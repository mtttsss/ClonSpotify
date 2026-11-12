Dashboard dinamico

Fecha	2026-11-11
Integrante	Cristóbal López (cristoballopez3)
Herramienta y modelo	Claude Sonnet 5.5 (claude.ai)
Archivos relacionados	js/dashboard.js (nuevo), dashboard.html


Objetivo	Reemplazar las estadísticas y listados escritos a mano en dashboard.html por contenido generado con JS desde los mocks, usando api.js

## Prompt 1

que debe tener un dashboard dinamico para funcionar adecuadamente bajo el contexto de mi proyecto?

## Respuesta 1

Un dashboard dinámico tiene que cumplir un criterio principal: ningún número ni listado puede estar escrito a mano. Todo sale de los datos, y cada capa del proyecto se encarga de una sola cosa.

Cómo debería comportarse
Los datos vienen de la capa de servicios. En tu proyecto, eso es api.js con obtenerCanciones() y obtenerPlaylists(). El dashboard no debería hacer fetch directo a los JSON ni leer localStorage por su cuenta, porque así se mezclarían dos formas de trabajar con datos, que es justo lo que criticó la valoración.
Se calcula a partir de lo que existe. Solo puede mostrar métricas que los mocks permiten obtener: duración, artistas, géneros, cantidad de playlists. Cifras como “+15% este mes” o “Top 1%” no se pueden justificar, y un dashboard dinámico no las inventa.
Tiene tres estados. Mientras carga (tu API simula 500 ms de latencia) debe avisar que está cargando. Si falla una petición, debe mostrar el error con un botón “Reintentar”. Si no hay datos, debe mostrar un mensaje claro y no tarjetas con ceros. Esto es lo que pide el criterio B3.
Refleja el estado actual. Como lee los datos cada vez que se abre la página, si el usuario crea o borra una playlist en la biblioteca y vuelve al dashboard, los números ya están actualizados. No necesita actualizarse en vivo.
No se rompe con datos incompletos. Una playlist sin cancionIds, un id que no existe en el catálogo o un catálogo vacío no deberían causar un error en pantalla.
Respeta la sesión. auth.js ya protege dashboard.html, así que solo se ve con sesión iniciada. El dashboard no debe duplicar esa lógica.
Qué cambia en cada capa
Capa	Responsabilidad en el dashboard
HTML (dashboard.html)	Solo la estructura: títulos de sección y contenedores vacíos con id, más una zona para los mensajes de estado. Sin números ni textos de ejemplo.
CSS (style.css)	Ya tienes las clases dash-*. El JS las reutiliza al crear los elementos, así el aspecto (incluido el modo claro y el responsive) sigue en un solo lugar.
JS (js/dashboard.js)	Pide los datos, calcula, pinta y maneja los estados.
api.js	Entrega los datos con el formato { ok, status, data, error }. El dashboard se apoya en eso para saber si todo salió bien.

Dentro del JS conviene que el cálculo y el pintado sean funciones separadas. Una función recibe canciones y playlists y devuelve las métricas, y otras las pintan. Así, si mañana cambias qué se muestra, tocas una sola.

Detalles que suelen olvidarse
Pintar con textContent, no con innerHTML, porque algunos datos (como nombres de playlists) los escribe el usuario.
Accesibilidad: alt en cada imagen y una zona de estado con aria-live, para que un lector de pantalla anuncie “Cargando” o el error.
Un archivo propio (dashboard.js), cargado solo en esa página. Si falta algún contenedor, que avise en consola y no falle en silencio.
Rastro de IA: las marcas [IA] inicio y [IA] fin con el registro correspondiente.

Lo que depende de otras partes del proyecto
Mostrar solo las playlists del usuario requiere que la sesión guarde un id. Hoy sesion_tenji solo tiene nombre, correo y avatar, así que de momento se cuentan todas.
Mostrar álbumes requiere una función obtenerAlbumes() en api.js, que todavía no existe.

## Prompt 2

desglosa mas lo del js, con ejemplos y una guia para poder crear el codigo del dashboard.js


## Respuesta 2

El archivo tiene siempre el mismo orden. Primero se piden los datos, después se calculan y al final se pintan. Cada paso es una función pequeña, y así sabes dónde mirar cuando algo falla.

0. Mapa del archivo
js
// 1. import de api.js
// 2. DOMContentLoaded
//      2.1 buscar los contenedores (y avisar si falta alguno)
//      2.2 utilidades: crearElemento, contar, formatearDuracion, formatearMinutos
//      2.3 calcularMetricas(canciones, playlists)   → devuelve un objeto con las cifras
//      2.4 pintarStats / pintarArtistas / pintarCanciones   → escriben en el DOM
//      2.5 mostrarError y cargarDashboard           → coordinan todo y manejan los estados
//      2.6 llamada final: cargarDashboard()

La regla es que calcular no toca el DOM y pintar no calcula. Si cambias qué se muestra, tocas una función.

1. El import
js
import { obtenerCanciones, obtenerPlaylists } from "../TENJI2/js/api.js";

La ruta se lee desde donde está dashboard.js. Como está en js/ y TENJI2/ está a su lado, subes un nivel (../) y entras a TENJI2/js/api.js. Es la misma ruta que usa catalogo.js.

2. Buscar los contenedores y no fallar en silencio
js
const estado = document.getElementById('estado-dashboard');
const contenedorStats = document.getElementById('dash-stats');

Si un id no existe en el HTML, getElementById devuelve null y todo lo que venga después se rompe o no hace nada. Por eso conviene revisar todos al inicio y avisar cuál falta:

js
const necesarios = { 'dash-stats': contenedorStats, 'estado-dashboard': estado };
const faltantes = Object.keys(necesarios).filter((id) => !necesarios[id]);
if (faltantes.length > 0) {
    console.error('Faltan estos id en el HTML:', faltantes.join(', '));
    return;
}

Object.keys te da los nombres, filter deja solo los que tienen valor null, y el return corta la ejecución.

3. Las utilidades, con ejemplos de entrada y salida

crearElemento(etiqueta, clase, texto) evita repetir createElement, className y textContent en cada elemento:

js
function crearElemento(etiqueta, clase, texto) {
    const elemento = document.createElement(etiqueta);
    if (clase) elemento.className = clase;
    if (texto !== undefined) elemento.textContent = texto;
    return elemento;
}

crearElemento('h3', 'dash-stat-valor', '26')   // <h3 class="dash-stat-valor">26</h3>

Usa textContent y no innerHTML, porque el texto se inserta como texto plano y no se interpreta como HTML.

contar(mapa, clave) suma 1 a un contador dentro de un Map:

js
const generos = new Map();
contar(generos, 'Rock');
contar(generos, 'Rock');
contar(generos, 'Pop');
// generos → Map { 'Rock' => 2, 'Pop' => 1 }

La línea clave es mapa.set(clave, (mapa.get(clave) || 0) + 1). Si la clave no existe, get devuelve undefined, el || 0 lo convierte en 0 y se suma 1.

formatearDuracion(segundos) y formatearMinutos(segundos) convierten segundos, que es como vienen en canciones.json:

js
formatearDuracion(5100)   // "1 h 25 min"   (5100 s = 1 h y 1500 s = 25 min)
formatearMinutos(266)     // "4:26"
formatearMinutos(241)     // "4:01"  ← por eso se usa padStart(2, '0')

Se usa Math.floor(segundos / 60) para los minutos y segundos % 60 (el resto) para los segundos.

4. Pedir los datos

Todas las funciones de api.js devuelven el mismo formato:

js
{ ok: true, status: 200, data: [ { id: 1, titulo: "Sextape", ... }, ... ], error: null }

Lo primero es mirar ok. Si es false, data es null y lo único útil es error.

Hay dos peticiones y cada una tarda 500 ms simulados. Si las haces una tras otra esperas 1000 ms. Con Promise.all salen a la vez y esperas 500:

js
const [resCanciones, resPlaylists] = await Promise.all([
    obtenerCanciones(),
    obtenerPlaylists()
]);

La desestructuración [a, b] recibe los resultados en el mismo orden en que los pediste. Esto va dentro de una función async, porque await solo funciona ahí.

5. Calcular las métricas

La idea es recorrer una vez las canciones y acumular todo lo que necesitas.

Artistas. Se guarda un objeto por artista dentro de un Map:

js
if (!artistas.has(cancion.artista)) {
    artistas.set(cancion.artista, { nombre: cancion.artista, genero: cancion.genero,
                                    imagen: cancion.imagen, cuenta: 0, segundos: 0 });
}
const artista = artistas.get(cancion.artista);
artista.cuenta++;
artista.segundos += cancion.duracion;

Con tus datos, tras pasar las canciones 7 y 8, Easykid queda así: { cuenta: 2, segundos: 347, ... }. Los demás artistas tienen cuenta: 1.

Ranking. Un Map no se ordena directamente. Se pasa a arreglo con [...artistas.values()], se usa sort y se corta con slice:

js
.sort((a, b) => b.cuenta - a.cuenta || b.segundos - a.segundos)
.slice(0, 4)

b.cuenta - a.cuenta pone primero al que tiene más canciones. Si empatan, da 0, y el || pasa a la segunda comparación, la duración total. Con tus datos queda Easykid (2 canciones), luego Tan Bionica (266 s), Drake (260 s) y Attaque 77 (259 s).

Canciones más largas. Se copia el arreglo con [...canciones] para no alterar el original:

js
[...canciones].sort((a, b) => b.duracion - a.duracion).slice(0, 4)

Playlists. Solo aportan dos cifras. La cantidad es playlists.length, y las canciones guardadas se suman con reduce:

js
const cancionesGuardadas = playlists.reduce((total, playlist) => {
    return total + (playlist.cancionIds || []).length;
}, 0);

El || [] evita que falle una playlist que no tenga cancionIds.

La función termina con un return { ... } con todas las cifras. No toca el HTML.

6. Pintar

El patrón es el mismo en las tres funciones: crear los elementos, armarlos y agregarlos al contenedor. Por ejemplo, una tarjeta de estadística:

js
const tarjeta = crearElemento('article', 'dash-card-stat');
tarjeta.appendChild(crearElemento('h3', 'dash-stat-valor', '26'));
tarjeta.appendChild(crearElemento('p', 'dash-stat-label', 'Duración del catálogo'));
contenedorStats.appendChild(tarjeta);

Eso equivale a escribir a mano:

html
<article class="dash-card-stat">
    <h3 class="dash-stat-valor">26</h3>
    <p class="dash-stat-label">Duración del catálogo</p>
</article>

Las clases son las que ya tienes en style.css, así el aspecto, el modo claro y el responsive no se tocan. Para repetir el patrón con varias tarjetas, defines un arreglo de objetos { icono, valor, label, badge, tipo } y lo recorres con forEach. En las imágenes no te olvides del alt.

7. Los tres estados
Cargando: estado.textContent = 'Cargando panel...' al inicio de cargarDashboard.
Error: si ok es false, se muestra el mensaje y un botón que vuelve a llamar a la misma función:
js
const boton = crearElemento('button', 'btn-perfil', 'Reintentar');
boton.addEventListener('click', cargarDashboard);
estado.appendChild(boton);
Vacío: solo si el catálogo no tiene canciones. Que no haya playlists no es un caso vacío, porque el dashboard sigue mostrando el catálogo.

Todo el try de cargarDashboard va con un catch para los errores inesperados, y limpia los contenedores al empezar con replaceChildren() para que el botón “Reintentar” no duplique tarjetas.

8. Cómo armarlo sin perderte

Avanza en este orden y comprueba cada paso en el navegador antes de seguir:

Crea el archivo con un console.log('dashboard.js cargado') y confirma que aparece en la consola.
Agrega el import, el DOMContentLoaded y la revisión de contenedores.
Escribe cargarDashboard solo con la petición y un console.log(resCanciones.data). Debes ver las 26 canciones.
Escribe calcularMetricas y haz console.log(metricas). Debes ver cifras razonables.
Escribe pintarStats y confirma que salen las 4 tarjetas.
Agrega pintarArtistas y pintarCanciones.
Agrega los estados de error y vacío. Para probar el error, usa obtenerPlaylists({ forzarError: true }) y vuelve a dejarlo normal.
9. Errores comunes
Olvidar el await y trabajar con una promesa en vez de los datos.
Usar innerHTML con datos que vienen de personas.
Mezclar cálculo y pintado en la misma función, lo que dificulta encontrar errores.
No limpiar los contenedores antes de volver a pintar.
Revisar solo resCanciones.ok y olvidar resPlaylists.ok.

Cuando quieras, en el siguiente prompt armamos el código completo con todo esto junto.