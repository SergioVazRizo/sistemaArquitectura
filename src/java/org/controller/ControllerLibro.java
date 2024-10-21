package org.controller;

import java.sql.SQLException;
import java.util.List;
import org.cqrs.LibroCommand;
import org.cqrs.LibroQuery;
import org.model.Libro;

public class ControllerLibro {

    private final LibroCommand libroCommand;
    private final LibroQuery libroQuery;

    public ControllerLibro() {
        this.libroCommand = new LibroCommand();
        this.libroQuery = new LibroQuery();
    }

    public List<Libro> getAllLibros() throws SQLException, ClassNotFoundException {
        return libroQuery.getAllLibros();
    }

    public String agregarLibro(Libro libro) throws ClassNotFoundException, SQLException {
        return libroCommand.agregarLibro(libro);
    }

    public String editarLibro(Libro libro) throws ClassNotFoundException, SQLException {
        return libroCommand.editarLibro(libro);
    }

    public String eliminarLibro(int cve_libro) throws ClassNotFoundException, SQLException {
        return libroCommand.eliminarLibro(cve_libro);
    }
}