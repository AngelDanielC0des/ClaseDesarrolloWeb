package appweb.servlet;
/*
 * Esta clase, representa un Documento de Identidad en España
 * Identifica a un ciudadado de manera única
 */
public class Dni  {
	static final String SECUENCIA_LETRAS_DNI = "TRWAGMYFPDXBNJZSQVHLCKE";
	int numero;
	char letra;
	
	/*
	 * Constructor por defecto
	 */
	public Dni() {
super();
	}
	/*
	 * Constructor que recibibe un número 
	 * y devuelve el nuevo dni con la letra calculada.
	 */
	public Dni(int numero) {
		// super();
		this.numero = numero;
		this.letra = this.calcularLetra();
		
	}
	
	/*
	 * Constructor canónico
	 * @param numero del nuevo DNI
	 * @param letra del nuevo DNI
	 */
	public Dni(int numero, char letra) {
		// super();
		this.numero = numero;
		this.letra = letra;
	}

	/*
	 * Este método, calcula la letra del Dni, según el algoritmo oficial del Ministerio
	 * @return letra la letra del nuevo Dni.
	 */
	public char calcularLetra() {
		char letraDevuelta = ' ';
		
		int resto = numero % 23;
		letraDevuelta = Dni.SECUENCIA_LETRAS_DNI.charAt(resto);
		return letraDevuelta;
	}
	

	

}
