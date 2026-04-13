import java.sql.*;

public class testBBDD {

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
                System.out.println("Se insertaron personajes");
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

            System.out.println("💾 Episodio guardado: " + nombre);

            if (filasmodificadas > 0){
                System.out.println("Se inserto un episodio");
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

            System.out.println("💾 Episodio guardado: " + nombre);

            if (filasmodificadas > 0){
                System.out.println("Se inserto una ubicacion");
            }else{
                System.out.println("No se inserto ninguna ubicacion");
            }
        }
    }
}