package backend;
import java.sql.*;
public class BBDD {

    public void insertarPersonajes(String nombre, String especie, String estado, String origen, String imagen, String ultima_ubicacion) throws SQLException{
        Connection con = DbConnect.getInstance().getConnection();
        String sql = "INSERT INTO personajes(nombre, especie, estado, origen, imagen, ultima_ubicacion) VALUES(?, ?, ?, ?, ?, ?)";

        try (PreparedStatement pst = con.prepareStatement(sql)){

            pst.setString(1, nombre);
            pst.setString(2 , especie);
            pst.setString(3 , estado);
            pst.setString(4, origen);
            pst.setString(5, imagen);
            pst.setString(6, ultima_ubicacion);

            int filasmodificadas = pst.executeUpdate();

            if (filasmodificadas > 0){
                System.out.println("💾 Personaje guardado: " + nombre + "\n");
            }else{
                System.out.println("No se insertaron personajes");
            }
        }
    }


    public void insertarEpisodio(String nombre, String fecha, String codigo, String img) throws SQLException {
        Connection con = DbConnect.getConnection();
        String sql = "INSERT INTO episodios(nombre, fecha, codigo, imagen) VALUES(?, ?, ?, ?)";

        try (PreparedStatement pst = con.prepareStatement(sql)) {

            pst.setString(1, nombre);
            pst.setString(2, fecha);
            pst.setString(3, codigo);
            pst.setString(4, img);

            int filasmodificadas = pst.executeUpdate();

            if (filasmodificadas > 0){
                System.out.println("💾 Episodio guardado: " + nombre + "\n");
            }else{
                System.out.println("No se inserto ningun episodio");
            }
        }
    }

    public void insertarUbicacion(String nombre, String tipo, String dimension, String img) throws SQLException {
        Connection con = DbConnect.getConnection();
        String sql = "INSERT INTO ubicaciones(nombre, tipo, dimension, imagen) VALUES(?, ?, ?, ?)";

        try (PreparedStatement pst = con.prepareStatement(sql)) {
            pst.setString(1, nombre);
            pst.setString(2, tipo);
            pst.setString(3, dimension);
            pst.setString(4, img);

            int filasmodificadas = pst.executeUpdate();

            if (filasmodificadas > 0){
                System.out.println("💾 Ubicacion guardada: " + nombre + "\n");
            }else{
                System.out.println("No se inserto ninguna ubicacion");
            }
        }
    }

    public String obtenerDatos(String tipo) throws SQLException {
    Connection con = DbConnect.getInstance().getConnection();
    String sql = "SELECT * FROM " + (tipo.equals("character") ? "personajes" : tipo.equals("location") ? "ubicaciones" : "episodios");

    StringBuilder json = new StringBuilder("[");
    try (PreparedStatement pst = con.prepareStatement(sql);
        ResultSet rs = pst.executeQuery()) {

        while (rs.next()) {
            json.append("{");
            if (tipo.equals("character")) {
                json.append("\"name\":\"").append(rs.getString("nombre")).append("\",");
                json.append("\"species\":\"").append(rs.getString("especie")).append("\",");
                json.append("\"status\":\"").append(rs.getString("estado")).append("\",");
                json.append("\"origin\":{\"name\":\"").append(rs.getString("origen")).append("\"},");
                json.append("\"location\":{\"name\":\"").append(rs.getString("ultima_ubicacion")).append("\"},");
                json.append("\"image\":\"").append(rs.getString("imagen")).append("\"");
            } else if (tipo.equals("location")) {
                json.append("\"name\":\"").append(rs.getString("nombre")).append("\",");
                json.append("\"type\":\"").append(rs.getString("tipo")).append("\",");
                json.append("\"dimension\":\"").append(rs.getString("dimension")).append("\",");
                json.append("\"image\":\"").append(rs.getString("imagen")).append("\"");
            } else if (tipo.equals("episode")) {
                json.append("\"name\":\"").append(rs.getString("nombre")).append("\",");
                json.append("\"air_date\":\"").append(rs.getString("fecha")).append("\",");
                json.append("\"episode\":\"").append(rs.getString("codigo")).append("\",");
                json.append("\"image\":\"").append(rs.getString("imagen")).append("\"");
            }
            json.append("},");
        }
    }
    // Quitar la ultima coma
    if (json.length() > 1) json.setLength(json.length() - 1);
    json.append("]");
    return json.toString();
}
}
