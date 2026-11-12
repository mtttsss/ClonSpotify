# <Filtros de canciones>
- **Fecha:** 2026-11-09
- **Integrante:** <Matias Pinto> (@mtttsss)
- **Herramienta y modelo:** <ChatGPT (GPT-6)>
- **Archivos afectados:** <api.js>

## Objetivo

<Implementar correctamente los filtros de canciones (conectar al frontend lo de api.js)>

## Conversación

### Prompt 1

Ayudame con los filtros y sort, para implementarlos en la pagina, ya estan implementados en api.js, falta conectarlo

### Respuesta 1

¡Vamos! 🔥 Como ya tienes implementados `filter()` y `sort()` dentro de `api.js`, no necesitamos modificar tu API ni tu archivo `canciones.json`. Solo falta conectar esas funciones con los controles de la página TENJI.

Revisé los archivos que me enviaste y vamos a trabajar principalmente con `index.html` y `js/catalogo.js`, conservando los comentarios y funcionalidades existentes.

## 1. ¿Qué vamos a implementar?

Tu API ya acepta esta llamada:

```
obtenerCanciones({
    busqueda: "",
    genero: "",
    ordenarPor: ""
});
```

Cada parámetro cumple una función distinta:

| Parámetro    | Función                                   | Ejemplo      |
| ------------ | ----------------------------------------- | ------------ |
| `busqueda`   | Buscar canciones por título o artista     | `"Deftones"` |
| `genero`     | Mostrar canciones de un género específico | `"Rock"`     |
| `ordenarPor` | Ordenar los resultados                    | `"duracion"` |

Los tres parámetros pueden utilizarse simultáneamente. Por ejemplo, podríamos mostrar las canciones de Rock ordenadas alfabéticamente.

## 2. Agregar los controles a `index.html`

Busca esta parte de tu HTML:

```
<section class="albumes seccion-espaciada">
    <h2>Explorar canciones</h2>
```

Justo debajo del título, agrega:

```

<div class="filtros-catalogo">

    <label for="filtro-genero">Filtrar por género:</label>
    <select id="filtro-genero">
        <option value="">Todos los géneros</option>
        <option value="Alternative Metal">Alternative Metal</option>
        <option value="Cumbia">Cumbia</option>
        <option value="Urbano">Urbano</option>
        <option value="Rap">Rap</option>
        <option value="Reggaeton">Reggaeton</option>
        <option value="Rock">Rock</option>
        <option value="Pop">Pop</option>
        <option value="Dancehall">Dancehall</option>
    </select>

    <label for="ordenar-canciones">Ordenar por:</label>
    <select id="ordenar-canciones">
        <option value="">Orden original</option>
        <option value="titulo">Título (A-Z)</option>
        <option value="artista">Artista (A-Z)</option>
        <option value="duracion">Duración (menor a mayor)</option>
    </select>

</div>

```

Si ya agregaste el selector de géneros del paso anterior, no lo dupliques: utiliza este bloque completo en su lugar.

Los valores son importantes porque coinciden con lo que espera `api.js`.

Así se verían los controles:

Explorar canciones

Filtrar por género:Todos los géneros

Ordenar por:Orden original

Vista de ejemplo. Los controles de arriba no modifican tu proyecto.

## 3. Conectar los controles en `js/catalogo.js`

Para evitar errores al insertar líneas entre funciones, te dejo el archivo completo actualizado a partir de la última versión que me enviaste.

Conservé el buscador antiguo, sus comentarios y la lógica para generar las tarjetas. También añadí una protección para evitar que las respuestas antiguas de la API sobrescriban búsquedas nuevas.

Reemplaza el contenido de `js/catalogo.js` por este:

```

import { obtenerCanciones } from "../TENJI2/js/api.js";


document.addEventListener('DOMContentLoaded', () => {
    const contenedorCanciones = document.getElementById('contenedor-canciones');
    const estadoCanciones = document.getElementById('estado-canciones');

    if (!contenedorCanciones || !estadoCanciones) return;

    const buscador = document.getElementById('input-buscador');
    const filtroGenero = document.getElementById('filtro-genero');
    const ordenarCanciones = document.getElementById('ordenar-canciones');

    const albumesPopulares = document.getElementById('albumes-populares');
    const albumesRecomendados = document.getElementById('albumes-recomendados');

    // Identifica cada consulta para evitar resultados desactualizados
    let numeroConsulta = 0;

    async function cargarCanciones(busqueda = '', genero = '', ordenarPor = '') {
        const consultaActual = ++numeroConsulta;

        estadoCanciones.textContent = 'Cargando canciones...';

        try {
            const respuesta = await obtenerCanciones({
                busqueda,
                genero,
                ordenarPor
            });

            // Si el usuario hizo otra consulta, ignorar esta respuesta
            if (consultaActual !== numeroConsulta) return;

            if (!respuesta.ok) {
                estadoCanciones.textContent = 'Error al cargar canciones: ' + respuesta.error;
                return;
            }

            console.log('Canciones obtenidas desde la API:', respuesta.data);

            contenedorCanciones.innerHTML = '';

            if (respuesta.data.length === 0) {
                estadoCanciones.textContent = 'No se encontraron canciones.';
                return;
            }

            respuesta.data.forEach(cancion => {
                const tarjeta = document.createElement('article');
                tarjeta.className = 'portadas';

                const imagen = document.createElement('img');
                imagen.src = cancion.imagen;
                imagen.alt = `Portada de ${cancion.titulo}`;

                const titulo = document.createElement('h4');
                titulo.className = 'albumTitulo';
                titulo.textContent = cancion.titulo;

                const artista = document.createElement('p');
                artista.className = 'albumArtista';
                artista.textContent = cancion.artista;

                tarjeta.appendChild(imagen);
                tarjeta.appendChild(titulo);
                tarjeta.appendChild(artista);

                contenedorCanciones.appendChild(tarjeta);
            });

            estadoCanciones.textContent = '';

            estadoCanciones.textContent = 'Canciones cargadas correctamente';
        } catch (error) {
            if (consultaActual !== numeroConsulta) return;

            console.error('Error al obtener canciones:', error);
            estadoCanciones.textContent = 'Ocurrió un error al cargar las canciones.';
        }
    }

    // Obtener los valores actuales del buscador y los selectores
    function actualizarCatalogo() {
        const busqueda = buscador?.value.trim() || '';
        const genero = filtroGenero?.value || '';
        const ordenarPor = ordenarCanciones?.value || '';

        // Ocultar las secciones de álbumes durante la búsqueda
        const hayFiltrosActivos = Boolean(busqueda || genero || ordenarPor);

        if (albumesPopulares) {
            albumesPopulares.style.display = hayFiltrosActivos ? 'none' : '';
        }

        if (albumesRecomendados) {
            albumesRecomendados.style.display = hayFiltrosActivos ? 'none' : '';
        }

        // Consultar las canciones mediante la API
        cargarCanciones(busqueda, genero, ordenarPor);
    }

    // Cargar las canciones al entrar a Inicio
    actualizarCatalogo();

    // Buscar mientras el usuario escribe
    if (buscador) {
        buscador.addEventListener('input', actualizarCatalogo);
    }

    // Filtrar cuando se selecciona un género
    if (filtroGenero) {
        filtroGenero.addEventListener('change', actualizarCatalogo);
    }

    // Ordenar cuando se selecciona un criterio
    if (ordenarCanciones) {
        ordenarCanciones.addEventListener('change', actualizarCatalogo);
    }
});


document.addEventListener('keyup', (e) => {

    if (document.getElementById('contenedor-canciones')) return;

    if (e.target.matches('.buscador input')) {
        document.querySelectorAll('.portadas').forEach((portadas) => {
            if (portadas.textContent.toLowerCase().includes(e.target.value)) {
                portadas.classList.remove('filtro');
            } else {
                portadas.classList.add('filtro');
            }
        });
    }
});

//esto es para la busqueda
//solo se puede buscar en minisculas, si se busca en mayusculas no funciona

```

No modificamos `api.js` ni `reproductor.js`. Las tarjetas siguen utilizando las mismas clases CSS, así que el evento delegado que agregamos anteriormente al reproductor debería seguir funcionando.

## 4. Entender el código

Hay tres partes fundamentales que necesitas comprender.

### A. ¿Cómo funciona el filtro por género?

Dentro de tu API ya tienes:

```
if (genero) {
    canciones = canciones.filter((cancion) => {
        return cancion.genero.toLowerCase() === genero.toLowerCase();
    });
}
```

`filter()` recorre el arreglo de canciones y construye uno nuevo con las que cumplen una condición.

Por ejemplo, al seleccionar `Rock`, solo conserva las canciones cuyo campo `genero` sea `"Rock"`.

### B. ¿Cómo funciona `sort()`?

Tu API tiene tres criterios:

```
// Duración: de menor a mayor
canciones.sort((a, b) => a.duracion - b.duracion);

// Título: orden alfabético
canciones.sort((a, b) =>
    a.titulo.localeCompare(b.titulo, "es")
);

// Artista: orden alfabético
canciones.sort((a, b) =>
    a.artista.localeCompare(b.artista, "es")
);
```

- `sort()` ordena los elementos del arreglo.
- `a` y `b` son dos canciones que JavaScript compara.
- `a.duracion - b.duracion` ordena numéricamente de menor a mayor.
- `localeCompare()` compara textos, considerando las reglas del idioma español.

La diferencia es que `filter()` selecciona elementos y `sort()` cambia su orden.

### C. ¿Por qué usamos `change`?

En el JavaScript nuevo aparece:

```
filtroGenero.addEventListener('change', actualizarCatalogo);
```

El evento `change` se ejecuta cuando el usuario selecciona una opción diferente.

Entonces `actualizarCatalogo()` recoge los valores del buscador, del filtro y del ordenamiento, y se los pasa a tu API.

La secuencia es:

Usuario selecciona Rock

`change` ejecuta `actualizarCatalogo()`

`obtenerCanciones({ genero: "Rock" })`

La API filtra con `filter()`

Se muestran las 4 canciones de Rock

## 5. Pruebas que debes realizar

| Acción                                         | Resultado esperado                                |
| ---------------------------------------------- | ------------------------------------------------- |
| Todos los géneros + orden original             | 26 canciones                                      |
| Seleccionar Rock                               | 4 canciones                                       |
| Seleccionar Cumbia                             | 3 canciones                                       |
| Seleccionar Dancehall                          | 1 canción                                         |
| Seleccionar Título (A-Z)                       | Orden alfabético por título                       |
| Seleccionar Duración                           | Canciones de menor a mayor duración               |
| Seleccionar Rock + buscar `Pink`               | Solo la canción coincidente                       |
| Buscar un nombre inexistente                   | Mensaje «No se encontraron canciones»             |
| Restablecer ambos selectores y borrar búsqueda | Vuelven los álbumes superiores y las 26 canciones |

Importante: el ordenamiento únicamente afecta las canciones de «Explorar canciones», no los álbumes populares o recomendados. Cuando hay filtros activos, ocultamos esas secciones superiores para concentrar la página en los resultados.

Te propongo que hagamos primero estas dos modificaciones y las pruebes en Live Server. Si los filtros funcionan, después podemos darles un diseño más profesional con `style.css`, sin tocar nuevamente la API.