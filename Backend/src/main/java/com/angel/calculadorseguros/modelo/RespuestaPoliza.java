package com.angel.calculadorseguros.modelo;

import java.time.LocalDate;

/**
 * DTO de SALIDA común a los 3 endpoints.
 *
 * ¿Por qué un solo record para las 3 respuestas en vez de uno por endpoint?
 *   Para que el cliente consuma SIEMPRE la misma forma de JSON,
 *   independientemente de qué tipo de seguro haya pedido. Esto
 *   simplifica el frontend y el contrato de la API.
 *
 * Campos:
 *   - tipo        : "HOGAR" | "VIDA" | "SALUD". Permite al cliente
 *                   saber qué póliza se acaba de calcular sin tener
 *                   que recordarlo del request.
 *   - precioBase  : importe calculado ANTES de aplicar el factor.
 *   - factor      : multiplicador (1.0 normal, 1.10 con recargo, etc.).
 *                   Se devuelve aunque sea 1.0 para que el cliente
 *                   sepa SI se aplicó recargo o no.
 *   - precioFinal : precioBase * factor, redondeado a 2 decimales.
 *   - fechaCalculo: día en que se hizo el cálculo (auditoría).
 *
 * ¿Por qué LocalDate y no LocalDateTime?
 *   Porque el cálculo de la póliza no depende de la hora, solo del
 *   día. Si necesitaras auditoría precisa, usarías LocalDateTime o
 *   Instant.
 */
public record RespuestaPoliza(
        String tipo,
        double precioBase,
        double factor,
        double precioFinal,
        LocalDate fechaCalculo) {
}
