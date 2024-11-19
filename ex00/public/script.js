const accessKey = '01NaKsZIj_hfxDAHQ8XhFdiMgZomw97WXjgJRzTBrW4';
const imageContainer = document.getElementById('image-grid');
let page = 1;
let isLoading = false;
const minimumImageCount = 36;  // Número mínimo de imágenes que queremos cargar inicialmente
const imagesPerPage = 30;  // Número de imágenes por solicitud
let loadedImagesCount = 0;  // Para llevar la cuenta de cuántas imágenes hemos cargado

// Función para cargar imágenes
function fetchImages(page) {
    if (isLoading) return;  // Evita solicitudes múltiples

    isLoading = true;
    const url = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${imagesPerPage}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayImages(data);
            loadedImagesCount += data.length;  // Incrementa el contador de imágenes cargadas
            isLoading = false;
            
            // Si no hemos alcanzado el mínimo de imágenes cargadas, cargamos más
            if (loadedImagesCount < minimumImageCount) {
                page++;
                fetchImages(page);  // Solicita más imágenes
            }
        })
        .catch(error => {
            console.error('Error fetching images:', error);
            isLoading = false;
        });
}

// Función para mostrar las imágenes
function displayImages(images) {
    images.forEach(image => {
        const width = image.width;
        const height = image.height;

        const imgElement = document.createElement('img');
        imgElement.src = image.urls.small;  // Usa la imagen de tamaño pequeño
        imgElement.alt = image.alt_description || 'Unsplash Image';
        imgElement.classList.add('image-item');
        imageContainer.appendChild(imgElement);
    });
}

// Función que detecta el scroll para cargar más imágenes
function handleScroll() {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 100) {
        page++;
        fetchImages(page);
    }
}

// Carga inicial de imágenes hasta alcanzar el mínimo
window.onload = function() {
    fetchImages(page);  // Empieza la carga de imágenes
};

// Detecta el evento de scroll en la ventana
window.addEventListener('scroll', handleScroll);

