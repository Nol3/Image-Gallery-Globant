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
        
        // Mostrar/ocultar corazón al pasar el ratón
        imageContainer.addEventListener('mouseenter', () => {
            heartIcon.style.display = 'block';
        });
        
        imageContainer.addEventListener('mouseleave', () => {
            heartIcon.style.display = 'none';
        });

        // Manejar click en el corazón
        heartIcon.addEventListener('click', async (e) => {
            e.stopPropagation();
            try {
                // Guardar en localStorage para mostrar en favorites.html
                const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                favorites.push({
                    id: image.id,
                    urls: image.urls,
                    alt_description: image.alt_description
                });
                localStorage.setItem('favorites', JSON.stringify(favorites));
                
                // Feedback visual
                heartIcon.src = './assets/corazon_lleno.svg';
                setTimeout(() => {
                    heartIcon.src = './assets/corazon.svg';
                }, 1000);
            } catch (error) {
                console.error('Error saving favorite:', error);
            }
        });

        imageContainer.appendChild(imgElement);
        imageGrid.appendChild(imageContainer);
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

document.addEventListener('DOMContentLoaded', function() {
    const favoritesButton = document.getElementById('favorites-button');
    favoritesButton.addEventListener('click', function() {
        window.location.href = 'favorites.html';
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const profileImg = document.getElementById('profile-img');
    const dropdown = document.getElementById('dropdown');
    
    // Toggle dropdown al hacer click en la imagen de perfil
    profileImg.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    // Cerrar dropdown cuando se hace click fuera
    document.addEventListener('click', function(e) {
        if (!e.target.matches('#profile-img')) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    });

    // Manejar click en el botón de dashboard
    const dashboardButton = document.getElementById('dashboardButton');
    if (dashboardButton) {
        dashboardButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const homeButton = document.getElementById('home-button');
    if (homeButton) {
        homeButton.addEventListener('click', function() {
            // Limpiar el contenedor de imágenes
            imageContainer.innerHTML = '';
            // Reiniciar las variables de control
            page = 1;
            loadedImagesCount = 0;
            // Cargar nuevas imágenes
            fetchImages(page);
        });
    }
});

