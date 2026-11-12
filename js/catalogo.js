import { obtenerCanciones } from "../TENJI2/js/api.js";


document.addEventListener('DOMContentLoaded', () => {
    const contenedorCanciones = document.getElementById('contenedor-canciones');
    const estadoCanciones = document.getElementById('estado-canciones');

    if (!contenedorCanciones || !estadoCanciones) return;

    async function cargarCanciones(busqueda = '') {
        estadoCanciones.textContent = 'Cargando canciones...';

        try {
            const respuesta = await obtenerCanciones({ busqueda });

            if (!respuesta.ok) {
                estadoCanciones.textContent = 'Error al cargar canciones: ' + respuesta.error;
                return;
            }

            console.log('Canciones obtenidas desde la API:', respuesta.data);

            contenedorCanciones.innerHTML = '';

            respuesta.data.forEach(cancion => {
                const tarjeta = document.createElement('article');
                tarjeta.className = 'portadas';

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

                contenedorCanciones.appendChild(tarjeta);
            });

            estadoCanciones.textContent = '';

            estadoCanciones.textContent = 'Canciones cargadas correctamente';
        } catch (error) {
            console.error('Error al obtener canciones:', error);
            estadoCanciones.textContent = 'Ocurrió un error al cargar las canciones.';
        }
    }

    cargarCanciones();
    const buscador = document.getElementById('input-buscador');

    const albumesPopulares = document.getElementById('albumes-populares');
    const albumesRecomendados = document.getElementById('albumes-recomendados');

    if (buscador) {
        buscador.addEventListener('input', () => {
            const busqueda = buscador.value.trim();

            if (albumesPopulares) {
                albumesPopulares.style.display = busqueda ? 'none' : '';
            }

            if (albumesRecomendados) {
                albumesRecomendados.style.display = busqueda ? 'none' : '';
            }

            cargarCanciones(busqueda);
        });
    }
});


document.addEventListener('keyup', (e) => {

    if (document.getElementById('contenedor-canciones')) return;

    if (e.target.matches('.buscador input')) {
        document.querySelectorAll('.portadas').forEach((portadas) => {
            if (portadas.textContent.toLowerCase().includes(e.target.value)) {
                portadas.classList.remove('filtro');
            } else {
                portadas.classList.add('filtro');
            }
        });
    }
});


