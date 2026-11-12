# TENJI — Frontend de plataforma musical

TENJI es una aplicación web inspirada en las plataformas de música. Permite explorar canciones y álbumes, buscar y filtrar el catálogo, organizar playlists y guardar canciones favoritas. En esta segunda entrega se trabajó en pasar de una maqueta estática a un frontend interactivo que obtiene sus datos desde archivos JSON mediante una API simulada.

**Repositorio:** https://github.com/mtttsss/ClonSpotify

## Integrantes

- Matías Pinto
- David Cornejo
- Cristóbal López

## Tecnologías utilizadas

| Tecnología | Uso en el proyecto | Cómo se incorpora |
|---|---|---|
| HTML5 | Estructura y navegación entre vistas | Archivos `.html` del proyecto |
| CSS3 | Diseño y apariencia de la interfaz | `style.css` |
| JavaScript (ES Modules) | Interacciones, validaciones y funcionamiento de la aplicación | Archivos de `js/` y `script.js` |
| JSON | Almacenamiento de datos simulados de canciones, álbumes, playlists y usuarios | Archivos de `mocks/` |
| Web Storage (`localStorage`) | Guardado de sesiones, playlists y canciones favoritas | API del navegador |
| Google Fonts (Montserrat) | Tipografía de la interfaz | Enlace externo en los archivos HTML |


**Sobre las librerías:** se trabajó con JavaScript y CSS nativos, separados en módulos para mantener el proyecto comprensible. Esto se hizo debido a que para nosotros era mucho mas facil trabajar con librerias que ya conociamos y habiamos utilizado desde antes, esto no afectara a la profesionalidad de la entrega.

## Requisitos para ejecutar TENJI

- Un navegador actualizado, como Google Chrome, Microsoft Edge o Opera GX.
- Visual Studio Code (recomendado).
- La extensión **Live Server** de Visual Studio Code, o cualquier servidor HTTP local que sirva archivos estáticos.
- Conexión a internet para cargar fuentes externas y algunas portadas alojadas en otros sitios.

> **Importante:** no abrir `index.html` haciendo doble clic ni usar una dirección `file://`. Los módulos de JavaScript y las consultas `fetch()` a los archivos JSON necesitan que el proyecto se ejecute desde un servidor local.

## Instalación y ejecución local

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/mtttsss/ClonSpotify.git
   ```

2. Abrir la carpeta del proyecto en Visual Studio Code.
3. Si aún no está instalada, agregar la extensión **Live Server** desde el panel de extensiones.
4. Abrir `index.html` y seleccionar **Open with Live Server** (o **Go Live**).
5. El navegador abrirá una dirección local similar a `http://127.0.0.1:5500/index.html` (el puerto puede variar).
6. Para probar las páginas privadas, registrar una cuenta e iniciar sesión desde la interfaz.


## Acceso y credenciales para pruebas

En la implementación actual, los usuarios se registran desde `register.html` y sus datos se guardan en el `localStorage` **del mismo navegador**. Por ello, una instalación nueva no contiene automáticamente un usuario de prueba creado en el computador de otro integrante.

**Recorrido de acceso:** `index.html` → **Iniciar sesión** → **Registrarse** → completar formulario → `login.html` → entrar con la cuenta creada. Al iniciar sesión se accede al dashboard; cerrar sesión elimina la sesión simulada.

## Vistas del proyecto

| Vista | Archivo | Cómo acceder |
|---|---|---|
| Inicio y catálogo | `index.html` | Página inicial y enlace **Inicio** |
| Iniciar sesión | `login.html` | Botón **Iniciar sesión** |
| Registro de usuario | `register.html` | Desde la opción de registro del acceso |
| Dashboard | `dashboard.html` | Menú lateral; requiere sesión |
| Biblioteca | `biblioteca.html` | Menú **Tu Biblioteca**; requiere sesión |
| Detalle de playlist | `playlist.html?id=ID` | Al abrir una playlist desde la Biblioteca; el ID corresponde a una playlist existente |
| Perfil | `perfil.html` | Menú **Mi perfil**; requiere sesión |
| Configuración | `configuracion.html` | Menú **Configuración**; requiere sesión |


## Organización de archivos

Las rutas principales de la Entrega 2 son:

```text
ClonSpotify/
├── README.md                 # Este documento
├── index.html                # Inicio y catálogo
├── biblioteca.html           # Playlists y favoritos
├── playlist.html             # Detalle de playlist
├── dashboard.html            # Dashboard
├── perfil.html               # Perfil
├── configuracion.html        # Configuración
├── login.html                # Inicio de sesión
├── register.html             # Registro
├── style.css                 # Estilos generales
├── script.js                 # Entrada de scripts
├── js/                       # Módulos de las vistas e interacciones
│   ├── main.js
│   ├── catalogo.js
│   ├── biblioteca.js
│   ├── reproductor.js
│   └── mislikes.js
├── TENJI2/
│   ├── js/
│   │   └── api.js           # Capa de servicios simulada
│   └── mocks/
│       ├── canciones.json
│       ├── albumes.json
│       └── playlists.json
└── ia/
    └── README.md            # Índice de los registros de uso de IA
```

Esta vista resume los archivos más relevantes; `js/` e `ia/` contienen otros módulos y registros.

## API simulada (sección 5.4 de la pauta)

La capa de acceso a datos se encuentra en **`TENJI2/js/api.js`**. Desde las vistas se llaman sus funciones en lugar de consultar directamente los archivos JSON. Las rutas `/api/...` de esta sección son **equivalentes propuestos para una futura API REST**, no direcciones HTTP disponibles actualmente.

### Tabla de endpoints equivalentes

| Función de servicio | Método HTTP equivalente | Ruta REST equivalente | Descripción |
|---|---|---|---|
| `obtenerCanciones({ busqueda, genero, ordenarPor })` | GET | `/api/canciones` | Lista canciones y admite búsqueda, filtro por género y ordenamiento. |
| `obtenerCancion(id)` | GET | `/api/canciones/:id` | Obtiene una canción por ID; devuelve error si no existe. |
| `obtenerAlbumes({ categoria })` | GET | `/api/albumes` | Lista álbumes y permite filtrar por categoría. |
| `obtenerPlaylists({ forzarError })` | GET | `/api/playlists` | Lista las playlists y permite simular un fallo para pruebas. |
| `obtenerPlaylist(id)` | GET | `/api/playlists/:id` | Consulta una playlist por ID. |
| `crearPlaylist(datos)` | POST | `/api/playlists` | Crea una playlist y devuelve un resultado equivalente a 201. |
| `editarPlaylist(id, datos)` | PUT | `/api/playlists/:id` | Actualiza los datos de una playlist existente. |
| `eliminarPlaylist(id)` | DELETE | `/api/playlists/:id` | Elimina una playlist después de la confirmación en la interfaz. |

### Parámetros y datos utilizados

| Recurso | Parámetros o campos principales |
|---|---|
| Canciones | `id`, `titulo`, `artista`, `album`, `duracion` (segundos), `genero`, `imagen` |
| Consulta de canciones | `busqueda` (texto), `genero` (categoría) y `ordenarPor` (`duracion`, `titulo` o `artista`) |
| Álbumes | `id`, `nombre`, `artista`, `imagen`, `categoria` |
| Consulta de álbumes | `categoria`: por ejemplo, `popular` o `recomendado` |
| Playlists | `id`, `nombre`, `descripcion`, `usuarioId` y `cancionIds` |
| Creación de playlist | `nombre` obligatorio; `descripcion`, `usuarioId` y `cancionIds` opcionales |
| Edición de playlist | `id` y los campos que se quieran actualizar, como `nombre`, `descripcion` o `cancionIds` |
| Simulación de error | `obtenerPlaylists({ forzarError: true })` permite provocar una respuesta fallida para pruebas |

### Respuestas de los servicios

Las funciones son asíncronas (`async/await`), simulan una latencia de **500 ms** y devuelven un formato uniforme:

```javascript
{
    ok: true,
    status: 200,
    data: [],
    error: null
}
```

Cuando ocurre un error, `ok` es `false`, `data` es `null` y `error` contiene un mensaje. Dependiendo de la operación, se simulan códigos como `200`, `201`, `400`, `404` o `500`.

Las canciones y los álbumes se leen desde los archivos JSON de `TENJI2/mocks/`. Las playlists parten de datos simulados y sus modificaciones se guardan en `localStorage` para persistir entre recargas. Los favoritos se almacenan con la clave `tenji_likes`.


## Registro del uso de inteligencia artificial

El equipo registra las consultas que aportaron código al proyecto dentro de `ia/`.

**Índice de registros:** [ia/README.md](ia/README.md)

Cada registro contiene la información correspondiente a su consulta y los archivos afectados. El historial de Git permite revisar también los aportes individuales del equipo.
