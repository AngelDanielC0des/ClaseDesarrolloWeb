package com.angel.calculadorseguros.servicio;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.angel.calculadorseguros.modelo.RespuestaPoliza;
import com.angel.calculadorseguros.modelo.SolicitudHogar;
import com.angel.calculadorseguros.modelo.SolicitudSalud;
import com.angel.calculadorseguros.modelo.SolicitudVida;

/**
 * ===========================================================
 *                CAPA DE SERVICIO (lógica de negocio)
 * ===========================================================
 *
 * ¿Qué hace esta clase?
 *   Contiene las FÓRMULAS para calcular el precio de una póliza
 *   a partir de los datos de la solicitud. NO toca HTTP, JSON
 *   ni nada de Spring en sus métodos: recibe records y devuelve
 *   records.
 *
 * ¿Por qué es importante separarla del controller?
 *   - Reutilización: otro controller, un test, un batch, etc.
 *     pueden llamar a estos métodos sin levantar la web.
 *   - Testabilidad: se puede testear con JUnit sin necesidad de
 *     MockMvc ni de arrancar el contexto de Spring.
 *   - Claridad: el controller "traduce" y el service "calcula".
 *
 * @Service
 *   Marca la clase como bean de Spring. Spring la detectará al
 *   arrancar y la inyectará donde se pida (en este caso, en
 *   el Controller por constructor). Las alternativas son
 *   @Component y @Repository, pero @Service es semánticamente
 *   la más adecuada para "capa de servicio".
 *
 * Las constantes de las fórmulas están extraídas como private static
 * final para que las reglas de negocio sean legibles y modificables
 * en un único bloque visible.
 */
@Service
public class CalculadorPolizaService {

    // -------------------- Constantes: HOGAR --------------------
    private static final double HOGAR_PRECIO_POR_M2 = 5.0;
    private static final double HOGAR_PCT_VALOR_MERCADO = 0.001;
    private static final int HOGAR_ANIO_UMBRAL_RECARGO = 1980;
    private static final double HOGAR_FACTOR_RECARGO = 1.10;

    // -------------------- Constantes: VIDA --------------------
    private static final double VIDA_PCT_CAPITAL = 0.005;
    private static final double VIDA_PRECIO_POR_EDAD = 2.0;
    private static final double VIDA_RECARGO_FUMADOR = 100.0;
    private static final double VIDA_DESCUENTO_DEPORTISTA = 50.0;

    // -------------------- Constantes: SALUD --------------------
    private static final double SALUD_CUOTA_BASE = 50.0;
    private static final double SALUD_PRECIO_POR_EDAD = 1.5;
    private static final double SALUD_RECARGO_COPAGO = 30.0;
    private static final double SALUD_RECARGO_DENTAL = 20.0;
    private static final double SALUD_RECARGO_FAMILIAR = 25.0;

    /**
     * Calcula la póliza de HOGAR.
     *
     * Fórmula:
     *   precioBase = metrosCuadrados * HOGAR_PRECIO_POR_M2
     *              + valorMercado * HOGAR_PCT_VALOR_MERCADO
     *   factor     = HOGAR_FACTOR_RECARGO si anioConstruccion < HOGAR_ANIO_UMBRAL_RECARGO
     *                1.0 en caso contrario (sin recargo)
     *   precioFinal = precioBase * factor
     *
     * Idea: a más metros, más superficie a asegurar. Un pequeño
     * porcentaje del valor de mercado cubre el contenido. Las
     * casas muy antiguas (+40 años) tienen más riesgo y llevan
     * recargo del 10%.
     */
    public RespuestaPoliza calcularHogar(SolicitudHogar s) {
        double base = s.metrosCuadrados() * HOGAR_PRECIO_POR_M2
                    + s.valorMercado() * HOGAR_PCT_VALOR_MERCADO;
        double factor = s.anioConstruccion() < HOGAR_ANIO_UMBRAL_RECARGO
                ? HOGAR_FACTOR_RECARGO
                : 1.0;
        return construirRespuesta("HOGAR", base, factor);
    }

    /**
     * Calcula la póliza de VIDA.
     *
     * Fórmula:
     *   precioBase = capital * VIDA_PCT_CAPITAL + edad * VIDA_PRECIO_POR_EDAD
     *   si es fumador    -> + VIDA_RECARGO_FUMADOR €
     *   si es deportista -> - VIDA_DESCUENTO_DEPORTISTA €
     *
     * Idea: 0,5% del capital cubre el riesgo base, la edad
     * sube el precio (a más años, más probabilidad de siniestro),
     * el tabaco sube el riesgo, el deporte lo baja.
     */
    public RespuestaPoliza calcularVida(SolicitudVida s) {
        double base = s.capitalSolicitado() * VIDA_PCT_CAPITAL
                    + s.edadAsegurado() * VIDA_PRECIO_POR_EDAD;
        // Boolean.TRUE.equals(...) evita NullPointerException si
        // por algún motivo el campo fuera null (con @NotNull no
        // debería pasar, pero es una salvaguarda).
        if (Boolean.TRUE.equals(s.esFumador())) {
            base += VIDA_RECARGO_FUMADOR;
        }
        if (Boolean.TRUE.equals(s.esDeportista())) {
            base -= VIDA_DESCUENTO_DEPORTISTA;
        }
        return construirRespuesta("VIDA", base, 1.0);
    }

    /**
     * Calcula la póliza de SALUD.
     *
     * Fórmula:
     *   precioBase = SALUD_CUOTA_BASE + edad * SALUD_PRECIO_POR_EDAD
     *   si copago > 0              -> + SALUD_RECARGO_COPAGO €
     *   si cobertura dental        -> + SALUD_RECARGO_DENTAL €
     *   si cobertura familiar      -> + SALUD_RECARGO_FAMILIAR €
     *
     * Idea: una cuota base fija más un plus por edad. Cada
     * cobertura extra es un "complemento" con su precio. El
     * copago también se traduce en un pequeño recargo administrativo.
     */
    public RespuestaPoliza calcularSalud(SolicitudSalud s) {
        double base = SALUD_CUOTA_BASE + s.edadAsegurado() * SALUD_PRECIO_POR_EDAD;
        if (s.copagoSeleccionado() > 0) {
            base += SALUD_RECARGO_COPAGO;
        }
        if (Boolean.TRUE.equals(s.coberturaDental())) {
            base += SALUD_RECARGO_DENTAL;
        }
        if (Boolean.TRUE.equals(s.coberturaFamiliar())) {
            base += SALUD_RECARGO_FAMILIAR;
        }
        return construirRespuesta("SALUD", base, 1.0);
    }

    /**
     * Helper privado: arma la RespuestaPoliza con los importes
     * redondeados y la fecha de hoy. Centralizar esto evita
     * repetir la misma lógica en los 3 métodos públicos.
     */
    private RespuestaPoliza construirRespuesta(String tipo, double base, double factor) {
        double precioBase = round(base);
        double precioFinal = round(base * factor);
        return new RespuestaPoliza(tipo, precioBase, factor, precioFinal, LocalDate.now());
    }

    /**
     * Redondea un double a 2 decimales.
     * Math.round con el truco de multiplicar/dividir por 100
     * es la forma más simple y suficiente para importes
     * monetarios de un examen.
     */
    private double round(double v) {
        return Math.round(v * 100.0) / 100.0;
    }
}
