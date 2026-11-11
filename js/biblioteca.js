import { mostrarToast } from "./notificaciones.js";
// [IA] inicio - 2026-11-11_mtttsss_edicion-crud.md

// creacion y edicion de playlists
document.addEventListener('DOMContentLoaded', () => {
    const btnCrearPlaylist = document.getElementById('btnCrearPlaylist');
    const modalPlaylist = document.getElementById('modalPlaylist');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const btnGuardarModal = document.getElementById('btnGuardarModal');
    const inputNombrePlaylist = document.getElementById('nombrePlaylist');
    const inputDescripcion = document.getElementById('descripcionPlaylist');
    const tituloModal = document.getElementById('tituloModalPlaylist');
    const textoModal = document.getElementById('textoModalPlaylist');
    const errorPlaylist = document.getElementById('errorPlaylist');

    if (!modalPlaylist || !btnGuardarModal || !inputNombrePlaylist) return;

    let playlistEnEdicion = null;

    const cerrarModal = () => {
        modalPlaylist.classList.add('oculto');
        playlistEnEdicion = null;
        inputNombrePlaylist.value = '';
        if (inputDescripcion) inputDescripcion.value = '';
        if (errorPlaylist) errorPlaylist.textContent = '';
        btnGuardarModal.disabled = false;
        btnGuardarModal.textContent = 'Crear';
    };

    // Abrir modal para crear
    if (btnCrearPlaylist) {
        btnCrearPlaylist.addEventListener('click', () => {
            playlistEnEdicion = null;
            if (errorPlaylist) errorPlaylist.textContent = '';
            if (tituloModal) tituloModal.textContent = 'Crear nueva playlist';
            if (textoModal) textoModal.textContent = 'Ponle un nombre a tu nueva playlist.';
            btnGuardarModal.textContent = 'Crear';
            modalPlaylist.classList.remove('oculto');
            inputNombrePlaylist.focus();
        });
    }

    // Abrir modal para editar
    document.addEventListener('click', async (event) => {
        const botonEditar = event.target.closest('.btn-editar');
        if (!botonEditar) return;

        const id = Number(botonEditar.dataset.id);
        const respuesta = await obtenerPlaylists();

        if (!respuesta.ok) {
            alert('No se pudieron cargar las playlists: ' + respuesta.error);
            return;
        }

        const playlist = respuesta.data.find(p => p.id === id);

        if (!playlist) {
            alert('No se encontró la playlist.');
            return;
        }

        playlistEnEdicion = id;
        inputNombrePlaylist.value = playlist.nombre;
        if (inputDescripcion) inputDescripcion.value = playlist.descripcion || '';

        if (tituloModal) tituloModal.textContent = 'Editar playlist';
        if (textoModal) textoModal.textContent = 'Modifica los datos de tu playlist.';
        btnGuardarModal.textContent = 'Guardar cambios';

        modalPlaylist.classList.remove('oculto');
        inputNombrePlaylist.focus();
    });

    // Cerrar modal con el botón Cancelar
    btnCancelarModal?.addEventListener('click', cerrarModal);

    // Cerrar modal al hacer clic fuera de él
    modalPlaylist.addEventListener('click', (event) => {
        if (event.target === modalPlaylist && !btnGuardarModal.disabled) {
            cerrarModal();
        }
    });

    // Cerrar modal presionando Escape
    document.addEventListener('keydown', (event) => {
        if (
            event.key === 'Escape' &&
            !modalPlaylist.classList.contains('oculto') &&
            !btnGuardarModal.disabled
        ) {
            cerrarModal();
        }
    });

    // Crear o actualizar playlist
    btnGuardarModal.addEventListener('click', async () => {
        if (btnGuardarModal.disabled) return;

        const nombre = inputNombrePlaylist.value.trim();
        const descripcion = inputDescripcion?.value.trim() || '';

        if (!nombre) {
            if (errorPlaylist) errorPlaylist.textContent = 'Debes ingresar un nombre.';
            return;
        }

        if (errorPlaylist) errorPlaylist.textContent = '';

        btnGuardarModal.disabled = true;
        btnGuardarModal.textContent = 'Guardando...';

        let respuesta;

        try {
            if (playlistEnEdicion !== null) {
                respuesta = await editarPlaylist(playlistEnEdicion, {
                    nombre,
                    descripcion
                });
            } else {
                respuesta = await crearPlaylist({
                    nombre,
                    descripcion: descripcion || 'Creado desde la web',
                    cancionIds: []
                });
            }

            if (respuesta.ok) {
                mostrarToast(playlistEnEdicion !== null ? '¡Playlist actualizada con éxito!' : '¡Playlist creada con éxito!', 'exito');
                setTimeout(() => {
                    cerrarModal();
                    window.location.reload();
                }, 1200);
            } else {
                if (errorPlaylist) errorPlaylist.textContent = respuesta.error;
                btnGuardarModal.disabled = false;
                btnGuardarModal.textContent =
                    playlistEnEdicion !== null ? 'Guardar cambios' : 'Crear';
            }
        } catch (error) {
            if (errorPlaylist) errorPlaylist.textContent = 'Ocurrió un error inesperado.';
            btnGuardarModal.disabled = false;
            btnGuardarModal.textContent =
                playlistEnEdicion !== null ? 'Guardar cambios' : 'Crear';
            console.error(error);
        }
    });
});


import {
    obtenerPlaylists,
    crearPlaylist,
    editarPlaylist,
    eliminarPlaylist
} from "../TENJI2/js/api.js";

// cargar playlist
document.addEventListener("DOMContentLoaded", async () => {
    const contenedorPlaylists = document.getElementById("contenedor-mis-playlists");
    if (!contenedorPlaylists) return;

    const btnCrear = document.getElementById("btnCrearPlaylist");
    const respuesta = await obtenerPlaylists();

    if (!respuesta.ok) {
        console.error("Error al obtener playlists:", respuesta.error);
        return;
    }

    const playlists = respuesta.data;

    playlists.forEach(playlist => {
        const article = document.createElement("article");
        article.className = "portadas";
        article.innerHTML = `
            <img src="https://i.scdn.co/image/ab67616d0000b273b17e8d2b2d2d768ef40aa348" alt="${playlist.nombre}">
            <h4>${playlist.nombre}</h4>
            <p>${playlist.descripcion || "De USUARIO"}</p>
            <button class="btn-editar"
                data-id="${playlist.id}"
                title="Editar playlist"
                style="background:transparent; border:none; color:#a875ff; cursor:pointer; font-size:14px; margin-top:5px; margin-right:12px;">
                Editar
            </button>
            <button class="btn-eliminar" data-id="${playlist.id}" title="Eliminar playlist" style="background:transparent; border:none; color:#ff4d4d; cursor:pointer; font-size:14px; margin-top:5px;">Eliminar</button>
        `;

        if (btnCrear) {
            contenedorPlaylists.insertBefore(article, btnCrear);
        } else {
            contenedorPlaylists.appendChild(article);
        }
    });
});


// [IA] fin - 2026-11-11_mtttsss_edicion-crud.md



// eliminar playlist
document.addEventListener('click', async (event) => {
    if (event.target.classList.contains('btn-eliminar')) {
        const idPlaylist = Number(event.target.getAttribute('data-id'));

        const confirmar = confirm("¿Estás seguro de que deseas eliminar esta playlist?");
        if (!confirmar) return;

        const respuesta = await eliminarPlaylist(idPlaylist);

        if (respuesta.ok) {
            mostrarToast('Playlist eliminada correctamente', 'exito');
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } else {
            console.error("Error al eliminar la playlist:", respuesta.error);
            alert("No se pudo eliminar: " + respuesta.error);
        }
    }
});
