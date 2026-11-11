const botonLike = document.querySelector('.like');

if (botonLike) {
    if (localStorage.getItem('like') === 'true') {
        botonLike.textContent = '♥';
        botonLike.style.color = '#5e17eb';
    }

    botonLike.addEventListener('click', () => {
        const activo = botonLike.textContent === '♡';
        botonLike.textContent = activo ? '♥' : '♡';
        botonLike.style.color = activo ? '#5e17eb' : '#fff';
        localStorage.setItem('like', activo);
    });
}

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




