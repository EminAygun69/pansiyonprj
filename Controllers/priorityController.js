import jwt from 'jsonwebtoken';
import connection from '../config/db.js';

export async function priorityCheck(req, res){

    let token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err , decoded) =>{
        if(err){
            return res.status(403).json({ message: "Token is not valid" });
        }
        else{
            console.log(decoded.priority);  
            if(decoded.priority == 'admin'){
                const queryRoomsAdmin = 'SELECT oda_id , oda_adi , oda_tipi , yatak_sayisi , kisi_sayisi , fiyat, durum FROM pansiyon.odalar';
                connection.query(queryRoomsAdmin, (err, results) =>{
                    if(err){
                        console.error('Database query error:', err);
                        return res.status(500).render('error', { message: 'Veritabanı hatası' });
                    }
                    return res.status(200).render('adminPanel.ejs', {message: decoded.priority, rooms: results });
                });

                
            }
            else{
                return res.status(403).json({ message: "You don't have the necessary permissions" });
            }

        }
    });
    

};