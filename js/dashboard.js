// [IA] inicio · ia/2026-11-11_cristoballopez3-dashboard.md

import { obtenerCanciones, obtenerPlaylists } from "./api.js";

console.log('dashboard.js cargado');

document.addEventListener('DOMContentLoaded', () => {
    const estado = document.getElementById('estado-dashboard');
    const contenedorStats = document.getElementById('dash-stats');
    const contenedorArtistas = document.getElementById('dash-artistas');
    const contenedorCanciones = document.getElementById('dash-canciones');


    const necesarios = {
        'estado-dashboard': estado,
        'dash-stats': contenedorStats,
        'dash-artistas': contenedorArtistas,
        'dash-canciones': contenedorCanciones
    };
    const faltantes = Object.keys(necesarios).filter((id) => !necesarios[id]);
    if (faltantes.length > 0) {
        console.error('dashboard.js: faltan estos id en el HTML:', faltantes.join(', '));
        return;
    }




    function crearElemento(etiqueta, clase, texto) {
        const elemento = document.createElement(etiqueta);
        if (clase) elemento.className = clase;
        if (texto !== undefined) elemento.textContent = texto;
        return elemento;
    }


    function contar(mapa, clave) {
        mapa.set(clave, (mapa.get(clave) || 0) + 1);
    }


    function formatearDuracion(segundos) {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        return horas > 0 ? `${horas} h ${minutos} min` : `${minutos} min`;
    }


    function formatearMinutos(segundos) {
        const minutos = Math.floor(segundos / 60);
        const resto = String(segundos % 60).padStart(2, '0');
        return `${minutos}:${resto}`;
    }

    function limpiarContenido() {
        contenedorStats.replaceChildren();
        contenedorArtistas.replaceChildren();
        contenedorCanciones.replaceChildren();
    }



    function calcularMetricas(canciones, playlists) {
        const artistas = new Map();
        const generos = new Map();
        let segundosTotales = 0;

        canciones.forEach((cancion) => {
            segundosTotales += cancion.duracion;
            contar(generos, cancion.genero);

            if (!artistas.has(cancion.artista)) {
                artistas.set(cancion.artista, {
                    nombre: cancion.artista,
                    genero: cancion.genero,
                    imagen: cancion.imagen,
                    cuenta: 0,
                    segundos: 0
                });
            }
            const artista = artistas.get(cancion.artista);
            artista.cuenta++;
            artista.segundos += cancion.duracion;
        });


        const topArtistas = [...artistas.values()]
            .sort((a, b) => b.cuenta - a.cuenta || b.segundos - a.segundos)
            .slice(0, 4);

        const cancionesMasLargas = [...canciones]
            .sort((a, b) => b.duracion - a.duracion)
            .slice(0, 4);

        const generoPrincipal = [...generos.entries()]
            .sort((a, b) => b[1] - a[1])[0] || ['Sin datos', 0];


        const cancionesGuardadas = playlists.reduce((total, playlist) => {
            return total + (playlist.cancionIds || []).length;
        }, 0);

        return {
            totalCanciones: canciones.length,
            segundosTotales,
            totalArtistas: artistas.size,
            generoPrincipal,
            topArtistas,
            cancionesMasLargas,
            totalPlaylists: playlists.length,
            cancionesGuardadas
        };
    }



    function pintarStats(m) {
        const badgePlaylists = m.totalPlaylists === 0
            ? 'Crea una en tu biblioteca'
            : `${m.cancionesGuardadas} canciones guardadas`;

        const tarjetas = [
            { icono: '🎧', valor: formatearDuracion(m.segundosTotales), label: 'Duración del catálogo', badge: `${m.totalCanciones} canciones`, tipo: 'neutro' },
            { icono: '🎵', valor: String(m.totalPlaylists), label: 'Tus playlists', badge: badgePlaylists, tipo: 'neutro' },
            { icono: '🌟', valor: String(m.totalArtistas), label: 'Artistas distintos', badge: 'En el catálogo', tipo: 'neutro' },
            { icono: '👑', valor: m.generoPrincipal[0], label: 'Género principal', badge: `${m.generoPrincipal[1]} de ${m.totalCanciones} canciones`, tipo: 'especial' }
        ];

        tarjetas.forEach((t) => {
            const tarjeta = crearElemento('article', 'dash-card-stat');
            tarjeta.appendChild(crearElemento('span', 'dash-stat-icon', t.icono));
            tarjeta.appendChild(crearElemento('h3', 'dash-stat-valor', t.valor));
            tarjeta.appendChild(crearElemento('p', 'dash-stat-label', t.label));
            tarjeta.appendChild(crearElemento('span', `dash-badge ${t.tipo}`, t.badge));
            contenedorStats.appendChild(tarjeta);
        });
    }

    function pintarArtistas(topArtistas) {
        topArtistas.forEach((artista, indice) => {
            const item = crearElemento('div', 'dash-artista-item');

            const foto = crearElemento('img', 'dash-artista-foto');
            foto.src = artista.imagen;
            foto.alt = `Imagen de ${artista.nombre}`;

            const info = crearElemento('div', 'dash-artista-info');
            info.appendChild(crearElemento('h4', 'albumTitulo', artista.nombre));
            info.appendChild(crearElemento('p', 'albumArtista', artista.genero));

            const palabra = artista.cuenta === 1 ? 'canción' : 'canciones';

            item.appendChild(crearElemento('span', 'dash-rank', String(indice + 1)));
            item.appendChild(foto);
            item.appendChild(info);
            item.appendChild(crearElemento('span', 'dash-horas', `${artista.cuenta} ${palabra} · ${formatearDuracion(artista.segundos)}`));

            contenedorArtistas.appendChild(item);
        });
    }

    function pintarCanciones(cancionesMasLargas) {
        cancionesMasLargas.forEach((cancion) => {
            const item = crearElemento('div', 'dash-cancion-item');

            const foto = crearElemento('img', 'dash-cancion-foto');
            foto.src = cancion.imagen;
            foto.alt = `Portada de ${cancion.titulo}`;

            item.appendChild(foto);
            item.appendChild(crearElemento('h4', 'dash-cancion-titulo', cancion.titulo));
            item.appendChild(crearElemento('p', 'dash-cancion-sub', `${cancion.artista} · ${formatearMinutos(cancion.duracion)}`));

            contenedorCanciones.appendChild(item);
        });
    }



    function mostrarError(mensaje) {
        limpiarContenido();
        estado.textContent = mensaje + ' ';

        const botonReintentar = crearElemento('button', 'btn-perfil', 'Reintentar');
        botonReintentar.addEventListener('click', cargarDashboard);
        estado.appendChild(botonReintentar);
    }

    async function cargarDashboard() {
        estado.textContent = 'Cargando panel...';
        limpiarContenido();

        try {

            const [resCanciones, resPlaylists] = await Promise.all([
                obtenerCanciones(),
                obtenerPlaylists()
            ]);

            if (!resCanciones.ok || !resPlaylists.ok) {
                mostrarError(resCanciones.error || resPlaylists.error);
                return;
            }


            if (resCanciones.data.length === 0) {
                estado.textContent = 'No hay canciones en el catálogo todavía.';
                return;
            }

            const metricas = calcularMetricas(resCanciones.data, resPlaylists.data);

            estado.textContent = '';
            pintarStats(metricas);
            pintarArtistas(metricas.topArtistas);
            pintarCanciones(metricas.cancionesMasLargas);

        } catch (error) {
            console.error('Error al cargar el dashboard:', error);
            mostrarError('Ocurrió un error al cargar el panel.');
        }
    }

    cargarDashboard();
});

// [IA] fin