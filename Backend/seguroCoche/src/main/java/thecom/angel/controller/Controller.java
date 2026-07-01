package thecom.angel.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.xtd.opositest.modelo.SalidaSCoche;
import edu.xtd.opositest.modelo.SolicitudSCoche;
import edu.xtd.opositest.service.SeguroService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/seguros/coche")
@Validated
public class Controller {
	
	
	/* Esto es lo que hace el Autowired ( inversión de control): 
	 *  private final SeguroService seguroService;
	 *  Controller(SeguroService seguroService) {
        this.seguroService = seguroService;
    } */
	 
    @Autowired
    private SeguroService seguroService;

    @PostMapping("/simular")
    public ResponseEntity<SalidaSCoche> simular(@Valid @RequestBody SolicitudSCoche solicitud) {
        SalidaSCoche resultado = seguroService.calcularSeguro(solicitud);
        return ResponseEntity.ok(resultado);
    }
}
