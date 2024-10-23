DROP DATABASE IF EXISTS GestionInventarioArq;
CREATE DATABASE GestionInventarioArq;
USE GestionInventarioArq;

CREATE TABLE Usuario (
    cve_usuario     INT AUTO_INCREMENT PRIMARY KEY,
    usuario         VARCHAR(20),
    password        VARCHAR(20),
    token           VARCHAR(100),
    a_paterno       VARCHAR(100),
    a_materno       VARCHAR(100),
    nombre          VARCHAR(100),
    rol           VARCHAR(100)
);

Create Table Libro (
	cve_libro	int auto_increment primary key,
    nombre_libro varchar(250),
    autor_libro varchar(250),
    genero_libro varchar(250),
    pdf_libro longtext, 
    estatus boolean
);

select * from Libro;