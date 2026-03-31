import java.sql.*;

public class testBBDD {

    public void insertarPersonajes(String nombre, String genero, String especie, String estado, String origen, String imagen) throws SQLException{
        Connection con = DbConnect.getInstance().getConnection();
        String sql = "INSERT INTO personajes(nombre, genero, especie, estado, origen, imagen) VALUES(?, ?, ?, ?, ?, ?)";

        try (PreparedStatement pst = con.prepareStatement(sql)){

            pst.setString(1, nombre);
            pst.setString(2, genero);
            pst.setString(3, estado);
            pst.setString(4, estado);
            pst.setString(5, origen);
            pst.setString(6, imagen);

            int filasmodificadas = pst.executeUpdate();

            if (filasmodificadas > 0){
                System.out.println("Se insertaron personajes");
            }else{
                System.out.println("No se insertaron personajes");
            }
        }
    }

    public static void main(String[] args) {
        testBBDD testDAO = new testBBDD();
        try {
            testDAO.insertarPersonajes("test", "humano", "alien", "morido", "tierra", "http.imagen.es");

        } catch (SQLException e) {
            System.out.println(e);
        }
    }
}

