package org.dao;

import org.model.Usuario;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import org.bd.ConexionMySQL;

public class UsuarioDAO {

    private ConexionMySQL conexion;

    public UsuarioDAO() {
        this.conexion = new ConexionMySQL();
    }

    // Método para agregar un nuevo usuario
    public boolean agregarUsuario(Usuario usuario) throws SQLException, ClassNotFoundException {
        String query = "INSERT INTO usuario (usuario, password, token, a_paterno, a_materno, nombre, rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = conexion.openConnection();
            stmt = conn.prepareStatement(query);
            stmt.setString(1, usuario.getUsuario());
            stmt.setString(2, usuario.getPassword());
            stmt.setString(3, usuario.getToken());
            stmt.setString(4, usuario.getA_paterno());
            stmt.setString(5, usuario.getA_materno());
            stmt.setString(6, usuario.getNombre());
            stmt.setString(7, usuario.getRol());
            return stmt.executeUpdate() > 0; // Retorna true si se insertó
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // Método para editar un usuario existente
    public boolean editarUsuario(Usuario usuario) throws SQLException, ClassNotFoundException {
        String query = "UPDATE usuario SET usuario = ?, password = ?, token = ?, a_paterno = ?, a_materno = ?, nombre = ?, rol = ? WHERE cve_usuario = ?";
        Connection conn = null;
        PreparedStatement stmt = null;

        try {
            conn = conexion.openConnection();
            stmt = conn.prepareStatement(query);
            stmt.setString(1, usuario.getUsuario());
            stmt.setString(2, usuario.getPassword());
            stmt.setString(3, usuario.getToken());
            stmt.setString(4, usuario.getA_paterno());
            stmt.setString(5, usuario.getA_materno());
            stmt.setString(6, usuario.getNombre());
            stmt.setString(7, usuario.getRol());
            stmt.setInt(8, usuario.getCve_usuario());
            return stmt.executeUpdate() > 0; // Retorna true si se actualizó
        } catch (SQLException ex) {
            System.out.println(ex);
            return false;
        } finally {
            try {
                if (stmt != null) {
                    stmt.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }

    // Método para obtener todos los usuarios
    public List<Usuario> getAllUsuarios() throws SQLException, ClassNotFoundException {
        List<Usuario> usuarios = new ArrayList<>();
        String query = "SELECT * FROM usuario";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = conexion.openConnection();
            stmt = conn.prepareStatement(query);
            rs = stmt.executeQuery();

            while (rs.next()) {
                Usuario usuario = new Usuario(
                        rs.getInt("cve_usuario"),
                        rs.getString("usuario"),
                        rs.getString("password"),
                        rs.getString("token"),
                        rs.getString("a_paterno"),
                        rs.getString("a_materno"),
                        rs.getString("nombre"),
                        rs.getString("rol")
                );
                usuarios.add(usuario);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return usuarios;
    }

    // Método para buscar usuarios por un criterio específico
    public List<Usuario> buscarUsuario(String query) throws SQLException, ClassNotFoundException {
        List<Usuario> usuarios = new ArrayList<>();
        String sql = "SELECT * FROM usuario WHERE usuario LIKE ? OR nombre LIKE ?";
        Connection conn = null;
        PreparedStatement stmt = null;
        ResultSet rs = null;

        try {
            conn = conexion.openConnection();
            stmt = conn.prepareStatement(sql);
            stmt.setString(1, "%" + query + "%");
            stmt.setString(2, "%" + query + "%");
            rs = stmt.executeQuery();

            while (rs.next()) {
                Usuario usuario = new Usuario(
                        rs.getInt("cve_usuario"),
                        rs.getString("usuario"),
                        rs.getString("password"),
                        rs.getString("token"),
                        rs.getString("a_paterno"),
                        rs.getString("a_materno"),
                        rs.getString("nombre"),
                        rs.getString("rol")
                );
                usuarios.add(usuario);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (rs != null) {
                    rs.close();
                }
                if (stmt != null) {
                    stmt.close();
                }
                conexion.closeConnection();
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
        return usuarios;
    }
}
