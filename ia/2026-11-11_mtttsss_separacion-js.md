# <Separacion de JavaScripts>
- **Fecha:** 2026-11-09
- **Integrante:** <Matias Pinto> (@mtttsss)
- **Herramienta y modelo:** <ChatGPT (GPT-6)>
- **Archivos afectados:** <api.js>

## Objetivo

<Separar cada funcion de JavaScript a uno nuevo>

Esto se hizo debido a que al usar todos un mismo js, chocabamos constantemente en el GitHub, esto era una complicacion. Por esto, le pedimos a la IA que nos segmentara cada funcion que creamos a un archivo, para evitar problemas.

## Conversación

### Prompt 1

ayudame a separar los javascript, te mandare el archivo completo y quiero separarlo en varios, intenta que este todo correcto en su correspondiente javascript, NO ELIMINES NINGUN TIPO DE COMENTARIO NI DE LINEA, TIENE QUE ESTAR TODO DONDE ESTA PERO SEPARADO

### Respuesta 1

¡Listo! Revisé las 632 líneas de tu `script.js` y lo separé en archivos JavaScript según sus funcionalidades, conservando el código y los comentarios originales, incluidos los marcadores `[IA]`.

Modularización preparada

Descargar TENJI modularizado (.zip)

Incluye los nuevos archivos, el script original intacto y las instrucciones de instalación.

## 1. Nueva organización

| Archivo                | Responsabilidad                            |
| ---------------------- | ------------------------------------------ |
| `js/main.js`           | Carga los diferentes módulos               |
| `js/notificaciones.js` | Notificaciones Toast                       |
| `js/auth.js`           | Login, registro, sesión y avatar           |
| `js/catalogo.js`       | Buscador actual                            |
| `js/reproductor.js`    | Botones Like, Play y selección de tarjetas |
| `js/configuracion.js`  | Modo claro                                 |
| `js/biblioteca.js`     | CRUD completo de playlists                 |
| `script.js`            | Archivo puente para los HTML existentes    |

Tu `TENJI2/js/api.js` permanece en su ubicación actual.

## 2. ¿Encontré código duplicado?

No encontré un segundo evento de creación de playlists en el archivo que acabas de enviar. El problema anterior, que generaba dos playlists por clic, ya no está presente.

Sin embargo, detecté algunos problemas existentes que conviene conocer:

| Problema                                     | Cómo afecta                                                                 |
| -------------------------------------------- | --------------------------------------------------------------------------- |
| Buscador sin normalizar mayúsculas           | Algunas búsquedas pueden no encontrar resultados                            |
| Like con una única clave de almacenamiento   | No distingue los likes de cada canción                                      |
| Eventos de tarjetas registrados una sola vez | Las tarjetas añadidas dinámicamente no reciben automáticamente esos eventos |
| Uso de `innerHTML` con nombres de playlists  | Puede interpretar texto ingresado como HTML                                 |
| Botón Play únicamente visual                 | No reproduce audio real                                                     |

No corregí estos comportamientos todavía, porque me pediste conservar todas las líneas originales. Separar el código y corregir funcionalidades son dos trabajos distintos.

## 3. ¿Qué cambios técnicos fueron necesarios?

Solo incorporé lo indispensable para que los módulos puedan comunicarse:

- Una importación y exportación para compartir `mostrarToast()`.
- La ruta correcta hacia `TENJI2/js/api.js` desde `js/biblioteca.js`.
- Un archivo de entrada que carga los módulos en el orden correspondiente.

Todos los archivos JavaScript nuevos pasaron una comprobación de sintaxis con Node.js. Todavía falta probar su funcionamiento en el navegador.

## 4. Cómo instalarlo sin perder tu trabajo

1. Descomprime el ZIP.
2. Conserva una copia de seguridad de tu `script.js` actual.
3. Copia la carpeta `js/` y el nuevo `script.js` a la raíz de `Proyecto-Spotify-Limpio`.
4. Mantén la carpeta `TENJI2/` sin cambios.
5. Abre TENJI con Live Server y prueba las funcionalidades.

Si tus HTML ya cargan:

```
<script type="module" src="script.js"></script>
```

No necesitas modificar esa referencia.

Importante: no cargues el script original junto con los nuevos módulos, porque volverías a registrar los eventos dos veces.

### Siguiente paso

Antes de subir a GitHub, recomiendo probar login, registro, modo claro y CRUD de playlists. Como son funcionalidades de distintos integrantes, debemos asegurarnos de que todas funcionen después de separar los archivos.

Por ahora no hagas commit ni push. Primero instalemos esta estructura en tu proyecto local y confirmemos que TENJI sigue funcionando igual que antes.