document.addEventListener('DOMContentLoaded', function() {
    const cardsContainer = document.querySelector('.cards');
    const articles = Array.from(document.querySelectorAll('.cards article')); // Convertimos a Array
    const noMoreMessage = cardsContainer.querySelector('span');
    
    
    // Función para manejar el deslizamiento
    function handleSwipe(direction) {
        // Si no hay más artículos, no hacemos nada
        if (articles.length === 0) {
            noMoreMessage.style.display = 'block';
            return;
        }
        
        // Tomamos la ÚLTIMA tarjeta (la que está visible encima)
        const lastArticle = articles[articles.length - 1];
        
        // Añadimos clase de animación según la dirección
        lastArticle.classList.add(direction === 'like' ? 'go-right' : 'go-left');
  
        
        // Eliminamos la tarjeta del array después de la animación
        setTimeout(() => {
            lastArticle.style.display = 'none';
            articles.pop(); // Eliminamos la última tarjeta del array
            
            // Si no hay más artículos, mostramos el mensaje
            if (articles.length === 0) {
                noMoreMessage.style.display = 'block';
            }
        }, 500);
    }
    
    // Manejadores para los botones LIKE y NOPE
    document.getElementById('like-button').addEventListener('click', () => {
        console.log('like button');
        handleSwipe('like');

    });
    
    document.getElementById('nope-button').addEventListener('click', () => {
        console.log('nope button');
        handleSwipe('nope');
    });
});