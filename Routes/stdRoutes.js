import express from 'express';
const router = express.Router();
import { registerUser } from '../Models/userRegHash.js'; // registerUser fonksiyonunu import edin
import { verifyEmail } from '../Controllers/mailVeriflicator.js'; // verifyEmail fonksiyonunu import edin
import { loginControl } from '../Controllers/loginController.js';


router.get('/',(req , res) => {
    res.render('index.ejs');
});

router.get('/hakkimizda',(req , res) => {
    res.render('hakkimizda.ejs')
});

router.get('/odalar',(req , res) => {
    res.render('odalar.ejs')
});

router.get('/rezervasyon',(req , res) => {
    res.render('rezervasyon.ejs')
});

router.get('/iletisim',(req , res) => {
    res.render('iletisim.ejs')
});

router.get('/giris',(req , res) => {
    res.render('giris.ejs')
});

router.get('/profil',(req , res) => {
    res.render('profil.ejs')
});
router.get('/register' ,(req , res) => {
    res.render('register');
});
router.post('/auth/register', registerUser);
router.get('/verify-email', verifyEmail);
//!AŞŞAĞIDAKİ ROTA KODUNU YAZACAKSIN
router.post('/auth/login', loginControl);

export default router;