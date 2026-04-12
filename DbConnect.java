public class DbConnect {
    // JDBC URL, usuario y contraseña de la base de datos
    private static final String JDBC_URL = "jdbc:mysql://localhost:3307/RickAndMorty";
    private static final String USUARIO = "pr_michael";
    private static final String CONTRASEÑA = "1234";

    private static DbConnect dbInstance; //Variable para almacenar la unica instancia de la clase
    private static java.sql.Connection conexion;

    private DbConnect() {
        // El Constructor es privado!!
    }

    public static DbConnect getInstance(){
        //Si no hay ninguna instancia...
        if(dbInstance == null){
            dbInstance = new DbConnect();
        }
        return dbInstance;
    }

    public static java.sql.Connection getConnection(){
        if(conexion == null){
            try {
                conexion = java.sql.DriverManager.getConnection(JDBC_URL, USUARIO, CONTRASEÑA);
                System.out.println("Conexión realizada SINGLETON");

            } catch (java.sql.SQLException ex) {
                System.out.println("ERROR al conectar: " + ex.getMessage());
            }
        }
        return conexion;
    }
}
