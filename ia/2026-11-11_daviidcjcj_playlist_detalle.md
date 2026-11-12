Flujo principal de playlists, detalle y aspectos del criterio A1 de la pauta.

Fecha: 2026-11-11
Integrante: David Cornejo (@daviidcjcj)
Herramienta y modelo: Claude
Archivos afectados: js/playlist.js (nuevo), playlist.html, js/biblioteca.js, js/reproductor.js, perfil.html, style.css


Conversación

Prompt 1
ayudame a implementar la logica el js para el flujo de las playlists, tengo un nuevo archivo playlist.js, ayudame a hacer la logica para poder navegar en las playlist, tengo el html y css listo, solo falta eso. 

Respuesta 1 

Esta es la lógica de js/playlist.js para navegar entre playlists. La separé en la parte que pinta la página y la que carga los datos. Es el mismo código que ya está en tu proyecto, así que no cambia nada de lo que probamos.

js/playlist.js (archivo completo)
js
// Detalle de una playlist: playlist.html?id=3
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
    // El id viaja en la URL. Si falta o no es numérico, la API responde 400.
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

    // La playlist solo guarda ids: se buscan en el catálogo respetando el orden
    const canciones = playlist.cancionIds
        .map((idCancion) => cancionesRespuesta.data.find((c) => c.id === idCancion))
        .filter(Boolean);

    mostrarPlaylist(playlist, canciones, null);
}

cargarDetalle();

Prompt 2

Ahora ayudame a ajustar el biblioteca.js para evitar errores de logica y que la navegacion entre playlists sea correcta 

Respuesta 2

js/biblioteca.js: la navegación desde la lista

1. En el playlists.forEach(...) que dibuja cada tarjeta, agrega el data-id y envuelve imagen, título y descripción en un enlace:

js
article.dataset.id = id;
article.innerHTML = `
    <a href="playlist.html?id=${id}" class="enlace-playlist" aria-label="Abrir playlist ${nombre}">
        <img src="..." alt="Portada de ${nombre}">
        <h4>${nombre}</h4>
        <p>${descripcion}</p>
    </a>
    <button class="btn-editar" data-id="${id}">Editar</button>
    <button class="btn-eliminar" data-id="${id}">Eliminar</button>
`;

2. Al final del archivo, agrega esto para que cualquier parte de la tarjeta abra el detalle:

js
document.addEventListener('click', (event) => {
    const tarjeta = event.target.closest('#contenedor-mis-playlists .portadas[data-id]');
    if (!tarjeta) return;

    // Editar, Eliminar y el enlace ya hacen lo suyo
    if (event.target.closest('button, a')) return;

    window.location.href = `playlist.html?id=${tarjeta.dataset.id}`;
});

Prompt 3

necesito que me ayudes a saber si un archivo de la pagina no se pudo cargar en el playlist.html, que debo agregar

Respuesta 3

Agrega una pequeña función de contingencia en tu HTML y usa el atributo onerror en la etiqueta de tu script principal. De esta forma, si el navegador no logra encontrar el archivo JS o bloquea la ejecución (por no usar Live Server), la interfaz mostrará un mensaje de alerta en lugar de quedarse en blanco.
Reemplaza el código de tu playlist.html con esta versión:
    <script>
        function falloCarga(archivo) {
            var c = document.getElementById('contenedor-playlist');
            if (c) {
                c.innerHTML = '<p style="color:#ff4d4d;font-weight:bold;">No se pudo cargar ' + archivo +
                    '. Revisa que el archivo exista en esa ruta y abre el sitio con Live Server (no con doble clic).</p>';
            }
        }
    </script>

    });
Cómo funciona
Al abrir playlist.html?id=3, cargarDetalle() muestra el spinner y lee el id de la URL.
Llama a obtenerPlaylist(id). Si responde 404, muestra “Playlist no encontrada”; si es un id inválido (400), muestra el mensaje de la API; y si falla el servidor, ofrece Reintentar.
Si existe, busca sus canciones en el catálogo y las pinta en orden.
Desde la biblioteca, el clic en la tarjeta lleva a playlist.html?id=N, y el enlace “← Volver a tu biblioteca” regresa.