import { obtenerCanciones, obtenerAlbumes } from "./api.js";

function mostrarCarga(destino, mensaje) {
    destino.innerHTML = `<div class="estado-ui"><div class="spinner"></div><p>${mensaje}</p></div>`;
}

function mostrarError(destino, mensaje, reintentar) {
    destino.innerHTML = `<div class="estado-ui estado-error"><p style="color: var(--error); font-weight: bold;">${mensaje}</p><button type="button" class="btn-reintentar">Reintentar</button></div>`;
    destino.querySelector('.btn-reintentar').addEventListener('click', reintentar);
}

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

        mostrarCarga(estadoCanciones, 'Cargando canciones...');
        contenedorCanciones.replaceChildren();

        try {
            const respuesta = await obtenerCanciones({
                busqueda,
                genero,
                ordenarPor
            });

            if (consultaActual !== numeroConsulta) return;

            if (!respuesta.ok) {
                mostrarError(estadoCanciones, 'Error al cargar canciones: ' + respuesta.error, actualizarCatalogo);
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

                contenedorCanciones.appendChild(tarjeta);
            });

            estadoCanciones.textContent = `Mostrando ${respuesta.data.length} canciones`;
        } catch (error) {
            if (consultaActual !== numeroConsulta) return;

            console.error('Error al obtener canciones:', error);
            mostrarError(estadoCanciones, 'Ocurrió un error al cargar las canciones.', actualizarCatalogo);
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



document.addEventListener('DOMContentLoaded', async () => {

    const contenedorPopulares = document.getElementById('contenedor-albumes-populares');
    const contenedorRecomendados = document.getElementById('contenedor-albumes-recomendados');

    if (!contenedorPopulares || !contenedorRecomendados) return;

    function crearTarjetaAlbum(album) {

        const tarjeta = document.createElement('article');
        tarjeta.className = 'portadas';

        const imagen = document.createElement('img');
        imagen.src = album.imagen;
        imagen.alt = `Portada de ${album.nombre}`;

        const titulo = document.createElement('h4');
        titulo.className = 'albumTitulo';
        titulo.textContent = album.nombre;

        const artista = document.createElement('p');
        artista.className = 'albumArtista';
        artista.textContent = album.artista;

        tarjeta.appendChild(imagen);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(artista);

        tarjeta.addEventListener('click', () => {
            const imagenReproductor = document.querySelector('.info-cancion img');
            const tituloReproductor = document.querySelector('.reproductorTitulo');
            const artistaReproductor = document.querySelector('.reproductorArtista');

            if (imagenReproductor) imagenReproductor.src = album.imagen;
            if (tituloReproductor) tituloReproductor.textContent = album.nombre;
            if (artistaReproductor) artistaReproductor.textContent = album.artista;
        });

        return tarjeta;
    }

    try {
        const [respuestaPopulares, respuestaRecomendados] = await Promise.all([
            obtenerAlbumes({ categoria: 'popular' }),
            obtenerAlbumes({ categoria: 'recomendado' })
        ]);

        if (!respuestaPopulares.ok || !respuestaRecomendados.ok) {
            console.error('Error al cargar los álbumes:', {
                populares: respuestaPopulares.error,
                recomendados: respuestaRecomendados.error
            });
            return;
        }

        const tarjetasPopulares = respuestaPopulares.data.map(crearTarjetaAlbum);
        contenedorPopulares.replaceChildren(...tarjetasPopulares);

        const tarjetasRecomendadas = respuestaRecomendados.data.map(crearTarjetaAlbum);
        contenedorRecomendados.replaceChildren(...tarjetasRecomendadas);

        console.log('Álbumes populares cargados:', respuestaPopulares.data);
        console.log('Álbumes recomendados cargados:', respuestaRecomendados.data);

    } catch (error) {
        console.error('Ocurrió un error al cargar los álbumes:', error);
    }
});



// [IA] fin

//esto es para la busqueda

