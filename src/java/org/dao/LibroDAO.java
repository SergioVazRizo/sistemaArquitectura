package org.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.bd.ConexionMySQL;
import org.model.Libro;

public class LibroDAO {

    private ConexionMySQL conexion;

    public LibroDAO() {
        this.conexion = new ConexionMySQL();
    }

    public List<Libro> getAllLibrosPublic() throws SQLException, ClassNotFoundException {
        List<Libro> librosList = new ArrayList<>();
        String query = "SELECT * FROM Libro WHERE estatus = 'Activo'";

        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = conexion.openConnection();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cve_libro = rs.getInt("cve_libro");
                String nombre_libro = rs.getString("nombre_libro");
                String autor_libro = rs.getString("autor_libro");
                String genero_libro = rs.getString("genero_libro");
                String pdf_libro = rs.getString("pdf_libro");
                String estatus = rs.getString("estatus");

                Libro libro = new Libro(cve_libro, nombre_libro, autor_libro, genero_libro, pdf_libro, estatus);
                librosList.add(libro);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (pstm != null) {
                    pstm.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return librosList;
    }

    public List<Libro> getAllLibros() throws SQLException, ClassNotFoundException {
        List<Libro> librosList = new ArrayList<>();
        String query = "SELECT * FROM Libro";

        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = conexion.openConnection();
            pstm = conn.prepareStatement(query);
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cve_libro = rs.getInt("cve_libro");
                String nombre_libro = rs.getString("nombre_libro");
                String autor_libro = rs.getString("autor_libro");
                String genero_libro = rs.getString("genero_libro");
                String pdf_libro = rs.getString("pdf_libro");
                String estatus = rs.getString("estatus");

                Libro libro = new Libro(cve_libro, nombre_libro, autor_libro, genero_libro, pdf_libro, estatus);
                librosList.add(libro);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (pstm != null) {
                    pstm.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        return librosList;
    }

    public List<Libro> buscarLibroPorNombre(String nombre) throws SQLException, ClassNotFoundException {
        List<Libro> librosList = new ArrayList<>();
        String query = "SELECT * FROM Libro WHERE nombre_libro LIKE ? AND estatus = 'Activo'";

        Connection conn = null;
        PreparedStatement pstm = null;
        ResultSet rs = null;

        try {
            conn = conexion.openConnection();
            pstm = conn.prepareStatement(query);
            pstm.setString(1, "%" + nombre + "%"); // Para hacer una búsqueda parcial
            rs = pstm.executeQuery();

            while (rs.next()) {
                int cve_libro = rs.getInt("cve_libro");
                String nombre_libro = rs.getString("nombre_libro");
                String autor_libro = rs.getString("autor_libro");
                String genero_libro = rs.getString("genero_libro");
                String pdf_libro = rs.getString("pdf_libro");
                String estatus = rs.getString("estatus");

                Libro libro = new Libro(cve_libro, nombre_libro, autor_libro, genero_libro, pdf_libro, estatus);
                librosList.add(libro);
            }
        } finally {
            // Cierre de recursos
            if (rs != null) {
                rs.close();
            }
            if (pstm != null) {
                pstm.close();
            }
            conexion.closeConnection();
        }

        return librosList;
    }

    public boolean agregarLibro(Libro libro) throws SQLException, ClassNotFoundException {
        String query = "INSERT INTO Libro (nombre_libro, autor_libro, genero_libro, estatus, pdf_libro) VALUES (?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = conexion.openConnection();
            pstmt = conn.prepareStatement(query);
            pstmt.setString(1, libro.getNombre_libro());
            pstmt.setString(2, libro.getAutor_libro());
            pstmt.setString(3, libro.getGenero_libro());
            pstmt.setString(4, libro.getEstatus());
            pstmt.setString(5, libro.getPdf_libro());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        } finally {
            try {
                if (pstmt != null) {
                    pstmt.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    public boolean editarLibro(Libro libro) throws SQLException, ClassNotFoundException {
        String query = "UPDATE Libro SET nombre_libro=?, autor_libro=?, genero_libro=?, estatus=?, pdf_libro=? WHERE cve_libro=?";
        Connection conn = null;
        PreparedStatement pstmt = null;

        try {
            conn = conexion.openConnection();
            pstmt = conn.prepareStatement(query);
            pstmt.setString(1, libro.getNombre_libro());
            pstmt.setString(2, libro.getAutor_libro());
            pstmt.setString(3, libro.getGenero_libro());
            pstmt.setString(4, libro.getEstatus());
            pstmt.setString(5, libro.getPdf_libro());

            pstmt.setInt(6, libro.getCve_libro());
            int filasAfectadas = pstmt.executeUpdate();
            return filasAfectadas > 0;
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        } finally {
            try {
                if (pstmt != null) {
                    pstmt.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

}
