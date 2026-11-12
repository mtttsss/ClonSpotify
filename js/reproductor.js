
const botonLike = document.querySelector('.like');

let cancionSeleccionadaId = null;

// Obtener la clave de favoritos del usuario que inició sesión
function obtenerClaveLikes() {
    const usuario = JSON.parse(localStorage.getItem('sesion_tenji'));

    if (!usuario || usuario.id === undefined || usuario.id === null) {
        return null;
    }

    return `tenji_likes_${usuario.id}`;
}

function obtenerLikes() {
    const clave = obtenerClaveLikes();

    if (!clave) return [];

    return JSON.parse(localStorage.getItem(clave)) || [];
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

        const clave = obtenerClaveLikes();

        if (!clave) {
            console.error('No hay un usuario conectado.');
            return;
        }

        let likes = obtenerLikes();

        if (likes.includes(cancionSeleccionadaId)) {
            likes = likes.filter(id => id !== cancionSeleccionadaId);
        } else {
            likes.push(cancionSeleccionadaId);
        }

        localStorage.setItem(clave, JSON.stringify(likes));

        actualizarBotonLike();

        console.log('Usuario:', clave);
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
    botonPlay.addEventListener('click', () => {
        botonPlay.textContent =
            botonPlay.textContent === '▶' ? '⏸' : '▶';
    });
}

const selectorImagen = document.querySelector('.info-cancion img');

const selectorNombre = document.querySelector('.reproductorTitulo')
    || document.querySelector('.info-cancion .detalles-cancion h4');

const selectorArtista = document.querySelector('.reproductorArtista')
    || document.querySelector('.info-cancion .detalles-cancion p');

document.addEventListener('click', (event) => {

    const tarjeta = event.target.closest(
        '#contenedor-canciones .portadas, #contenedor-mis-likes .portadas'
    );

    if (!tarjeta) return;

    const imagen = tarjeta.querySelector('img');
    const nombre = tarjeta.querySelector('.albumTitulo');
    const artista = tarjeta.querySelector('.albumArtista');

    if (imagen && selectorImagen) {
        selectorImagen.src = imagen.src;
    }

    if (nombre && selectorNombre) {
        selectorNombre.textContent = nombre.textContent;
    }

    if (artista && selectorArtista) {
        selectorArtista.textContent = artista.textContent;
    }

    const duracion = Number(tarjeta.dataset.duracion);
    const tiempoTotal = document.querySelector('.tiempo-total');
    const tiempoActual = document.querySelector('.tiempo-actual');
    const barraProgreso = document.querySelector('.barra-progreso');

    if (tiempoTotal && Number.isFinite(duracion) && duracion > 0) {
        tiempoTotal.textContent = formatearDuracion(duracion);
    }

    if (tiempoActual) {
        tiempoActual.textContent = '0:00';
    }

    if (barraProgreso) {
        barraProgreso.value = 0;
    }
});

function formatearDuracion(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;

    return `${minutos}:${String(segundosRestantes).padStart(2, '0')}`;
}
