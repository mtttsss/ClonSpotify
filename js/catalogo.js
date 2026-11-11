import { obtenerCanciones } from "../TENJI2/js/api.js";


document.addEventListener('DOMContentLoaded', () => {
    const contenedorCanciones = document.getElementById('contenedor-canciones');
    const estadoCanciones = document.getElementById('estado-canciones');

    if (!contenedorCanciones || !estadoCanciones) return;

    async function cargarCanciones() {
        estadoCanciones.textContent = 'Cargando canciones...';

        try {
            const respuesta = await obtenerCanciones();

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
});


document.addEventListener('keyup', (e) => {
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


//esto es para la busqueda
//solo se puede buscar en minisculas, si se busca en mayusculas no funciona

