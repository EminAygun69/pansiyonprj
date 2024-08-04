import connection from '../config/db.js';

export async function verifyEmail(req, res) {
    const { token } = req.query;

    try {
        connection.query('SELECT * FROM Kullanicilar WHERE verificationToken = ?', [token], (err, results) => {
            if (err) {
                console.error('Database query error:', err);
                res.status(500).send('Bir hata oluştu.');
                return;
            }

            if (results.length === 0) {
                // Token geçersiz
                res.status(400).send('Geçersiz token.');
                return;
            }

            // Kullanıcıyı güncelle
            connection.query('UPDATE Kullanicilar SET isVerified = true, verificationToken = NULL WHERE verificationToken = ?', [token], (err) => {
                if (err) {
                    console.error('Database update error:', err);
                    res.status(500).send('Bir hata oluştu.');
                    return;
                }

                // İşlem sonrası yanıt
                res.send('E-posta adresiniz doğrulandı.');
            });
        });
    } catch (err) {
        console.error('Verification error:', err);
        res.status(500).send('Bir hata oluştu.');
    }
}
