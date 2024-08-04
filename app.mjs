import express from 'express';
const app = express();
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config();


// __filename ve __dirname'i tanımlayın
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//dosya importları
// import mysql from './config/db.js'; veritabanı bağlantı testi

//rota dosyalarının aktarımı
import stdRoutes from './Routes/stdRoutes.js';


// View engine olarak EJS kullanma
app.set('view engine', 'ejs');

// Middleware ve static dosyalar
app.use('/Public', express.static(path.join(__dirname, 'Public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/',stdRoutes);




const Port = process.env.PORT;

app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
});