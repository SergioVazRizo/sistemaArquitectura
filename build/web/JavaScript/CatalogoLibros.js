let libroEditando = null;

// URL BASE
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/SistemaGestionArq/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

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

function previewPDF(event) {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
        const fileURL = URL.createObjectURL(file);
        const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
        const pdfPreview = document.getElementById("pdfPreview");

        pdfPreview.src = fileURL;
        pdfPreviewContainer.style.display = "block";
    } else {
        alert("Por favor, selecciona un archivo PDF válido.");
    }
}

function removePDF() {
    const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
    const pdfPreview = document.getElementById("pdfPreview");
    const fileInput = document.getElementById("pfd_libro");

    pdfPreview.src = "";  
    pdfPreviewContainer.style.display = "none";  
    fileInput.value = "";  
}

async function cargarLibros() {
    const response = await fetch(BASE_URL + "api/libro/getAllLibros");
    const libros = await response.json();
    const tablaLibro = document.getElementById("tablaLibro");
    tablaLibro.innerHTML = ""; // Limpiar tabla

    libros.forEach(libro => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${libro.cve_libro}</td>
            <td>${libro.nombre_libro}</td>
            <td>${libro.autor_libro}</td>
            <td>${libro.genero_libro}</td>
            <td>${libro.estatus}</td>
            <td>
                <button onclick="seleccionarLibro(${libro.cve_libro}, '${libro.nombre_libro}', '${libro.autor_libro}', '${libro.genero_libro}','${libro.estatus}','${libro.pdf_libro}')">Editar <i class='bx bxs-edit-alt'></i></button>
            </td>
        `;
        tablaLibro.appendChild(row);
    });
}

function seleccionarLibro(cve_libro, nombre_libro, autor_libro, genero_libro, estatus, pdf_base64) {
    document.getElementById("nombre_libro").value = nombre_libro;
    document.getElementById("autor_libro").value = autor_libro;
    document.getElementById("genero_libro").value = genero_libro;
    document.getElementById("estatus").value = estatus;

    // Almacenar la clave del libro en una variable global
    libroEditando = cve_libro;

    // Decodificar y mostrar el PDF en la vista previa si existe
    if (pdf_base64) {
        const fileURL = `data:application/pdf;base64,${pdf_base64}`;
        const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
        const pdfPreview = document.getElementById("pdfPreview");

        pdfPreview.src = fileURL;
        pdfPreviewContainer.style.display = "block"; 
    } else {
        removePDF(); 
    }
}

// Función para convertir base64 a Blob
function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
}

async function agregarLibro() {
    const fileInput = document.getElementById("pfd_libro");
    const file = fileInput.files[0];

    if (!file) {
        Swal.fire("Error", "Por favor, selecciona un archivo", "error");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async function () {
        const base64String = reader.result.split(',')[1];

        const response = await fetch(BASE_URL + "api/libro/agregarLibro", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `nombre_libro=${encodeURIComponent(document.getElementById("nombre_libro").value)}&` +
                    `autor_libro=${encodeURIComponent(document.getElementById("autor_libro").value)}&` +
                    `genero_libro=${encodeURIComponent(document.getElementById("genero_libro").value)}&` +
                    `estatus=${encodeURIComponent(document.getElementById("estatus").value)}&` +
                    `pdf_libro=${encodeURIComponent(base64String)}`
        });

        const result = await response.json();

        if (response.ok) {
            Swal.fire("Éxito", "El libro se ha guardado correctamente", "success");
            limpiarFormulario();
            await cargarLibros();
        } else {
            Swal.fire("Error", result.error || "Hubo un problema al guardar el libro", "error");
        }
    };

    reader.readAsDataURL(file);
}

async function editarLibro() {
    if (libroEditando === null)
        return; // Verificar si hay un libro en edición

    const fileInput = document.getElementById("pfd_libro");
    const file = fileInput.files[0];
    let pdf_libro = null;

    if (file) {
        const reader = new FileReader();
        reader.onloadend = async function () {
            pdf_libro = reader.result.split(',')[1]; // Extraer solo la parte Base64
            await actualizarLibro(libroEditando, pdf_libro); // Actualizar libro con el nuevo PDF
        };
        reader.readAsDataURL(file); // Leer el archivo como Data URL
    } else {
        // Si no se selecciona un nuevo archivo, intentar obtener el PDF actual del elemento de vista previa
        const currentPdf = document.getElementById("pdfPreview").src;
        if (currentPdf.startsWith("data:application/pdf;base64,")) {
            const base64 = currentPdf.split(',')[1]; // Extraer solo la parte Base64
            await actualizarLibro(libroEditando, base64); // Actualizar libro con el PDF actual
        } else {
            await actualizarLibro(libroEditando); // Actualizar sin cambiar el PDF
        }
    }
}

// Función para actualizar un libro
async function actualizarLibro(cve_libro, pdf_libro) {
    const response = await fetch(BASE_URL + `api/libro/editarLibro/${cve_libro}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `nombre_libro=${encodeURIComponent(document.getElementById("nombre_libro").value)}&` +
                `autor_libro=${encodeURIComponent(document.getElementById("autor_libro").value)}&` +
                `genero_libro=${encodeURIComponent(document.getElementById("genero_libro").value)}&` +
                `estatus=${encodeURIComponent(document.getElementById("estatus").value)}&` +
                (pdf_libro ? `pdf_libro=${encodeURIComponent(pdf_libro)}` : '')
    });

    const result = await response.json(); // Obtener respuesta en formato JSON

    if (response.ok) {
        Swal.fire("Éxito", "El libro se ha actualizado correctamente", "success");
        limpiarFormulario();
        await cargarLibros();
    } else {
        Swal.fire("Error", result.error || "Hubo un problema al actualizar el libro", "error");
    }
}

function limpiarFormulario() {
    document.getElementById("nombre_libro").value = "";
    document.getElementById("autor_libro").value = "";
    document.getElementById("genero_libro").value = "";
    document.getElementById("pfd_libro").value = "";
    document.getElementById("estatus").value = "";
    removePDF();
    libroEditando = null;
}

window.onload = function () {
    verificarToken();
    cargarLibros();
}