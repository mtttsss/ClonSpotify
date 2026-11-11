# <Obtener canciones>
- **Fecha:** 2026-11-10
- **Integrante:** <Matias Pinto> (@mtttsss)
- **Herramienta y modelo:** <ChatGPT (GPT-6)>
- **Archivos afectados:** <api.js>

## Objetivo

<Implementacion de CRUD>

## Conversación
(ACLARACIONES)
Para esta parte (aun que ya lo deje documentado en el api.js) no solo se copio y se pego lo de la IA, me guiee con ella sobre como avanzar antes que nada, vi videos de youtube y una vez complete la primera parte de api.js comprendi mucho mejor el como hacer el CRUD sin solo copiar y pegar.

### Prompt 1

Ayudame a implentar el CRUD en api.js, explicandome y enseñandome

### Respuesta 2

¡Vamos! Ahora vamos a implementar el CRUD completo de playlists en TENJI, pero quiero que entiendas cómo funciona cada operación, porque después tendrás que integrarla con el frontend y probablemente explicarla en tu evaluación.

Como ya creamos `obtenerPlaylists()`, aprovecharemos esa función y evitaremos repetir código innecesariamente.

## 1. ¿Qué vamos a construir?

Tu archivo `api.js` tendrá estas funciones para las playlists:

| Función                     | Operación | Resultado                       |
| --------------------------- | --------- | ------------------------------- |
| `obtenerPlaylists()`        | READ      | Obtiene todas las playlists     |
| `obtenerPlaylist(id)`       | READ      | Obtiene una playlist específica |
| `crearPlaylist(datos)`      | CREATE    | Crea una playlist               |
| `editarPlaylist(id, datos)` | UPDATE    | Modifica una playlist           |
| `eliminarPlaylist(id)`      | DELETE    | Elimina una playlist            |

Todas devolverán el formato que ya vienes utilizando:

```
{
    ok: true,
    status: 200,
    data: /* resultado */,
    error: null
}
```

Importante: conserva tus funciones de canciones. Todo lo que construiremos ahora va debajo de ellas.

## 2. Primero: crear una función auxiliar para guardar datos

Ya tienes `obtenerPlaylists()`, que consulta `localStorage` y, cuando es necesario, carga `mocks/playlists.json`.

Ahora necesitamos hacer lo contrario: recibir un arreglo de playlists y guardarlo.

Agrega esta función después de `obtenerPlaylists()`:

```
function guardarPlaylists(playlists) {
    localStorage.setItem(
        "tenji_playlists",
        JSON.stringify(playlists)
    );
}
```

### ¿Qué hace?

Supongamos que tenemos este arreglo:

```
const playlists = [
    { id: 1, nombre: "Rock" },
    { id: 2, nombre: "Urbano" }
];
```

`JSON.stringify(playlists)` convierte el arreglo en texto JSON.

Después, `localStorage.setItem()` guarda ese texto utilizando la clave `"tenji_playlists"`.

Esto nos permitirá guardar los cambios cuando creemos, editemos o eliminemos playlists.

Un detalle importante: esta función auxiliar no necesita `export`, porque solamente la utilizaremos dentro de `api.js`.

## 3. READ: consultar una playlist por ID

Empezaremos por la operación más sencilla, porque se parece a `obtenerCancion(id)`.

Agrega:

```

export async function obtenerPlaylist(id) {

    const respuesta = await obtenerPlaylists();

    if (!respuesta.ok) {
        return respuesta;
    }

    const playlist = respuesta.data.find((p) => {
        return p.id === id;
    });

    if (!playlist) {
        return {
            ok: false,
            status: 404,
            data: null,
            error: "Playlist no encontrada"
        };
    }

    return {
        ok: true,
        status: 200,
        data: playlist,
        error: null
    };
}

```

Aquí reutilizamos `obtenerPlaylists()`, que ya incorpora la latencia.

La parte fundamental es:

```
const playlist = respuesta.data.find((p) => {
    return p.id === id;
});
```

`.find()` busca la primera playlist cuyo identificador coincide con `id`.

Si no existe, devolvemos `404`.

## 4. CREATE: crear una playlist

Esta será nuestra primera operación de escritura.

Imagina que queremos crear una playlist llamada «Para entrenar».

Necesitamos:

1. Obtener las playlists actuales.
2. Calcular un identificador único.
3. Construir el nuevo objeto.
4. Agregarlo al arreglo.
5. Guardar el arreglo actualizado.
6. Devolver la nueva playlist con `status: 201`.

Agrega esta función:

```

export async function crearPlaylist(datos) {

    const respuesta = await obtenerPlaylists();

    if (!respuesta.ok) {
        return respuesta;
    }

    try {
        const playlists = respuesta.data;

        // Comprobamos que el nombre sea válido
        if (!datos || typeof datos.nombre !== "string" ||
            datos.nombre.trim() === "") {
            return {
                ok: false,
                status: 400,
                data: null,
                error: "Debes ingresar un nombre para la playlist"
            };
        }

        // Calculamos un ID que no esté utilizado
        const nuevoId = playlists.reduce((maximo, playlist) => {
            return Math.max(maximo, playlist.id);
        }, 0) + 1;

        // Construimos la nueva playlist
        const nuevaPlaylist = {
            id: nuevoId,
            nombre: datos.nombre.trim(),
            descripcion: datos.descripcion ?? "",
            usuarioId: datos.usuarioId ?? null,
            cancionIds: datos.cancionIds ?? []
        };

        // Incorporamos la playlist al arreglo
        playlists.push(nuevaPlaylist);

        // Guardamos los cambios
        guardarPlaylists(playlists);

        return {
            ok: true,
            status: 201,
            data: nuevaPlaylist,
            error: null
        };

    } catch (error) {
        console.error("Error en crearPlaylist:", error);

        return {
            ok: false,
            status: 500,
            data: null,
            error: "No se pudo crear la playlist"
        };
    }
}

```

### Entendamos las tres instrucciones nuevas

A. `.reduce()` para calcular el ID

```
const nuevoId = playlists.reduce((maximo, playlist) => {
    return Math.max(maximo, playlist.id);
}, 0) + 1;
```

Busca el ID más alto y le suma uno.

Por ejemplo, si existen los IDs `1`, `2`, `5` y `10`, el nuevo será `11`.

Esto es mejor que utilizar `playlists.length + 1`, porque podríamos haber eliminado alguna playlist anteriormente y terminar reutilizando un identificador existente.

B. `??` para establecer valores predeterminados

```
descripcion: datos.descripcion ?? ""
```

Si no se proporciona una descripción, utilizamos una cadena vacía.

C. `.push()` para agregar la playlist

```
playlists.push(nuevaPlaylist);
```

Agrega el nuevo objeto al final del arreglo.

Después lo guardamos en `localStorage`.

## 5. UPDATE: editar una playlist

Ahora necesitamos modificar una playlist existente.

Por ejemplo, cambiar el nombre de «Para entrenar» a «Entrenamiento BJJ».

La lógica será:

1. Obtener las playlists.
2. Encontrar la playlist mediante su ID.
3. Verificar que existe.
4. Actualizar sus propiedades.
5. Guardar los cambios.

```

export async function editarPlaylist(id, datos) {

    const respuesta = await obtenerPlaylists();

    if (!respuesta.ok) {
        return respuesta;
    }

    try {
        const playlists = respuesta.data;

        const playlist = playlists.find((p) => {
            return p.id === id;
        });

        if (!playlist) {
            return {
                ok: false,
                status: 404,
                data: null,
                error: "Playlist no encontrada"
            };
        }

        if (!datos || typeof datos !== "object" ||
            Array.isArray(datos)) {
            return {
                ok: false,
                status: 400,
                data: null,
                error: "Debes proporcionar datos válidos"
            };
        }

        if (datos.nombre !== undefined) {
            if (typeof datos.nombre !== "string" ||
                datos.nombre.trim() === "") {
                return {
                    ok: false,
                    status: 400,
                    data: null,
                    error: "El nombre de la playlist no puede estar vacío"
                };
            }

            playlist.nombre = datos.nombre.trim();
        }

        if (datos.descripcion !== undefined) {
            playlist.descripcion = datos.descripcion;
        }

        if (datos.cancionIds !== undefined) {
            playlist.cancionIds = datos.cancionIds;
        }

        guardarPlaylists(playlists);

        return {
            ok: true,
            status: 200,
            data: playlist,
            error: null
        };

    } catch (error) {
        console.error("Error en editarPlaylist:", error);

        return {
            ok: false,
            status: 500,
            data: null,
            error: "No se pudo editar la playlist"
        };
    }
}

```

### ¿Por qué usamos `datos.nombre !== undefined`?

Porque queremos permitir actualizaciones parciales.

Por ejemplo:

```
editarPlaylist(1, {
    nombre: "Rock clásico"
});
```

Aquí solamente queremos modificar el nombre, sin alterar la descripción ni las canciones.

La condición comprueba si recibimos un nuevo nombre antes de modificarlo.

Esta implementación permite editar `nombre`, `descripcion` y `cancionIds`, pero no el `id` ni `usuarioId`. Por ahora es una decisión razonable: el identificador debe mantenerse estable y el propietario no debería cambiarse libremente.

## 6. DELETE: eliminar una playlist

Esta operación es muy parecida al filtrado que ya implementaste con las canciones.

La diferencia es que utilizaremos `.filter()` para conservar todas las playlists excepto la que queremos eliminar.

```

export async function eliminarPlaylist(id) {

    const respuesta = await obtenerPlaylists();

    if (!respuesta.ok) {
        return respuesta;
    }

    try {
        const playlists = respuesta.data;

        const playlist = playlists.find((p) => {
            return p.id === id;
        });

        if (!playlist) {
            return {
                ok: false,
                status: 404,
                data: null,
                error: "Playlist no encontrada"
            };
        }

        // Conservamos todas las playlists excepto la eliminada
        const playlistsActualizadas = playlists.filter((p) => {
            return p.id !== id;
        });

        guardarPlaylists(playlistsActualizadas);

        return {
            ok: true,
            status: 200,
            data: playlist,
            error: null
        };

    } catch (error) {
        console.error("Error en eliminarPlaylist:", error);

        return {
            ok: false,
            status: 500,
            data: null,
            error: "No se pudo eliminar la playlist"
        };
    }
}

```

### La diferencia entre `===` y `!==`

Observa estas dos instrucciones:

```
p.id === id
```

Significa: encuentra una playlist cuyo ID sea igual al solicitado.

En cambio:

```
p.id !== id
```

Significa: conserva las playlists cuyo ID sea diferente del solicitado.

Por ejemplo, si tenemos:

```
[
    { id: 1, nombre: "Rock" },
    { id: 2, nombre: "Pop" },
    { id: 3, nombre: "Urbano" }
]
```

Y eliminamos la playlist `2`, el arreglo resultante será:

```
[
    { id: 1, nombre: "Rock" },
    { id: 3, nombre: "Urbano" }
]
```

Es importante entender que `.filter()` no modifica el arreglo original: devuelve uno nuevo. Por eso guardamos `playlistsActualizadas`.

## 7. Probemos el CRUD completo

Ahora viene la parte más entretenida: comprobar las cuatro operaciones desde la consola de Chrome.

Abre TENJI con Live Server y ejecuta este bloque:

```

const api = await import("./js/api.js");

// READ: obtener todas las playlists
console.log("TODAS:", await api.obtenerPlaylists());

// CREATE: crear una playlist de prueba
const creacion = await api.crearPlaylist({
    nombre: "Mi playlist de prueba",
    descripcion: "Creada desde la consola",
    usuarioId: 1,
    cancionIds: [1, 3, 7]
});

console.log("CREAR:", creacion);

// Guardamos el ID generado
if (creacion.ok) {
    const id = creacion.data.id;

    // READ: obtener una playlist específica
    console.log("OBTENER:", await api.obtenerPlaylist(id));

    // UPDATE: editar la playlist creada
    console.log("EDITAR:", await api.editarPlaylist(id, {
        nombre: "Mi playlist editada"
    }));

    // DELETE: eliminar la playlist creada
    console.log("ELIMINAR:", await api.eliminarPlaylist(id));

    // Comprobar que ya no existe
    console.log("VERIFICAR 404:", await api.obtenerPlaylist(id));
}

```

Si funciona correctamente, los códigos de respuesta esperados son:

| Prueba              | Status esperado |
| ------------------- | --------------- |
| Obtener todas       | 200             |
| Crear               | 201             |
| Obtener por ID      | 200             |
| Editar              | 200             |
| Eliminar            | 200             |
| Buscar la eliminada | 404             |

Estas pruebas crean y eliminan una playlist temporal. No deberían modificar las playlists originales del repositorio, pero sí trabajan sobre el almacenamiento local del navegador.

## 8. ¿Qué nos falta para cumplir toda la pauta?

Con estas funciones tendremos el CRUD básico de playlists implementado en la capa de servicios.

Sin embargo, todavía nos quedarán algunos puntos importantes para la Entrega 2:

- Validar mejor los tipos de datos y los IDs de canciones para evitar guardar playlists incorrectas.
- Incorporar un error forzado que podamos demostrar durante la evaluación.
- Integrar el CRUD con la interfaz de Cristóbal, incluyendo formularios, estados de carga, errores y confirmación antes de eliminar.
- Revisar las restricciones de sesión y autorización junto con David.

Además, ten presente que `localStorage` es una simulación: cualquiera que utilice el navegador puede modificar esos datos. No reemplaza una autorización real de servidor.

Mi recomendación: agrega las funciones en el orden presentado, prueba primero `obtenerPlaylist()` y `crearPlaylist()`, y después prueba edición y eliminación. Cuando me envíes tu `api.js` actualizado, revisaremos toda la integración y corregiremos cualquier error antes de subirlo a GitHub.