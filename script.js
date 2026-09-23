
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

botonLike.addEventListener('click', (e) => {
    if (botonLike.textContent === '♡') {
        botonLike.textContent = '♥';
        botonLike.style.color = '#5e17eb';
    } else {
        botonLike.textContent = '♡';
        botonLike.style.color = '#fff';
    }
});

// que se rellene el boton del like al hacer click