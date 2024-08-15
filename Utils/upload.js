// middleware/upload.js
import multer from 'multer';
import path from 'path';

// Yükleme depolama ayarlarını yapılandırma
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'Public/roomPictures');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Sadece resim dosyalarını kabul edecek şekilde filtreleme
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Yalnızca resim dosyaları yüklenebilir'));
    }
};

export const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5MB'a kadar olan dosyalara izin ver
    fileFilter
});
