import express from 'express';
const router = express.Router();
import bodyParser from 'body-parser';
import connection from '../config/db.js';
import { upload } from '../Utils/upload.js';
import { uploadRoomImage } from '../Controllers/roomPicUpload.js';

router.post('/process/admin/addRoom',(req, res) => {
    const { odaAdi, odaTipi, yatakSayisi, kisiSayisi, fiyat, odaAciklama, odaDurum, olusturmaTarihi } = req.body;

    const sql = 'INSERT INTO odalar (oda_Adi, oda_tipi, yatak_sayisi, kisi_sayisi, fiyat, aciklama, durum, olusturma_tarihi) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    connection.query(sql, [odaAdi, odaTipi, yatakSayisi, kisiSayisi, fiyat, odaAciklama, odaDurum, olusturmaTarihi], (err, result) => {
        if (err) throw err;
        console.log('Oda eklendi:', result.insertId);
        res.send('Oda başarıyla eklendi!');
    });
});

router.post('/process/admin/deleteRoom', (req, res) => {
    const { roomNumber } = req.body;
    const queryDeleteRoom = 'DELETE FROM pansiyon.odalar WHERE oda_id = ?';
    const queryDeleteRoomPictures = 'DELETE FROM odaresimler WHERE oda_id = ?';
    connection.query(queryDeleteRoom, [roomNumber], (err, result) =>{
        if(err){
            throw err;
            console.log(err);
            console.log('Oda silme işlemi başarısız oldu!');
        }
        else{
            console.log('Oda silindi:', result.affectedRows);
            res.send('Oda başarıyla silindi!');
        }

    });
    connection.query(queryDeleteRoomPictures, [roomNumber], (err, result) => {
        if(err){
            throw err;
            console.log(err);
        }
        else
        {
            console.log('Oda resimleri:', result.affectedRows);
        }
    });
});

router.post('/process/admin/roompictureAdd', upload.single('roomImage'), uploadRoomImage);
export default router;