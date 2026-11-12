# <Obtener albumes>
- **Fecha:** 2026-11-11
- **Integrante:** <Matias Pinto> (@mtttsss)
- **Herramienta y modelo:** <ChatGPT (GPT-6)>
- **Archivos afectados:** <api.js>

## Objetivo

<Aplicar lo mismo aplicado en las canciones, pero con los albumes>

## Conversación

### Prompt 1

Sigamos con la B4 (Esa parte de la pauta)

### Respuesta 1

¡Vamos! 🔥 Retomemos la B4 de TENJI: cargar los álbumes populares y recomendados desde los mocks, tal como ya hicimos con las 26 canciones.

Como acabamos de actualizar el repositorio con los cambios de tus compañeros, trabajaremos con cuidado para no perder ninguna funcionalidad.

## Estado actual

| Elemento                    | Estado                               |
| --------------------------- | ------------------------------------ |
| `TENJI2/mocks/albumes.json` | &#x20;Creado con 8 álbumes           |
| `TENJI2/js/api.js`          | Falta confirmar `obtenerAlbumes()`   |
| `js/catalogo.js`            | Falta conectar los álbumes           |
| `index.html`                | Álbumes todavía escritos manualmente |

## Paso 1. Revisar `api.js`

Abre `TENJI2/js/api.js` y presiona `Ctrl + F`. Busca:

```
export async function obtenerAlbumes
```

Si ya existe, no la dupliques. Pasa directamente a probarla.

Si no existe, agrega al final del archivo:

```

 // Obtener albumes desde los datos simulados

export async function obtenerAlbumes({ categoria = "" } = {}) {

    // Simular el tiempo de respuesta de la API
    await esperar(LATENCIA);

    try {
        // Obtener los albumes desde el archivo JSON
        const respuesta = await fetch(
            new URL("../mocks/albumes.json", import.meta.url)
        );

        if (!respuesta.ok) {
            return {
                ok: false,
                status: respuesta.status,
                data: null,
                error: "No se pudieron cargar los álbumes"
            };
        }

        let albumes = await respuesta.json();

        // Comprobar que los datos sean un arreglo
        if (!Array.isArray(albumes)) {
            throw new Error("Los datos de álbumes no son válidos");
        }

        // Filtrar por categoria si se solicita
        if (categoria) {
            albumes = albumes.filter((album) => {
                return album.categoria.toLowerCase() === categoria.toLowerCase();
            });
        }

        return {
            ok: true,
            status: 200,
            data: albumes,
            error: null
        };

    } catch (error) {
        console.error("Error al obtener álbumes:", error);

        return {
            ok: false,
            status: 500,
            data: null,
            error: "Ocurrió un error al cargar los álbumes"
        };
    }
}

```

### ¿Qué hace esta función?

- `await esperar(LATENCIA)` simula los 500 milisegundos de respuesta.
- `fetch()` obtiene los ocho álbumes desde `albumes.json`.
- `filter()` permite seleccionar solamente los populares o recomendados.
- Devuelve el mismo formato `{ ok, status, data, error }` que utilizan las demás funciones de tu API.

Por ejemplo:

```
obtenerAlbumes({ categoria: "popular" });
```

Devuelve únicamente los cuatro álbumes populares.

## Paso 2. Probar la función

Guarda `api.js`, abre TENJI con Live Server y entra a la consola del navegador (`F12`).

Ejecuta:

```
import("./TENJI2/js/api.js").then(async ({ obtenerAlbumes }) => {
    const respuesta = await obtenerAlbumes();
    console.log("Álbumes obtenidos:", respuesta);
});
```

Deberías obtener:

```
Álbumes obtenidos:
{
    ok: true,
    status: 200,
    data: Array(8),
    error: null
}
```

Si funciona, habremos terminado la conexión de los álbumes con la API.

Todavía no elimines las tarjetas originales del HTML. En el siguiente paso conectaremos `js/catalogo.js` y solo después reemplazaremos las tarjetas estáticas por los contenedores dinámicos.

Dime si `obtenerAlbumes()` ya existía y si te devuelve `Array(8)`. Así avanzamos sin duplicar código ni modificar el trabajo de tus compañeros.




