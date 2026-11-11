# <localStorage>
- **Fecha:** 2026-11-10
- **Integrante:** <Matias Pinto> (@mtttsss)
- **Herramienta y modelo:** <ChatGPT (GPT-6)>
- **Archivos afectados:** <api.js>

## Objetivo

<Validar correctamente el localStorage>

## Conversación

### Prompt 1

Ayudame con el localStorage paso a paso y enseñandome todo

### Respuesta 1

¡Perfecto! Vamos a trabajar con `localStorage` en tu proyecto TENJI, paso a paso, explicando qué hace cada instrucción, por qué la necesitamos y dónde debes escribirla en `api.js`.

Como ya tienes el CRUD funcionando, no vamos a reemplazar tu código ni borrar tus comentarios. Solo mejoraremos la manera en que recuperamos y validamos los datos guardados.

## 1. ¿Qué es `localStorage`?

`localStorage` es un sistema de almacenamiento que proporciona el navegador. Permite guardar información para recuperarla posteriormente, incluso después de recargar o cerrar la página.

En TENJI lo utilizamos para conservar las playlists que creamos, editamos o eliminamos.

Por ejemplo, imagina que tenemos esta playlist:

```
{
    id: 11,
    nombre: "Mis favoritas",
    descripcion: "Canciones para entrenar",
    usuarioId: 1,
    cancionIds: [1, 3, 7]
}
```

Cuando creamos esa playlist, queremos que siga existiendo al recargar TENJI.

Sin almacenamiento persistente, los cambios desaparecerían al reiniciar la aplicación.

### ¿Cómo funciona en nuestro proyecto?

playlists.json

Contiene las playlists iniciales

api.js

Consulta, crea, edita y elimina playlists

localStorage

Guarda los cambios localmente en el navegador

Una aclaración importante: `localStorage` no es una base de datos compartida. Los cambios quedan guardados en ese navegador y origen web. Si otra persona abre TENJI desde otro computador, no verá necesariamente tus playlists modificadas.

## 2. Comprendamos el código que ya tienes

Actualmente, dentro de `obtenerPlaylists()`, utilizas:

```
const guardadas = localStorage.getItem("tenji_playlists");
```

Esta línea intenta recuperar información almacenada bajo la clave `"tenji_playlists"`.

Tenemos dos posibilidades:

- Si existen datos guardados, `getItem()` devuelve un texto.
- Si no existe esa clave, devuelve `null`.

Por eso utilizamos:

```
if (guardadas !== null) {
    playlists = JSON.parse(guardadas);
}
```

### ¿Qué hace `JSON.parse()`?

`localStorage` almacena cadenas de texto.

Por ejemplo, puede contener:

```
[
    {"id": 1, "nombre": "Rock"},
    {"id": 2, "nombre": "Urbano"}
]
```

Aunque parezca un arreglo, lo que recuperamos inicialmente es un texto.

`JSON.parse()` convierte ese texto en un arreglo de objetos JavaScript, permitiéndonos utilizar métodos como `.find()`, `.filter()` y `.push()`.

En cambio, cuando queremos guardar un arreglo, utilizamos `JSON.stringify()` para convertirlo nuevamente en texto.

| Método                      | Función                                    |
| --------------------------- | ------------------------------------------ |
| `localStorage.getItem()`    | Recupera el texto almacenado               |
| `JSON.parse()`              | Convierte el texto JSON a datos JavaScript |
| `JSON.stringify()`          | Convierte datos JavaScript a texto JSON    |
| `localStorage.setItem()`    | Guarda el texto                            |
| `localStorage.removeItem()` | Elimina una clave almacenada               |

## 3. ¿Qué problema debemos corregir?

Tu función actualmente puede recuperar un dato como este:

```
{
    "nombre": "Playlist incorrecta"
}
```

Este JSON es válido, por lo que `JSON.parse()` no generará ningún error.

Pero hay un problema: obtuvimos un objeto cuando esperábamos un arreglo.

Si después ejecutamos:

```
playlists.find((p) => p.id === 1);
```

JavaScript producirá un error porque `.find()` es un método de arreglos, no de objetos comunes.

Lo que queremos es detectar ese problema desde `obtenerPlaylists()`, antes de entregar los datos al resto del CRUD.

## 4. Primera modificación en `api.js`

Busca tu función:

```
export async function obtenerPlaylists() {
```

Dentro de ella encontrarás un bloque parecido a este:

```
if (guardadas !== null) {
    playlists = JSON.parse(guardadas);
} else {
    const respuesta = await fetch("./mocks/playlists.json");

    if (!respuesta.ok) {
        return {
            ok: false,
            status: respuesta.status,
            data: null,
            error: "No se pudieron cargar las playlists"
        };
    }

    playlists = await respuesta.json();

    localStorage.setItem(
        "tenji_playlists",
        JSON.stringify(playlists)
    );
}
```

Justo después de la última llave `}` de ese bloque y antes del `return` exitoso, agrega estas tres líneas:

```
if (!Array.isArray(playlists)) {
    throw new Error("Los datos de playlists no son válidos");
}
```

### ¿Qué significa cada instrucción?

`Array.isArray(playlists)`

Comprueba si `playlists` es realmente un arreglo.

Por ejemplo:

```
Array.isArray([1, 2, 3]); // true

Array.isArray({ nombre: "Rock" }); // false

Array.isArray("Rock"); // false
```

El operador `!`

Invierte un resultado booleano.

Por ejemplo:

```
!true  // false
!false // true
```

Por lo tanto:

```
!Array.isArray(playlists)
```

Significa: si playlists NO es un arreglo.

`throw new Error()`

Genera un error que interrumpe la ejecución normal.

Como tu función ya tiene un `try/catch`, ese error será capturado y convertido en la respuesta uniforme que utiliza tu API.

## 5. Así debe quedar esa parte del código

Te muestro solamente la sección que modificaremos:

```
if (guardadas !== null) {
    playlists = JSON.parse(guardadas);
} else {
    const respuesta = await fetch("./mocks/playlists.json");

    if (!respuesta.ok) {
        return {
            ok: false,
            status: respuesta.status,
            data: null,
            error: "No se pudieron cargar las playlists"
        };
    }

    playlists = await respuesta.json();

    localStorage.setItem(
        "tenji_playlists",
        JSON.stringify(playlists)
    );
}

if (!Array.isArray(playlists)) {
    throw new Error("Los datos de playlists no son válidos");
}

return {
    ok: true,
    status: 200,
    data: playlists,
    error: null
};
```

Observación: esta validación detecta cuando `playlists` no es un arreglo, pero todavía no comprueba la estructura de cada elemento.

Además, en una mejora posterior convendrá validar el JSON inicial antes de guardarlo en `localStorage`, para evitar almacenar datos mal formados.

## 6. Probemos que funciona

### Prueba A. Datos correctos

Abre TENJI utilizando Live Server y ejecuta:

```
const api = await import("./js/api.js");

console.log(await api.obtenerPlaylists());
```

Deberías recibir:

```
{
    ok: true,
    status: 200,
    data: [/* playlists */],
    error: null
}
```

### Prueba B. Datos incorrectos

Ahora simularemos que `localStorage` contiene información incorrecta.

Pero antes guardaremos un respaldo, para no perder tus playlists.

Copia y ejecuta este bloque completo:

```
const respaldo = localStorage.getItem("tenji_playlists");

try {
    localStorage.setItem(
        "tenji_playlists",
        '{"nombre":"Playlist incorrecta"}'
    );

    console.log(await api.obtenerPlaylists());

} finally {
    if (respaldo === null) {
        localStorage.removeItem("tenji_playlists");
    } else {
        localStorage.setItem("tenji_playlists", respaldo);
    }
}
```

### ¿Qué estamos haciendo?

Primero recuperamos los datos originales. Después guardamos temporalmente un objeto incorrecto y ejecutamos `obtenerPlaylists()`.

Si tu validación funciona, recibiremos:

```
{
    ok: false,
    status: 500,
    data: null,
    error: "Ocurrió un error al cargar las playlists"
}
```

Finalmente, `finally` restaura los datos originales.

Esto es importante porque no queremos perder las playlists que hayas creado durante las pruebas anteriores.

## 7. Comprobemos que entendiste

¿Qué sucede si `JSON.parse()` recupera un objeto válido, pero ese objeto no es un arreglo?

JavaScript convierte automáticamente el objeto en un arreglo.

`JSON.parse()` funciona, pero `Array.isArray()` devuelve `false`.

`localStorage` elimina automáticamente el objeto incorrecto.

Por ahora, haz solamente esta modificación en `obtenerPlaylists()` y ejecuta las dos pruebas.

Cuando me muestres los resultados, revisaremos si la validación funciona y después avanzaremos a comprobar que los objetos dentro del arreglo tengan los campos correctos, sin cambiar la estructura de tu CRUD ni tus comentarios.