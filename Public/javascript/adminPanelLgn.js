function getCookieValue(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function sendTokenAndRedirect() {
    const token = getCookieValue('token'); // Çerezden tokeni al

    if (token) {
        // Fetch API ile POST isteği gönder
        fetch('/adminPanel', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: token })
        })
        .then(response => {
            if (response.ok) {
                // Eğer POST isteği başarılı olursa, kullanıcıyı admin paneline yönlendir
                window.location.href = '/adminPanel';
            } else {
                console.error('Token gönderilemedi.');
            }
        })
        .catch(error => {
            console.error('Bir hata oluştu:', error);
        });
    } else {
        console.error('Token bulunamadı.');
    }
}
