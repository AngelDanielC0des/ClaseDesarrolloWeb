package thecom.angel.service;

import org.springframework.stereotype.Service;

import edu.xtd.opositest.modelo.SalidaSCoche;
import edu.xtd.opositest.modelo.SolicitudSCoche;
import edu.xtd.opositest.modelo.TipoCobertura;

@Service
public class SeguroService {

    private static final double PRIMA_BASE = 300.0;

    public SalidaSCoche calcularSeguro(SolicitudSCoche solicitud) {
        double prima = PRIMA_BASE;

        if (solicitud.edadConductor() < 25) {
            prima += 150;
        } else if (solicitud.edadConductor() > 65) {
            prima += 100;
        }

        if (solicitud.antiguedadCarnet() < 2) {
            prima += 200;
        } else if (solicitud.antiguedadCarnet() <= 10) {
            prima += 50;
        }

        prima += solicitud.valorVehiculo() * 0.02;

        if (solicitud.tipoCobertura() == TipoCobertura.TERCEROS_AMPLIADO) {
            prima += 150;
        } else if (solicitud.tipoCobertura() == TipoCobertura.TODO_RIESGO) {
            prima += 400;
        }

        if (Boolean.TRUE.equals(solicitud.tieneGaraje())) {
            prima = prima - prima * 0.10;
        }

        return new SalidaSCoche("COCHE", prima);
    }
}
