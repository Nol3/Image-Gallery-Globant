// archivo: app.js

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-query');
const resultsDiv = document.getElementById('results');
let searchPage = 1;
let currentSearchQuery = '';
let isSearching = false;

searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    currentSearchQuery = searchInput.value;
    searchPage = 1;
    resultsDiv.innerHTML = ''; // Limpiar resultados anteriores
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

function displaySearchResults(images) {
    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;
        imgElement.alt = image.alt_description || 'Unsplash Image';
        imgElement.classList.add('image-item');
        resultsDiv.appendChild(imgElement);
    });
}

// Infinite scroll para resultados de búsqueda
window.addEventListener('scroll', () => {
    if (currentSearchQuery && !isSearching) {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            searchPage++;
            searchImages();
        }
    }
});
