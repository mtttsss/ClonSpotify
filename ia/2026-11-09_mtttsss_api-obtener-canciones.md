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

## Hagamos solamente esto por ahora

Ejecuta la prueba y envíame una captura de lo que aparece.

No pasaremos a filtros, ordenamiento ni CRUD hasta confirmar que `obtenerCanciones()` está funcionando correctamente.

### Prompt 3

Como podemos seguir en el archivo api.js para que funcione la busqueda de canciones?

### Respuesta 3

¡Vamos! Seguiremos trabajando en `api.js`, pero esta vez construiremos la búsqueda paso a paso, para que entiendas la lógica antes de escribirla.

## Paso 1. Entender cómo funcionará la búsqueda

Actualmente, tu función `obtenerCanciones()` hace lo siguiente:

1\. `obtenerCanciones()`

Se ejecuta la función

2\. `fetch()`

Obtiene las 11 canciones del JSON

3\. `return`

Devuelve todas las canciones

Lo que queremos es agregar un paso intermedio: revisar cuáles canciones coinciden con lo que escribió el usuario.

Por ejemplo, tu archivo contiene:

| ID | Canción       | Artista  |
| -- | ------------- | -------- |
| 1  | Sextape       | Deftones |
| 6  | IDGAF         | Drake    |
| 7  | MOOD          | Easykid  |
| 8  | Y si peleamos | Easykid  |

Si alguien busca `Easykid`, nuestra función debería devolver solamente las canciones 7 y 8.

### ¿Cómo lo resolveríamos?

Primero recibimos el texto que queremos buscar. Luego obtenemos las canciones, revisamos si su título o artista contiene ese texto y devolvemos únicamente las coincidencias.

Para revisar el arreglo, utilizaremos posteriormente un método de JavaScript llamado `.filter()`.

Pero primero necesitamos que nuestra función sea capaz de recibir la búsqueda.

## Paso 2. Modificar los parámetros de la función

Actualmente tienes:

```
export async function obtenerCanciones() {
```

Observa los paréntesis `()`.

Están vacíos porque nuestra función todavía no recibe información.

En JavaScript, los parámetros permiten entregarle información a una función para que trabaje con ella.

Por ejemplo:

```
function saludar(nombre) {
    console.log(nombre);
}
```

Cuando ejecutamos:

```
saludar("Matias");
```

La variable `nombre` recibe el texto `"Matias"`.

Nosotros queremos hacer algo equivalente con las canciones.

### Tu primera modificación

Por ahora, cambia únicamente la declaración de tu función por:

```
export async function obtenerCanciones(busqueda = "") {
```

Veamos cada parte:

- `busqueda`: parámetro que contendrá el texto que queremos encontrar.
- `=`: asigna un valor predeterminado.
- `""`: cadena de texto vacía.

¿Por qué usamos un valor predeterminado?

Porque queremos mantener dos comportamientos:

```
obtenerCanciones();
```

Sin entregar un texto, debería mostrar todas las canciones.

```
obtenerCanciones("Easykid");
```

Entregando un texto, debería buscar coincidencias.

Así no necesitamos crear dos funciones diferentes.

Más adelante podemos utilizar un objeto de opciones para incorporar también filtros y ordenamiento. Por ahora comenzamos con un parámetro sencillo para entender el mecanismo.

## Paso 3. Comprobemos que entendiste esta parte

¿Qué valor tendrá `busqueda` cuando llamemos a `obtenerCanciones()` sin pasarle ningún argumento?

`undefined`

`""` (texto vacío)

`null`

`"Easykid"`

Por ahora, realiza solamente esta modificación. Tu función todavía devolverá todas las canciones, porque aún no incorporamos la lógica para filtrarlas.

Cuando me confirmes que cambiaste esa línea y entiendes para qué sirve el parámetro, avanzaremos al siguiente paso: cómo utilizar `.filter()` para recorrer tus 11 canciones y encontrar coincidencias.

### Prompt 4

Entiendo, ahora enseñame a usar el filtro

### Respuesta 4

¡Perfecto! Ahora aprenderemos a utilizar `.filter()`, uno de los métodos más útiles de JavaScript para trabajar con arreglos.

Vamos a entenderlo primero y después lo incorporaremos a tu función `obtenerCanciones()`.

## 1. ¿Qué es `.filter()`?

`.filter()` es un método de JavaScript que permite recorrer un arreglo y crear uno nuevo que contenga únicamente los elementos que cumplen una condición.

Imagina que tenemos este arreglo:

```
const numeros = [1, 2, 3, 4, 5];
```

Queremos quedarnos solamente con los números mayores que 3.

Podemos escribir:

```
const mayores = numeros.filter((numero) => {
    return numero > 3;
});
```

El resultado será:

```
[4, 5]
```

### Entendamos cada parte

```
numeros.filter((numero) => {
```

- `numeros` es nuestro arreglo original.
- `.filter()` recorre sus elementos, uno por uno.
- `numero` representa el elemento que estamos revisando en ese momento.
- `=>` es una función flecha (arrow function), una forma de escribir funciones en JavaScript.

Y esta línea:

```
return numero > 3;
```

Es una condición que devuelve `true` o `false`.

Si devuelve `true`, el elemento se incorpora al nuevo arreglo. Si devuelve `false`, se descarta.

Visualicemos el ejemplo

## 1

Se descarta

## 2

Se descarta

## 3

Se descarta

## 4

Se incluye

## 5

Se incluye

Nuevo arreglo

4

5

Una característica importante: `.filter()` no modifica el arreglo original. Crea uno nuevo.

## 2. Apliquémoslo a TENJI

En tu `api.js` ya tienes esta línea:

```
const canciones = await respuesta.json();
```

Aquí, `canciones` contiene el arreglo de tus 11 canciones.

Ahora necesitamos recorrer ese arreglo y decidir cuáles coinciden con la búsqueda.

Para empezar, trabajaremos únicamente con el artista.

Justo después de esa línea, agrega:

```
const cancionesFiltradas = canciones.filter((cancion) => {

});
```

### ¿Qué significa?

- `cancionesFiltradas`: variable donde guardaremos el nuevo arreglo.
- `canciones`: arreglo original con las 11 canciones.
- `.filter()`: revisa cada canción.
- `cancion`: representa una canción individual durante cada recorrido.

Por ejemplo, cuando el método revise la primera canción, `cancion` será el objeto de Sextape, que contiene propiedades como `id`, `titulo`, `artista` y `genero`.

Todavía no hemos indicado la condición. Si lo ejecutaras así, el resultado sería un arreglo vacío porque la función no devuelve `true` para ninguna canción.

## 3. Agreguemos nuestra primera condición

Dentro de las llaves, escribe:

```
return cancion.artista === busqueda;
```

Detengámonos aquí.

### ¿Qué hace `cancion.artista`?

Accede a la propiedad `artista` de la canción que estamos revisando.

Por ejemplo:

```
cancion.artista
// "Easykid"
```

### ¿Qué significa `===`?

Es un operador de comparación estricta.

Comprueba si dos valores son iguales, considerando su tipo y contenido.

Por ejemplo:

```
"Easykid" === "Easykid"  // true
"Easykid" === "easykid"  // false
```

Así, cuando invoquemos:

```
obtenerCanciones("Easykid");
```

`.filter()` conservará las dos canciones cuyo artista sea exactamente `"Easykid"`.

Pero tenemos un problema: esta condición solo funciona cuando el texto coincide exactamente, incluyendo mayúsculas y minúsculas.

Además, cuando `busqueda` es `""`, no encontraríamos ninguna canción.

Resolveremos esos dos problemas en el siguiente paso.

## 4. Probemos el filtro sin modificar todavía el resultado de la API

Después del bloque `.filter()`, agrega temporalmente:

```
console.log(cancionesFiltradas);
```

Este `console.log()` nos permitirá observar el resultado del filtro antes de incorporarlo a la respuesta.

Mantén por ahora:

```
data: canciones,
```

De esta forma, tu función seguirá devolviendo las 11 canciones normalmente, pero podremos inspeccionar el arreglo filtrado por separado.

### Prueba en Live Server

En la consola del navegador ejecuta:

```
import("./js/api.js").then(async (api) => {
    await api.obtenerCanciones("Easykid");
});
```

Deberías ver un arreglo con dos objetos: MOOD y Y si peleamos.

## 5. Comprobemos la lógica

Si ejecutamos `obtenerCanciones("Drake")`, ¿qué debería contener `cancionesFiltradas`?

Las 11 canciones originales.

Solo la canción cuyo artista sea Drake.

Un arreglo vacío.

Todas las canciones excepto Drake.

Tu tarea ahora: agrega el filtro con la comparación `===`, prueba con `"Easykid"` y confirma que en la consola aparezcan dos canciones.

Después aprenderemos a utilizar `.toLowerCase()` e `.includes()` para que la búsqueda funcione aunque el usuario escriba solo una parte del nombre o utilice distintas mayúsculas.

### Prompt 5

Ya manejo mas o menos eso, hice el codigo de esta manera, dime si esta correcto: (codigo adjunto)

### Respuesta 5

¡Vas bien! La lógica de búsqueda que escribiste es correcta, pero encontré un error importante que debes corregir para que funcione.

Lo interesante es que ya estás utilizando varios conceptos juntos: `if`, `.filter()`, `.toLowerCase()` e `.includes()`. Vamos a revisar qué hiciste bien y qué debemos mejorar.

## 1. El error principal: `const` y la reasignación

Primero declaraste:

```
const canciones = await respuesta.json();
```

Pero después escribiste:

```
canciones = canciones.filter((cancion) => {
```

¿Cuál es el problema?

En JavaScript, `const` significa que una variable no puede recibir una nueva asignación.

Cuando haces:

```
canciones = canciones.filter(...)
```

Estás intentando reemplazar el arreglo original por uno nuevo.

Eso provoca un error:

```
TypeError: Assignment to constant variable.
```

Tu bloque `catch` captura ese error y devuelve `status: 500`, aunque el JSON se haya cargado correctamente.

### ¿Cómo lo solucionamos?

Tienes dos alternativas:

Alternativa A: utilizar `let`

Cambiar:

```
const canciones = await respuesta.json();
```

Por:

```
let canciones = await respuesta.json();
```

`let` permite reasignar una variable, así que tu filtro funcionará sin modificar el resto de la lógica.

Alternativa B: crear otra variable

Mantener `const canciones` y guardar el arreglo filtrado en una nueva variable.

Esta opción permite conservar separadas las canciones originales y las que coinciden con la búsqueda.

Para tu implementación actual, recomiendo la alternativa A, porque es sencilla y coherente con el código que ya escribiste.

## 2. Tu condición `if (busqueda)` está bien pensada

Escribiste:

```
if (busqueda) {
```

Esto significa que solamente aplicaremos el filtro cuando `busqueda` tenga un valor que JavaScript considere verdadero.

Por ejemplo:

| Valor de `busqueda` | ¿Se ejecuta el filtro? |
| ------------------- | ---------------------- |
| `""`                | No                     |
| `"Easykid"`         | Sí                     |
| `"Drake"`           | Sí                     |
| `"MOOD"`            | Sí                     |

Esto resuelve un problema que habíamos identificado antes: si el usuario no escribe nada, devolvemos las 11 canciones sin filtrarlas.

Muy buena decisión.

## 3. Tu uso de `.filter()` es correcto

Revisemos esta condición:

```
return (
    cancion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    cancion.artista.toLowerCase().includes(busqueda.toLowerCase())
);
```

Aquí combinaste correctamente cuatro conceptos:

- `.filter()` recorre las canciones y construye un arreglo nuevo.
- `.toLowerCase()` convierte los textos a minúsculas.
- `.includes()` permite buscar coincidencias parciales.
- `||` significa que basta con que coincida el título o el artista.

Por ejemplo:

```
obtenerCanciones("easy");
```

Encontrará las canciones de Easykid aunque hayas escrito solamente una parte del nombre.

Eso es mejor que comparar utilizando `===`, porque el usuario no necesita escribir el nombre completo.

### Una pequeña mejora

Actualmente ejecutas:

```
busqueda.toLowerCase()
```

Dos veces por cada canción.

No es un error, pero estás repitiendo una operación.

Podrías convertir la búsqueda a minúsculas una sola vez y guardarla en una variable antes de aplicar `.filter()`.

Más adelante también podemos aprender a utilizar `.trim()` para ignorar espacios accidentales al principio y al final del texto.

## 4. Otro detalle: los comentarios `[IA]`

En tu código aparecen dos comentarios de cierre:

```
// [IA] fin
```

Pero solamente un comentario de inicio.

Eso deja un bloque sin delimitar correctamente. Debes asegurarte de que cada comentario de inicio tenga su correspondiente comentario de fin, delimitando el código que realmente incorporaste.

## 5. Probemos tu código después de corregir `const`

Haz únicamente este cambio:

```
let canciones = await respuesta.json();
```

Después abre TENJI con Live Server y prueba:

```
import("./js/api.js").then(async (api) => {
    const resultado = await api.obtenerCanciones("Easykid");
    console.log(resultado);
});
```

El resultado esperado es:

```
{
    ok: true,
    status: 200,
    data: Array(2),
    error: null
}
```

También conviene probar sin búsqueda, para verificar que sigues obteniendo las 11 canciones.

## 6. Una pregunta para comprobar tu comprensión

¿Por qué tu código necesita `let canciones` en lugar de `const canciones`?

Porque `.filter()` siempre necesita variables `let`.

Porque estoy reasignando a `canciones` un nuevo arreglo.

Porque `fetch()` no funciona con `const`.

Mi evaluación de tu implementación: la lógica está bien planteada. El error de reasignación es puntual y fácil de corregir.

Cuando confirmes que funciona, continuaremos con el filtro por género, aprovechando la lógica que acabas de aprender.

### Prompt 6

funciona perfecto, sigamos

### Respuesta 6

¡Excelente! Entonces ya tenemos funcionando la búsqueda por título y artista en TENJI. Ahora vamos con el siguiente requisito de la Entrega 2: filtrar canciones por género.

Seguiremos construyendo tu función paso a paso, sin entregarte todo el código de una vez.

## Paso 1. Comprender la diferencia entre búsqueda y filtro

Aunque se parecen, cumplen funciones distintas.

Búsqueda: encuentra canciones cuyo título o artista contenga determinado texto.

Filtro por género: muestra únicamente las canciones que pertenecen a una categoría específica.

Por ejemplo, en tu `canciones.json` tienes estos géneros:

| Género            | Canciones |
| ----------------- | --------- |
| Urbano            | 6         |
| Alternative Metal | 1         |
| Cumbia            | 1         |
| Trap              | 1         |
| Reggaeton         | 1         |
| Total             | 10        |

Hay 11 canciones, pero revisando los datos, Urbano aparece 7 veces, por lo que el total correcto es 11.

Imagina que alguien quiere escuchar únicamente música urbana. Queremos poder ejecutar:

```
obtenerCanciones(/* buscar por género Urbano */);
```

Y obtener solamente esas siete canciones.

## Paso 2. ¿Cómo recibiremos dos criterios?

Actualmente tu función comienza así:

```
export async function obtenerCanciones(busqueda = "") {
```

Tenemos un parámetro: `busqueda`.

Una posibilidad sería añadir otro:

```
export async function obtenerCanciones(busqueda = "", genero = "") {
```

Esto es perfectamente válido en JavaScript.

Sin embargo, piensa en algo: más adelante debemos agregar también ordenamiento.

Si seguimos incorporando parámetros, tendremos algo así:

```
obtenerCanciones("Easykid", "Urbano", "titulo");
```

Funciona, pero al leerlo no queda tan claro qué representa cada argumento.

### Una alternativa más organizada: recibir un objeto

Podemos usar:

```
obtenerCanciones({
    busqueda: "Easykid",
    genero: "Urbano"
});
```

Aquí cada valor tiene un nombre, lo que facilita comprender la llamada y agregar nuevas opciones después.

Esta es la alternativa que recomiendo para TENJI.

## Paso 3. Primera modificación

Vamos a reemplazar el parámetro actual:

```
export async function obtenerCanciones(busqueda = "") {
```

Por esta declaración:

```
export async function obtenerCanciones({ busqueda = "", genero = "" } = {}) {
```

### ¿Qué significa cada parte?

1\. `{ busqueda, genero }`

Estamos utilizando una característica de JavaScript llamada desestructuración de objetos.

Permite extraer propiedades de un objeto y utilizarlas directamente como variables.

2\. `busqueda = ""` y `genero = ""`

Ambos parámetros tienen valores predeterminados vacíos.

Esto significa que podemos llamar a la función sin aplicar ningún criterio.

3\. El último `= {}`

Indica que, si llamamos a `obtenerCanciones()` sin entregar un argumento, se utilizará un objeto vacío.

De esa manera, evitamos un error al intentar extraer propiedades de un valor inexistente.

### Ejemplos de uso

```
obtenerCanciones();
```

Devuelve todas las canciones.

```
obtenerCanciones({ busqueda: "Easykid" });
```

Busca canciones de Easykid.

```
obtenerCanciones({ genero: "Urbano" });
```

Solicita canciones del género Urbano. Todavía debemos implementar esa condición.

```
obtenerCanciones({
    busqueda: "Easykid",
    genero: "Urbano"
});
```

Posteriormente permitirá combinar ambos criterios.

## Paso 4. Una comprobación importante

Con esta modificación, cambia la forma de llamar a la función.

Antes utilizábamos:

```
obtenerCanciones("Easykid");
```

Ahora debemos utilizar:

```
obtenerCanciones({ busqueda: "Easykid" });
```

La lógica del filtro que ya programaste puede mantenerse; solamente cambia la forma en que recibimos los parámetros.

Pregunta para comprobar que entendiste

Si ejecutamos:

```
obtenerCanciones({ genero: "Trap" });
```

¿Qué valor tendrá la variable `busqueda`?

`"Trap"`

`""`

`undefined`

Por ahora realiza solamente este cambio en la declaración de `obtenerCanciones()` y prueba nuevamente la búsqueda usando el formato con llaves.

Cuando me confirmes que sigue funcionando, construiremos juntos la condición del filtro por género utilizando `.filter()` y veremos cómo combinar ambos criterios sin duplicar código.

### Prompt 7

¡Excelente! Ya sabemos que `obtenerCanciones()` recibe correctamente dos parámetros: `busqueda` y `genero`.

Ahora vamos a implementar el filtro por género, reutilizando lo que aprendiste sobre `.filter()`.

## Paso 5. Incorporar el filtro por género

### 1. Primero, entendamos la lógica

Actualmente tienes un bloque parecido a este:

```
if (busqueda) {
    canciones = canciones.filter((cancion) => {
        return (
            cancion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            cancion.artista.toLowerCase().includes(busqueda.toLowerCase())
        );
    });
}
```

Ese bloque hace algo muy importante: modifica qué canciones contiene la variable `canciones`.

Recuerda que anteriormente cambiamos su declaración de `const` a `let` para poder reasignarla.

Imagina que ejecutamos:

```
obtenerCanciones({
    busqueda: "Easykid",
    genero: "Urbano"
});
```

Queremos que ocurra lo siguiente:

11 canciones iniciales

Búsqueda: Easykid

Quedan 2 canciones

Filtro: Urbano

Siguen quedando 2 canciones

¿Por qué siguen quedando dos? Porque ambas canciones de Easykid tienen el género `Urbano` en tu JSON.

La idea es aplicar los filtros uno después del otro, de manera que cada uno trabaje sobre las canciones que quedaron del anterior.

### 2. Agreguemos una condición nueva

Debajo del bloque `if (busqueda)`, pero antes del `return` que devuelve la respuesta exitosa, agrega únicamente:

```
if (genero) {

}
```

Esto significa:

> Si se recibió un género, ejecutaremos las instrucciones que estén dentro de las llaves.

Si `genero` es `""`, JavaScript considera ese valor falso y no entra al bloque.

### 3. Utilicemos `.filter()`

Dentro de ese nuevo `if`, escribe:

```
canciones = canciones.filter((cancion) => {

});
```

Fíjate en algo: estamos reutilizando la misma variable `canciones`.

Si anteriormente la búsqueda redujo el arreglo a dos canciones, este segundo `.filter()` recorrerá solamente esas dos.

Si no se realizó ninguna búsqueda, recorrerá las 11 originales.

Esta es una forma sencilla de combinar criterios sin crear una función distinta para cada combinación.

### 4. ¿Cómo comprobamos el género?

En tu JSON cada canción tiene una propiedad llamada `genero`.

Por ejemplo:

```
{
  "id": 7,
  "titulo": "MOOD",
  "artista": "Easykid",
  "genero": "Urbano"
}
```

Para acceder al género de la canción que estamos revisando, utilizamos:

```
cancion.genero
```

Ahora queremos comprobar si ese género es igual al que solicitó el usuario.

Escribe dentro del `.filter()`:

```
return cancion.genero.toLowerCase() === genero.toLowerCase();
```

Vamos a descomponer esta instrucción.

| Parte                  | Qué hace                                         |
| ---------------------- | ------------------------------------------------ |
| `cancion.genero`       | Obtiene el género de la canción actual.          |
| `.toLowerCase()`       | Convierte ese género a minúsculas.               |
| `===`                  | Compara si dos valores son exactamente iguales.  |
| `genero.toLowerCase()` | Convierte el género solicitado a minúsculas.     |
| `return`               | Devuelve `true` o `false` al método `.filter()`. |

### ¿Por qué usamos `===` en vez de `.includes()`?

En la búsqueda de texto nos interesan las coincidencias parciales. Por ejemplo, escribir `"Easy"` debe encontrar `"Easykid"`.

Pero para filtrar por género queremos una categoría concreta.

Por ejemplo:

```
"urbano" === "urbano" // true
"trap" === "urbano"   // false
```

Así evitamos incluir accidentalmente géneros diferentes que contengan palabras parecidas.

## Paso 6. Probemos el filtro

Guarda tu archivo `api.js` y abre la consola de Chrome con Live Server.

Ejecuta:

```
import("./js/api.js").then(async (api) => {
    const resultado = await api.obtenerCanciones({
        genero: "Trap"
    });

    console.log(resultado);
});
```

Según tu JSON, debería devolver una canción: IDGAF de Drake.

Después puedes comprobar estas combinaciones:

| Parámetros                                  | Resultado esperado |
| ------------------------------------------- | ------------------ |
| `{ genero: "Urbano" }`                      | 7 canciones        |
| `{ genero: "Trap" }`                        | 1 canción          |
| `{ busqueda: "Easykid", genero: "Urbano" }` | 2 canciones        |
| `{ busqueda: "Drake", genero: "Cumbia" }`   | 0 canciones        |
| `{}`                                        | 11 canciones       |

En la cuarta prueba, el resultado correcto es `ok: true` con `data: []`. No encontrar coincidencias no significa que la API haya fallado.

## Paso 7. Una pregunta para reforzar la lógica

Si ejecutamos `obtenerCanciones({ busqueda: "Drake", genero: "Cumbia" })`, ¿por qué el resultado será un arreglo vacío?

Porque `fetch()` no puede combinar dos parámetros.

Porque la búsqueda encuentra a Drake, pero su género no es Cumbia.

Porque `.filter()` solamente puede utilizarse una vez.

Por ahora, agrega únicamente el bloque de filtrado por género y realiza las pruebas.

### Prompt 7

Asi va mi codigo de api.js, dime si esta todo correcto y si podemos proseguir con las siguientes etapas, agregue ordenamientos por duracion, titulo y  artista: (codigo adjunto)

### Respuesta 7

¡Muy bien! Revisé tu `api.js` completo y, en términos generales, la lógica está correcta y podemos avanzar a la siguiente etapa.

Has conseguido integrar búsqueda, filtrado y tres tipos de ordenamiento dentro de una misma función, sin duplicar innecesariamente el código.

Te explicaré qué está bien, qué mejoraría y si existe algún problema que debamos corregir.

## 1. Evaluación general

## 9/10

Listo para avanzar

Evaluación orientativa de la implementación actual de `obtenerCanciones()`, no del archivo `api.js` completo ni de toda la Entrega 2.

| Funcionalidad                       | Evaluación                   |
| ----------------------------------- | ---------------------------- |
| Función asíncrona con `async/await` | &#x20;Correcta               |
| Latencia simulada de 500 ms         | &#x20;Correcta               |
| Lectura del JSON mediante `fetch()` | &#x20;Correcta               |
| Manejo de errores con `try/catch`   | &#x20;Básico, pero funcional |
| Búsqueda por título y artista       | &#x20;Correcta               |
| Filtro por género                   | &#x20;Correcto               |
| Ordenamiento por duración           | &#x20;Correcto               |
| Ordenamiento por título             | &#x20;Correcto               |
| Ordenamiento por artista            | &#x20;Correcto               |
| Respuesta uniforme                  | &#x20;Correcta               |

## 2. Aspectos que implementaste correctamente

### A. Parámetros opcionales

```
export async function obtenerCanciones({
    busqueda = "",
    genero = "",
    ordenarPor = ""
} = {}) {
```

La declaración es válida.

Permite llamar a la función sin parámetros o combinar distintos criterios.

Por ejemplo:

```
obtenerCanciones({
    busqueda: "Easykid",
    genero: "Urbano",
    ordenarPor: "duracion"
});
```

La función primero buscará coincidencias, después filtrará por género y finalmente ordenará los resultados.

### B. Filtrado mediante `.filter()`

Tus dos filtros funcionan de manera independiente.

Además, como utilizas `let canciones`, puedes reasignar el arreglo después de cada filtro.

El resultado es que ambos criterios pueden combinarse correctamente.

### C. Ordenamiento mediante `.sort()`

Tus tres condiciones están bien implementadas:

```
if (ordenarPor === "duracion") {
    canciones.sort((a, b) => a.duracion - b.duracion);
}
```

Ordena de menor a mayor duración.

```
if (ordenarPor === "titulo") {
    canciones.sort((a, b) =>
        a.titulo.localeCompare(b.titulo, "es")
    );
}
```

Ordena alfabéticamente por título.

```
if (ordenarPor === "artista") {
    canciones.sort((a, b) =>
        a.artista.localeCompare(b.artista, "es")
    );
}
```

Ordena alfabéticamente por artista.

Utilizar `"es"` en `.localeCompare()` es una buena decisión, porque proporciona reglas de comparación apropiadas para el español.

## 3. ¿Qué mejoraría?

Encontré tres mejoras, pero ninguna exige reestructurar tu función.

### Mejora 1. Evitar repetir `.toLowerCase()`

Actualmente escribes:

```
busqueda.toLowerCase()
```

Dos veces dentro de cada comparación.

Podrías convertir el texto una sola vez y reutilizarlo.

No es un error de funcionamiento. Es simplemente una pequeña optimización y mejora de legibilidad.

### Mejora 2. Ignorar espacios accidentales

Si alguien escribe:

```
obtenerCanciones({ busqueda: " Easykid " });
```

Tu búsqueda podría no encontrar resultados por los espacios al principio y al final.

Esto se puede resolver utilizando `.trim()`.

No es indispensable para continuar, pero mejoraría la experiencia del usuario.

### Mejora 3. Mostrar información sobre errores durante el desarrollo

Actualmente tienes:

```
catch (error) {
    return {
        ok: false,
        status: 500,
        data: null,
        error: "Ocurrió un error al cargar las canciones"
    };
}
```

El manejo es correcto, pero oculta la causa técnica del error.

Durante el desarrollo, podrías incluir:

```
console.error("Error en obtenerCanciones:", error);
```

Así, si aparece un `ReferenceError` o un problema con el JSON, podrás identificarlo rápidamente.

## 4. ¿Hay errores importantes?

No encontré errores de sintaxis ni de lógica evidentes en el código que compartiste.

Solo haría dos observaciones:

- Si alguien entrega `ordenarPor: "desconocido"`, la función simplemente devolverá las canciones sin ordenarlas. Es un comportamiento aceptable para esta etapa, aunque posteriormente podemos validar las opciones.
- La función todavía no incorpora una manera de forzar errores de prueba, requisito que aparece en la pauta. Eso lo implementaremos cuando trabajemos el manejo de errores de toda la API.

También conviene probar los tres ordenamientos en Live Server antes de considerar esta función completamente verificada.

## 5. ¿Podemos avanzar?

Sí. La implementación actual está suficientemente bien estructurada para continuar.

Ya completaste la parte principal de consulta, búsqueda, filtro y ordenamiento de canciones.

El siguiente paso será desarrollar:

`obtenerCancion(id)` — Consultar una canción específica.

Esta función deberá recibir el identificador de una canción, buscarla entre los datos y devolverla. Si no existe, deberá responder con un error `404`.

Con ella aprenderás a utilizar `.find()`, que es parecido a `.filter()`, pero sirve para obtener un único elemento.

Mi recomendación es avanzar con esa función antes de comenzar las operaciones CRUD de playlists, porque es más sencilla y te ayudará a consolidar cómo trabajar con identificadores y respuestas de la API.

Conclusión: tu código está bien planteado para tu nivel académico y podemos continuar.
