package com.angel.calculadorseguros.modelo;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

/**
 * DTO de ENTRADA para el seguro de HOGAR.
 *
 * ¿Qué es un record?
 *   Es una clase inmutable de Java 16+ que genera automáticamente
 *   constructor, getters, equals, hashCode y toString. Los records
 *   son perfectos para DTOs: una vez recibido el JSON, no se
 *   modifica el objeto, solo se lee.
 *
 * ¿Qué hace @Valid en el controller?
 *   Spring, al ver @Valid antes del @RequestBody, mira TODAS las
 *   anotaciones de jakarta.validation de los componentes de este
 *   record y, si alguna falla, lanza MethodArgumentNotValidException
 *   ANTES de entrar en el método. Eso lo captura después el
 *   GlobalExceptionHandler para devolver un 400 con el JSON
 *   uniforme de error.
 *
 * ¿Por qué wrappers (Double, Integer) y NO primitivos (double, int)?
 *   Las anotaciones de validación solo aplican a tipos OBJETO.
 *   Si pusiéramos 'double metrosCuadrados' y el cliente omitiera
 *   el campo, Java le pondría 0 por defecto y @NotNull no podría
 *   detectar el error. Con Double, el campo puede ser null y
 *   @NotNull salta.
 *
 * ¿Qué pasa si el cliente envía un TIPO incorrecto (ej. "abc" en vez de 80)?
 *   Jackson (el serializador JSON de Spring) intenta convertir y
 *   falla. Eso genera HttpMessageNotReadableException, que también
 *   es capturada por el GlobalExceptionHandler.
 */
public record SolicitudHogar(
        @NotNull(message = "metrosCuadrados es obligatorio")
        @Positive(message = "metrosCuadrados debe ser positivo")
        @Min(value = 20, message = "metrosCuadrados mínimo 20")
        Double metrosCuadrados,

        @NotNull(message = "anioConstruccion es obligatorio")
        @Min(value = 1900, message = "anioConstruccion mínimo 1900")
        Integer anioConstruccion,

        @NotNull(message = "valorMercado es obligatorio")
        @Positive(message = "valorMercado debe ser positivo")
        Double valorMercado,

        @NotBlank(message = "zona no puede estar vacía")
        String zona) {
}
