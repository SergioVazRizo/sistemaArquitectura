
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/SistemaGestionArq/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

function verificarToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = BASE_URL + 'index.html';
    }
}

function cerrarSesion() {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuario || !token) {
        console.error('No se encontraron usuario o token en el localStorage');
        return;
    }

    fetch(BASE_URL + 'api/login/cerrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'usuario=' + encodeURIComponent(usuario) + '&token=' + encodeURIComponent(token)
    })
            .then(response => {
                if (response.ok) {
                    // Remover usuario, token y rol del localStorage
                    localStorage.removeItem('usuario');
                    localStorage.removeItem('token');
                    localStorage.removeItem('rol'); // Eliminar el rol del localStorage

                    Swal.fire({
                        title: 'Sesión cerrada',
                        text: 'exitosamente',
                        icon: 'success'
                    }).then(() => {
                        window.location.href = BASE_URL + '/index.html';
                    });
                } else {
                    throw new Error('Error al cerrar sesión');
                }
            })
            .catch(error => {
                console.error(error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al cerrar sesión',
                    icon: 'error'
                });
            });
}


document.addEventListener('DOMContentLoaded', function () {
    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (event) {
            event.preventDefault();

            Swal.fire({
                title: '¿Estás seguro de que deseas salir?',
                text: 'Tu sesión actual se cerrará',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, salir',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    cerrarSesion();
                }
            });
        });
    }
});

window.onload = function () {
    verificarToken();
    cargarUsuarios();
}

//Funciones propias
let paginaActual = 0;
const usuariosPorPagina = 10;

function cargarPaginaAnterior() {
    if (paginaActual > 0) {
        paginaActual--;
        cargarUsuarios();
    }
}

function cargarPaginaSiguiente() {
    paginaActual++;
    cargarUsuarios();
}

function cargarUsuarios() {
    const inicio = paginaActual * usuariosPorPagina;
    fetch(BASE_URL + `api/usuario/getAllUsuariosPaginados?inicio=${inicio}&cantidad=${usuariosPorPagina}`)
            .then(response => response.json())
            .then(data => {
                const tablaUsuarios = document.getElementById('tablaUsuarios');
                tablaUsuarios.innerHTML = ''; // Limpiar tabla

                data.forEach(usuario => {
                    const row = `
                <tr>
                    <td>${usuario.cve_usuario}</td>
                    <td>${usuario.usuario}</td>
                    <td>${usuario.password}</td>
                    <td>${usuario.a_paterno}</td>
                    <td>${usuario.a_materno}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.rol}</td>
                    <td>
                        <button type="button" class="btn btn-info" onclick="seleccionarUsuario('${usuario.usuario}', '${usuario.password}', ${usuario.cve_usuario}, '${usuario.a_paterno}', '${usuario.a_materno}', '${usuario.nombre}', '${usuario.rol}')" data-id="${usuario.cve_usuario}"><i class='bx bxs-select-multiple'></i></button>
                    </td>
                </tr>
            `;
                    tablaUsuarios.innerHTML += row;
                });
            })
            .catch(error => {
                console.error('Error al cargar usuarios:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al cargar usuarios',
                    icon: 'error'
                });
            });
}

function buscarUsuario() {
    const searchInput = document.getElementById('search-input').value.trim().toLowerCase();
    fetch(BASE_URL + `api/usuario/buscarUsuario?query=${searchInput}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                const tablaUsuarios = document.getElementById('tablaUsuarios');
                tablaUsuarios.innerHTML = ''; // Limpiar tabla

                data.forEach(usuario => {
                    const row = `
                    <tr>
                        <td>${usuario.cve_usuario}</td>
                        <td>${usuario.usuario}</td>
                        <td>${usuario.password}</td>
                        <td>${usuario.a_paterno}</td>
                        <td>${usuario.a_materno}</td>
                        <td>${usuario.nombre}</td>
                        <td>${usuario.rol}</td>
                        <td>
                            <button type="button" class="btn btn-info" onclick="seleccionarUsuario('${usuario.usuario}', '${usuario.password}', ${usuario.cve_usuario}, '${usuario.a_paterno}', '${usuario.a_materno}', '${usuario.nombre}', '${usuario.rol}')" data-id="${usuario.cve_usuario}"><i class='bx bxs-select-multiple'></i></button>
                        </td>
                    </tr>
                `;
                    tablaUsuarios.innerHTML += row;
                });
            })
            .catch(error => {
                console.error('Error al buscar usuarios:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al buscar usuarios',
                    icon: 'error'
                });
            });
}


function agregarUsuario() {
    if (!validarFormulario()) {
        return;
    }

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const a_paterno = document.getElementById('a_paterno').value;
    const a_materno = document.getElementById('a_materno').value;
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;

    fetch(BASE_URL + 'api/usuario/agregarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}&a_paterno=${encodeURIComponent(a_paterno)}&a_materno=${encodeURIComponent(a_materno)}&nombre=${encodeURIComponent(nombre)}&rol=${encodeURIComponent(rol)}`
    })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Usuario agregado correctamente',
                        icon: 'success'
                    }).then(() => {
                        cargarUsuarios();
                        limpiarFormulario();
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo agregar el usuario',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error al agregar usuario:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al agregar el usuario',
                    icon: 'error'
                });
            });
}

function editarUsuario() {
    const idUsuario = obtenerIdUsuarioSeleccionado();
    if (!idUsuario) {
        console.error('No se ha seleccionado ningún usuario para editar');
        return;
    }

    if (!validarFormulario()) {
        return;
    }

    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const a_paterno = document.getElementById('a_paterno').value;
    const a_materno = document.getElementById('a_materno').value;
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;

    fetch(BASE_URL + 'api/usuario/editarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `cve_usuario=${encodeURIComponent(idUsuario)}&usuario=${encodeURIComponent(usuario)}&password=${encodeURIComponent(password)}&a_paterno=${encodeURIComponent(a_paterno)}&a_materno=${encodeURIComponent(a_materno)}&nombre=${encodeURIComponent(nombre)}&rol=${encodeURIComponent(rol)}`
    })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    Swal.fire({
                        title: 'Éxito',
                        text: 'Usuario editado correctamente',
                        icon: 'success'
                    }).then(() => {
                        cargarUsuarios();
                        limpiarFormulario();
                        localStorage.removeItem('selectedUserId');
                    });
                } else {
                    Swal.fire({
                        title: 'Error',
                        text: 'No se pudo editar el usuario',
                        icon: 'error'
                    });
                }
            })
            .catch(error => {
                console.error('Error al editar usuario:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al editar el usuario',
                    icon: 'error'
                });
            });
}

function seleccionarUsuario(usuario, password, idUsuario, a_paterno, a_materno, nombre, rol) {
    document.getElementById('usuario').value = usuario;
    document.getElementById('password').value = password;
    document.getElementById('a_paterno').value = a_paterno;
    document.getElementById('a_materno').value = a_materno;
    document.getElementById('nombre').value = nombre;
    document.getElementById('rol').value = rol;
    localStorage.setItem('selectedUserId', idUsuario);
}

function obtenerIdUsuarioSeleccionado() {
    return localStorage.getItem('selectedUserId');
}

function limpiarFormulario() {
    document.getElementById('usuario').value = '';
    document.getElementById('password').value = '';
    document.getElementById('a_paterno').value = '';
    document.getElementById('a_materno').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('rol').value = '';
    document.getElementById('search-input').value = '';
}

function validarFormulario() {
    const a_paterno = document.getElementById('a_paterno').value;
    const a_materno = document.getElementById('a_materno').value;
    const nombre = document.getElementById('nombre').value;
    const rol = document.getElementById('rol').value;


    if (
            a_paterno.trim() === '' ||
            a_materno.trim() === '' ||
            nombre.trim() === '' ||
            rol.trim() === ''
            ) {
        Swal.fire({
            title: 'Advertencia',
            text: 'Faltan Datos, la extensión no es numérica o el email no es válido',
            icon: 'warning'
        });
        return false;
    }

    return true;
}