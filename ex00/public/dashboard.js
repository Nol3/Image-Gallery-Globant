document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Verificar si el usuario está autenticado
        const response = await fetch('/api/user');
        if (!response.ok) {
            window.location.href = '/';
            return;
        }
        
        const userData = await response.json();
        
        // Mostrar información del usuario
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            userInfo.innerHTML = `
                <h2>Bienvenido, ${userData.username || 'Usuario'}</h2>
                <p>Email: ${userData.email || 'No disponible'}</p>
            `;
        }
        
    } catch (error) {
        console.error('Error:', error);
        window.location.href = '/';
    }
});