const REDIRECT_URI = encodeURIComponent('http://localhost:3000/auth/unsplash/callback');
const scope = encodeURIComponent('public read_user write_user');

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('unsplashLoginBtn');
    if (!loginBtn) return;

    const CLIENT_ID = '01NaKsZIj_hfxDAHQ8XhFdiMgZomw97WXjgJRzTBrW4';
    const CURRENT_DOMAIN = window.location.origin;
    const REDIRECT_URI = encodeURIComponent(`${CURRENT_DOMAIN}/auth/unsplash/callback`);
    const scope = encodeURIComponent('public read_user write_user');

    loginBtn.addEventListener('click', () => {
        const authUrl = `https://unsplash.com/oauth/authorize?` +
            `client_id=${CLIENT_ID}&` +
            `redirect_uri=${REDIRECT_URI}&` +
            `response_type=code&` +
            `scope=${scope}`;
        
        window.location.href = authUrl;
    });

    // Verificar autenticación
    async function checkAuth() {
        try {
            const response = await fetch('/api/user');
            if (response.ok) {
                window.location.href = '/landing.html';
            }
        } catch (error) {
            console.error('Error verificando autenticación:', error);
        }
    }

    checkAuth();
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