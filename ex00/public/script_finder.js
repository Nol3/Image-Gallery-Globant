const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-query');
const resultsDiv = document.getElementById('results');
let searchPage = 1;
let currentSearchQuery = '';
let isSearching = false;
// Eliminar esta línea que causa el conflicto:
// let page = 1;

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    currentSearchQuery = searchInput.value;
    searchPage = 1;
    
    // Limpiar ambos contenedores
    resultsDiv.innerHTML = '';
    document.getElementById('image-grid').innerHTML = '';
    
    // Ocultar el grid principal y mostrar los resultados
    document.getElementById('image-grid').style.display = 'block';
    document.getElementById('results').style.display = 'block';
    
    // Mostrar un mensaje de carga
    resultsDiv.innerHTML = '<div class="loader"></div>';
    
    // Realizar la búsqueda
    searchImages();
});

function searchImages() {
    if (isSearching) return;
    isSearching = true;

    const url = `https://api.unsplash.com/search/photos?query=${currentSearchQuery}&page=${searchPage}&per_page=30&client_id=${accessKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Limpiar el mensaje de carga
            resultsDiv.innerHTML = '';
            
            if (!data.results || data.results.length === 0) {
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <p>No se encontraron imágenes para "${currentSearchQuery}"</p>
                        <button onclick="resetSearch()" class="reset-button">Volver a la galería</button>
                    </div>`;
                return;
            }
            displaySearchResults(data.results);
            isSearching = false;
        })
        .catch(error => {
            console.error('Error searching images:', error);
            resultsDiv.innerHTML = `
                <div class="error-message">
                    <p>Error: ${error.message}</p>
                    <button onclick="resetSearch()" class="reset-button">Volver a la galería</button>
                </div>`;
            isSearching = false;
        });
}

function displaySearchResults(images) {
    images.forEach(image => {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Unsplash Image';
        imgElement.classList.add('image-item');

        const heartIcon = document.createElement('img');
        heartIcon.src = './assets/corazon.svg';
        heartIcon.classList.add('heart-icon');
        heartIcon.style.display = 'none';

        imageContainer.appendChild(imgElement);
        imageContainer.appendChild(heartIcon);

        // Añadir los mismos eventos del hover que en script.js
        imageContainer.addEventListener('mouseenter', () => {
            heartIcon.style.display = 'block';
        });
        
        imageContainer.addEventListener('mouseleave', () => {
            heartIcon.style.display = 'none';
        });

        document.getElementById('results').appendChild(imageContainer);
    });
}

// Infinite scroll para resultados de búsqueda
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (currentSearchQuery && !isSearching) {
            searchPage++;
            searchImages();
        }
    }
});

// Función para resetear la búsqueda y volver a la galería principal
function resetSearch() {
    // Limpiar la búsqueda
    searchInput.value = '';
    currentSearchQuery = '';
    searchPage = 1;
    
    // Limpiar y ocultar resultados
    resultsDiv.innerHTML = '';
    document.getElementById('results').style.display = 'none';
    
    // Mostrar y recargar el grid principal
    document.getElementById('image-grid').style.display = 'block';
    document.getElementById('image-grid').innerHTML = '';
    loadedImagesCount = 0;
    page = 1;
    fetchImages(page);
}

// Eliminar la función loadRandomImages ya que esa funcionalidad está en script.js
// Eliminar esta línea:
// document.addEventListener('DOMContentLoaded', function() {
//     loadRandomImages();
// });
