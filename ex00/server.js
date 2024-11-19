const express = require('express');
const axios = require('axios');
const path = require('path');  // Importa path para rutas de archivos
const app = express();
const port = 3000;

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de autenticación inicial
app.get('/auth', (req, res) => {
  const clientId = '01NaKsZIj_hfxDAHQ8XhFdiMgZomw97WXjgJRzTBrW4';
  const redirectUri = 'http://localhost:3000/callback';  // Asegúrate de que esta URI esté registrada en Unsplash
  const scope = 'public write_photos';
  const url = `https://unsplash.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  
  res.redirect(url);
});

const session = require('express-session');

// Configura las sesiones
app.use(session({
  secret: 'mi-secreto',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Si usas HTTPS, establece esto en true
}));

// Ruta de callback (después de que el usuario autoriza)
app.get('/callback', async (req, res) => {
  const code = req.query.code;  // El código de autorización viene aquí
  if (!code) {
    return res.status(400).send('No se recibió ningún código de autorización.');
  }

  const clientId = '01NaKsZIj_hfxDAHQ8XhFdiMgZomw97WXjgJRzTBrW4';
  const clientSecret = '_YDtSUV07C6FgoVJbKvP6rM8EjLVYa9nvSWQCmdwIiE';
  const redirectUri = 'http://localhost:3000/callback';  // Debe coincidir exactamente

  console.log(`Código de autorización recibido: ${code}`);

  try {
    const response = await axios({
      method: 'post',
      url: 'https://unsplash.com/oauth/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        code: code,
        grant_type: 'authorization_code'
      })
    });

    const accessToken = response.data.access_token;

    // Guarda el token en la sesión
    req.session.accessToken = accessToken;
    res.send('Autenticación exitosa. Ya puedes realizar solicitudes a la API de Unsplash.');
  } catch (error) {
    console.error(error.response ? error.response.data : error.message);
    res.status(500).send('Error al obtener el token de acceso.');
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
