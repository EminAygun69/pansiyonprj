import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../config/db.js';
import bcrypt from 'bcrypt';
import { userMailResend } from './loginMai.js'; // Fonksiyonun doğru yolu

dotenv.config();

export async function loginControl(req, res) {
    const { usernameLGN, passwordLGN } = req.body;
    console.log(usernameLGN, passwordLGN);
  
    // Kullanıcıyı veritabanında bul
    const query = 'SELECT * FROM kullanicilar WHERE username = ?';
    db.query(query, [usernameLGN], (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).render('error', { message: 'Veritabanı hatası' });
        } 

        if (results.length === 0) {
            console.log('kullanıcı yok');
            return res.status(401).render('test', { message: 'Kullanıcı bulunamadı' });
        }

        const user = results[0];
        console.log(user);

        // Şifreyi kontrol et
        bcrypt.compare(passwordLGN, user.password, (err, isMatch) => {
            if (err) {
                console.log('şifre doğrulama hatası');
                return res.status(500).render('error', { message: 'Şifre doğrulama hatası' });
            } 
            if (!isMatch) {
                console.log('Şifre yanlış');
                return res.status(401).render('test', { message: 'Şifre yanlış' });
            }

            
            if (user.is_verified == 1) {
                // JWT oluştur
                const token = jwt.sign(
                    { id: user.id, username: user.username, email: user.email, priority: user.priority }, 
                    process.env.SECRET_KEY, 
                    { expiresIn: '5h' }
                );

                // Token'ı HTTP-only cookie olarak ayarla
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 3600000 // 1 saat
                });
                console.log('GİRİŞ YAPILDI');
                return res.status(200).render('profil', { priority: 'admin' });
            } else {
                console.log('Email doğrulama yapılmadı');
                // Yeni doğrulama token'ı oluştur
                const newToken = jwt.sign(
                    { email: user.email }, 
                    process.env.SECRET_KEY, 
                    { expiresIn: '1h' }
                );
                // Yeni doğrulama e-postası gönder
                userMailResend(user.email, newToken);
                return res.status(401).render('test', { message: 'Email doğrulama yapılmadı', message2: 'Yeniden doğrulama maili yollandı' });
            }
        });
    });
};
