// Sunucudan gönderilen token değeri
var token = "<%= token %>";
    
// Token varsa, çereze kaydet ve geçerlilik süresini ayarla
if (token) {
    var date = new Date();
    date.setTime(date.getTime() + (1 * 60 * 60 * 1000)); // 1 saat geçerlilik süresi

    var expires = "expires=" + date.toUTCString();

    // Çereze token değerini kaydetme ve geçerlilik süresi ekleme
    document.cookie = "token=" + token + ";" + expires + ";path=/;SameSite=Lax";
    console.log(token);
    console.log("Çerez ayarlandı: token=" + token);
} else {
    console.log("Token mevcut değil.");
}

// Çerezlerdeki token'ı kontrol etme
function getCookie(name) {
    let cookieArr = document.cookie.split(";");
    for(let i = 0; i < cookieArr.length; i++) {
        let cookiePair = cookieArr[i].split("=");
        if(name == cookiePair[0].trim()) {
            return decodeURIComponent(cookiePair[1]);
        }
    }
    return null;
}

// Eğer token varsa bir şey yap
var storedToken = getCookie('token');
if (storedToken) {
    console.log("Token from cookie:", storedToken);
    // Burada, çerezden okunan token ile yapılacak işlemler
} else {
    console.log("Token bulunamadı.");
}