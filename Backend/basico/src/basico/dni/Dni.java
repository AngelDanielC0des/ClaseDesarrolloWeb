package basico.dni;


public class Dni {
	static final String SECUENCIA_LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";
	int numero;
	char letra;
	
	
	
	public Dni() {
super();
	}
	
	
	public Dni(int numero) {
		// super();
		this.numero = numero;
		
	}
	
	public Dni(int numero, char letra) {
		// super();
		this.numero = numero;
		this.letra = letra;
	}

	public char calcularLetra() {
		char letraDevuelta = ' ';
		
		int resto = numero % 23;
		letraDevuelta = Dni.SECUENCIA_LETRAS_DNI.charAt(resto);
		return letraDevuelta;
	}
	

	

}
