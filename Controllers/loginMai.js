import connection from '../config/db.js';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'hotmail',
    auth: {
        user: process.env.EMAIL_USER, // Hotmail adresiniz
        pass: process.env.EMAIL_PASS // Hotmail şifreniz
    },
    tls: {
        rejectUnauthorized: false
    }
});


export async function userMailResend(email, token) {
    try {
        // Yeni doğrulama token'ını veritabanına kaydet
        connection.query('UPDATE Kullanicilar SET verification_token = ? WHERE email = ?', [token, email], (err) => {
            if (err) {
                console.error('Database update error:', err);
                return;
            }

            // E-posta gönderme
            const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'E-posta Doğrulama',
                text: `Lütfen e-posta adresinizi doğrulamak için şu linke tıklayın: ${verificationUrl}`,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('E-posta gönderim hatası:', error);
                } else {
                    console.log('E-posta gönderildi:', info.response);
                }
            });
        });
    } catch (err) {
        console.error('Verification error:', err);
    }
}
