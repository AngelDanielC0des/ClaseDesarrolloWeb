package appweb.servlet;

public class Nie extends Dni {
	char prefijo;

	@Override
	public char calcularLetra() {
		// 1. Convertimos el char del prefijo a su equivalente numérico en formato String
		String prefijoNumerico = "";
		if (this.prefijo == 'X') {
			prefijoNumerico = "0";
		} else if (this.prefijo == 'Y') {
			prefijoNumerico = "1";
		} else if (this.prefijo == 'Z') {
			prefijoNumerico = "2";
		} else {
			// Por si acaso ya viene el número directamente
			prefijoNumerico = String.valueOf(this.prefijo); 
		}
		
		// 2. Forzamos que la parte numérica tenga 7 dígitos (añadiendo ceros a la izquierda si falta)
		String parteNumericaStr = String.format("%07d", this.numero);
		
		// 3. Concatenamos el prefijo transformado con los números y parseamos a entero completo
		int numeroConvertido = Integer.parseInt(prefijoNumerico + parteNumericaStr);
		
		// 4. Aplicamos el algoritmo matemático oficial (Módulo 23)
		int resto = numeroConvertido % 23;
		
		// 5. Retornamos el caracter correspondiente apuntando a la constante de la clase Padre
		return Dni.SECUENCIA_LETRAS_DNI.charAt(resto);
	}
}