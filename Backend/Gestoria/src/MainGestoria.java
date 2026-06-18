import documentos.Dni;

public class MainGestoria {

	public static void main(String[] args) {
		Dni dni = new Dni(65465);
		char letra = dni.calcularLetra();
		System.out.println("Mi letra es" + letra);	}
}
