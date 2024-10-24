package org.rest;

import com.google.gson.Gson;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;
import org.controller.ControllerLibro;
import org.model.Libro;
import org.viewModels.LibroViewModels;

@Path("libro")
public class RestLibro {

    private final ControllerLibro cl = new ControllerLibro();
    private final Gson gson = new Gson();

    @Path("getAllLibrosPublic")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllLibrosPublic() {
        try {
            List<LibroViewModels> libros = cl.getAllLibrosPublic();
            return Response.ok(gson.toJson(libros)).build();
        } catch (SQLException | ClassNotFoundException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}")
                    .build();
        }
    }

    @Path("getAllLibros")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllLibros() {
        try {
            List<Libro> libros = cl.getAllLibros();
            return Response.ok(gson.toJson(libros)).build();
        } catch (SQLException | ClassNotFoundException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}")
                    .build();
        }
    }

    @Path("agregarLibro")
    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response agregarLibro(@FormParam("nombre_libro") String nombre_libro,
            @FormParam("autor_libro") String autor_libro,
            @FormParam("genero_libro") String genero_libro,
            @FormParam("pdf_libro") String pdf_libro) {
        if (nombre_libro == null || autor_libro == null || genero_libro == null || pdf_libro == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Todos los campos son obligatorios.\"}")
                    .build();
        }

        Libro nuevoLibro = new Libro(0, nombre_libro, autor_libro, genero_libro, pdf_libro);
        try {
            String resultado = cl.agregarLibro(nuevoLibro);
            if (resultado == null) {
                return Response.status(Response.Status.CREATED)
                        .entity("{\"success\":\"Libro agregado correctamente\"}")
                        .build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"error\":\"" + resultado + "\"}")
                        .build();
            }
        } catch (ClassNotFoundException | SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}")
                    .build();
        }
    }

    @Path("editarLibro/{cve_libro}")
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Response editarLibro(@PathParam("cve_libro") int cve_libro,
            @FormParam("nombre_libro") String nombre_libro,
            @FormParam("autor_libro") String autor_libro,
            @FormParam("genero_libro") String genero_libro,
            @FormParam("pdf_libro") String pdf_libro) {
        if (nombre_libro == null || autor_libro == null || genero_libro == null || pdf_libro == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("{\"error\":\"Todos los campos son obligatorios.\"}")
                    .build();
        }

        Libro libro = new Libro(cve_libro, nombre_libro, autor_libro, genero_libro, pdf_libro);
        try {
            String resultado = cl.editarLibro(libro);
            if (resultado == null) {
                return Response.ok("{\"success\":\"Libro editado correctamente\"}").build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"error\":\"" + resultado + "\"}")
                        .build();
            }
        } catch (ClassNotFoundException | SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}")
                    .build();
        }
    }

    @Path("eliminarLibro/{cve_libro}")
    @DELETE
    @Produces(MediaType.APPLICATION_JSON)
    public Response eliminarLibro(@PathParam("cve_libro") int cve_libro) {
        try {
            String resultado = cl.eliminarLibro(cve_libro);
            if (resultado == null) {
                return Response.ok("{\"success\":\"Libro eliminado correctamente\"}").build();
            } else {
                return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                        .entity("{\"error\":\"" + resultado + "\"}")
                        .build();
            }
        } catch (ClassNotFoundException | SQLException e) {
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("{\"error\":\"Ocurrió un error. Intente más tarde.\"}")
                    .build();
        }
    }
}
