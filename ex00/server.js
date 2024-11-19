const express = require('express');
const axios = require('axios');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto',
    resave: false,
    saveUninitialized: true
}));

// En server.js
app.get('/auth/unsplash/callback', async (req, res) => {
    console.log('1. Llegó al callback con código:', req.query.code);
    const code = req.query.code;
    
    if (!code) {
        console.error('No se recibió código de autorización');
        return res.status(400).json({ error: 'Código no recibido' });
    }

    try {
        console.log('2. Intentando obtener token...');
        console.log('Usando client_id:', process.env.UNSPLASH_CLIENT_ID); // Cambiado
        console.log('Usando redirect_uri:', process.env.REDIRECT_URI);
        
        const response = await axios({
            method: 'post',
            url: 'https://unsplash.com/oauth/token',
            data: {
                client_id: process.env.UNSPLASH_CLIENT_ID, // Cambiado
                client_secret: process.env.UNSPLASH_CLIENT_SECRET, // Cambiado
                redirect_uri: process.env.REDIRECT_URI,
                code: code,
                grant_type: 'authorization_code'
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        console.log('3. Respuesta del token:', response.data);
        const accessToken = response.data.access_token;
        req.session.accessToken = accessToken;
        req.session.username = response.data.username;
        req.session.userId = response.data.user_id;

        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error completo:', error);
        console.error('Error detallado:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.response?.headers
        });
        res.status(500).json({ 
            error: 'Error en autenticación',
            details: error.response?.data || error.message 
        });
    }
});

// Añadir esta nueva ruta antes de app.listen
app.get('/config', (req, res) => {
  res.json({
    clientId: process.env.UNSPLASH_CLIENT_ID
  });
});

// Ruta para verificar autenticación
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
        res.status(500).json({ error: 'Error obteniendo datos del usuario' });
    }
});

// Ruta para servir dashboard.html
app.get('/dashboard', (req, res) => {
    if (!req.session.accessToken) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Mantén tu configuración del servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
