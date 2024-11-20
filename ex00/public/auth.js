const REDIRECT_URI = encodeURIComponent('http://localhost:3000/auth/unsplash/callback');
const scope = encodeURIComponent('public read_user write_user');

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('unsplashLoginBtn');
    if (!loginBtn) return;

    const REDIRECT_URI = encodeURIComponent('http://localhost:3000/auth/unsplash/callback');
    const scope = encodeURIComponent('public read_user write_user');

    loginBtn.addEventListener('click', async () => {
        try {
            const response = await fetch('/config');
            if (!response.ok) throw new Error('Error al obtener configuración');
            
            const { clientId } = await response.json();
            const authUrl = `https://unsplash.com/oauth/authorize?` +
                `client_id=${clientId}&` +
                `redirect_uri=${REDIRECT_URI}&` +
                `response_type=code&` +
                `scope=${scope}`;
            
            window.location.href = authUrl;
        } catch (error) {
            console.error('Error en autenticación:', error);
        }
    });

    // Verificar si ya está autenticado al cargar la página
    fetch('/api/user')
        .then(response => {
            if (response.ok) {
                window.location.href = '/landing.html';
            }
        })
        .catch(error => console.error('Error verificando autenticación:', error));
});

app.get('/api/user', async (req, res) => {
    if (!req.session.accessToken) {
        return res.status(401).json({ error: 'No autenticado' });
    }

    try {
        const userResponse = await axios.get('https://api.unsplash.com/me', {
            headers: {
                'Authorization': `Bearer ${req.session.accessToken}`
            }
        });
        res.json(userResponse.data);
    } catch (error) {
        res.status(401).json({ error: 'Sesión inválida' });
    }
});