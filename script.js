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
    
    if (usuarioActivo) {
        if (btnIrLogin) btnIrLogin.style.display = 'none';
        if (btnPerfil) btnPerfil.style.display = 'block';
    }

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

    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (event) => {
            event.preventDefault();
            localStorage.removeItem('sesion_tenji'); 
            window.location.href = 'index.html'; 
        });
    }
    
});
 // [IA] fin 

document.addEventListener('keyup', (e) => {
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

const botonLike = document.querySelector('.like');

if (botonLike) {
    botonLike.addEventListener('click', (e) => {
        if (botonLike.textContent === '♡') {
            botonLike.textContent = '♥';
            botonLike.style.color = '#5e17eb';
        } else {
            botonLike.textContent = '♡';
            botonLike.style.color = '#fff';
        }
    });
}

// que se rellene el boton del like al hacer click

const botonPlay = document.querySelector('.play');

if (botonPlay) {

    botonPlay.addEventListener('click', (e) => {

        if (botonPlay.textContent === '▶') {
            botonPlay.textContent = '⏸';
        } else {
            botonPlay.textContent = '▶';
        }

    });

}

// que se cambie el boton de play a pause al hacer click


const selectorImagen = document.querySelector('.info-cancion img');
const selectorNombre = document.querySelector('.reproductorTitulo');
const selectorArtista = document.querySelector('.reproductorArtista');


const albumes = document.querySelectorAll('.portadas');

albumes.forEach((album) => {

    album.addEventListener('click', () => {

        const imagen = album.querySelector('img');
        const nombre = album.querySelector('.albumTitulo');
        const artista = album.querySelector('.albumArtista');

        if (imagen && nombre && artista) {

            selectorImagen.src = imagen.src;
            selectorNombre.textContent = nombre.textContent;
            selectorArtista.textContent = artista.textContent;

        }

    });

});




const formLogin = document.getElementById('formLogin');

if (formLogin) {


    formLogin.addEventListener('submit', (event) => {

        event.preventDefault();
    
        const correo = document.getElementById('correo');
        const password = document.getElementById('password');
   
        const errorCorreo = document.getElementById('errorCorreo');
        const errorPassword = document.getElementById('errorPassword');
        
        errorCorreo.textContent = '';
        errorPassword.textContent = '';

        let formularioValido = true;

        if (correo.value.trim() === '') {
            errorCorreo.textContent =
                'Debes ingresar tu correo o nombre de usuario';

            formularioValido = false;
        }

        if (password.value.trim() === '') {
            errorPassword.textContent =
                'Debes ingresar tu contraseña';

            formularioValido = false;
        }

        const botonLogin = formLogin.querySelector('.botonlogin');

        if (formularioValido) {
            botonLogin.disabled = true;
            botonLogin.textContent = 'Iniciando sesión...';
            botonLogin.style.opacity = '0.7';
            botonLogin.style.cursor = 'not-allowed';

            // [IA] inicio · ia/2026-11-09_daviidcjcj_implementaciones_validacion_login.md

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
                // [IA] fin

            }, 1000);
        }

    });

}

const formRegister = document.getElementById('formRegister');

if (formRegister) {

    formRegister.addEventListener('submit', (event) => {

        event.preventDefault();

        const correo = document.getElementById('correo');
        const password = document.getElementById('password');
        const nombre = document.getElementById('nombre');

        const errorCorreo = document.getElementById('errorCorreo');
        const errorPassword = document.getElementById('errorPassword');
        const errorNombre = document.getElementById('errorNombre');

        errorCorreo.textContent = '';
        errorPassword.textContent = '';
        errorNombre.textContent = '';

        let formularioValido = true;

        if (correo.value.trim() === '') {
            errorCorreo.textContent = 'Debes ingresar un correo';
            formularioValido = false;
        } else if (correo.validity.typeMismatch) {
            errorCorreo.textContent = 'Ingresa un correo válido';
            formularioValido = false;
        }

        if (password.value.trim() === '') {
            errorPassword.textContent = 'Debes ingresar una contraseña';
            formularioValido = false;
        } else if (password.value.length < 8) {
            errorPassword.textContent = 'Mínimo 8 caracteres';
            formularioValido = false;
        }

        if (nombre.value.trim() === '') {
            errorNombre.textContent = 'Debes ingresar un usuario';
            formularioValido = false;
        }

        const botonRegistro = formRegister.querySelector('.botonregistro');

        if (formularioValido) {
            // 1. Deshabilitar el botón y cambiar su estado visual
            botonRegistro.disabled = true;
            botonRegistro.textContent = 'Procesando...';
            botonRegistro.style.opacity = '0.7';
            botonRegistro.style.cursor = 'not-allowed';

            // [IA] inicio · ia/2026-11-09_daviidcjcj_implementaciones_validacion_login.md

            let usuarios = JSON.parse(localStorage.getItem('usuarios_tenji')) || [];

            const usuarioExiste = usuarios.find(u => u.correo === correo.value);

            if (usuarioExiste) {
                setTimeout(() => {
                    errorCorreo.textContent = 'Este correo ya está registrado.';
                    botonRegistro.disabled = false;
                    botonRegistro.textContent = 'Registrarse';
                    botonRegistro.style.opacity = '1';
                    botonRegistro.style.cursor = 'pointer';
                }, 500);
            } else {
                usuarios.push({
                    nombre: nombre.value,
                    correo: correo.value,
                    password: password.value
                });
                localStorage.setItem('usuarios_tenji', JSON.stringify(usuarios));

                // [IA] fin
                
                setTimeout(() => {
                    botonRegistro.style.backgroundColor = '#28a745'; 
                    botonRegistro.textContent = '¡Registro exitoso! Redirigiendo...';
                    
                    setTimeout(() => {
                        window.location.href = 'login.html'; 
                    }, 1000);
                }, 1500);
            }
        }

    });

}

// toggle de contraseña 

const btnMostrarClave = document.getElementById('btnMostrarClave');
const inputPassword = document.getElementById('password');

if (btnMostrarClave && inputPassword) {
    btnMostrarClave.addEventListener('click', () => {
        if (inputPassword.type === 'password') {
            inputPassword.type = 'text';
            btnMostrarClave.textContent = '🔒';
        } else {
            inputPassword.type = 'password';
            btnMostrarClave.textContent = '🔓';
        }
    });
}

// modal para crear playlist 

document.addEventListener('DOMContentLoaded', () => {
    const btnCrearPlaylist = document.getElementById('btnCrearPlaylist');
    const modalPlaylist = document.getElementById('modalPlaylist');
    const btnCancelarModal = document.getElementById('btnCancelarModal');
    const btnGuardarModal = document.getElementById('btnGuardarModal');
    const inputNombrePlaylist = document.getElementById('nombrePlaylist');

    if (btnCrearPlaylist && modalPlaylist) {
        btnCrearPlaylist.addEventListener('click', () => {
            modalPlaylist.classList.remove('oculto');
            if (inputNombrePlaylist) inputNombrePlaylist.focus();
        });

        const cerrarModal = () => {
            modalPlaylist.classList.add('oculto');
            if (inputNombrePlaylist) inputNombrePlaylist.value = '';
            if (btnGuardarModal) btnGuardarModal.textContent = 'Crear';
        };

        if (btnCancelarModal) {
            btnCancelarModal.addEventListener('click', cerrarModal);
        }

        modalPlaylist.addEventListener('click', (event) => {
            if (event.target === modalPlaylist) {
                cerrarModal();
            }
        });

        if (btnGuardarModal && inputNombrePlaylist) {
            btnGuardarModal.addEventListener('click', () => {
                if (inputNombrePlaylist.value.trim() !== '') {
                    btnGuardarModal.textContent = 'Creando...';
                    
                    setTimeout(() => {
                        cerrarModal();
                    }, 1000);
                }
            });
        }
    }
});

// [IA] inicio - 2026-11-10_cristoballopez3-modo_claro.md

document.addEventListener('DOMContentLoaded', () => {
    const toggleClaro = document.getElementById('toggle-modo-claro');

    if (localStorage.getItem('tema') === 'claro') {
        document.body.classList.add('modo-claro');
        if (toggleClaro) {
            toggleClaro.checked = true;
        }
    }
    
    if (toggleClaro) {
        toggleClaro.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('modo-claro');
                localStorage.setItem('tema', 'claro'); 
            } else {
                document.body.classList.remove('modo-claro');
                localStorage.setItem('tema', 'oscuro'); 
            }
        });
    }
});

// [IA] fin





