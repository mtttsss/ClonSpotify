
const botonLike = document.querySelector('.like');

let cancionSeleccionadaId = null;

function obtenerLikes() {
    const likesGuardados = JSON.parse(localStorage.getItem('tenji_likes')) || [];
    return likesGuardados;
}

function actualizarBotonLike() {
    if (!botonLike) return;

    if (cancionSeleccionadaId === null) {
        botonLike.textContent = '♡';
        botonLike.style.color = '#fff';
        botonLike.disabled = true;
        return;
    }

    botonLike.disabled = false;

    const likes = obtenerLikes();
    const tieneLike = likes.includes(cancionSeleccionadaId);

    botonLike.textContent = tieneLike ? '♥' : '♡';
    botonLike.style.color = tieneLike ? '#5e17eb' : '#fff';
}

if (botonLike) {

    actualizarBotonLike();

    botonLike.addEventListener('click', () => {

        if (cancionSeleccionadaId === null) return;

        let likes = obtenerLikes();

        if (likes.includes(cancionSeleccionadaId)) {
            likes = likes.filter(id => id !== cancionSeleccionadaId);
        } else {
            likes.push(cancionSeleccionadaId);
        }

        localStorage.setItem('tenji_likes', JSON.stringify(likes));

        actualizarBotonLike();

        console.log('Canciones favoritas:', likes);
    });
}

document.addEventListener('click', (event) => {

    const tarjeta = event.target.closest(
        '#contenedor-canciones .portadas[data-cancion-id], #contenedor-mis-likes .portadas[data-cancion-id]'
    );

    if (tarjeta) {
        cancionSeleccionadaId = Number(tarjeta.dataset.cancionId);
        actualizarBotonLike();
        return;
    }

    const tarjetaAlbum = event.target.closest(
        '#contenedor-albumes-populares .portadas, #contenedor-albumes-recomendados .portadas'
    );

    if (tarjetaAlbum) {
        cancionSeleccionadaId = null;
        actualizarBotonLike();
    }
});



const botonPlay = document.querySelector('.play');

if (botonPlay) {

    botonPlay.addEventListener('click', (e) => {

        if (botonPlay.textContent === '▶') {
            botonPlay.textContent = '⏸';
        } else {
            botonPlay.textContent = '▶';
        }

    });

}

// que se cambie el boton de play a pause al hacer click



const selectorImagen = document.querySelector('.info-cancion img');

const selectorNombre = document.querySelector('.reproductorTitulo')
    || document.querySelector('.info-cancion .detalles-cancion h4');

const selectorArtista = document.querySelector('.reproductorArtista')
    || document.querySelector('.info-cancion .detalles-cancion p');


const albumes = document.querySelectorAll('.portadas');

albumes.forEach((album) => {

    album.addEventListener('click', () => {

        const imagen = album.querySelector('img');
        const nombre = album.querySelector('.albumTitulo');
        const artista = album.querySelector('.albumArtista');

        if (imagen && nombre && artista) {

            selectorImagen.src = imagen.src;
            selectorNombre.textContent = nombre.textContent;
            selectorArtista.textContent = artista.textContent;

        }

    });

});

document.addEventListener('click', (event) => {
    const tarjeta = event.target.closest('#contenedor-canciones .portadas, #contenedor-mis-likes .portadas');
    const duracion = Number(tarjeta.dataset.duracion);
    const tiempoTotal = document.querySelector('.tiempo-total');

    if (tiempoTotal && Number.isFinite(duracion)) {
        tiempoTotal.textContent = formatearDuracion(duracion);
    }

    if (!tarjeta) return;

    const imagen = tarjeta.querySelector('img');
    const nombre = tarjeta.querySelector('.albumTitulo');
    const artista = tarjeta.querySelector('.albumArtista');

    if (imagen && nombre && artista &&
        selectorImagen && selectorNombre && selectorArtista) {

        selectorImagen.src = imagen.src;
        selectorNombre.textContent = nombre.textContent;
        selectorArtista.textContent = artista.textContent;
    }
});


function formatearDuracion(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${minutos}:${String(segundosRestantes).padStart(2, '0')}`;
}





