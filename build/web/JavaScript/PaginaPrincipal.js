//URL BASE
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/SistemaGestionArq';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

function mostrarOpcionesSegunRol() {
    var rol = localStorage.getItem('rol');  

    // Ocultar todas las opciones por defecto
    document.getElementById('catalogoUsuarios').style.display = 'none';
    document.getElementById('catalogoLibros').style.display = 'none';
    document.getElementById('busquedaLibros').style.display = 'none';

    // Mostrar las opciones según el rol
    if (rol === 'admin') {
        document.getElementById('catalogoUsuarios').style.display = 'block';
    } else if (rol === 'bibliotecario') {
        document.getElementById('catalogoLibros').style.display = 'block';
    } else if (rol === 'alumno') {
        document.getElementById('busquedaLibros').style.display = 'block';
    }
}

function cerrarSesion() {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');

    if (!usuario || !token) {
        console.error('No se encontraron usuario o token en el localStorage');
        return;
    }

    fetch(BASE_URL + '/api/login/cerrar', {
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


function verificarToken() {
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = BASE_URL + '/index.html';
    }
}

window.onload = function () {
    verificarToken();
    startTime();
    mostrarOpcionesSegunRol();
};

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

function startTime() {
    const today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12; // the hour '0' should be '12'
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = h + ":" + m + ":" + s + " " + ampm;
    setTimeout(startTime, 1000);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }
    ;  // Add zero in front of numbers < 10
    return i;
}



