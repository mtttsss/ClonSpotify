# <Obtener canciones>
- **Fecha:** 2026-11-09
- **Integrante:** <Matias Pinto> (@mtttsss)
- **Herramienta y modelo:** <ChatGPT (GPT-6)>
- **Archivos afectados:** <api.js>

## Objetivo

<Implementacion de api.js para simular una API real>

## Conversación

### Prompt 1
<Hola, estoy haciendo ya el apartado de api.js, necesito que me guíes y me ayudes a completarlo, explicame cada parte y como funciona para lograr comprender el codigo, actua segun la pauta y todos los archivos que te adjunte>

### Respuesta 1

# TENJI — Desarrollo de `api.js`

Vamos a construir tu archivo `api.js` desde cero, siguiendo la pauta de la Entrega 2 de Desarrollo Web y Móvil (CIT2008), y utilizando los mocks que preparaste.

Lo haremos como una tutoría: te explicaré qué problema resuelve cada parte, cómo funciona el código y cómo comprobar que está bien hecho. No quiero que termines con 300 líneas que funcionan, pero que después no puedas explicar frente al profesor.

## 1. ¿Qué es `api.js` y por qué lo necesitamos?

Actualmente, TENJI tiene tres fuentes de datos:

```
mocks/
├── canciones.json
├── playlists.json
└── usuarios.json
```

Estos archivos contienen información, pero no ofrecen por sí solos las operaciones que necesita una aplicación.

Por ejemplo, cuando Cristóbal programe el buscador, la interfaz tendrá que solicitar las canciones. En lugar de abrir directamente el JSON desde cada página, llamará a una función de `api.js`.

Interfaz de TENJI

Dashboard · Biblioteca · Perfil

Llama a obtenerCanciones()

js/api.js

Consulta, procesa datos y simula la API

canciones.json

playlists.json

usuarios.json

La ventaja es que, cuando en la Entrega 3 desarrollen un backend real, podrán reemplazar el funcionamiento interno de `api.js` sin rehacer todas las vistas.

## 2. ¿Qué exige la pauta?

Revisé especialmente las secciones 5.2, 5.3 y 5.4.

| Requisito                   | Qué vamos a implementar                            |
| --------------------------- | -------------------------------------------------- |
| Un solo módulo de servicios | `js/api.js`                                        |
| Funciones asíncronas        | `async` y `await`                                  |
| Latencia simulada           | Espera entre 300 y 800 ms                          |
| Respuesta uniforme          | `{ok, status, data, error}`                        |
| Operaciones REST simuladas  | GET, POST, PUT, DELETE                             |
| Persistencia                | `localStorage` para los cambios                    |
| Errores forzados            | Una opción para probar fallos                      |
| Documentación               | Tabla de endpoints en README                       |
| Estados de interfaz         | Cargando, vacío y error, coordinados con Cristóbal |

Para TENJI, propongo utilizar las playlists como recurso para el CRUD, mientras que las canciones funcionarán como catálogo de consulta.

## 3. Nuestro orden de trabajo

1. Preparar `api.js` y crear `obtenerCanciones()`

   Comprender Promesas, `fetch`, `async/await`, latencia y respuestas.
2. Agregar búsqueda, filtros y ordenamiento

   Utilizar las propiedades `titulo`, `artista`, `genero` y `duracion` de tus canciones.
3. Consultar canciones individuales, playlists y usuarios

   Trabajar con IDs y respuestas 404.
4. Implementar CRUD de playlists

   Crear, editar, eliminar y guardar cambios con `localStorage`.
5. Simular errores y documentar los endpoints

   Comprobar casos normales, vacíos y fallidos.

No avanzaremos al siguiente paso sin comprender y comprobar el anterior.

# Paso 1. Crear nuestra primera función

Abre VS Code y, dentro de `TENJI2/js/`, crea un archivo llamado `api.js`.

Por ahora escribiremos solamente lo necesario para obtener las canciones desde `mocks/canciones.json`.

## Código inicial

```

/*
 * TENJI - Capa de servicios simulada
 * Entrega 2 - Desarrollo Web y Móvil
 */

// [IA] inicio · ia/2026-11-09_mtttsss_api-obtener-canciones.md

// Tiempo de espera simulado: 500 milisegundos
const LATENCIA = 500;

// Devuelve una Promesa que termina después del tiempo indicado
function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Obtiene las canciones desde el archivo JSON
export async function obtenerCanciones() {
    await esperar(LATENCIA);

    try {
        const respuesta = await fetch("./mocks/canciones.json");

        if (!respuesta.ok) {
            return {
                ok: false,
                status: respuesta.status,
                data: null,
                error: "No se pudieron cargar las canciones"
            };
        }

        const canciones = await respuesta.json();

        return {
            ok: true,
            status: 200,
            data: canciones,
            error: null
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            data: null,
            error: "Ocurrió un error al cargar las canciones"
        };
    }
}

// [IA] fin

```

Este código es nuestra primera versión, no el `api.js` definitivo. Todavía faltan el error forzado, las consultas de otros recursos y las operaciones de escritura.

## 4. Explicación línea por línea

### A. La constante `LATENCIA`

```
const LATENCIA = 500;
```

Una constante es una variable cuyo valor no puedes reasignar.

Aquí estamos indicando que queremos simular una espera de 500 milisegundos.

- 1 segundo = 1.000 milisegundos.
- 500 milisegundos = medio segundo.

¿Por qué hacemos esto? Porque la pauta pide simular la demora de una API real, entre 300 y 800 milisegundos.

### B. La función `esperar()`

```
function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
```

Esta es una de las partes que debes comprender bien.

¿Qué es una Promesa?

Una Promesa es un objeto de JavaScript que representa una operación cuyo resultado estará disponible ahora o más adelante.

Por ejemplo, cuando solicitas datos a un servidor, JavaScript no sabe cuánto tardarán en llegar. Una Promesa permite representar esa operación.

En nuestro caso:

- `new Promise(...)` crea la Promesa.
- `setTimeout(...)` programa una acción después de un tiempo.
- `resolve()` indica que la operación terminó correctamente.

Por eso, `esperar(500)` representa una operación que finaliza después de aproximadamente medio segundo.

### C. `export async function`

```
export async function obtenerCanciones() {
```

Aquí tenemos tres conceptos:

| Palabra    | Significado                                             |
| ---------- | ------------------------------------------------------- |
| `export`   | Permite que otro archivo JavaScript importe la función. |
| `async`    | Hace que la función devuelva una Promesa.               |
| `function` | Declara una función reutilizable.                       |

Por ejemplo, Cristóbal podrá importar tu función desde otro módulo JavaScript:

```
import { obtenerCanciones } from "./api.js";
```

La ruta dependerá de dónde esté el archivo que realiza la importación.

### D. `await esperar(LATENCIA)`

```
await esperar(LATENCIA);
```

Significa que `obtenerCanciones()` debe esperar a que se resuelva la Promesa antes de continuar.

Importante: `await` no congela toda la página. Solo suspende la ejecución de esa función asíncrona, permitiendo que el navegador continúe respondiendo.

### E. La función `fetch()`

```
const respuesta = await fetch("./mocks/canciones.json");
```

`fetch()` permite realizar solicitudes HTTP desde JavaScript.

En este caso, estamos solicitando el archivo `canciones.json`.

Una diferencia importante: la ruta relativa de `fetch()` se interpreta respecto de la página web que se está ejecutando, no respecto de la ubicación física de `api.js`.

Por eso, si abres `index.html` desde la raíz de `TENJI2`, la ruta `./mocks/canciones.json` es correcta.

### F. Validación de la respuesta

```
if (!respuesta.ok) {
```

`respuesta.ok` indica si la solicitud HTTP obtuvo un estado exitoso.

El signo `!` significa negación.

Por tanto, estamos preguntando: ¿La solicitud falló?

Si falla, devolvemos un objeto con los mismos campos que utiliza una respuesta exitosa, pero indicando el error.

### G. Convertir el JSON

```
const canciones = await respuesta.json();
```

`respuesta.json()` lee el contenido recibido y lo convierte en datos JavaScript.

Por ejemplo, el arreglo de objetos de tu JSON pasa a estar disponible en la variable `canciones`.

### H. Devolver la respuesta

```
return {
    ok: true,
    status: 200,
    data: canciones,
    error: null
};
```

Este es el formato uniforme que utilizaremos en todas las funciones.

| Campo    | Significado                                      |
| -------- | ------------------------------------------------ |
| `ok`     | Indica si la operación fue exitosa.              |
| `status` | Código HTTP simulado o recibido.                 |
| `data`   | Información obtenida.                            |
| `error`  | Mensaje de error, o `null` si no hubo problemas. |

En nuestro caso, `data` contendrá las 11 canciones.

### I. ¿Para qué sirve `try/catch`?

El bloque `try` intenta realizar la operación. Si ocurre un error inesperado, como un fallo de red o un JSON que no puede interpretarse, el bloque `catch` permite manejarlo y devolver una respuesta controlada.

El código `500` se utiliza aquí como estado simulado de error interno. Más adelante refinaremos los códigos según el tipo de fallo.

# Paso 2. Probar que la función funciona

Antes de agregar más código, vamos a realizar una prueba real.

1. Guarda `js/api.js`.
2. Abre `index.html` usando Live Server en VS Code. No basta con abrir el HTML directamente desde el explorador de archivos.
3. Abre las herramientas de desarrollador con `F12`.
4. Entra en la pestaña Console y pega:

```
import("./js/api.js").then(async (api) => {
    const resultado = await api.obtenerCanciones();
    console.log(resultado);
});
```

Si todo está bien, después de aproximadamente medio segundo deberías obtener un objeto con esta estructura:

```
{
    ok: true,
    status: 200,
    data: [
        // Tus 11 canciones
    ],
    error: null
}
```

Este ejemplo comprueba que la función puede leer el JSON y devolver la respuesta. Aún no significa que la búsqueda, el CRUD o la persistencia estén terminados.

## 5. Verifiquemos lo que aprendiste

Mini comprobación

0 de 3 respondidas

1\. ¿Qué hace async en obtenerCanciones()?

Convierte automáticamente el JSON en HTML

Hace que la función devuelva una Promesa

Guarda los datos en localStorage

2\. ¿Para qué usamos await esperar(LATENCIA)?

Para simular el retraso de la API

Para eliminar los datos del JSON

Para impedir que toda la página funcione

3\. ¿Qué contiene data cuando la solicitud resulta exitosa?

El tiempo de espera

La ruta del archivo

El arreglo de canciones obtenido


Tu tarea ahora es solamente crear `api.js` con nuestra primera función y ejecutar la prueba en Live Server.

Cuando lo hagas, muéstrame qué aparece en la consola. Si funciona, el siguiente paso será implementar la búsqueda, el filtro por género y el ordenamiento usando tus 11 canciones.

### Prompt 2

<Esto me aparece>

### Respuesta 2

¡Bien! Revisé tu captura y todavía no aparece ningún error relacionado con `api.js`. Lo que estás viendo es normal al abrir la consola de Chrome.

Hay dos cosas distintas:

1. `favicon.ico 404`: Chrome intentó cargar el ícono de la pestaña y no lo encontró. No afecta a nuestra API.
2. Advertencia amarilla: Chrome está bloqueando temporalmente que pegues código en la consola, como medida de seguridad.

Por eso todavía no hemos probado `obtenerCanciones()`.

## Paso 1. Habilitar el pegado en la consola

Como estamos trabajando con código que acabamos de revisar, puedes hacer lo siguiente:

1. Haz clic donde aparece el símbolo `>` en la consola.
2. Escribe manualmente:

```
allow pasting
```

3\. Presiona Enter.

Esto permitirá pegar código en esa consola. Hazlo solamente con código que comprendas y en el que confíes.

## Paso 2. Ejecutar nuestra prueba

Ahora copia y pega este código:

```

import("./js/api.js").then(async (api) => {
    const resultado = await api.obtenerCanciones();
    console.log(resultado);
});

```

Presiona Enter.

### ¿Qué debería suceder?

Después de aproximadamente medio segundo, debería aparecer algo parecido a esto:

```
{
    ok: true,
    status: 200,
    data: Array(11),
    error: null
}
```

Si aparece `Array(11)`, significa que la función logró obtener tus 11 canciones.

Si aparece un error, lo revisamos antes de continuar.

Importante: veo que tu página tiene el mensaje `Live reload enabled`, lo que indica que probablemente estás utilizando Live Server, tal como necesitamos.

### Hagamos solamente esto por ahora

Ejecuta la prueba y envíame una captura de lo que aparece.

No pasaremos a filtros, ordenamiento ni CRUD hasta confirmar que `obtenerCanciones()` está funcionando correctamente.

