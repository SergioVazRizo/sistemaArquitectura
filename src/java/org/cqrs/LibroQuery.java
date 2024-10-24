package org.cqrs;

import java.sql.SQLException;
import java.util.List;
import org.dao.LibroDAO;
import org.model.Libro;

public class LibroQuery {

    private final LibroDAO libroDAO;

    public LibroQuery() {
        this.libroDAO = new LibroDAO();
    }

    public List<Libro> getAllLibros() throws SQLException, ClassNotFoundException {
        return libroDAO.getAllLibros();
    }

    public List<Libro> buscarLibroPorNombre(String nombre) throws SQLException, ClassNotFoundException {
        return libroDAO.buscarLibroPorNombre(nombre);
    }

}
