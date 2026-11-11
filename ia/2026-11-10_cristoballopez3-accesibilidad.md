Accesibilidad básica, estados interactivos y arquitectura de variables CSS
Fecha: 2026-11-10
Integrante: Cristóbal López (@cristoballopez3-cpu)
Herramienta y modelo: Gemini 1.5 Pro
Archivos afectados: style.css

Objetivo
Comprender los fundamentos de la accesibilidad básica en la web, explorar los mecanismos de retroalimentación visual para la navegación e implementar la centralización de colores del proyecto mediante custom properties en CSS.


Prompt 1

a que se refiere  el criterio de accesibilidad básica y retroalimentación visual en CSS, y cómo afecta la usabilidad general del sitio

Respuesta 1
La accesibilidad básica y la retroalimentación visual (Criterio C3) hacen referencia a la capacidad de la interfaz para responder de manera clara, predecible y visible ante las acciones del usuario, garantizando que cualquier persona pueda navegar de forma cómoda:

1. **Retroalimentación de Estado (Hover y Active):**
   Un elemento interactivo (como un botón o enlace) nunca debe sentirse estático. Al posicionar el cursor encima (`:hover`) o hacer clic (`:active`), la interfaz debe ofrecer un cambio sutil de brillo, escala o color para confirmar visualmente al usuario que el elemento es ejecutable.

2. **Navegación por Teclado e Indicador de Foco (`:focus-visible`):**
   Muchas personas o tecnologías de asistencia navegan utilizando la tecla `Tab` en lugar del mouse. El foco visible resalta con un borde de alto contraste la casilla o botón que está seleccionado en ese instante, permitiendo orientarse sin perder el cursor.

3. **Prevención de Selección Accidental:**
   En entornos móviles o al interactuar rápidamente mediante clics repetidos, el texto dentro de botones o ítems de menú tiende a sombreado azul por defecto. Restringir esta selección en controles mediante reglas de `user-select` evita distracciones visuales o errores de maquetación en pantalla.


Prompt 2

entiendo ya la teoria, pero qué referencias me recomiendas aplicar para mejorar estos aspectos en la navegación y botones, sin modificar la estructura del que ya tengo?

Respuesta 2
Para fortalecer la experiencia visual de TENJI basándote en los estándares de accesibilidad UI/UX, considera las siguientes pautas conceptuales:

1. **Uso de Transiciones Suaves:**
   Evita que los cambios de color entre el estado reposo y el estado activo sean inmediatos o bruscos. Implementar un tiempo de transición global (`0.2s ease`) hace que la interacción se perciba más pulida y orgánica.

2. **Consistencia en el Indicador de Foco:**
   Asigna un contorno con color de alto contraste (como un verde acento) exclusivo para el foco por teclado, asegurando que se diferencie claramente del fondo oscuro (#000000 o #121212) y de los colores de los contenedores secundario (#141022).

3. **Consolidación de Variables con `:root` (Criterio C4):**
   Para asegurar la mantenibilidad técnica del CSS sin alterar los estilos actuales, define una paleta de custom properties al inicio del documento. Esto abstrae los colores hexadecimales usados a lo largo de la hoja de estilos en nombres semánticos reutilizables (`--bg-principal`, `--color-acento`, etc.).

Prompt 3

cómo es la estructura de un :root y de qué forma se organizan sus variables en CSS

Respuesta 3
La estructura de un bloque `:root` representa el nivel más alto del árbol DOM de un documento (equivalente a la etiqueta `<html>`), actuando como el contenedor global donde se almacenan las variables de CSS (*custom properties*).

Su sintaxis y organización conceptual se dividen en tres pilares:

1. **Ubicación al Inicio del Documento:**
   El bloque `:root` se coloca siempre en las primeras líneas de la hoja de estilos global (`style.css`), asegurando que todos los selectores posteriores tengan acceso a los valores declarados.

2. **Sintaxis de Declaración de Variables (`--nombre-variable`):**
   Cada variable se crea utilizando dos guiones seguidos de un identificador semántico y su valor correspondiente. Por ejemplo:
   ```css
   :root {
       --bg-principal: #121212;
       --color-acento: #5e17eb;
   }