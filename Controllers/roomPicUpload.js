// controllers/roomController.js
import { query } from 'express';
import connection from '../config/db.js';
import bodyParser from 'body-parser';
export const uploadRoomImage = (req, res) => {
    if (!req.file) {
        return res.status(400).send('Lütfen bir resim dosyası yükleyin.');
    }
    const { odaId } = req.body;
    console.log('Oda ID:', odaId);
    const insertQuery = `INSERT INTO odaresimler (oda_id, resim_url) VALUES (?, ?)`;
    // Yüklenen dosyanın yolunu ve diğer bilgilerini kullanabilirsiniz
    console.log('Yüklenen dosya:', req.file);

    // Örneğin, veritabanına dosya yolunu kaydedebilirsiniz
    // Oda resmini veritabanına kaydetme işlemini burada gerçekleştirin
    const imagePath = req.file.path.replace('Public/', '/'); // Yolun başındaki "Public/" kısmını çıkarır
    connection.query(insertQuery,[odaId, imagePath],(err, result) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).send('Bir hata oluştu.');
        }
        else{
            console.log(result);
        }
    });
    

    res.send(`Resim başarıyla yüklendi: ${imagePath}`);
};
