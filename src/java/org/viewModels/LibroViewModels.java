package org.viewModels;

/**
 *
 * @author checo
 */
public class LibroViewModels {

    private int lId;
    private String nombreL;
    private String autor;
    private String estatus;
    private String genero;
    private String universidad;
    private String pdf;

    public LibroViewModels(int lId, String nombreL, String autor, String estatus, String genero, String universidad, String pdf) {
        this.lId = lId;
        this.nombreL = nombreL;
        this.autor = autor;
        this.estatus = estatus;
        this.genero = genero;
        this.universidad = universidad;
        this.pdf = pdf;
    }

    public LibroViewModels() {

    }

}
