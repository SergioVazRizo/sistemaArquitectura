function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/SistemaGestionArq/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

document.getElementById('searchBtn').addEventListener('click', function () {
    const query = document.getElementById('searchInput').value;
    fetchBooks(query);
});


document.getElementById('clearBtn').addEventListener('click', function () {
    clearResults();
});

function clearResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; // Limpiar resultados
    document.getElementById('searchInput').value = ''; // Limpiar el input
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

document.getElementById('viewAllBtn').addEventListener('click', function () {
    fetchAllBooks();
});

async function fetchAllBooks() {
    try {
        const response = await fetch(`${BASE_URL}api/libro/getAllLibrosTodos`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.status}`);
        }
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error fetching all books:', error);
    }
}


async function fetchBooks(query) {
    try {
        const response = await fetch(`${BASE_URL}api/libro/buscarLibroPorNombreTodos/${query}`);
        if (!response.ok) {
            throw new Error(`Error en la red: ${response.status}`);
        }
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

function displayResults(books) {
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = ''; 

    if (books.length === 0) {
        resultsContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    books.forEach(libro => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        // Convertir el estatus
        let estado = libro.estatus === 'Activo' ? 'Disponible' : 'Prestado';

        resultItem.innerHTML = `
            <h3>${libro.nombreL}</h3>
            <p>Autor: ${libro.autor}</p>
            <p>Genero: ${libro.genero}</p>
            <h5>${estado}</h5>
            <h4>${libro.universidad}</h4>
            <button onclick="previewPDF('${libro.pdf}')">Visualizar <i class='bx bx-show-alt'></i></button>
        `;
        resultsContainer.appendChild(resultItem);
    });
}

//function previewPDF(base64) {
//    const modal = document.getElementById('pdfModal');
//    const pdfPreviewModal = document.getElementById('pdfPreviewModal');
//
//    // Crear un Blob a partir del base64 y mostrarlo en el iframe
//    const byteCharacters = atob(base64);
//    const byteNumbers = new Array(byteCharacters.length);
//    for (let i = 0; i < byteCharacters.length; i++) {
//        byteNumbers[i] = byteCharacters.charCodeAt(i);
//    }
//    const byteArray = new Uint8Array(byteNumbers);
//    const blob = new Blob([byteArray], {type: 'application/pdf'});
//    const fileURL = URL.createObjectURL(blob);
//
//    pdfPreviewModal.src = fileURL;
//    modal.style.display = "block"; // Muestra el modal
//}

function isValidBase64(str) {
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
}

function previewPDF(pdfBase64) {
    try {
        // Elimina el prefijo si existe
        if (pdfBase64.startsWith("data:application/pdf;base64,")) {
            pdfBase64 = pdfBase64.replace("data:application/pdf;base64,", "");
        }

        // Validar que solo contenga caracteres Base64 válidos
        if (!isValidBase64(pdfBase64)) {
            console.error("La cadena Base64 contiene caracteres no válidos.");
            return;
        }

        // Convertir la cadena Base64 a bytes
        const byteCharacters = atob(pdfBase64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        // Crear un Blob a partir del arreglo de bytes
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        
        // Abrir una nueva ventana y mostrar el PDF
        const pdfWindow = window.open();
        if (pdfWindow) {
            pdfWindow.document.write(
                `<iframe src="${blobUrl}" width="100%" height="100%"></iframe>`
            );
        } else {
            console.error("No se pudo abrir la ventana.");
        }
    } catch (error) {
        console.error("Error al intentar previsualizar el PDF:", error);
    }
}

function closeModal() {
    const modal = document.getElementById('pdfModal');
    const pdfPreviewModal = document.getElementById('pdfPreviewModal');

    pdfPreviewModal.src = ''; // Limpia el iframe
    modal.style.display = "none"; // Oculta el modal
}

// Cierra el modal al hacer clic fuera de su contenido
window.onclick = function (event) {
    const modal = document.getElementById('pdfModal');
    if (event.target == modal) {
        closeModal();
    }
}

window.onload = function () {
    verificarToken();
}

