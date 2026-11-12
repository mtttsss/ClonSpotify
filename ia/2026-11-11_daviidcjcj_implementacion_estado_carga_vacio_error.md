Implementación del estado de carga, vacio y error

Fecha: 2026-11-11
Integrante: David Cornejo (@daviidcjcj)
Herramienta y modelo: Gemini
Archivos afectados: biblioteca.js style.css

Objetivo

Implementar y probar los estados de carga, vacio y error incluidos en el aspecto B3 de la pauta.

Prompt 1

necesito implementar los estados de carga vacio y error del B3 de la pauta, esto hay que hacerlo en el biblioteca.js que te envie anteriormente, explicame como y donde incorporar esto en el codigo sin estropear lo demas, tambien un spinner para cuando este cargando, el css lo diseñamos despues

Respuesta 1

Para integrar los estados de carga (con el spinner), lista vacía y error con su respectivo botón de "Reintentar" directamente en tu archivo `biblioteca.js`, puedes hacerlo actualizando la función encargada de obtener y pintar las playlists.

Aquí tienes el código exacto y limpio para incorporar en tu archivo, sin tocar la parte de CSS por ahora:

### Código para integrar en `biblioteca.js`

```javascript
const cargarMisPlaylists = async () => {
    const contenedorPlaylists = document.getElementById("contenedor-mis-playlists");
    if (!contenedorPlaylists) return;

    const btnCrear = document.getElementById("btnCrearPlaylist");

    // Limpiamos el contenedor pero conservamos el botón de crear si existe
    contenedorPlaylists.innerHTML = '';
    if (btnCrear) contenedorPlaylists.appendChild(btnCrear);

    // 1. ESTADO DE CARGA (Spinner)
    const msjCarga = document.createElement("div");
    msjCarga.id = "msjCarga";
    msjCarga.className = "estado-ui";
    msjCarga.innerHTML = `
        <div class="spinner"></div>
        <p>Cargando tus playlists...</p>
    `;
    if (btnCrear) {
        contenedorPlaylists.insertBefore(msjCarga, btnCrear);
    } else {
        contenedorPlaylists.appendChild(msjCarga);
    }

    let respuesta;
    try {
        // Llamada a la API (puedes pasarle { forzarError: true } para probar el error)
        respuesta = await obtenerPlaylists();
    } catch (error) {
        respuesta = { ok: false, error: "Fallo de conexión con el servidor." };
    }

    // Quitamos el elemento de carga (spinner)
    const elementoCarga = document.getElementById("msjCarga");
    if (elementoCarga) elementoCarga.remove();

    // 2. ESTADO DE ERROR (Con botón Reintentar)
    if (!respuesta.ok) {
        const divError = document.createElement("div");
        divError.className = "estado-ui estado-error";
        divError.innerHTML = `
            <p>Error: ${respuesta.error}</p>
            <button id="btnReintentar">Reintentar</button>
        `;
        if (btnCrear) {
            contenedorPlaylists.insertBefore(divError, btnCrear);
        } else {
            contenedorPlaylists.appendChild(divError);
        }

        // El botón vuelve a ejecutar esta misma función para reintentar la carga
        document.getElementById("btnReintentar").addEventListener("click", cargarMisPlaylists);
        return;
    }

    const playlists = respuesta.data;

    // 3. ESTADO VACÍO
    if (!playlists || playlists.length === 0) {
        const msjVacio = document.createElement("div");
        msjVacio.className = "estado-ui";
        msjVacio.textContent = "Aún no tienes playlists. ¡Crea la primera!";
        if (btnCrear) {
            contenedorPlaylists.insertBefore(msjVacio, btnCrear);
        } else {
            contenedorPlaylists.appendChild(msjVacio);
        }
        return;
    }

    // 4. ESTADO DE ÉXITO (Pinta las playlists normalmente)
    playlists.forEach(playlist => {
        const article = document.createElement("article");
        article.className = "portadas";
        article.innerHTML = `
            <img src="https://i.scdn.co/image/ab67616d0000b273b17e8d2b2d2d768ef40aa348" alt="${playlist.nombre}">
            <h4>${playlist.nombre}</h4>
            <p>${playlist.descripcion || "De USUARIO"}</p>
            <button class="btn-editar" data-id="${playlist.id}" title="Editar playlist">Editar</button>
            <button class="btn-eliminar" data-id="${playlist.id}" title="Eliminar playlist">Eliminar</button>
        `;
        
        if (btnCrear) {
            contenedorPlaylists.insertBefore(article, btnCrear);
        } else {
            contenedorPlaylists.appendChild(article);
        }
    });
};

// Ejecutar al cargar el DOM
document.addEventListener("DOMContentLoaded", cargarMisPlaylists);

```

### ¿Cómo y dónde ubicarlo?

* Reemplaza la antigua función que tenías para listar o renderizar las playlists en `biblioteca.js` con este bloque completo.
* Asegúrate de que al final del archivo se mantenga el disparador `DOMContentLoaded` para que se ejecute al abrir la página.

Cuando gustes, me avisas para ver cómo probar estos estados utilizando los parámetros de la API.

Prompt 2

bien, ahora como puedo poner a prueba los estados? explicame como hacerlo

Respuesta 2

¡Excelente! Como acordamos en la simulación, para poner a prueba estos estados de forma rápida y limpia directamente con tu código actual (aprovechando que tu API ya viene preparada para esto), haz lo siguiente:

### 1. Probar el Estado de Error y el Botón 'Reintentar'

Para verificar que el mensaje de error en rojo y el botón de reintento funcionan perfecto, no necesitas desconectar internet ni complicarte:

1. Abre tu archivo `api.js`.
2. Busca la función `obtenerPlaylists()` y pásale o activa el parámetro de prueba cambiando la llamada para que reciba `{ forzarError = true }` o simplemente cambia el retorno temporal de la función por esto:
```javascript
export async function obtenerPlaylists({ forzarError = false } = {}) {
    await esperar(LATENCIA);

    // CAMBIO TEMPORAL PARA PRUEBA DE ERROR
    return {
        ok: false,
        status: 500,
        data: null,
        error: "Error simulado del servidor para la pauta"
    };

```


3. Guarda el archivo y recarga tu página web. Verás aparecer inmediatamente el mensaje de error y tu botón **"Reintentar"**. Si haces clic en él, verás que vuelve a intentar la ejecución en vivo.

### 2. Probar el Estado Vacío

Para comprobar que aparece el mensaje *"Aún no tienes playlists..."* cuando no hay información:

1. En tu mismo archivo `api.js`, haz que la función devuelva temporalmente una lista vacía en lugar de buscar en el almacenamiento:
```javascript
return {
    ok: true,
    status: 200,
    data: [], // <-- Arreglo vacío para probar el estado UI
    error: null
};

```


2. Guarda el archivo y recarga la página. El sistema detectará que no hay elementos y desplegará de inmediato el estado vacío.

### 3. Probar el Spinner (Carga)

Como tu API ya utiliza la función `esperar(LATENCIA)` (que por defecto trae un tiempo de retardo), el spinner aparecerá automáticamente cada vez que cargues o recargues la vista. Si quieres que se note más tiempo en pantalla para mostrárselo al profesor, solo sube un poco el valor de la latencia al inicio de tu `api.js`:

```javascript
const LATENCIA = 1500; // 1.5 segundos de espera simulada

```

Una vez que hagas tus pruebas y verifiques que todo responde correctamente, solo dejas los valores de la API originales y tu pauta quedará 100% lista.