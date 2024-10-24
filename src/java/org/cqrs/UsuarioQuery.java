package org.cqrs;

import org.model.Usuario;
import org.controller.ControllerUsuario;
import java.sql.SQLException;
import java.util.List;
import org.dao.UsuarioDAO;

public class UsuarioQuery {
    private final UsuarioDAO usuarioDAO;

    public UsuarioQuery() {
        this.usuarioDAO = new UsuarioDAO();
    }

    public List<Usuario> getAllUsuarios() throws SQLException, ClassNotFoundException {
        return usuarioDAO.getAllUsuarios();
    }

    public List<Usuario> buscarUsuario(String query) throws SQLException, ClassNotFoundException {
        return usuarioDAO.buscarUsuario(query);
    }
}
