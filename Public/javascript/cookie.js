document.addEventListener("DOMContentLoaded", function() {
    // HTML içinde token'ı saklayan elementi seç
    var tokenContainer = document.getElementById('token-container');
    
    if (tokenContainer) {
        // Elementin veri özniteliğinden token'ı al
        var token = tokenContainer.getAttribute('data-token');

        // Token varsa, çereze kaydet ve geçerlilik süresini ayarla
        if (token) {
            var date = new Date();
            date.setTime(date.getTime() + (1 * 60 * 60 * 1000)); // 1 saat geçerlilik süresi
            var expires = "expires=" + date.toUTCString();

            // Çereze token değerini kaydetme ve geçerlilik süresi ekleme
            document.cookie = "token=" + token + ";" + expires + ";path=/;SameSite=Lax";
            console.log("Çerez ayarlandı: token=" + token);
        } else {
            console.log("Token mevcut değil.");
        }
    } else {
        // console.log("Token container bulunamadı.");
    }
});

// Çerezlerdeki token'ı kontrol etme fonksiyonu
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for (let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if (name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// Çerezdeki token'ı kontrol etme
var storedToken = getCookie('token');
if (storedToken) {
    console.log("Çerezden okunan token:", storedToken);
    // Burada, çerezden okunan token ile yapılacak işlemler
} else {
    console.log("Token bulunamadı.");
}
