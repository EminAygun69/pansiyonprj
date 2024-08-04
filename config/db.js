import dotenv from 'dotenv';
import mysql from 'mysql';
dotenv.config({path: './.env'});

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}); 
db.connect((err) => {
    if (err) {
      console.error('Error connecting error to database:', err);
    } else {
      console.log('MySQL connection succes');
    }
  });

export default db;

