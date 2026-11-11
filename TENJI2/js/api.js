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
} = {}) {

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



export async function obtenerCancion(id) {

    const respuesta = await obtenerCanciones();

    if (!respuesta.ok) {
        return respuesta;
    }

    const cancion = respuesta.data.find((c) => {
        return c.id === id;
    });

    if (!cancion) {
        return {
            ok: false,
            status: 404,
            data: null,
            error: "Canción no encontrada"
        };
    }

    return {
        ok: true,
        status: 200,
        data: cancion,
        error: null
    };
}

// [IA] fin


// CRUD, esta parte es para crear, actualizar y eliminar canciones, esta parte igual que la anterior fue una combinacion de IA con aprendizaje propio
// Al poner los comentarios de [IA] inicio y [IA] fin no quiere decir solo que fue un copy paste, si no que me guiee con la IA, ademas de videos de youtube



export async function obtenerPlaylists() {
    await esperar(LATENCIA);

    try {
        const guardadas = localStorage.getItem("tenji_playlists");

        let playlists;

        if (guardadas !== null) {
            playlists = JSON.parse(guardadas);
        } else {
            const respuesta = await fetch("./mocks/playlists.json");

            if (!respuesta.ok) {
                return {
                    ok: false,
                    status: respuesta.status,
                    data: null,
                    error: "No se pudieron cargar las playlists"
                };
            }

            playlists = await respuesta.json();

            localStorage.setItem(
                "tenji_playlists",
                JSON.stringify(playlists)
            );
        }

        return {
            ok: true,
            status: 200,
            data: playlists,
            error: null
        };

    } catch (error) {
        console.error("Error en obtenerPlaylists:", error);

        return {
            ok: false,
            status: 500,
            data: null,
            error: "Ocurrió un error al cargar las playlists"
        };
    }
}


function guardarPlaylists(playlists) {
    localStorage.setItem(
        "tenji_playlists",
        JSON.stringify(playlists)
    );
}

function validarId(id) {
    return Number.isInteger(id) && id > 0;
}

// Este seria el READ

export async function obtenerPlaylist(id) {

        if (!validarId(id)) {
            return {
                ok: false,
                status: 400,
                data: null,
                error: "El ID de la playlist debe ser un número entero positivo"
            };
        }

        const respuesta = await obtenerPlaylists();

        if (!respuesta.ok) {
            return respuesta;
        }

        const playlist = respuesta.data.find((p) => {
            return p.id === id;
        });

        if (!playlist) {
            return {
                ok: false,
                status: 404,
                data: null,
                error: "Playlist no encontrada"
            };
        }

        return {
            ok: true,
            status: 200,
            data: playlist,
            error: null
        };
    }

    // Este seria el CREATE


    export async function crearPlaylist(datos) {

        const respuesta = await obtenerPlaylists();

        if (!respuesta.ok) {
            return respuesta;
        }

        try {
            const playlists = respuesta.data;


            if (!datos || typeof datos !== "object" ||
                Array.isArray(datos)) {
                return {
                    ok: false,
                    status: 400,
                    data: null,
                    error: "Debes proporcionar datos válidos"
                };
            }

            if (typeof datos.nombre !== "string" ||
                datos.nombre.trim() === "") {
                return {
                    ok: false,
                    status: 400,
                    data: null,
                    error: "Debes ingresar un nombre para la playlist"
                };
            }

            if (datos.descripcion !== undefined &&
                typeof datos.descripcion !== "string") {
                return {
                    ok: false,
                    status: 400,
                    data: null,
                    error: "La descripción debe ser un texto"
                };
            }

            if (datos.usuarioId !== undefined &&
                datos.usuarioId !== null &&
                (!Number.isInteger(datos.usuarioId) || datos.usuarioId <= 0)) {
                return {
                    ok: false,
                    status: 400,
                    data: null,
                    error: "El ID del usuario debe ser un número entero positivo"
                };
            }


            if (datos.cancionIds !== undefined) {

                if (!Array.isArray(datos.cancionIds)) {
                    return {
                        ok: false,
                        status: 400,
                        data: null,
                        error: "Las canciones deben estar en un arreglo"
                    };
                }

                const idsValidos = datos.cancionIds.every((id) => {
                    return Number.isInteger(id) && id > 0;
                });

                if (!idsValidos) {
                    return {
                        ok: false,
                        status: 400,
                        data: null,
                        error: "Los IDs de las canciones deben ser enteros positivos"
                    };
                }
            }


            const nuevoId = playlists.reduce((maximo, playlist) => {
                return Math.max(maximo, playlist.id);
            }, 0) + 1;


            const nuevaPlaylist = {
                id: nuevoId,
                nombre: datos.nombre.trim(),
                descripcion: datos.descripcion ?? "",
                usuarioId: datos.usuarioId ?? null,
                cancionIds: datos.cancionIds ?? []
            };

            playlists.push(nuevaPlaylist);

            guardarPlaylists(playlists);

            return {
                ok: true,
                status: 201,
                data: nuevaPlaylist,
                error: null
            };

        } catch (error) {
            console.error("Error en crearPlaylist:", error);

            return {
                ok: false,
                status: 500,
                data: null,
                error: "No se pudo crear la playlist"
            };
        }
    }

    // Este seria el UPDATE


    export async function editarPlaylist(id, datos) {

        if (!validarId(id)) {
            return {
                ok: false,
                status: 400,
                data: null,
                error: "El ID de la playlist debe ser un número entero positivo"
            };
        }


        const respuesta = await obtenerPlaylists();

        if (!respuesta.ok) {
            return respuesta;
        }

        try {
            const playlists = respuesta.data;

            const playlist = playlists.find((p) => {
                return p.id === id;
            });

            if (!playlist) {
                return {
                    ok: false,
                    status: 404,
                    data: null,
                    error: "Playlist no encontrada"
                };
            }

            if (!datos || typeof datos !== "object" ||
                Array.isArray(datos)) {
                return {
                    ok: false,
                    status: 400,
                    data: null,
                    error: "Debes proporcionar datos válidos"
                };
            }

            if (datos.descripcion !== undefined &&
                typeof datos.descripcion !== "string") {
                return {
                    ok: false,
                    status: 400,
                    data: null,
                    error: "La descripción debe ser un texto"
                };
            }

            if (datos.cancionIds !== undefined) {

                if (!Array.isArray(datos.cancionIds)) {
                    return {
                        ok: false,
                        status: 400,
                        data: null,
                        error: "Las canciones deben estar en un arreglo"
                    };
                }

                const idsValidos = datos.cancionIds.every((id) => {
                    return Number.isInteger(id) && id > 0;
                });

                if (!idsValidos) {
                    return {
                        ok: false,
                        status: 400,
                        data: null,
                        error: "Los IDs de las canciones deben ser enteros positivos"
                    };
                }
            }

            if (datos.nombre !== undefined) {
                if (typeof datos.nombre !== "string" ||
                    datos.nombre.trim() === "") {
                    return {
                        ok: false,
                        status: 400,
                        data: null,
                        error: "El nombre de la playlist no puede estar vacío"
                    };
                }

                playlist.nombre = datos.nombre.trim();
            }

            if (datos.descripcion !== undefined) {
                playlist.descripcion = datos.descripcion;
            }

            if (datos.cancionIds !== undefined) {
                playlist.cancionIds = datos.cancionIds;
            }

            guardarPlaylists(playlists);

            return {
                ok: true,
                status: 200,
                data: playlist,
                error: null
            };

        } catch (error) {
            console.error("Error en editarPlaylist:", error);

            return {
                ok: false,
                status: 500,
                data: null,
                error: "No se pudo editar la playlist"
            };
        }
    }



    // Este seria el DELETE


    export async function eliminarPlaylist(id) {

        if (!validarId(id)) {
            return {
                ok: false,
                status: 400,
                data: null,
                error: "El ID de la playlist debe ser un número entero positivo"
            };
        }

        const respuesta = await obtenerPlaylists();

        if (!respuesta.ok) {
            return respuesta;
        }

        try {
            const playlists = respuesta.data;

            const playlist = playlists.find((p) => {
                return p.id === id;
            });

            if (!playlist) {
                return {
                    ok: false,
                    status: 404,
                    data: null,
                    error: "Playlist no encontrada"
                };
            }


            const playlistsActualizadas = playlists.filter((p) => {
                return p.id !== id;
            });

            guardarPlaylists(playlistsActualizadas);

            return {
                ok: true,
                status: 200,
                data: playlist,
                error: null
            };

        } catch (error) {
            console.error("Error en eliminarPlaylist:", error);

            return {
                ok: false,
                status: 500,
                data: null,
                error: "No se pudo eliminar la playlist"
            };
        }
    }

