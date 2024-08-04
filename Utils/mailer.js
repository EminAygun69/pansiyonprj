import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'Hotmail', // Kullandığınız e-posta servis sağlayıcısına göre ayarlayın
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export async function sendVerificationEmail(email, token) {
    const verificationUrl = `http://localhost:5000/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Doğrulama',
        html: `<p>Merhaba,</p>
               <p>Kayıt işleminizi tamamlamak için lütfen aşağıdaki linke tıklayın:</p>
               <a href="${verificationUrl}">E-Posta Doğrulama Linki</a>`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Doğrulama e-postası gönderildi.');
    } catch (error) {
        console.error('E-posta gönderim hatası:', error);
    }
}
