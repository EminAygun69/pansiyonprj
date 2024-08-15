import express from 'express';
const router = express.Router();
import connection from '../config/db.js';
import { registerUser } from '../Models/userRegHash.js'; // registerUser fonksiyonunu import edin
import { verifyEmail } from '../Controllers/mailVeriflicator.js'; // verifyEmail fonksiyonunu import edin
import {loginControl} from '../Controllers/loginControl.js';
import {priorityCheck} from '../Controllers/priorityController.js';

router.get('/', (req, res) => {
    res.render('index.ejs');
});

router.get('/hakkimizda', (req, res) => {
    res.render('hakkimizda.ejs');
});

router.get('/odalar', (req, res) => {
    const query = `
        SELECT 
            o.oda_id,
            o.oda_adi,
            o.oda_tipi,
            o.yatak_sayisi,
            o.kisi_sayisi,
            o.fiyat,
            o.aciklama,
            o.durum,
            r.resim_url
        FROM 
            odalar o
        LEFT JOIN 
            odaresimler r ON o.oda_id = r.oda_id
        ORDER BY 
            o.oda_id
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).send('Bir hata oluştu.');
        }

        // Odaları bir objeye grupluyoruz
        const odalar = {};

        results.forEach(row => {
            if (!odalar[row.oda_id]) {
                odalar[row.oda_id] = {
                    oda_id: row.oda_id,
                    oda_adi: row.oda_adi,
                    oda_tipi: row.oda_tipi,
                    yatak_sayisi: row.yatak_sayisi,
                    kisi_sayisi: row.kisi_sayisi,
                    fiyat: row.fiyat,
                    aciklama: row.aciklama,
                    durum: row.durum,
                    resimler: []
                };
            }
            if (row.resim_url) {
                odalar[row.oda_id].resimler.push(row.resim_url);
            }
        });

        // Odalar objesini diziye dönüştürüyoruz
        const odalarListesi = Object.values(odalar);
        res.render('odalar.ejs', { odalar: odalarListesi });
    }); // Burada bir kapanış parantezi eksikti, bu yüzden ekledim.
});

router.get('/rezervasyon', (req, res) => {
    res.render('rezervasyon.ejs');
});

router.get('/iletisim', (req, res) => {
    res.render('iletisim.ejs');
});

router.get('/giris', (req, res) => {
    res.render('giris.ejs');
});

router.get('/profil', (req, res) => {
    res.render('profil.ejs');
});

router.get('/register', (req, res) => {
    res.render('register.ejs');
});

router.get('/adminpanel', priorityCheck);
router.post('/auth/register', registerUser);
router.get('/verify-email', verifyEmail);

router.post('/auth/login', loginControl);

export default router;
