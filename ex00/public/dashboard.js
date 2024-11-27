document.addEventListener('DOMContentLoaded', async function() {
    const userInfo = document.getElementById('userInfo');
    
    try {
        const response = await fetch('/api/user');
        if (!response.ok) {
            throw new Error('No autenticado');
        }
        
        const userData = await response.json();
        
        // Mostrar información del usuario con más detalles
        userInfo.innerHTML = `
            <h2>Bienvenido, ${userData.username || 'Usuario'}</h2>
            <p>Email: ${userData.email || 'No disponible'}</p>
            <p>Total de fotos: ${userData.total_photos || 0}</p>
            <p>Total de colecciones: ${userData.total_collections || 0}</p>
            <p>Total de likes: ${userData.total_likes || 0}</p>
        `;
        
    } catch (error) {
        console.error('Error al cargar el dashboard:', error);
        // Mostrar mensaje de error al usuario
        userInfo.innerHTML = `
            <p class="error">Error al cargar la información del usuario. Por favor, 
            <a href="/">inicia sesión</a> nuevamente.</p>
        `;
        
        // Redirigir después de un breve delay
        setTimeout(() => {
            window.location.href = '/';
        }, 3000);
    }
});