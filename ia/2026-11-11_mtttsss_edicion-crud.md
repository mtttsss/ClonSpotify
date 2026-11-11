# <Edicion de playlist CRUD>
- **Fecha:** 2026-11-09
- **Integrante:** <Matias Pinto> (@mtttsss)
- **Herramienta y modelo:** <ChatGPT (GPT-6)>
- **Archivos afectados:** <api.js>

## Objetivo

<Implementar la edicion de playlist en la pagina>

## Conversación

### Prompt 1

Ayudame con la parte de "edicion" del CRUD, para las playlist

### Respuesta 1

¡Dale! Vamos a implementar UPDATE (edición de playlists) en TENJI, reutilizando el modal que ya tienes para crear playlists y la función `editarPlaylist()` de tu API.

La idea es que cada playlist tenga un botón Editar, que permita modificar su nombre y descripción sin perder las canciones asociadas.

Trabajaremos únicamente con `biblioteca.html` y `script.js`.

## 1. Modificar el modal en `biblioteca.html`

Busca este código:

```
<h3>Crear nueva playlist</h3>
<p>Ponle un nombre a tu nueva playlist.</p>
<input type="text" id="nombrePlaylist" placeholder="Mi nueva playlist" autocomplete="off">
```

Reemplázalo por:

```
<h3 id="tituloModalPlaylist">Crear nueva playlist</h3>
<p id="textoModalPlaylist">Ponle un nombre a tu nueva playlist.</p>

<input type="text" id="nombrePlaylist"
       placeholder="Nombre de la playlist" autocomplete="off">

<input type="text" id="descripcionPlaylist"
       placeholder="Descripción de la playlist" autocomplete="off">
```

Con esto podremos cambiar el título del modal dependiendo de si estamos creando o editando una playlist, además de permitir modificar su descripción.

Mantén los botones Cancelar y Crear, junto con el elemento `errorPlaylist`.

## 2. Importar la función de edición en `script.js`

Busca la importación actual:

```
import { obtenerPlaylists, crearPlaylist, eliminarPlaylist } from "./TENJI2/js/api.js";
```

Reemplázala por:

```
import {
    obtenerPlaylists,
    crearPlaylist,
    editarPlaylist,
    eliminarPlaylist
} from "./TENJI2/js/api.js";
```

Así podremos utilizar la función `editarPlaylist()` que ya está implementada en la API.

## 3. Agregar el botón Editar a las tarjetas

En `script.js`, busca el bloque que genera las tarjetas dinámicamente, específicamente donde aparece:

```
<button class="btn-eliminar" data-id="${playlist.id}">Eliminar</button>
```

Justo antes agrega:

```
<button class="btn-editar"
        data-id="${playlist.id}"
        title="Editar playlist"
        style="background:transparent; border:none; color:#a875ff; cursor:pointer; font-size:14px; margin-top:5px; margin-right:12px;">
    ✏️ Editar
</button>
```

Cada tarjeta tendrá ahora dos acciones: editar y eliminar.

## 4. Adaptar el modal para crear y editar

En `script.js`, busca el bloque que comienza con:

```
//creacion playlist
document.addEventListener('DOMContentLoaded', () => {
```

Reemplaza ese bloque completo por el siguiente, conservando el código posterior de eliminación de playlists.

```

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

    // Cerrar modal
    btnCancelarModal?.addEventListener('click', cerrarModal);

    modalPlaylist.addEventListener('click', (event) => {
        if (event.target === modalPlaylist) cerrarModal();
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
                cerrarModal();
                window.location.reload();
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

```

### ¿Cómo funciona?

La variable `playlistEnEdicion` permite saber qué operación realizar:

- Si es `null`, se utiliza `crearPlaylist()`.
- Si contiene el ID de una playlist, se utiliza `editarPlaylist()`.

Cuando presionamos Editar, obtenemos los datos actuales de la playlist y los colocamos en los campos del modal.

Después, al guardar, enviamos los datos modificados a la API. Como solo enviamos el nombre y la descripción, se mantienen los identificadores de canciones existentes.

## 5. Comprobar que UPDATE funciona

Abre `biblioteca.html` mediante Live Server y realiza las siguientes pruebas:

1. Presiona Editar en una playlist existente.
2. Comprueba que el modal muestre su nombre y descripción actuales.
3. Cambia el nombre por `Playlist editada`.
4. Presiona Guardar cambios.
5. Verifica que aparezca el nombre actualizado.
6. Recarga la página y comprueba que el cambio permanece.
7. Prueba crear y eliminar una playlist para confirmar que esas operaciones siguen funcionando.

Si todo funciona, tendremos las cuatro operaciones CRUD conectadas a la interfaz:

| Operación | Función              |
| --------- | -------------------- |
| CREATE    | `crearPlaylist()`    |
| READ      | `obtenerPlaylists()` |
| UPDATE    | `editarPlaylist()`   |
| DELETE    | `eliminarPlaylist()` |

Importante: por ahora no modifiques `api.js` ni los mocks. La edición debe funcionar utilizando la lógica que ya desarrollaste, sin duplicar el manejo de datos en `script.js`.