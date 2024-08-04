import connection from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const secretKey = 'your_secret_key'; // Güçlü ve gizli bir anahtar kullanın.

export async function loginControl(req, res) {
    const { usernameLGN, passwordLGN } = req.body;

    // Kullanıcı adı ve şifre kontrolü
    if (!usernameLGN || !passwordLGN) {
        return res.status(400).send('Kullanıcı adı ve şifre gereklidir.');
    }

    const query = 'SELECT * FROM kullanicilar WHERE username = ?';

    connection.query(query, [usernameLGN], async (err, results) => {
        if (err) {
            console.error('Veritabanı sorgu hatası:', err);
            return res.status(500).send('Bir hata oluştu.');
        }

        if (results.length === 0) {
            console.log('Kullanıcı bulunamadı:', usernameLGN);
            return res.status(401).send('Kullanıcı bulunamadı.');
        }

        const user = results[0];
        const hashedPassword = user.password;

        try {
            // Şifreyi karşılaştır
            const isMatch = await bcrypt.compare(passwordLGN, hashedPassword);
            if (!isMatch) {
                console.log('Yanlış şifre:', usernameLGN);
                return res.status(401).send('Yanlış şifre.');
            }

            // Şifre doğru ise, JWT token oluştur
            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email, priority: user.priority, veriflied: user.is_verified }, // Payload
                process.env.SECRET_KEY, // Gizli anahtar
                { expiresIn: '1h' } // Token süresi 1 saat
            );

            // Token'ı HTTP-only cookie'ye yerleştir
            res.cookie('token', token, {
                httpOnly: false, // JavaScript erişimini engelle
                secure: process.env.NODE_ENV === 'production', // Yalnızca HTTPS üzerinde çalış
                maxAge: 3600000, // 1 saat (milisaniye cinsinden)
            });

            // Giriş başarılı olduğunda kullanıcıyı yönlendir
            res.render('authLogin', { token }); // EJS dosyasına token'ı gönderin
        } catch (bcryptError) {
            console.error('Bcrypt hatası:', bcryptError);
            return res.status(500).send('Bir hata oluştu.');
        }
    });
}
