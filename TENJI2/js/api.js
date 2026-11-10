
// [IA] inicio · ia/2026-11-09_mtttsss_api-obtener-canciones.md

// Tiempo de espera simulado: 500 milisegundos
const LATENCIA = 500;


function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


export async function obtenerCanciones({ busqueda = "", genero = "" } = {}) {
    await esperar(LATENCIA);

    try {
        const respuesta = await fetch("./mocks/canciones.json");

        if (!respuesta.ok) {
            return {
                ok: false,
                status: respuesta.status,
                data: null,
                error: "No se pudieron cargar las canciones"
            };
        }

        // [IA] fin

        let canciones = await respuesta.json();

        if (busqueda) {
    canciones = canciones.filter((cancion) => {
        return (
            cancion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
            cancion.artista.toLowerCase().includes(busqueda.toLowerCase())
                );
            });
        }

        if (genero) {
            canciones = canciones.filter((cancion) => {
                return cancion.genero.toLowerCase() === genero.toLowerCase();
            });
        }

        // [IA] inicio

        return {
            ok: true,
            status: 200,
            data: canciones,
            error: null
        };

    } catch (error) {
        return {
            ok: false,
            status: 500,
            data: null,
            error: "Ocurrió un error al cargar las canciones"
        };
    }
}

// [IA] fin
