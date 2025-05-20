const DECISION_THRESHOLD = 85;
let isAnimating = false;
let pullDeltaX = 0; // Distancia que la card se está arrastrando. Después se ajustará cuanto se tendrá que desplazar para like o nope

function startDrag(event){
    if (isAnimating) return

    // Con este codigo solo se moverá el article (card) más cercano
    const actualCard = event.target.closest('article');
    if(!actualCard) return;

    // get initial position of mouse finger
    const startX = event.pageX ?? event.touches[0].pageX;
    // console.log(startX) //con este log podemos ver donde tocamos

    // listen the mouse and touch movements
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onEnd);

    document.addEventListener('touchmove', onMove, { passive: true} );
    document.addEventListener('touchend', onEnd, { passive: true });

    function onMove (event){
        // La posicion donde MOVEMOS
        const currentX = event.pageX ?? event.touches[0].pageX;

        // Distancia que recorre el dedo o el mouse.
        pullDeltaX = currentX - startX;
        // console.log(pullDeltaX);

        if (pullDeltaX === 0) return;

        const deg = pullDeltaX / 10; // Transformamos los pixeles a grados para animar la rotacion

        isAnimating = true;
        // Cambio de estilos de traslado y rotancion mientras nos movemos en el eje
        actualCard.style.transform = `translateX(${pullDeltaX}px) rotate(${deg}deg)`;
        actualCard.style.cursor = 'grabbing';
        // Cambio de opacidad de la info del choice mientras trasladamos la card
        const opacity = Math.abs(pullDeltaX) / 100;
        const isRight = pullDeltaX > 0;
        const choiceEl = isRight 
            ? actualCard.querySelector('.choice.like') : actualCard.querySelector('.choice.nope');
        
        choiceEl.style.opacity = opacity;
    }

    function onEnd (event){
        // remove the event listeners
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onEnd)

        document.removeEventListener('touchmove', onMove)
        document.removeEventListener('touchend', onEnd)

        // saber si el usuario tomo una decisión
        const decisionMade = Math.abs(pullDeltaX) >= DECISION_THRESHOLD;

        if (decisionMade){
            const goRight = pullDeltaX >= 0;
            const goLeft = !goRight;

            //Añadir clase de acuerdo a la decision hecha.
            actualCard.classList.add(goRight ? 'go-right': 'go-left');
            actualCard.addEventListener('transitionend', () => {
                actualCard.remove()
            }, { once: true });
        } else {
            //Añadir clase de acuerdo a que no se ha decidido.
            actualCard.classList.add('reset');
            actualCard.classList.remove('go-right', 'go-left');
        }

        // reset de variables

        actualCard.addEventListener('transitionend', () => {
            actualCard.removeAttribute('style');
            actualCard.classList.remove('reset');

            pullDeltaX = 0;
            isAnimating = false;
        });
    }
}


document.addEventListener('mousedown', startDrag);
document.addEventListener('touchstart', startDrag, { passive: true });
