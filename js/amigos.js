// [IA] inicio · ia/2026-11-12_daviidcjcj_seccionamigos_usuariosjson.md

import { obtenerUsuarios } from "./api.js";

document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById('contenedor-amigos');
    const estado = document.getElementById('estado-amigos');

    if (!contenedor || !estado) return;

    const sesion = JSON.parse(localStorage.getItem('sesion_tenji'));

    function crearElemento(etiqueta, clase, texto) {
        const elemento = document.createElement(etiqueta);
        if (clase) elemento.className = clase;
        if (texto !== undefined) elemento.textContent = texto;
        return elemento;
    }

    function esElMismoUsuario(usuario) {
        if (!sesion) return false;
        return usuario.correo === sesion.correo;
    }

    function pintarAmigos(amigos) {
        contenedor.replaceChildren();

        amigos.forEach((amigo) => {
            const tarjeta = crearElemento('article', 'portadas portadas-centradas');

            const foto = crearElemento('img', 'foto-redonda');
            foto.src = amigo.avatar;
            foto.alt = `Foto de ${amigo.nombre}`;

            tarjeta.appendChild(foto);
            tarjeta.appendChild(crearElemento('h4', '', amigo.nombre));

            contenedor.appendChild(tarjeta);
        });
    }

    function mostrarError(mensaje) {
        contenedor.replaceChildren();
        estado.textContent = mensaje + ' ';

        const botonReintentar = crearElemento('button', 'btn-perfil', 'Reintentar');
        botonReintentar.addEventListener('click', cargarAmigos);
        estado.appendChild(botonReintentar);
    }

    async function cargarAmigos() {
        estado.textContent = 'Cargando amistades...';
        contenedor.replaceChildren();

        try {
            const respuesta = await obtenerUsuarios();

            if (!respuesta.ok) {
                mostrarError(respuesta.error);
                return;
            }

            const amigos = respuesta.data.filter((u) => !esElMismoUsuario(u));

            if (amigos.length === 0) {
                estado.textContent = 'Aún no tienes amistades.';
                return;
            }

            estado.textContent = '';
            pintarAmigos(amigos);
        } catch (error) {
            console.error('Error al cargar amigos:', error);
            mostrarError('Ocurrió un error al cargar tus amistades.');
        }
    }

    cargarAmigos();
});

// [IA] fin