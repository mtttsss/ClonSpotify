// [IA] inicio · ia/2026-11-11_daviidcjcj_playlist_detalle.md
import { obtenerPlaylist, obtenerCanciones } from "../TENJI2/js/api.js";

const contenedor = document.getElementById("contenedor-playlist");

function crearElemento(etiqueta, texto, clase) {
    const el = document.createElement(etiqueta);
    if (texto !== undefined) el.textContent = texto;
    if (clase) el.className = clase;
    return el;
}

function formatearDuracion(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = String(segundos % 60).padStart(2, "0");
    return `${minutos}:${resto}`;
}

function mostrarCarga() {
    contenedor.replaceChildren();
    const estado = crearElemento("div", undefined, "estado-ui");
    estado.append(
        crearElemento("div", undefined, "spinner"),
        crearElemento("p", "Cargando información...")
    );
    contenedor.append(estado);
}

function mostrarError(mensaje, { reintentable = false } = {}) {
    contenedor.replaceChildren();
    const estado = crearElemento("div", undefined, "estado-ui estado-error");
    const texto = crearElemento("p", mensaje);
    texto.style.cssText = "color: var(--error); font-weight: bold;";
    estado.append(texto);

    if (reintentable) {
        const boton = crearElemento("button", "Reintentar", "btn-reintentar");
        boton.type = "button";
        boton.addEventListener("click", cargarDetalle);
        estado.append(boton);
    }

    contenedor.append(estado);
}

function mostrarPlaylist(playlist, canciones, errorCanciones) {
    document.title = `${playlist.nombre} · TENJI`;
    contenedor.replaceChildren();

    const detalle = crearElemento("section", undefined, "detalle-playlist");
    detalle.append(crearElemento("h2", playlist.nombre));

    if (playlist.descripcion) {
        detalle.append(crearElemento("p", playlist.descripcion, "detalle-descripcion"));
    }

    const total = canciones.length;
    detalle.append(
        crearElemento("p", `${total} ${total === 1 ? "canción" : "canciones"}`, "detalle-meta")
    );

    if (errorCanciones) {
        const aviso = crearElemento("p", errorCanciones);
        aviso.style.color = "var(--error)";
        detalle.append(aviso);
    } else if (total === 0) {
        detalle.append(crearElemento("p", "Esta playlist aún no tiene canciones.", "detalle-descripcion"));
    }

    if (total > 0) {
        const lista = crearElemento("ol", undefined, "lista-canciones");

        canciones.forEach((cancion) => {
            const item = document.createElement("li");

            const portada = document.createElement("img");
            portada.src = cancion.imagen;
            portada.alt = `Portada de ${cancion.titulo}`;

            const info = crearElemento("div", undefined, "cancion-info");
            info.append(
                crearElemento("strong", cancion.titulo),
                crearElemento("span", cancion.artista)
            );

            item.append(
                portada,
                info,
                crearElemento("span", formatearDuracion(cancion.duracion), "cancion-duracion")
            );
            lista.append(item);
        });

        detalle.append(lista);
    }

    contenedor.append(detalle);
}

async function cargarDetalle() {
    if (!contenedor) return;

    mostrarCarga();

    try {
        await cargarDetalleInterno();
    } catch (error) {
        console.error("Error al cargar el detalle de la playlist:", error);
        mostrarError("Ocurrió un error inesperado al cargar la playlist.", { reintentable: true });
    }
}

async function cargarDetalleInterno() {

    // Si falta el parámetro o no es numérico, Number() da 0 o NaN y la API responde 400.
    const id = Number(new URLSearchParams(window.location.search).get("id"));

    const respuesta = await obtenerPlaylist(id);

    if (!respuesta.ok) {
        if (respuesta.status === 404) {
            mostrarError("Playlist no encontrada");
        } else if (respuesta.status === 400) {
            mostrarError(respuesta.error);
        } else {
            mostrarError(respuesta.error || "No se pudo cargar la playlist", { reintentable: true });
        }
        return;
    }

    const playlist = respuesta.data;
    const cancionesRespuesta = await obtenerCanciones();

    if (!cancionesRespuesta.ok) {
        mostrarPlaylist(playlist, [], "No se pudieron cargar las canciones de esta playlist.");
        return;
    }

    const canciones = playlist.cancionIds
        .map((idCancion) => cancionesRespuesta.data.find((c) => c.id === idCancion))
        .filter(Boolean);

    mostrarPlaylist(playlist, canciones, null);
}

cargarDetalle();
// [IA] fin