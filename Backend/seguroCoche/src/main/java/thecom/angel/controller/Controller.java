package thecom.angel.controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import thecom.angel.modelo.SalidaSCoche;
import thecom.angel.modelo.SolicitudSCoche;
import thecom.angel.service.SeguroService;

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

    
    Logger logger = LoggerFactory.getLogger(Controller.class);
    
    @PostMapping("/simular")
    public ResponseEntity<SalidaSCoche> simular(@Valid @RequestBody SolicitudSCoche solicitud) {
        SalidaSCoche resultado = seguroService.calcularSeguro(solicitud);
        return ResponseEntity.ok(resultado);
    }
}
