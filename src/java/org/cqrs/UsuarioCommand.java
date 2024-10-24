package org.cqrs;

import org.model.Usuario;
import org.controller.ControllerUsuario;
import java.sql.SQLException;
import org.dao.UsuarioDAO;

public class UsuarioCommand {
    private final UsuarioDAO usuarioDAO;

    public UsuarioCommand() {
        this.usuarioDAO = new UsuarioDAO();
    }

    public String agregarUsuario(Usuario usuario) throws SQLException, ClassNotFoundException {
        return usuarioDAO.agregarUsuario(usuario) ? null : "No se pudo agregar el usuario.";
    }

    public String editarUsuario(Usuario usuario) throws SQLException, ClassNotFoundException {
        if (usuario.getCve_usuario() <= 0) {
            return "El ID del usuario debe ser mayor a 0.";
        }
        return usuarioDAO.editarUsuario(usuario) ? null : "No se pudo editar el usuario.";
    }

}
