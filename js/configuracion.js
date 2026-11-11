// [IA] inicio - 2026-11-10_cristoballopez3-modo_claro.md

document.addEventListener('DOMContentLoaded', () => {
    const toggleClaro = document.getElementById('toggle-modo-claro');
    const esPaginaAuth = document.body.classList.contains('bodylogin') || document.body.classList.contains('bodyregistro');

    if (esPaginaAuth) {
        document.body.classList.remove('modo-claro');
        return;
    }

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


