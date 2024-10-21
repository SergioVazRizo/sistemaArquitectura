let libroEditando = null;

// URL BASE
function setBaseURL() {
    const URL_BASE = 'http://localhost:8080/SistemaGestionArq/';
    return URL_BASE;
}

// Llama a la función y almacena el resultado en una constante global
const BASE_URL = setBaseURL();

/*Funcion para que funcione el navbar*/
document.addEventListener('DOMContentLoaded', function () {
    const catalogos = document.getElementById('catalogos');

    catalogos.addEventListener('click', () => {
        catalogos.parentElement.classList.toggle('active');
    });

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
                localStorage.removeItem('usuario');
                localStorage.removeItem('token');
                Swal.fire({
                    title: 'Sesión cerrada',
                    text: 'exitosamente',
                    icon: 'success'
                }).then(() => {
                    window.location.href = BASE_URL + 'SistemaGestion/index.html';
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

    pdfPreview.src = "";  // Limpiar la vista previa del PDF
    pdfPreviewContainer.style.display = "none";  // Ocultar el contenedor de vista previa
    fileInput.value = "";  // Limpiar el input del archivo PDF
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
            <td>
                <button onclick="seleccionarLibro(${libro.cve_libro}, '${libro.nombre_libro}', '${libro.autor_libro}', '${libro.genero_libro}', '${libro.pdf_libro}')">Editar</button>
                <button onclick="eliminarLibro(${libro.cve_libro})">Eliminar</button>
            </td>
        `;
        tablaLibro.appendChild(row);
    });
}

function seleccionarLibro(cve_libro, nombre_libro, autor_libro, genero_libro, pdf_base64) {
    document.getElementById("cve_libro").value = cve_libro;  // Cargar cve_libro
    document.getElementById("nombre_libro").value = nombre_libro;
    document.getElementById("autor_libro").value = autor_libro;
    document.getElementById("genero_libro").value = genero_libro;

    libroEditando = cve_libro; // Guardar la clave del libro que se está editando
    document.getElementById("btnGuardar").innerText = "Editar"; // Cambiar el texto del botón a "Editar"

    // Decodificar y mostrar el PDF en la vista previa si existe
    if (pdf_base64) {
        const fileURL = `data:application/pdf;base64,${pdf_base64}`;
        const pdfPreviewContainer = document.getElementById("pdfPreviewContainer");
        const pdfPreview = document.getElementById("pdfPreview");

        pdfPreview.src = fileURL;
        pdfPreviewContainer.style.display = "block"; // Asegúrate de que el contenedor esté visible
    } else {
        removePDF(); // Llama a la función para limpiar la vista previa si no hay PDF
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
        Swal.fire("Error", "Por favor, selecciona un archivo PDF", "error");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async function () {
        const base64String = reader.result.split(',')[1]; // Extraer solo la parte Base64

        const response = await fetch(BASE_URL + "api/libro/agregarLibro", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `nombre_libro=${encodeURIComponent(document.getElementById("nombre_libro").value)}&` +
                    `autor_libro=${encodeURIComponent(document.getElementById("autor_libro").value)}&` +
                    `genero_libro=${encodeURIComponent(document.getElementById("genero_libro").value)}&` +
                    `pdf_libro=${encodeURIComponent(base64String)}`
        });

        const result = await response.json(); // Obtener respuesta en formato JSON

        if (response.ok) {
            Swal.fire("Éxito", "El libro se ha guardado correctamente", "success");
            limpiarFormulario(); // Limpiar el formulario después de guardar
            await cargarLibros(); // Recargar la tabla
        } else {
            Swal.fire("Error", result.error || "Hubo un problema al guardar el libro", "error");
        }
    };

    reader.readAsDataURL(file); // Leer el archivo como Data URL
}

async function editarLibro() {
    if (libroEditando === null) return; // Verificar si hay un libro en edición

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

// Función para eliminar un libro
async function eliminarLibro(cve_libro) {
    try {
        const response = await fetch(`${BASE_URL}api/libro/eliminarLibro/${cve_libro}`, {
            method: 'DELETE'
        });

        const result = await response.json(); // Obtener respuesta en formato JSON

        if (response.ok) {
            Swal.fire("Éxito", "El libro se ha eliminado correctamente", "success");
            await cargarLibros(); // Recargar la tabla
        } else {
            Swal.fire("Error", result.error || "Hubo un problema al eliminar el libro", "error");
        }
    } catch (error) {
        Swal.fire("Error", "Hubo un problema en la conexión", "error");
    }
}
                
function limpiarFormulario() {
    document.getElementById("nombre_libro").value = "";
    document.getElementById("autor_libro").value = "";
    document.getElementById("genero_libro").value = "";
    document.getElementById("pfd_libro").value = "";
    removePDF(); // Limpiar la vista previa del PDF
    libroEditando = null; // Reiniciar la variable de edición
}

window.onload = function () {
    verificarToken();
    cargarLibros();
}