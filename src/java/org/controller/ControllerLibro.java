package org.controller;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.AppService.LibrosExternosAppService;
import org.cqrs.LibroCommand;
import org.cqrs.LibroQuery;
import org.model.Libro;
import org.viewModels.LibroViewModels;

public class ControllerLibro {

    private final LibroCommand libroCommand;
    private final LibroQuery libroQuery;
    private final LibrosExternosAppService librosExternosAppService;

    public ControllerLibro() {
        this.libroCommand = new LibroCommand();
        this.libroQuery = new LibroQuery();
        this.librosExternosAppService = new LibrosExternosAppService();
    }

    public List<LibroViewModels> getLibrosTodos() throws SQLException, ClassNotFoundException {
        List<Libro> librosLocales = libroQuery.getAllLibros();
        List<LibroViewModels> librosCombinados = new ArrayList<>();

        for (Libro libro : librosLocales) {
            LibroViewModels libroVM = new LibroViewModels(
                    libro.getCve_libro(),
                    libro.getNombre_libro(),
                    libro.getAutor_libro(),
                    libro.getEstatus(),
                    libro.getGenero_libro(),
                    libro.getUniversidad(),
                    libro.getPdf_libro()
            );
            librosCombinados.add(libroVM);
        }

        // Llama a getAll() usando la instancia
        librosCombinados.addAll(librosExternosAppService.getAll());

        return librosCombinados;
    }

    public List<LibroViewModels> getAllLibrosPublic() throws SQLException, ClassNotFoundException {
        List<Libro> Libro = libroQuery.getAllLibros();
        List<LibroViewModels> respuesta = new ArrayList<>();
        for (Libro i : Libro) {
            LibroViewModels item = new LibroViewModels(i.getCve_libro(), i.getNombre_libro(), i.getAutor_libro(), i.getEstatus(), i.getGenero_libro(), i.getUniversidad(), i.getPdf_libro());
            respuesta.add(item);
        }
        return respuesta;
    }

    public List<Libro> getAllLibros() throws SQLException, ClassNotFoundException {
        return libroQuery.getAllLibros();
    }

    public List<LibroViewModels> buscarLibroPorNombreTodos(String nombre) throws SQLException, ClassNotFoundException {
        // Obtener libros locales que coincidan con el nombre
        List<Libro> librosLocales = libroQuery.buscarLibroPorNombre(nombre);
        List<LibroViewModels> librosCombinados = new ArrayList<>();

        for (Libro libro : librosLocales) {
            LibroViewModels libroVM = new LibroViewModels(
                    libro.getCve_libro(),
                    libro.getNombre_libro(),
                    libro.getAutor_libro(),
                    libro.getGenero_libro(),
                    libro.getEstatus(),
                    libro.getUniversidad(),
                    libro.getPdf_libro()
            );
            librosCombinados.add(libroVM);
        }

        // Agregar libros externos que coincidan con el nombre
        List<LibroViewModels> librosExternos = librosExternosAppService.buscarPorNombre(nombre);
        librosCombinados.addAll(librosExternos);

        return librosCombinados;
    }

    public List<LibroViewModels> buscarLibroPorNombre(String nombre) throws SQLException, ClassNotFoundException {
        List<Libro> libros = libroQuery.buscarLibroPorNombre(nombre);
        List<LibroViewModels> respuesta = new ArrayList<>();
        for (Libro i : libros) {
            LibroViewModels item = new LibroViewModels(i.getCve_libro(), i.getNombre_libro(), i.getAutor_libro(), i.getGenero_libro(), i.getEstatus(), i.getUniversidad(), i.getPdf_libro());
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
