package com.angel.calculadorseguros.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.angel.calculadorseguros.modelo.RespuestaPoliza;
import com.angel.calculadorseguros.modelo.SolicitudHogar;
import com.angel.calculadorseguros.modelo.SolicitudSalud;
import com.angel.calculadorseguros.modelo.SolicitudVida;
import com.angel.calculadorseguros.servicio.CalculadorPolizaService;

import jakarta.validation.Valid;

/**
 * ===========================================================
 *                   CAPA CONTROLLER (HTTP)
 * ===========================================================
 *
 * ¿Qué hace un @RestController?
 *   - @Controller: marca la clase como bean que atiende peticiones HTTP.
 *   - @ResponseBody: indica que el valor de retorno de los métodos
 *     se serializa DIRECTAMENTE al body de la respuesta (en JSON,
 *     por defecto gracias a Jackson). Sin esto, Spring buscaría
 *     una vista HTML.
 *   La suma de ambos (@RestController = @Controller + @ResponseBody)
 *   es lo que hace que un método que devuelve 'RespuestaPoliza'
 *   acabe enviando un JSON.
 *
 * ¿Qué hace @RequestMapping("/demo")?
 *   Aplica un prefijo común a TODAS las rutas de esta clase. Es
 *   equivalente a escribir "/demo/hogar", "/demo/vida" y
 *   "/demo/salud" en los mappings de abajo.
 *
 * ¿Inyección por constructor vs @Autowired en campo?
 *   Usamos constructor (estilo recomendado por Spring desde 4.x):
 *     - Inmutabilidad: el campo puede ser 'final'.
 *     - Testabilidad: se puede instanciar la clase manualmente
 *       en un test pasando un mock del servicio, sin necesidad
 *       de reflexión ni de un contexto de Spring.
 *   @Autowired en el campo o con setter funcionan, pero esconden
 *   dependencias y dificultan los tests.
 */
@RestController
@RequestMapping("/demo")
public class Controller {

    private final CalculadorPolizaService service;

    public Controller(CalculadorPolizaService service) {
        this.service = service;
    }

    /**
     * POST /demo/hogar
     *
     * Anotaciones del método:
     *   - @PostMapping("/hogar")
     *       Acepta solo peticiones POST. La ruta final es
     *       "/demo" (de la clase) + "/hogar" (del método) = "/demo/hogar".
     *
     *   - @RequestBody SolicitudHogar solicitud
     *       Le dice a Spring: "toma el BODY de la petición, conviértelo
     *       de JSON a un SolicitudHogar (vía Jackson) y pásalo al método".
     *       Si el body falta o no se puede parsear, se lanza
     *       HttpMessageNotReadableException (lo captura el advice).
     *
     *   - @Valid
     *       DISPARA las validaciones declaradas en el record. Si alguna
     *       falla, se lanza MethodArgumentNotValidException ANTES de
     *       ejecutar el cuerpo del método, y el GlobalExceptionHandler
     *       devuelve 400 con el JSON uniforme de error.
     *
     *   - ResponseEntity<RespuestaPoliza>
     *       Envuelve la respuesta para poder fijar código HTTP, cabeceras
     *       y body de forma explícita. ResponseEntity.ok(...) equivale
     *       a "200 OK con este body".
     */
    @PostMapping("/hogar")
    public ResponseEntity<RespuestaPoliza> calcularHogar(@Valid @RequestBody SolicitudHogar solicitud) {
        return ResponseEntity.ok(service.calcularHogar(solicitud));
    }

    /**
     * POST /demo/vida -> ver Javadoc del método anterior, la mecánica
     * es idéntica cambiando el record.
     */
    @PostMapping("/vida")
    public ResponseEntity<RespuestaPoliza> calcularVida(@Valid @RequestBody SolicitudVida solicitud) {
        return ResponseEntity.ok(service.calcularVida(solicitud));
    }

    /**
     * POST /demo/salud -> ver Javadoc del primer método.
     */
    @PostMapping("/salud")
    public ResponseEntity<RespuestaPoliza> calcularSalud(@Valid @RequestBody SolicitudSalud solicitud) {
        return ResponseEntity.ok(service.calcularSalud(solicitud));
    }
}
