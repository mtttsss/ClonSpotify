
import { obtenerCanciones } from "./api.js";


function mostrarCarga(destino, mensaje) {
    destino.textContent = mensaje;
}

function mostrarError(destino, mensaje, reintentar) {
    destino.replaceChildren();

    const texto = document.createElement('p');
    texto.textContent = mensaje;

    const boton = document.createElement('button');
    boton.textContent = 'Reintentar';
    boton.addEventListener('click', reintentar);

    destino.append(texto, boton);
}


document.addEventListener('DOMContentLoaded', cargarLikes);

async function cargarLikes() {

    const contenedorLikes = document.getElementById('contenedor-mis-likes');
    const estadoLikes = document.getElementById('estado-mis-likes');

    if (!contenedorLikes || !estadoLikes) return;

    const usuario = JSON.parse(localStorage.getItem('sesion_tenji'));

    if (!usuario || usuario.id === undefined || usuario.id === null) {
        estadoLikes.textContent = 'Debes iniciar sesión para ver tus favoritos.';
        return;
    }

    const clave = `tenji_likes_${usuario.id}`;

    let likesGuardados;

    try {
        likesGuardados = JSON.parse(localStorage.getItem(clave)) || [];
    } catch (error) {
        estadoLikes.textContent = 'No se pudieron leer los favoritos guardados.';
        console.error('Error al leer los Likes:', error);
        return;
    }

    if (!Array.isArray(likesGuardados) || likesGuardados.length === 0) {
        contenedorLikes.replaceChildren();
        estadoLikes.textContent = 'Todavía no tienes canciones favoritas.';
        return;
    }

    mostrarCarga(estadoLikes, 'Cargando tus canciones favoritas...');

    try {
        const respuesta = await obtenerCanciones();

        if (!respuesta.ok) {
            mostrarError(estadoLikes, 'No se pudieron cargar tus canciones favoritas.', cargarLikes);
            return;
        }

        const idsFavoritos = new Set(likesGuardados.map(String));

        const cancionesFavoritas = respuesta.data.filter(cancion =>
            idsFavoritos.has(String(cancion.id))
        );

        contenedorLikes.replaceChildren();

        cancionesFavoritas.forEach(cancion => {

            const tarjeta = document.createElement('article');
            tarjeta.className = 'portadas';
            tarjeta.dataset.cancionId = cancion.id;
            tarjeta.dataset.duracion = cancion.duracion;

            const imagen = document.createElement('img');
            imagen.src = cancion.imagen;
            imagen.alt = `Portada de ${cancion.titulo}`;

            const titulo = document.createElement('h4');
            titulo.className = 'albumTitulo';
            titulo.textContent = cancion.titulo;

            const artista = document.createElement('p');
            artista.className = 'albumArtista';
            artista.textContent = cancion.artista;

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(artista);

            contenedorLikes.appendChild(tarjeta);
        });

        estadoLikes.textContent = cancionesFavoritas.length === 0
            ? 'No se encontraron las canciones guardadas en favoritos.'
            : `Tienes ${cancionesFavoritas.length} canciones favoritas.`;

    } catch (error) {
        console.error('Error al cargar los Likes:', error);
        mostrarError(estadoLikes, 'Ocurrió un error al cargar tus favoritos.', cargarLikes);
    }
}
