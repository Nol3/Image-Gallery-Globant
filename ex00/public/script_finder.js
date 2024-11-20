const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-query');
const resultsDiv = document.getElementById('results');
let searchPage = 1;
let currentSearchQuery = '';
let isSearching = false;
let page = 1;

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    currentSearchQuery = searchInput.value;
    searchPage = 1;
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores
    document.getElementById('results').style.display = 'grid';
    document.getElementById('image-grid').style.display = 'none';
    searchImages();
});

function searchImages() {
    if (isSearching) return;
    isSearching = true;

    const url = `https://api.unsplash.com/search/photos?query=${currentSearchQuery}&page=${searchPage}&per_page=30&client_id=${accessKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                displaySearchResults(data.results);
            }
            isSearching = false;
        })
        .catch(error => {
            console.error('Error searching images:', error);
            isSearching = false;
        });
}

function loadRandomImages() {
    if (isSearching) return;
    isSearching = true;

    const url = `https://api.unsplash.com/photos/random?count=30&client_id=${accessKey}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return response.json();
        })
        .then(images => {
            displayRandomImages(images);
            isSearching = false;
        })
        .catch(error => {
            console.error('Error cargando imágenes:', error);
            const imageGrid = document.getElementById('image-grid');
            imageGrid.innerHTML = '<p style="color: red; text-align: center;">Error: Límite de API alcanzado o clave inválida</p>';
            isSearching = false;
        });
}

function displaySearchResults(images) {
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Unsplash Image';
        imgElement.classList.add('image-item');
        resultsDiv.appendChild(imgElement);
    });
}

function displayRandomImages(images) {
    const imageGrid = document.getElementById('image-grid');
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Unsplash Image';
        imgElement.classList.add('image-item');
        imageGrid.appendChild(imgElement);
    });
}

// Infinite scroll para resultados de búsqueda
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight - 100) {
        if (currentSearchQuery && !isSearching) {
            searchPage++;
            searchImages();
        } else if (!currentSearchQuery && !isSearching) {
            page++;
            loadRandomImages();
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    loadRandomImages();
});
