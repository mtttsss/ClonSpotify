import { obtenerCanciones } from "../TENJI2/js/api.js";

// [IA] inicio - 2026-11-11_mttts_filtros.md

document.addEventListener('DOMContentLoaded', () => {
    const contenedorCanciones = document.getElementById('contenedor-canciones');
    const estadoCanciones = document.getElementById('estado-canciones');

    if (!contenedorCanciones || !estadoCanciones) return;

    const buscador = document.getElementById('input-buscador');
    const filtroGenero = document.getElementById('filtro-genero');
    const ordenarCanciones = document.getElementById('ordenar-canciones');

    const albumesPopulares = document.getElementById('albumes-populares');
    const albumesRecomendados = document.getElementById('albumes-recomendados');

    let numeroConsulta = 0;

    async function cargarCanciones(busqueda = '', genero = '', ordenarPor = '') {
        const consultaActual = ++numeroConsulta;

        estadoCanciones.textContent = 'Cargando canciones...';
        contenedorCanciones.replaceChildren();

        try {
            const respuesta = await obtenerCanciones({
                busqueda,
                genero,
                ordenarPor
            });

            if (consultaActual !== numeroConsulta) return;

            if (!respuesta.ok) {
                estadoCanciones.textContent = 'Error al cargar canciones: ' + respuesta.error;
                return;
            }

            console.log('Canciones obtenidas desde la API:', respuesta.data);


            if (respuesta.data.length === 0) {
                estadoCanciones.textContent = 'No se encontraron canciones.';
                return;
            }

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

            estadoCanciones.textContent = `Mostrando ${respuesta.data.length} canciones`;
        } catch (error) {
            if (consultaActual !== numeroConsulta) return;

            console.error('Error al obtener canciones:', error);
            estadoCanciones.textContent = 'Ocurrió un error al cargar las canciones.';
        }
    }

    function actualizarCatalogo() {
        const busqueda = buscador?.value.trim() || '';
        const genero = filtroGenero?.value || '';
        const ordenarPor = ordenarCanciones?.value || '';

        const hayFiltrosActivos = Boolean(busqueda || genero || ordenarPor);

        if (albumesPopulares) {
            albumesPopulares.style.display = hayFiltrosActivos ? 'none' : '';
        }

        if (albumesRecomendados) {
            albumesRecomendados.style.display = hayFiltrosActivos ? 'none' : '';
        }


        cargarCanciones(busqueda, genero, ordenarPor);
    }

    actualizarCatalogo();

    if (buscador) {
        buscador.addEventListener('input', actualizarCatalogo);
    }

    if (filtroGenero) {
        filtroGenero.addEventListener('change', actualizarCatalogo);
    }

    if (ordenarCanciones) {
        ordenarCanciones.addEventListener('change', actualizarCatalogo);
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

// [IA] fin

//esto es para la busqueda

