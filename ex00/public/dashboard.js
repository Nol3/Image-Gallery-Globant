document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/api/user');
        const userData = await response.json();
        
        document.getElementById('username').textContent = userData.username;
        
        const userInfo = document.getElementById('userInfo');
        userInfo.innerHTML = `
            <p>Total Fotos: ${userData.total_photos}</p>
            <p>Total Likes: ${userData.total_likes}</p>
            <p>Total Colecciones: ${userData.total_collections}</p>
        `;
        
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/login.html';
    }
});