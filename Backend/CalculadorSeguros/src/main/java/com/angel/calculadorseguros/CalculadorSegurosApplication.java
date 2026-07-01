package com.angel.calculadorseguros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ===========================================================
 *                  ENTRYPOINT DE LA APLICACIÓN
 * ===========================================================
 *
 * Esta clase es el "main" de una app Spring Boot. La genera
 * automáticamente Spring Initializr (https://start.spring.io)
 * y NO se debería borrar.
 *
 * ¿Qué hace @SpringBootApplication?
 *   Es una "meta-anotación" que equivale a poner tres a la vez:
 *     1) @Configuration
 *        -> La clase puede definir beans (@Bean) si hicieran falta.
 *     2) @EnableAutoConfiguration
 *        -> Spring Boot mira el classpath y configura TODO lo
 *           que pueda automáticamente: servidor Tomcat, Jackson
 *           para JSON, Hibernate si hubiera JPA, etc.
 *     3) @ComponentScan
 *        -> Escanea este paquete (com.angel.calculadorseguros)
 *           y todos los subpaquetes en busca de componentes
 *           (@Component, @Service, @RestController, @Repository,
 *           @Configuration...). Por eso es importante que las
 *           demás clases estén en subpaquetes de este.
 *
 * ¿Qué hace SpringApplication.run(...)?
 *   1) Crea el "contexto" de Spring (el contenedor de beans).
 *   2) Arranca el servidor web embebido (Tomcat por defecto).
 *   3) Deja la app lista para recibir peticiones.
 *
 * ¿Por qué no se hacen más cosas aquí?
 *   Porque Spring Boot sigue el principio "convention over
 *   configuration": con el classpath correcto y esta clase,
 *   ya tienes una app web funcionando. El resto (controladores,
 *   servicios, etc.) se detecta por anotaciones.
 */
@SpringBootApplication
public class CalculadorSegurosApplication {

    public static void main(String[] args) {
        SpringApplication.run(CalculadorSegurosApplication.class, args);
    }
}
