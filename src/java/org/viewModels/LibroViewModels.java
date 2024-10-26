package org.viewModels;

/**
 *
 * @author checo
 */
public class LibroViewModels {

    private int L_id;
    private String nombre_libro;
    private String autor_libro;
    private String genero_libro;
    private String estatus;
    private String universidad;
    private String pdf_libro;

    public LibroViewModels(int L_id, String nombre_libro, String autor_libro, String genero_libro, String estatus, String universidad, String pdf_libro) {
        this.L_id = L_id;
        this.nombre_libro = nombre_libro;
        this.autor_libro = autor_libro;
        this.genero_libro = genero_libro;
        this.estatus = estatus;
        this.universidad = universidad;
        this.pdf_libro = pdf_libro;
    }

    public LibroViewModels() {

    }

}
