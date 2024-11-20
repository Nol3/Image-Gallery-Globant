<h1>Unsplash Image Gallery Project</h1>
Este proyecto es parte del programa Globant Fullstack Piscine de 42 Málaga.

<h2>Descripción</h2>
Aplicación web que muestra una galería de imágenes desde Unsplash, con un diseño tipo Pinterest. Incluye una barra de búsqueda para encontrar fotos específicas.

<h2>Características</h2>
- Galería de imágenes: Muestra imágenes desde la API de Unsplash
- Búsqueda: Permite buscar imágenes por palabra clave
- Diseño Pinterest: Las imágenes se muestran en un grid tipo masonry
- Autenticación: Integración con OAuth 2.0 de Unsplash

<h2>Requisitos Previos</h2>
- Docker y Docker Compose instalados
- Cuenta de desarrollador en Unsplash (https://unsplash.com/developers)

<h2>Configuración</h2>

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
cd <nombre-del-repositorio>
```

2. Ejecutar con Docker:
```bash
cd ex00
docker-compose up --build
```

La aplicación estará disponible en http://localhost:3000

<h2>Desarrollo Local</h2>
Si deseas desarrollar o modificar el proyecto:

1. Crear archivo .env con tus propias credenciales de Unsplash
2. Instalar dependencias: `npm install`
3. Ejecutar: `npm start`
```

Este enfoque:
- Facilita la prueba rápida del proyecto
- Mantiene la seguridad al usar variables de entorno en Docker
- Separa el entorno de desarrollo del de prueba
- Evita que los usuarios necesiten crear archivos .envEste enfoque:
- Facilita la prueba rápida del proyecto
- Mantiene la seguridad al usar variables de entorno en Docker
- Separa el entorno de desarrollo del de prueba
- Evita que los usuarios necesiten crear archivos .env