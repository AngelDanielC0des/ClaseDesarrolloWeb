package com.angel.calculadorseguros.modelo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO de ENTRADA para el seguro de VIDA.
 *
 * Mismas reglas que SolicitudHogar: record inmutable con
 * validaciones de Jakarta. Ver el Javadoc de SolicitudHogar
 * para la explicación detallada de records, @Valid y por qué
 * se usan wrappers en vez de primitivos.
 *
 * Punto importante de este DTO:
 *   esFumador y esDeportista son Boolean (objeto), no boolean.
 *   Si fueran primitivos, valdrían 'false' por defecto y
 *   @NotNull no podría distinguir "el cliente no lo envió"
 *   de "el cliente envió false". Con Boolean, llegan como
 *   'true', 'false' o 'null' (ausente), y @NotNull los filtra.
 */
public record SolicitudVida(
        @NotNull(message = "edadAsegurado es obligatoria")
        @Min(value = 18, message = "edadAsegurado mínima 18")
        @Max(value = 90, message = "edadAsegurado máxima 90")
        Integer edadAsegurado,

        @NotNull(message = "capitalSolicitado es obligatorio")
        @Positive(message = "capitalSolicitado debe ser positivo")
        Double capitalSolicitado,

        @NotNull(message = "esFumador es obligatorio")
        Boolean esFumador,

        @NotNull(message = "esDeportista es obligatorio")
        Boolean esDeportista) {
}
