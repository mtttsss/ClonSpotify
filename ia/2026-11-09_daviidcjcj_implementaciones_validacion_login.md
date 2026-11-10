Implementación de Login, Rutas Protegidas y Sesión

Fecha: 2026-11-09
Integrante: David Cornejo (@daviidcjcj)
Herramienta y modelo: Gemini
Archivos afectados: script.js

Objetivo

Implementar la validación de credenciales mediante localStorage para el login, proteger las vistas privadas redirigiendo al login en ausencia de sesión activa, y gestionar dinámicamente el botón de cierre de sesión en la barra superior.

Prompt 1

En la validación del login. modifica donde dice formLogin para que lea 'usuarios_tenji' del localStorage. si el correo y la clave coinciden, que se cree 'sesion_tenji' y redirige al dashboard, si no que muestre error.

Respuesta 1

        if (formularioValido) {
            botonLogin.disabled = true;
            botonLogin.textContent = 'Iniciando sesión...';
            botonLogin.style.opacity = '0.7';
            botonLogin.style.cursor = 'not-allowed';

            setTimeout(() => {
                const usuarios = JSON.parse(localStorage.getItem('usuarios_tenji')) || [];
                
                const usuarioValido = usuarios.find(u => u.correo === correo.value && u.password === password.value);

                if (usuarioValido) {
                    localStorage.setItem('sesion_tenji', JSON.stringify({
                        nombre: usuarioValido.nombre,
                        correo: usuarioValido.correo
                    }));
                    
                    window.location.href = 'dashboard.html'; 
                } else {
                    errorPassword.textContent = 'Correo o contraseña incorrectos.';
                    botonLogin.disabled = false;
                    botonLogin.textContent = 'Iniciar Sesión';
                    botonLogin.style.opacity = '1';
                    botonLogin.style.cursor = 'pointer';
                }
            }, 1000);
        }


Prompt 2

bien, ahora hagamos la protección de las rutas y del cierre de sesión. haz que se verifique si existe la sesión en localStorage, si un usuario intenta entrar al dashboard, perfil o biblioteca sin haber iniciado sesión para que lo rediriga. tambien ajusta el botón de la barra superior para permitir cerrar la sesión.

Respuesta 2

const usuarioActivo = JSON.parse(localStorage.getItem('sesion_tenji'));
const paginasProtegidas = ['dashboard.html', 'perfil.html', 'biblioteca.html'];
const paginaActual = window.location.pathname.split('/').pop();

if (paginasProtegidas.includes(paginaActual) && !usuarioActivo) {
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const botonHeader = document.querySelector('.barra-superior .botonlogin');
    
    if (botonHeader && usuarioActivo) {
        botonHeader.textContent = 'CERRAR SESIÓN';
        botonHeader.href = '#'; 
        
        botonHeader.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('sesion_tenji'); 
            window.location.href = 'index.html'; 
        });
    }
});


Qué se incorporó al proyecto

Se incorporó la lógica estructurada en script.js:

Validación de Login: Consulta de credenciales en el arreglo usuarios_tenji de localStorage y generación de la variable sesion_tenji.

Protección de rutas: Validación de window.location.pathname para expulsar usuarios no autenticados de páginas privadas.

Cierre de sesión: Modificación del botón en el header para cerrar la sesión al hacer clic.

Verificación

Rechazo de credenciales inválidas con mensaje de error visual.

Éxito en el login generando la persistencia  y redirección al dashboard.

Interceptación y redirección obligatoria al intentar entrar a rutas protegidas sin sesión.

Eliminación de la sesión y retorno al inicio al usar el botón de cierre de sesión.