package org.controller;

import java.sql.SQLException;
import java.util.List;
import org.cqrs.UsuarioCommand;
import org.cqrs.UsuarioQuery;
import org.model.Usuario;

public class ControllerUsuario {

    private final UsuarioCommand usuarioCommand;
    private final UsuarioQuery usuarioQuery;

    public ControllerUsuario() {
        this.usuarioCommand = new UsuarioCommand();
        this.usuarioQuery = new UsuarioQuery();
    }

    // Método para obtener todos los usuarios
    public List<Usuario> getAllUsuarios() throws SQLException, ClassNotFoundException {
        return usuarioQuery.getAllUsuarios();
    }

    // Método para agregar un nuevo usuario
    public String agregarUsuario(Usuario usuario) throws ClassNotFoundException, SQLException {
        return usuarioCommand.agregarUsuario(usuario);
    }

    // Método para editar un usuario existente
    public String editarUsuario(Usuario usuario) throws ClassNotFoundException, SQLException {
        return usuarioCommand.editarUsuario(usuario);
    }

    // Método para buscar usuarios
    public List<Usuario> buscarUsuario(String query) throws ClassNotFoundException, SQLException {
        return usuarioQuery.buscarUsuario(query);
    }
}
