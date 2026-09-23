
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

const botonPlay = document.querySelector('.play');

botonPlay.addEventListener('click', (e) => {
    if (botonPlay.textContent === '▶') {
        botonPlay.textContent = '⏸';
    } else {
        botonPlay.textContent = '▶';
    }
});

// que se cambie el boton de play a pause al hacer click


const selectorImagen = document.querySelector('.info-cancion img');
const selectorNombre = document.querySelector('.reproductorTitulo');
const selectorArtista = document.querySelector('.reproductorArtista');

const albumes = document.querySelectorAll('.portadas');

albumes.forEach((album) => {
    album.addEventListener('click', (e) => {
        const imagen = album.querySelector('img').src;
        const nombre = album.querySelector('.albumTitulo').textContent;
        const artista = album.querySelector('.albumArtista').textContent;

        selectorImagen.src = imagen;
        selectorNombre.textContent = nombre;
        selectorArtista.textContent = artista;
    });
}); 
