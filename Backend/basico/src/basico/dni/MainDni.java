package basico.dni;

import java.util.Scanner;



public class MainDni {
	
	public static void main(String[] args) {
		
		
		
		
		
		/*
		Scanner scanner = new Scanner(System.in);
		System.out.println("Intro su letra Dni");
		String letradni = scanner.nextLine();
		System.out.println("Letra dni = " + letradni);
		
		System.out.println("Intro su nº Dni");
		int numdni = scanner.nextInt();
		System.out.println("Num dni = " + numdni);	


		
		//Y CON ESA INFO, CONSTRUIMOS UN DNI
		Dni dni = new Dni();
		dni.numero = numdni;
		dni.letra = letradni.charAt(0);
		System.out.println("DNI = " + dni.numero + "-" +dni.letra);
		char letraCalculada =  dni.calcularLetra();
		System.out.println("La letrada calculdada es " + letraCalculada);
		//DESPUÉS, VAMOS A COMPROBAR SI EL DNI ES CORRECTO
		//SI LA LETRA SE CORRESPONDE CON EL NÚMERO
		/// */
		
		Dni dni1 = new Dni(50558785);
		char letraCalculada= dni1.calcularLetra();
		System.out.println(letraCalculada);
	}

}
