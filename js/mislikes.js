
import { obtenerCanciones } from "../TENJI2/js/api.js";

document.addEventListener('DOMContentLoaded', async () => {

    const contenedorLikes = document.getElementById('contenedor-mis-likes');
    const estadoLikes = document.getElementById('estado-mis-likes');

    if (!contenedorLikes || !estadoLikes) return;

    let likesGuardados;

    try {
        likesGuardados = JSON.parse(localStorage.getItem('tenji_likes')) || [];
    } catch (error) {
        estadoLikes.textContent = 'No se pudieron leer los favoritos guardados.';
        console.error('Error al leer los Likes:', error);
        return;
    }

    if (!Array.isArray(likesGuardados) || likesGuardados.length === 0) {
        estadoLikes.textContent = 'Todavía no tienes canciones favoritas.';
        return;
    }

    estadoLikes.textContent = 'Cargando tus canciones favoritas...';

    try {
        const respuesta = await obtenerCanciones();

        if (!respuesta.ok) {
            estadoLikes.textContent = 'No se pudieron cargar tus canciones favoritas.';
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
        estadoLikes.textContent = 'Ocurrió un error al cargar tus favoritos.';
    }
});
