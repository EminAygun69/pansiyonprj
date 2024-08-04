import bcrypt from 'bcrypt';
import connection from '../config/db.js';
import { sendVerificationEmail } from '../utils/mailer.js'; // mailer.js dosyasını import edin
import crypto from 'crypto';

const saltRounds = 10;

export async function registerUser(req, res) {
    const { usernamereg, emailreg, passwordreg, phonenumberreg } = req.body;

    try {
        // Kullanıcı adı ve e-posta kontrolü
        connection.query('SELECT * FROM Kullanicilar WHERE username = ? OR email = ?', [usernamereg, emailreg], async (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send('Bir hata oluştu.');
                return;
            }

            if (results.length > 0) {
                // Kullanıcı adı veya e-posta zaten mevcutsa hata ver
                res.status(400).send('Kullanıcı adı veya e-posta zaten mevcut.');
                return;
            }

            // Şifreyi hash'le
            const hashedPassword = await bcrypt.hash(passwordreg, saltRounds);

            // Telefon numarasını da hash'le (isteğe bağlı)
            const hashedPhoneNumber = await bcrypt.hash(phonenumberreg, saltRounds);

            // Doğrulama token'ı oluştur
            const verificationToken = crypto.randomBytes(32).toString('hex');

            // Yeni kullanıcıyı veritabanına ekle
            connection.query('INSERT INTO Kullanicilar (username, email, password, phone_number, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?)', [usernamereg, emailreg, hashedPassword, hashedPhoneNumber, 0, verificationToken], (err, results) => {
                if (err) {
                    console.error('Database insertion error:', err);
                    res.status(500).send('Bir hata oluştu.');
                    return;
                }

                // Doğrulama e-postasını gönder
                sendVerificationEmail(emailreg, verificationToken);

                // İşlem sonrası yanıt
                res.send('Kayıt başarılı. Lütfen e-posta adresinizi doğrulayın.');
            });
        });
    } catch (err) {
        console.error('Hashing or other error:', err);
        res.status(500).send('Bir hata oluştu.');
    }
}
