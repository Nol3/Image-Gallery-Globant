// archivo: app.js

async function buscarImg() {
    const apiKey = '01NaKsZIj_hfxDAHQ8XhFdiMgZomw97WXjgJRzTBrW4'; // Reemplaza con tu clave de API
    const searchTerm = document.getElementById('searchTerm').value;
    const url = `https://api.unsplash.com/search/photos?query=${searchTerm}&per_page=12&client_id=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        mostrarResultados(data.results);
    } catch (error) {
        console.error('Error al obtener las imágenes:', error);
    }
}

function mostrarResultados(imagenes) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Limpiar resultados previos

    if (imagenes.length === 0) {
        resultsDiv.innerHTML = '<p>No se encontraron imágenes.</p>';
        return;
    }

    imagenes.forEach(imagen => {
        const imgElement = document.createElement('img');
        imgElement.src = imagen.urls.small;
        imgElement.alt = imagen.alt_description;
        resultsDiv.appendChild(imgElement);
    });
}
