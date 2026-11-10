// [IA] inicio · ia/2026-11-09_mtttsss_api-obtener-canciones.md

// Tiempo de espera simulado: 500 milisegundos
const LATENCIA = 500;

function esperar(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// [IA] fin


// [IA] inicio · ia/2026-11-09_mtttsss_api-obtener-canciones.md

export async function obtenerCanciones({
    busqueda = "",
    genero = "",
    ordenarPor = ""
    } = {}){
    
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

        let canciones = await respuesta.json();

        // [IA] fin

        // [IA] inicio · ia/2026-11-10_mtttsss_api-busqueda-canciones.md

        if (busqueda) {
            canciones = canciones.filter((cancion) => {
                return (
                    cancion.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                    cancion.artista.toLowerCase().includes(busqueda.toLowerCase())
                );
            });
        }

        // [IA] fin

        // [IA] inicio · ia/2026-11-10_mtttsss_api-filtro-genero.md

        if (genero) {
            canciones = canciones.filter((cancion) => {
                return cancion.genero.toLowerCase() === genero.toLowerCase();
            });
        }

        // [IA] fin
        
        if (ordenarPor === "duracion") {
            canciones.sort((a, b) => a.duracion - b.duracion);
        }

        // sirve para ordenar por que cancion dura mas

         if (ordenarPor === "titulo") {
            canciones.sort((a, b) =>
                a.titulo.localeCompare(b.titulo, "es")
            );
        }
        
        // sirve para ordenar por titulo de la cancion

        if (ordenarPor === "artista") {
            canciones.sort((a, b) =>
                a.artista.localeCompare(b.artista, "es")
            );
        }

        // sirve para ordenar por artista de la cancion

        // [IA] inicio · ia/2026-11-09_mtttsss_api-obtener-canciones.md

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
