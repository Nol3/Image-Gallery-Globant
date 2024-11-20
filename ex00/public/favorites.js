
document.addEventListener('DOMContentLoaded', function() {
    const imageGrid = document.getElementById('image-grid');
    
    function displayFavorites() {
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        favorites.forEach(image => {
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('image-container');

            const imgElement = document.createElement('img');
            imgElement.src = image.urls.small;
            imgElement.alt = image.alt_description || 'Favorite Image';
            imgElement.classList.add('image-item');

            const heartIcon = document.createElement('img');
            heartIcon.src = './assets/corazon_lleno.svg';
            heartIcon.classList.add('heart-icon');

            // Permitir eliminar de favoritos
            heartIcon.addEventListener('click', () => {
                const updatedFavorites = favorites.filter(fav => fav.id !== image.id);
                localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
                imageContainer.remove();
            });

            imageContainer.appendChild(imgElement);
            imageContainer.appendChild(heartIcon);
            imageGrid.appendChild(imageContainer);
        });
    }

    displayFavorites();
});