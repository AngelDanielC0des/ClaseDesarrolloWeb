package basico;

import java.util.Scanner;

/**
 * Esta clase es la principal de mis ejemplos básicos
 * 
 * @autor Ángel Daniel
 * @version 1.0
 * @since xtalento 11/06/2026
 * 
 */
public class EjemploUno {
	/**
	 * Esta es la función main, el punto de entrada a nuestra app.
	 * 
	 * @param args parámetros de entrada
	 */
	public static void main(String[] args) {
		System.out.println("MÓDULO WEB");
		// TODO cálculo del IMC
		// fórmula: IMC = peso kg / estatura al cuadrado m
		// <16 DESNUTRIDO
		// >=16 & <18 DELGADO
		// >=18 & <25 IDEAL
		// >=25 & <31 SOBREPESO
		// >31 OBESO
		// ---------------
		// Pedir al usuario su peso y su estatura
		// e informarle de su IMC número y nominal
		// 1.70 m 65kg
		// Scanner scanner
		String palabra = new String("Hola"); // String es el constructor.
		System.out.println(palabra);
		Scanner scanner = new Scanner(System.in); // Lector de teclado
		String palabraIntroducida = scanner.nextLine();
		System.out.println("el usuario metio " + palabraIntroducida);
		
		
		float peso = scanner.nextFloat();
		System.out.println(peso);
		System.out.println("El peso es" + peso);
		
		float estatura = scanner.nextFloat();
		System.out.println(estatura);
		System.out.println("La estatura del usuario es " + estatura);
		float IMC = peso / (estatura * estatura);
		System.out.println("El IMC del usuario es " + IMC);
		if (IMC < 16) {
			System.out.println("Desnutrido");
		} else if (IMC >= 16 && IMC < 18) {
			System.out.println("Delgado");
		} else if (IMC >= 18 && IMC < 25) {
			System.out.println("Ideal");
		} else if (IMC >= 25 && IMC < 31) {
			System.out.println("Sobrepeso");
		}

		else {
			System.out.println("Obeso");
		}
	}
}
