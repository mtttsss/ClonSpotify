//toasts

const mostrarToast = (mensaje, tipo = 'exito') => {
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }

    const toast = document.createElement('div');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('oculto');
        setTimeout(() => toast.remove(), 400);
    }, 2500);
};



export { mostrarToast };
