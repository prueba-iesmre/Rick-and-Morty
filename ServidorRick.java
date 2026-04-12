import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;
import java.net.InetSocketAddress;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;

public class ServidorRick {
    public static void main(String[] args) throws Exception {
        // CREAMOS SERVIDOR PUERTO 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);

        server.createContext("/guardar", exchange -> {
            // CONFIGURACI0N DE CORS (Para que el navegador no bloquee la conexión)
            exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
            exchange.getResponseHeaders().add("Access-Control-Allow-Methods", "POST, OPTIONS");
            exchange.getResponseHeaders().add("Access-Control-Allow-Headers", "Content-Type");

            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }

            if ("POST".equals(exchange.getRequestMethod())) {
                // LEER EL JSON QUE VIENE DEL NAVEGADOR (JS FETCH)
                InputStream is = exchange.getRequestBody();
                Scanner s = new Scanner(is, StandardCharsets.UTF_8).useDelimiter("\\A");
                String json = s.hasNext() ? s.next() : "";

                System.out.println("📥 Solicitud recibida: " + json);

                String tipoDato = extraer(json, "tipo_dato");
                testBBDD db = new testBBDD();
                String mensajeRespuesta = "";
                int codigoEstado = 200;

                try {
                    // DEPENDIENDO DEL TIPO INSERTAMOS X
                    if (tipoDato.equals("character")) {
                        db.insertarPersonajes(
                            extraer(json, "nombre"), extraer(json, "especie"),
                            extraer(json, "estado"), extraer(json, "origen"),
                            extraer(json, "imagen"), extraer(json, "genero") // En JS mandamos 'genero' para la ubicación
                        );
                        mensajeRespuesta = "Personaje guardado correctamente";
                    }
                    else if (tipoDato.equals("location")) {
                        db.insertarUbicacion(
                            extraer(json, "nombre"), extraer(json, "tipo"),
                            extraer(json, "dimension"), extraer(json, "imagen")
                        );
                        mensajeRespuesta = "Ubicación guardada correctamente";
                    }
                    else if (tipoDato.equals("episode")) {
                        db.insertarEpisodio(
                            extraer(json, "nombre"), extraer(json, "air_date"),
                            extraer(json, "episode"), extraer(json, "imagen")
                        );
                        mensajeRespuesta = "Episodio guardado correctamente";
                    }

                } catch (Exception e) {
                    //  CONTROL DE DUPLICADOS
                    if (e.getMessage().contains("Duplicate entry")) {
                        mensajeRespuesta = "Esta información ya está en la base de datos";
                        codigoEstado = 409;
                    } else {
                        e.printStackTrace();
                        mensajeRespuesta = "Error en el servidor o BD";
                        codigoEstado = 500;
                    }
                }

                //  ENVIAR RESPUESTA AL NAVEGADOR
                byte[] respuestaBytes = mensajeRespuesta.getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(codigoEstado, respuestaBytes.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(respuestaBytes);
                    os.flush();
                }
            }
            exchange.close();
        });

        server.start();
        System.out.println("---------------------------------------------");
        System.out.println(" SERVIDOR RICK & MORTY ACTIVO EN PUERTO 8080");
        System.out.println("---------------------------------------------");
    }

    //(SPLIT)
    public static String extraer(String textoJSON, String etiqueta) {
        try {
            // Buscamos la etiqueta. Ejemplo: "nombre":"
            String busqueda = "\"" + etiqueta + "\":\"";

            // Cortamos el texto en dos partes usando la etiqueta como tijera
            String[] partes = textoJSON.split(busqueda);

            // Cogemos la segunda parte (lo que hay a la derecha del corte)
            String resto = partes[1];

            // Volvemos a cortar por la primera comilla que encontremos
            String[] valorFinal = resto.split("\"");

            // El trozo 0 es nuestro dato
            return valorFinal[0];

        } catch (Exception e) {
            return "No encontrado";
        }
    }
}