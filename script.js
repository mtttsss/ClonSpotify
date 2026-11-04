
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

// para que se visualice en la barra inferior


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

        if (formularioValido) {
            window.location.href = 'index.html';
        }

    });

}

// Validacion del login con el JavaScript


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

        if (formularioValido) {
            window.location.href = 'index.html';
        }

    });

}



