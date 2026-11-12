// menu hamburguesa
// [IA] inicio - ia/2026-11-11_cristoballopez3-menu_hamburguesa.md
document.addEventListener('DOMContentLoaded', () => {
    const btnHamburguesa = document.getElementById('btnHamburguesa');
    const barra = document.querySelector('.barra');

    if (btnHamburguesa && barra) {
        btnHamburguesa.addEventListener('click', () => {
            const abierto = barra.classList.toggle('menu-abierto');
            btnHamburguesa.setAttribute('aria-expanded', abierto);
            btnHamburguesa.textContent = abierto ? '✕' : '☰';   // ← nueva
        });
    }
});
// [IA] inicio