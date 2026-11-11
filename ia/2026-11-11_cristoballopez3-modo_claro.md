Implementación de Modo Claro, Variables CSS y Persistencia con LocalStorage
Fecha: 2026-11-11  
Integrante: Cristóbal López (@cristoballopez3-cpu)  
Herramienta y modelo: Gemini 1.5 Pro  
Archivos afectados: style.css, script.js, configuracion.html, index.html, perfil.html, biblioteca.html, dashboard.html  


 Objetivo
Analizar los fundamentos de experiencia de usuario (UX) para la maquetación de temas claros/oscuros en interfaces modernas, comprender los mecanismos de sobrescritura de custom properties en CSS y diseñar la arquitectura lógica en JavaScript para garantizar la persistencia del tema mediante almacenamiento local (`localStorage`).
---

 Prompt 1
dame un contexto de como hacer un buen modo claro para una pagina y que debe tener

Respuesta 1
Diseñar e implementar un Modo Claro (*Light Mode*) efectivo en una aplicación web no se limita a "invertir los colores al blanco puro". Requiere comprender principios clave de diseño de interfaz (UI), contraste visual, jerarquía y arquitectura de software:

1. **Evitar el Blanco Puro (`#FFFFFF`) en Fondos Extensos:**  
   El uso de blanco puro absoluto como fondo principal en pantallas grandes puede generar fatiga visual por exceso de luminancia. Es una buena práctica emplear tonos blanco marfil o gris muy claro (como `#F4F4F7` o `#F8F9FA`) para el contenedor general, reservando el blanco puro (`#FFFFFF`) para tarjetas (`cards`), modales o contenedores elevados que requieran destacar.

2. **Gestión Semántica de Contraste y Texto:**  
   En lugar de usar negro absoluto (`#000000`) para todo el texto, es recomendable establecer una jerarquía tipográfica:
   * **Texto primario:** Gris muy oscuro (`#121212` o `#1A1A1A`) para títulos e información relevante, asegurando una lectura cómoda.
   * **Texto secundario:** Tonos neutros medios (`#555555` o `#666666`) para descripciones, fechas o etiquetas secundarias.

3. **Inversión Mantenida de Identidad de Marca (Color Acento):**  
   Los colores de acción primaria o identidad de marca (como el morado acento `#5E17EB` en TENJI) deben permanecer consistentes o adaptarse ligeramente en saturación para garantizar la accesibilidad y el contraste mínimo exigido por las pautas WCAG (Web Content Accessibility Guidelines) sobre fondos claros.

4. **Persistencia e Integración Global:**  
   Un sistema de tema profesional debe cumplir con tres aspectos fundamentales:
   * **Centralización:** Los colores deben estar abstraídos en variables CSS dentro de `:root`.
   * **Persistencia:** La preferencia elegida por el usuario debe guardarse en el navegador (`localStorage`) para que se mantenga al cambiar entre páginas o al recargar la ventana.
   * **Control de Interacción:** Proveer un control accesible (como un *switch* o *toggle*) en la vista de configuración que refleje el estado en tiempo real.

Prompt 2
dame referencias a nivel codigo para realizar un modo claro (en el css y en el js)

Respuesta 2
Para implementar técnicamente un modo claro no es necesario duplicar hojas de estilo ni escribir selecciones complejas para cada elemento. La estrategia recomendada se basa en **dos pilares de arquitectura**:

1. Mecanismo CSS: Sobrescritura de Custom Properties
En CSS, el selector `:root` actúa como la fuente de verdad de tus variables globales. Cuando activas el modo claro, la idea es **interceptar los valores de esas variables** aplicando una clase condicional directamente en el elemento `<body>` o `<html>`.

* **Patrón de sobrescritura:** Creas una regla del tipo `body.modo-claro` donde redefines los mismos nombres de variables declarados en `:root` pero apuntando a la paleta clara (ej. `--bg-principal: #f4f4f7;`).
* **Herencia y cascada:** Al mutar las variables en el `body`, todos los selectores hijos que usen la función `var(--nombre-variable)` actualizarán automáticamente su color en pantalla sin necesidad de tocar su código individual.
* **Excepciones puntuales:** Si existen elementos con colores "hardcodeados" (escritos a mano en hexadecimal), necesitarás agregar reglas específicas bajo la clase `body.modo-claro .selector-elemento` para forzar su color de fondo o de texto según la jerarquía del diseño.

### 2. Mecanismo JS: Manipulación de la Clase de Estado
En JavaScript, la interfaz no necesita saber qué colores existen. Su única responsabilidad es **activar o desactivar la clase que desencadena la cascada de CSS**:

* **Uso de `classList`:** Se utiliza el método `classList.add('modo-claro')` o `classList.remove('modo-claro')` para alternar el estado del nodo `document.body`.
* **Vinculación con entradas de usuario:** Se vincula esta acción al evento `change` de una casilla de verificación (`<input type="checkbox">`) o al evento `click` de un botón dedicado.



Prompt 3
guiame con el codigo del js.

Respuesta 3
La estructura lógica en JavaScript para gestionar temas debe dividirse conceptualmente en **tres fases secuenciales**:

### Guía y Flujo Lógico Paso a Paso

1. **Fase de Inicialización (Esperar la carga del árbol DOM):**  
   Todo el código debe envolverse en un evento de escucha `DOMContentLoaded`. Esto garantiza que los botones, interruptores o tarjetas ya existan en la memoria antes de intentar seleccionarlos con `document.getElementById()`.

2. **Fase de Lectura y Sincronización Inicial (Al cargar cualquier pestaña):**  
   * Debes consultar la memoria del navegador usando `localStorage.getItem('clave_tema')`.
   * **Si el valor obtenido indica modo claro:**
     * Le agregas inmediatamente la clase condicional al `body`.
     * Si la página actual contiene el switch/checkbox de activación, debes asegurarte de marcar su propiedad `.checked = true` para que la interfaz mantenga coherencia visual con el estado guardado.

3. **Fase de Interacción y Persistencia (Al activar o desactivar el control):**  
   * Escuchas el cambio en el control interactivo (evento `change`).
   * Evalúas el estado de la casilla (si está marcada o no):
     * **Si se activa:** agregas la clase al `body` y ejecutas `localStorage.setItem('clave_tema', 'claro')`.
     * **Si se desactiva:** remueves la clase del `body` y ejecutas `localStorage.setItem('clave_tema', 'oscuro')`.

### Esquema de Pseudocódigo (Indicios de Estructura):

```text
AL CARGAR EL DOCUMENTO:
    Buscamos el elemento switch en el DOM

    SI (localStorage tiene guardado 'claro'):
        Agregar clase 'modo-claro' al body
        SI (existe el switch en esta página):
            Marcar el switch como activado

    SI (el switch existe en la página actual):
        ESCUCHAR cuando el switch cambie de estado:
            SI (el switch ahora está marcado):
                Agregar clase 'modo-claro' al body
                Guardar 'claro' en localStorage
            SINO:
                Quitar clase 'modo-claro' del body
                Guardar 'oscuro' en localStorage