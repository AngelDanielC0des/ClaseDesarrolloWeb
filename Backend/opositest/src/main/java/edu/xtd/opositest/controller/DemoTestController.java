package edu.xtd.opositest.controller;


import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

//CONTROLLER ES LA CLASE QUE VE EL CLIENTE
//MISIÓN: RECIBIR PETICIONES HTTP Y CONTESTARLAS
// ES EL GATO.

//REST - POR DEFECTO SE ASUME .JSON COMO FORMATO DE RESPUESTA
@Controller
@RequestMapping("/demo") // TODAS LAS PETICIONES A /demo, SON PARA ESTA CLASE
public class DemoTestController {
	@GetMapping("/saludo") //UNA PETICIÓN GET a /demo/saludo VENDRÁ AQUÍ
public String saludo () {
	String saludo ="HOLA";
	return saludo;
}
	@GetMapping("/saludo-personalizado") //UNA PETICIÓN GET a /demo/saludo VENDRÁ AQUÍ
public String saludoPersonalizado(@RequestParam String nombre, @RequestParam int edad,  Model model) {
	String saludo ="Hola soy " + nombre + " y tengo " + edad + " años";
	String saludoCodificado = URLEncoder.encode(saludo, StandardCharsets.UTF_8);
	   return "redirect:/index.html?mensaje=" + saludoCodificado;

}
	@GetMapping("/obtenerTest/{id}")
	public String obtenerTest (@PathVariable int id) {
		String respuesta = "El cliente quiere el test " +id;
		return respuesta;
	}
}
