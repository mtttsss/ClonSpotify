Implementacion de logica en javascript para desplegar menu al iniciar sesion.

Fecha: 2026-11-10
Integrante: David Cornejo (@daviidcjcj)
Herramienta y modelo: Gemini
Archivos afectados: script.js

Objetivo

Incorporar la logica del menu desplegable, para que solo este disponible cuando un usuario inicie sesion, y que tenga la opcion
de cerrar sesion y no alterar nada.

Prompt 1

en el menu desplegable del perfil, tengo listo el html y css, pero necesito la logica de javascript para que cuando alguien inicie sesion, aparezca ese menu en vez del boton de cerrar sesion, enviame lo que debo ajustar en el js

Respuesta 1

¡Excelente trabajo adelantando el HTML y el CSS! Tener esa estructura lista hace que la lógica de estado en JavaScript sea mucho más limpia.

Para lograr lo que necesitas, utilizaremos el localStorage para verificar si existe una sesión activa y manipularemos el DOM (Document Object Model) para ocultar o mostrar los elementos correspondientes. Además, agregaremos eventos de escucha (addEventListener) para controlar cuándo se abre y se cierra el menú.

Aquí tienes el código JavaScript puro (Vanilla JS) que debes incluir. Te recomiendo colocarlo dentro de un bloque DOMContentLoaded para asegurar que el HTML haya cargado completamente antes de ejecutar la lógica:

JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verificamos si hay un usuario logueado en el localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem('sesion_tenji'));

    // Obtenemos los elementos del DOM usando sus IDs
    const btnIrLogin = document.getElementById('btnIrLogin');
    const btnPerfil = document.getElementById('btnPerfil');
    const menuPerfil = document.getElementById('menuPerfil');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    // 2. Mostrar/Ocultar los botones según el estado de la sesión
    if (usuarioActivo) {
        if (btnIrLogin) btnIrLogin.style.display = 'none'; // Ocultamos "INICIAR SESIÓN"
        if (btnPerfil) btnPerfil.style.display = 'block';  // Mostramos "Mi Cuenta ▼"
    }

    // 3. Lógica de interacción del Menú Desplegable (Dropdown)
    if (btnPerfil && menuPerfil) {
        // Abrir/cerrar el menú al hacer clic en el botón
        btnPerfil.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita que el clic se propague al documento y lo cierre de inmediato
            menuPerfil.classList.toggle('oculto');
        });

        // Cerrar el menú automáticamente si se hace clic en cualquier otro lado de la página
        document.addEventListener('click', (event) => {
            if (!menuPerfil.contains(event.target) && event.target !== btnPerfil) {
                menuPerfil.classList.add('oculto');
            }
        });
    }

    // 4. Lógica para Cerrar Sesión
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (event) => {
            event.preventDefault(); // Evita que el enlace salte a otra página
            localStorage.removeItem('sesion_tenji'); // Eliminamos la sesión activa
            window.location.href = 'index.html'; // Redirigimos a la página de inicio
        });
    }
});
Explicación técnica de la solución:
classList.toggle('oculto'): Es la forma más eficiente de alternar estados. Si la clase existe, la quita (abriendo el menú); si no existe, la agrega (cerrando el menú).

event.stopPropagation(): Es crucial para el menú desplegable. Evita que el clic en el botón se "burbujee" hacia arriba y dispare el evento del document que cierra el menú al mismo tiempo que intentas abrirlo.

Pega este código en tu archivo script.js y asegúrate de que los IDs en tu HTML coincidan exactamente con los que usamos aquí (btnIrLogin, btnPerfil, menuPerfil, btnCerrarSesion). ¡Debería funcionar a la perfección!


