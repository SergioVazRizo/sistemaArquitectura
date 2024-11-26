package org.AppService;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.viewModels.LibroViewModels;

public class LibrosExternosAppService {

    private static final List<String> GET_ALL_PUBLICO_URLS = Arrays.asList(
            "http://10.16.18.48:8080/UniversidadIbero/api/libro/getAllLibrosPublico",
            "http://10.16.25.67:8080/PracticaLogin/api/producto/getLibrosPublic",
            "http://10.16.20.101:3000/api/book/publicBooks",
            "http://10.16.20.5:8080/biblioteca/api/libro/getAllLibrosPublico"
    );

    public List<LibroViewModels> getAll() {
        List<LibroViewModels> librosExternos = new ArrayList<>();

        for (String urlStr : GET_ALL_PUBLICO_URLS) {
            try {
                System.out.println("Intentando conectar con URL: " + urlStr);
                URL url = new URL(urlStr);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");

                int responseCode = conn.getResponseCode();
                System.out.println("Código de respuesta: " + responseCode);

                if (responseCode == 200) {
                    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder content = new StringBuilder();
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        content.append(inputLine);
                    }
                    in.close();
                    conn.disconnect();

                    // Verificar el contenido de la respuesta
                    System.out.println("Respuesta desde " + urlStr + ": " + content.toString());

                    Gson gson = new Gson();
                    Type listType = new TypeToken<List<LibroViewModels>>() {
                    }.getType();
                    List<LibroViewModels> librosDesdeApi = gson.fromJson(content.toString(), listType);

                    librosExternos.addAll(librosDesdeApi);
                } else {
                    System.out.println("Error en la conexión a " + urlStr + ": Código de respuesta " + responseCode);
                }

            } catch (Exception e) {
                System.out.println("Error al intentar conectar con " + urlStr);
                e.printStackTrace();
            }
        }

        System.out.println("Total de libros externos obtenidos: " + librosExternos.size());
        return librosExternos;
    }

    public List<LibroViewModels> buscarPorNombre(String nombre) {
        List<LibroViewModels> librosExternos = new ArrayList<>();

        for (String urlStr : GET_ALL_PUBLICO_URLS) {
            try {
                URL url = new URL(urlStr + "?nombre=" + nombre); // Asume que el servicio acepta el parámetro 'nombre'
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");

                int responseCode = conn.getResponseCode();

                if (responseCode == 200) {
                    BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    StringBuilder content = new StringBuilder();
                    String inputLine;
                    while ((inputLine = in.readLine()) != null) {
                        content.append(inputLine);
                    }
                    in.close();
                    conn.disconnect();

                    Gson gson = new Gson();
                    Type listType = new TypeToken<List<LibroViewModels>>() {
                    }.getType();
                    List<LibroViewModels> librosDesdeApi = gson.fromJson(content.toString(), listType);

                    librosExternos.addAll(librosDesdeApi);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        return librosExternos;
    }

}
