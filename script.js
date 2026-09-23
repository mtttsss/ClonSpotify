
document.addEventListener('keyup', (e) => {
    if (e.target.matches('.buscador input')) {
        document.querySelectorAll('.portadas').forEach((portadas) => {
            portadas.textContent.toLowerCase().includes(e.target.value)
                ? portadas.classList.remove('filtro')
                : portadas.classList.add('filtro');
        });
    }
});

//esto es para la busqueda
//solo se puede buscar en minisculas, si se busca en mayusculas no funciona
