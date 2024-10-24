package org.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.cqrs.LibroCommand;
import org.cqrs.LibroQuery;
import org.model.Libro;
import org.viewModels.LibroViewModels;

public class ControllerLibro {

    private final LibroCommand libroCommand;
    private final LibroQuery libroQuery;

    public ControllerLibro() {
        this.libroCommand = new LibroCommand();
        this.libroQuery = new LibroQuery();
    }

    public List<LibroViewModels> getAllLibrosPublic() throws SQLException, ClassNotFoundException {
        List<Libro> Libro = libroQuery.getAllLibrosPublic();
        List<LibroViewModels> respuesta = new ArrayList<>();
        for (Libro i : Libro) {
            LibroViewModels item = new LibroViewModels(i.getCve_libro(), i.getNombre_libro(), i.getAutor_libro(), i.getGenero_libro(), i.getPdf_libro());
            respuesta.add(item);
        }
        return respuesta;
    }

    public List<Libro> getAllLibros() throws SQLException, ClassNotFoundException {
        return libroQuery.getAllLibros();
    }

    public List<LibroViewModels> buscarLibroPorNombre(String nombre) throws SQLException, ClassNotFoundException {
        List<Libro> libros = libroQuery.buscarLibroPorNombre(nombre);
        List<LibroViewModels> respuesta = new ArrayList<>();
        for (Libro i : libros) {
            LibroViewModels item = new LibroViewModels(i.getCve_libro(), i.getNombre_libro(), i.getAutor_libro(), i.getGenero_libro(), i.getPdf_libro());
            respuesta.add(item);
        }
        return respuesta;
    }

    public String agregarLibro(Libro libro) throws ClassNotFoundException, SQLException {
        return libroCommand.agregarLibro(libro);
    }

    public String editarLibro(Libro libro) throws ClassNotFoundException, SQLException {
        return libroCommand.editarLibro(libro);
    }

}
