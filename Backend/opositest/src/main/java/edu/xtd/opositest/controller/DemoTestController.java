package edu.xtd.opositest.controller;


import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.xtd.opositest.modelo.Test;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

//CONTROLLER ES LA CLASE QUE VE EL CLIENTE
//MISIÓN: RECIBIR PETICIONES HTTP Y CONTESTARLAS
// ES EL GATO.

//REST - POR DEFECTO SE ASUME .JSON COMO FORMATO DE RESPUESTA
@RestController
@RequestMapping("/demo") // TODAS LAS PETICIONES A /demo, SON PARA ESTA CLASE
public class DemoTestController {
	@GetMapping("/saludo") //UNA PETICIÓN GET a /demo/saludo VENDRÁ AQUÍ
public String saludo () {
	String saludo ="HOLA";
	return saludo;
}
	@GetMapping("/saludo-personalizado")
	public ResponseEntity<Void> saludoPersonalizado(@RequestParam String nombre, @RequestParam int edad) {
		String saludo = "Hola soy " + nombre + " y tengo " + edad + " años";
		String saludoCodificado = URLEncoder.encode(saludo, StandardCharsets.UTF_8);
		HttpHeaders headers = new HttpHeaders();
		headers.add("Location", "/index.html?mensaje=" + saludoCodificado);
		return new ResponseEntity<>(headers, HttpStatus.FOUND);
	}
	@GetMapping("/obtenerTest/{id}")
	public String obtenerTest (@PathVariable int id) {
		String respuesta = "El cliente quiere el test " +id;
		return respuesta;
	}
	@GetMapping("/testJson")
	public Test obtenerTestJson () {
		Test test = new Test (1,"La constitución", 10);
		return test;
		}
	} 
