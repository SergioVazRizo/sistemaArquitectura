package org.model;

public class Libro {
    private int cve_libro;
    private String nombre_libro;
    private String autor_libro;
    private String genero_libro;
    private String pdf_libro;

    public Libro(int cve_libro, String nombre_libro, String autor_libro, String genero_libro, String pdf_libro) {
        this.cve_libro = cve_libro;
        this.nombre_libro = nombre_libro;
        this.autor_libro = autor_libro;
        this.genero_libro = genero_libro;
        this.pdf_libro = pdf_libro;
    }

    // Getters y Setters
    public int getCve_libro() {
        return cve_libro;
    }

    public void setCve_libro(int cve_libro) {
        this.cve_libro = cve_libro;
    }

    public String getNombre_libro() {
        return nombre_libro;
    }

    public void setNombre_libro(String nombre_libro) {
        this.nombre_libro = nombre_libro;
    }

    public String getAutor_libro() {
        return autor_libro;
    }

    public void setAutor_libro(String autor_libro) {
        this.autor_libro = autor_libro;
    }

    public String getGenero_libro() {
        return genero_libro;
    }

    public void setGenero_libro(String genero_libro) {
        this.genero_libro = genero_libro;
    }

    public String getPdf_libro() {
        return pdf_libro;
    }

    public void setPdf_libro(String pdf_libro) {
        this.pdf_libro = pdf_libro;
    }

}
