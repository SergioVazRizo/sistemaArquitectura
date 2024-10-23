use GestionInventarioArq;

/*Usuarios*/
INSERT INTO Usuario (usuario, password, token, a_paterno, a_materno, nombre, rol) VALUES ('admin', 'admin', 'sergio', 'Vázquez', 'Rizo', 'Sergio', 'administrador');
INSERT INTO Usuario (usuario, password, token, a_paterno, a_materno, nombre, rol) VALUES ('bibliotecario', 'bibliotecario', 'sergio', 'Vázquez', 'Rizo', 'Sergio', 'bibliotecario');
INSERT INTO Usuario (usuario, password, token, a_paterno, a_materno, nombre, rol) VALUES ('alumno', 'alumno', 'sergio', 'Vázquez', 'Rizo', 'Sergio', 'alumno');
select * from Usuario;