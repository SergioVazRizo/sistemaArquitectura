use GestionInventarioArq;

/*Usuarios*/
INSERT INTO Usuario (usuario, password, token, a_paterno, a_materno, nombre, rol) VALUES ('admin', '1234', 'sergio', 'Vázquez', 'Rizo', 'Sergio', 'administrador');
INSERT INTO Usuario (usuario, password, token, a_paterno, a_materno, nombre, rol) VALUES ('biblio', '1234', 'sergio', 'Vázquez', 'Rizo', 'Sergio', 'Bibliotecario');
INSERT INTO Usuario (usuario, password, token, a_paterno, a_materno, nombre, rol) VALUES ('alumno', '1234', 'sergio', 'Vázquez', 'Rizo', 'Sergio', 'Alumno');
select * from Usuario;