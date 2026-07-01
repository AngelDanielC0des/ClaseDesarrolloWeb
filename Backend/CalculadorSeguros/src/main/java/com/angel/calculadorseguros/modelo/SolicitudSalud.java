package com.angel.calculadorseguros.modelo;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

/**
 * DTO de ENTRADA para el seguro de SALUD.
 *
 * Mismas reglas que los otros DTOs. Ver el Javadoc de
 * SolicitudHogar para la explicación detallada.
 *
 * Novedades de validación en este record:
 *   - @PositiveOrZero: en 'copagoSeleccionado' permitimos 0
 *     (sin copago) o cualquier positivo. @Positive exigiría
 *     > 0, lo que no encaja con "puedo no querer copago".
 *   - @Min(0) en edadAsegurado: a diferencia de la vida, en
 *     salud se puede asegurar a un bebé (0 años).
 */
public record SolicitudSalud(
        @NotNull(message = "edadAsegurado es obligatoria")
        @Min(value = 0, message = "edadAsegurado mínima 0")
        @Max(value = 120, message = "edadAsegurado máxima 120")
        Integer edadAsegurado,

        @NotNull(message = "copagoSeleccionado es obligatorio")
        @PositiveOrZero(message = "copagoSeleccionado debe ser 0 o positivo")
        Double copagoSeleccionado,

        @NotNull(message = "coberturaDental es obligatoria")
        Boolean coberturaDental,

        @NotNull(message = "coberturaFamiliar es obligatoria")
        Boolean coberturaFamiliar) {
}
