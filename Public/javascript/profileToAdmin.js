const priority = 'admin'; // Burayı sunucudan gelen veri ile değiştirin
const adminLink = document.getElementById('adminLink');

if (priority === 'admin') {
  const newLink = document.createElement('a');
  newLink.href = '/adminpanel';
  newLink.textContent = 'Admin Panel';
  adminLink.appendChild(newLink);
}