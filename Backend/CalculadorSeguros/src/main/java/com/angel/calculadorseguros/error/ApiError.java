package com.angel.calculadorseguros.error;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO uniforme para TODAS las respuestas de error de la API.
 *
 * ¿Por qué un único formato?
 *   Para que el cliente (frontend o consumidor de la API) SIEMPRE
 *   sepa dónde encontrar: cuándo pasó, qué código HTTP, un mensaje
 *   legible, en qué endpoint, un ID de correlación, un enlace a
 *   http.cat con la "imagen" del error y, si procede, la lista de
 *   campos que no validaron.
 *
 * ¿Por qué un record?
 *   Porque es inmutable, conciso y Spring lo serializa a JSON
 *   sin configuración extra.
 *
 * ¿Por qué un campo helpUrl?
 *   Para darle al cliente algo accionable cuando recibe un error:
 *   la URL pública de http.cat correspondiente al status. Así
 *   puede, por ejemplo, mostrar la imagen del gato junto al JSON
 *   o enlazar a documentación. Ver {@link #helpUrlFor(int)}.
 */
public record ApiError(
        LocalDateTime timestamp,
        int status,
        String error,
        String message,
        String path,
        String correlationId,
        String helpUrl,
        List<FieldError> fieldErrors) {

    /**
     * Base de la URL de http.cat. http.cat sirve una imagen (un gato)
     * por cada código HTTP: https://http.cat/400, https://http.cat/500, etc.
     */
    public static final String HTTP_CAT_BASE = "https://http.cat/";

    /**
     * Construye la URL de http.cat para un status HTTP dado.
     * Centralizar esto evita repetir la cadena en cada handler
     * y permite cambiarla (por ejemplo, a un proxy interno) en
     * un único punto.
     */
    public static String helpUrlFor(int status) {
        return HTTP_CAT_BASE + status;
    }

    /**
     * Sub-record para representar UN error de validación concreto.
     * Cuando @Valid falla, Spring nos da tantos de estos como campos
     * haya incumpliendo las restricciones declaradas en el record de entrada.
     *
     * field    -> nombre del campo que ha fallado (ej. "edadAsegurado")
     * message  -> mensaje legible asociado a la anotación
     *             (ej. "must be greater than or equal to 18" para @Min(18))
     */
    public record FieldError(String field, String message) {
    }
}
