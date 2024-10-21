package org.cqrs;

import java.sql.SQLException;
import org.dao.LibroDAO;
import org.model.Libro;

public class LibroCommand {
    private final LibroDAO libroDAO;

    public LibroCommand() {
        this.libroDAO = new LibroDAO();
    }

    public String agregarLibro(Libro libro) throws SQLException, ClassNotFoundException {
        String validationError = validateLibro(libro);
        if (validationError != null) {
            return validationError; 
        }
        return libroDAO.agregarLibro(libro) ? null : "No se pudo agregar el libro.";
    }

    public String editarLibro(Libro libro) throws SQLException, ClassNotFoundException {
        if (libro.getCve_libro() <= 0) {
            return "El ID del libro debe ser mayor a 0.";
        }
        String validationError = validateLibro(libro);
        if (validationError != null) {
            return validationError; 
        }
        return libroDAO.editarLibro(libro) ? null : "No se pudo editar el libro.";
    }

    public String eliminarLibro(int cve_libro) throws SQLException, ClassNotFoundException {
        if (cve_libro <= 0) {
            return "El ID del libro debe ser mayor a 0.";
        }
        return libroDAO.eliminarLibro(cve_libro) ? null : "No se pudo eliminar el libro.";
    }

    private String validateLibro(Libro libro) {
        String nombre = libro.getNombre_libro();
        String genero = libro.getGenero_libro();
        if (nombre.length() < 5 || nombre.length() > 100) {
            return "El nombre del libro debe tener entre 5 y 100 caracteres.";
        }
        if (genero.length() < 5 || genero.length() > 100) {
            return "El género del libro debe tener entre 5 y 100 caracteres.";
        }
        return null;
    }
}