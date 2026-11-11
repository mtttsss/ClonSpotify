Implementación de la logica en JavaScript para poder dejarle a un usuario su perfil unico, y la opcion de cambiar foto de perfil.

Fecha: 2026-11-09
Integrante: David Cornejo (@daviidcjcj)
Herramienta y modelo: Gemini
Archivos afectados: script.js

Objetivo

Implementar un perfil un unico asignado a un usuario al iniciar sesion, con sus respectivos datos, y la opcion de cambiar imagen de perfil. 

Prompt 1

ahora quiero que me ayudes a implementar un perfil unico asignado a un usuario, con su respectivo username y datos, explicame como y donde debo ajustar el codigo js

Respuesta 1
Para lograr que cada usuario vea su propia información al iniciar sesión, utilizamos una técnica llamada "Renderizado Dinámico".

¿Cómo funciona?
En lugar de dejar los nombres y fotos fijas en tu HTML, usamos JavaScript para leer la sesión actual (usuarioActivo) desde tu localStorage. Cuando la página carga, buscamos las clases de tu perfil (.nombreperfil, .foto-perfil, etc.) y reemplazamos su contenido con los datos reales del usuario logueado.

¿Dónde debes ajustarlo?
Debes reemplazar el bloque inicial de tu script.js (desde la línea 1 hasta donde termina la lógica de cerrar sesión con // [IA] fin).

Copia y pega este código exacto, manteniendo tu estructura original con const usuarioActivo:

JavaScript
// [IA] inicio · ia/2026-11-09_daviidcjcj_implementaciones_validacion_login.md
const usuarioActivo = JSON.parse(localStorage.getItem('sesion_tenji'));
const paginasProtegidas = ['dashboard.html', 'perfil.html', 'biblioteca.html'];
const paginaActual = window.location.pathname.split('/').pop();

if (paginasProtegidas.includes(paginaActual) && !usuarioActivo) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const btnIrLogin = document.getElementById('btnIrLogin');
    const btnPerfil = document.getElementById('btnPerfil');
    const menuPerfil = document.getElementById('menuPerfil');
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    
    console.log("Estado de la sesión:", usuarioActivo);
    
    // --- LÓGICA DE USUARIO ACTIVO ---
    if (usuarioActivo) {
        // 1. Barra superior
        if (btnIrLogin) btnIrLogin.style.display = 'none';
        if (btnPerfil) {
            btnPerfil.style.display = 'block';
            // Personaliza el botón de la barra superior
            btnPerfil.innerHTML = `${usuarioActivo.nombre} ▼`; 
        }

        // 2. Inyección de datos en perfil.html
        const nombrePerfil = document.querySelector('.nombreperfil');
        const fotoPerfil = document.querySelector('.foto-perfil');
        const estadisticas = document.querySelector('.estadisticasperfil');

        if (nombrePerfil) {
            nombrePerfil.textContent = usuarioActivo.nombre;
        }
        
        if (estadisticas) {
            estadisticas.textContent = `${usuarioActivo.correo} • Oyente frecuente`;
        }

        if (fotoPerfil && usuarioActivo.avatar) {
            fotoPerfil.src = usuarioActivo.avatar;
        }
    }

    // --- LÓGICA DEL MENÚ DESPLEGABLE ---
    if (btnPerfil && menuPerfil) {
        btnPerfil.addEventListener('click', (event) => {
            event.stopPropagation();
            menuPerfil.classList.toggle('oculto');
        });

        document.addEventListener('click', (event) => {
            if (!menuPerfil.contains(event.target) && event.target !== btnPerfil) {
                menuPerfil.classList.add('oculto');
            }
        });
    }

    // --- LÓGICA DE CERRAR SESIÓN ---
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('sesion_tenji'); 
            window.location.href = 'index.html'; 
        });
    }
});
// [IA] fin 
Al guardar esto, la página de perfil tomará automáticamente el nombre y la foto del usuario que haya iniciado sesión.

Prompt 2

bien, ahora quiero implementar la opcion de poder cambiar la foto de perfil de un usuario que haya iniciado sesion, explicame como implementar eso y en que seccion del codigo

Respuesta 2

Para implementar la opción de cambiar la foto de perfil, usaremos una interacción sencilla: al hacer clic sobre la foto actual, aparecerá una ventana emergente (prompt) pidiendo el enlace (URL) de la nueva imagen. Si el usuario ingresa un enlace válido, actualizaremos la imagen visualmente, guardaremos el cambio en la sesión actual y, lo más importante, lo actualizaremos en la "base de datos" (usuarios_tenji) para que no se pierda al cerrar sesión.

¿Dónde debes ajustar el código?
Debes buscar en tu script.js el bloque que acabas de agregar, específicamente dentro del if (usuarioActivo) donde está la sección "2. Inyección de datos en perfil.html".

Reemplaza todo ese sub-bloque de inyección de datos por este código exacto:

JavaScript
        // 2. Inyección de datos en perfil.html
        const nombrePerfil = document.querySelector('.nombreperfil');
        const fotoPerfil = document.querySelector('.foto-perfil');
        const estadisticas = document.querySelector('.estadisticasperfil');

        if (nombrePerfil) nombrePerfil.textContent = usuarioActivo.nombre;
        if (estadisticas) estadisticas.textContent = `${usuarioActivo.correo}Oyente frecuente`;

        if (fotoPerfil && usuarioActivo.avatar) {
            fotoPerfil.src = usuarioActivo.avatar;
            
            // --- NUEVO: Lógica para cambiar la foto ---
            fotoPerfil.style.cursor = 'pointer';
            fotoPerfil.title = 'Haz clic para cambiar tu foto';

            fotoPerfil.addEventListener('click', () => {
                const nuevaUrl = prompt("Ingresa el enlace (URL) de tu nueva foto de perfil:");
                
                if (nuevaUrl && nuevaUrl.trim() !== "") {
                    // 1. Cambiamos la imagen visualmente
                    fotoPerfil.src = nuevaUrl.trim();
                    
                    // 2. Actualizamos la sesión activa
                    usuarioActivo.avatar = nuevaUrl.trim();
                    localStorage.setItem('sesion_tenji', JSON.stringify(usuarioActivo));
                    
                    // 3. Actualizamos la "Base de Datos" general de usuarios para que no se borre
                    let usuarios = JSON.parse(localStorage.getItem('usuarios_tenji')) || [];
                    const index = usuarios.findIndex(u => u.correo === usuarioActivo.correo);
                    
                    if (index !== -1) {
                        usuarios[index].avatar = nuevaUrl.trim();
                        localStorage.setItem('usuarios_tenji', JSON.stringify(usuarios));
                        alert("¡Foto de perfil actualizada con éxito!");
                    }
                }
            });
        }
¿Cómo funciona esta implementación?

fotoPerfil.style.cursor = 'pointer';: Cambia el icono del ratón a una "manito", indicando visualmente que la foto es un botón clickeable.

prompt(...): Detiene la ejecución y le pide al usuario un dato de entrada (el link de la foto).

Guardado triple: Se cambia el .src del HTML en vivo, se actualiza el objeto usuarioActivo en sesion_tenji, y mediante el método .findIndex() buscamos al usuario en usuarios_tenji para guardar el nuevo avatar permanentemente en el registro global.