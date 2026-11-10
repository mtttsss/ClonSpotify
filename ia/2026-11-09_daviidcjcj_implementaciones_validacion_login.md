# Login con localStorage, rutas protegidas y cierre de sesión
**Fecha:** 2026-11-09
**Integrante:** David Cornejo (@daviidcjcj)
**Herramienta y modelo:** Gemini
**Archivos afectados:** script.js

## Objetivo
Implementar la lectura de credenciales desde localStorage para el login, proteger las vistas privadas (dashboard, biblioteca, perfil) redirigiendo al login si no hay sesión, y cambiar el estado del botón de la barra superior para permitir el cierre de sesión, cumpliendo con los requerimientos A1 y A5 sin usar la capa api.js todavía.

## Conversación
*contexto previo de lo que implementaremos*

### Prompt 1
hagamos el paso 2, para comenzar con la validacion del login

### Respuesta 1
Vamos con el Paso 2: Hacer que el Login valide los datos y cree la sesión. Con esto cubriremos la exigencia de tener un login funcional que compruebe credenciales reales simuladas.   Busca en tu script.js la sección del Login (formLogin). Vamos a actualizar el bloque if (formularioValido) que pusimos antes para que lea la base de datos que creaste en el registro.Busca y borra este bloque en el login:JavaScript        if (formularioValido) {
            // Deshabilitar el botón mientras "carga"
            botonLogin.disabled = true;
            botonLogin.textContent = 'Iniciando sesión...';
            // ... (y lo que sigue del setTimeout)
        }
Reemplázalo por este código:JavaScript        if (formularioValido) {
            // 1. Deshabilitar el botón mientras "carga"
            botonLogin.disabled = true;
            botonLogin.textContent = 'Iniciando sesión...';
            botonLogin.style.opacity = '0.7';
            botonLogin.style.cursor = 'not-allowed';

            // --- NUEVA LÓGICA DE LOGIN CON LOCALSTORAGE ---
            setTimeout(() => {
                // Traer la lista de usuarios guardados
                const usuarios = JSON.parse(localStorage.getItem('usuarios_tenji')) || [];
                
                // Buscar si existe un usuario que coincida exactamente con el correo y contraseña
                const usuarioValido = usuarios.find(u => u.correo === correo.value && u.password === password.value);

                if (usuarioValido) {
                    // Si los datos son correctos, CREAR LA SESIÓN
                    localStorage.setItem('sesion_tenji', JSON.stringify({
                        nombre: usuarioValido.nombre,
                        correo: usuarioValido.correo
                    }));
                    
                    // Redirigir al dashboard
                    window.location.href = 'dashboard.html'; 
                } else {
                    // Si son incorrectos, mostrar error y restaurar el botón
                    errorPassword.textContent = 'Correo o contraseña incorrectos.';
                    botonLogin.disabled = false;
                    botonLogin.textContent = 'Iniciar Sesión';
                    botonLogin.style.opacity = '1';
                    botonLogin.style.cursor = 'pointer';
                }
            }, 1000); // Simulamos 1 segundo de latencia del servidor
        }
¿Qué hace esto y cómo lo pruebas?Compara los datos: El código va al localStorage, lee los usuarios que registraste en el Paso 1 y comprueba si hay un "match" perfecto de correo y contraseña.   Crea la sesión: Si el usuario es válido, crea una nueva llave en el navegador llamada sesion_tenji indicando que esa persona está conectada actualmente.   Rechaza errores: Si pones mal la contraseña o un correo que no existe, frena la redirección y te muestra el mensaje de error correspondiente.Para probarlo:
Ve a login.html, intenta entrar con un correo inventado y mira cómo te rechaza. Luego, entra con el correo y contraseña que creaste en el paso anterior y verás que te deja pasar a dashboard.html. Además, si abres la pestaña de "Aplicación" (F12) como hicimos antes, verás que ahora existe un nuevo archivo llamado sesion_tenji.Haz la prueba y avísame para pasar al Paso 3 y 4 (Los finales): proteger el dashboard para que nadie entre sin loguearse y habilitar el botón para cerrar la sesión.

### Prompt 2
antes de seguir, cuantos pasos son para dejar lista esta seccion y hacer el git push

### Respuesta 2
Solo nos faltan 2 pasos muy cortos para dejar toda la sección de sesiones y autenticación lista para el git push y ganar los puntos completos del criterio A5.   Aquí tienes lo que falta:Paso 3 (Proteger las páginas): Agregar unas líneas al principio de tu script.js que revisen si el usuario está conectado. Si alguien intenta entrar a dashboard.html, biblioteca.html o perfil.html sin estar logueado, lo mandaremos de vuelta al login.html.   Paso 4 (Cerrar sesión): Hacer que el botón de "INICIAR SESION" en la barra superior cambie a "CERRAR SESIÓN" si el usuario ya entró, y que al hacerle clic borre la sesión y lo devuelva al inicio.   Ambos pasos se hacen agregando un solo bloque de código al principio de tu archivo script.js.¿Te envío el código para liquidar estos dos últimos pasos de una vez?

### Prompt 3
hagamos el paso 3

### Respuesta 3
*(Copia y pega aquí EXACTAMENTE mi respuesta anterior donde te di el código de las rutas protegidas y el botón de cerrar sesión)*

## Qué se incorporó al proyecto
Se incorporó la lógica completa generada por la IA en `script.js`:
1. En el event listener de `formLogin`, se agregó la validación que busca coincidencias en `usuarios_tenji` y crea la llave `sesion_tenji` en localStorage.
2. Al inicio del archivo, se agregó el arreglo `paginasProtegidas` y la validación de `window.location.pathname` para redirigir al login si `usuarioActivo` es null.
3. Se agregó un `DOMContentLoaded` que modifica el botón `.botonlogin` de la barra superior para borrar la sesión y redirigir al index.

## Verificación
Se probó ingresar con credenciales inválidas (mostró error) y válidas (permitió el paso al dashboard). Se intentó acceder a `dashboard.html` mediante la URL directa en modo incógnito y el sistema redirigió exitosamente a `login.html`. Finalmente, al hacer clic en "CERRAR SESIÓN", se borró el dato del localStorage y devolvió al inicio.