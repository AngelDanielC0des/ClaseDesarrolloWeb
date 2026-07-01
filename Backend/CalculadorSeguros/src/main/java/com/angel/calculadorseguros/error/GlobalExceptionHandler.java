package com.angel.calculadorseguros.error;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

/**
 * ============================================================
 *        MANEJO GLOBAL DE EXCEPCIONES (GLOBAL HANDLER)
 * ============================================================
 *
 * ¿Qué es @RestControllerAdvice?
 *   Es un @Component "ampliado" que aplica a TODOS los @RestController
 *   de la aplicación. Aquí centralizamos cómo se traducen las
 *   excepciones a respuestas HTTP, evitando repetir try/catch en
 *   cada controller.
 *
 * ¿Cómo funciona?
 *   1) Un controller (o el @Valid previo) lanza una excepción.
 *   2) Spring busca en este advice un @ExceptionHandler cuyo
 *      parámetro sea del mismo tipo (o un supertipo).
 *   3) El método elegido se ejecuta y su ResponseEntity es lo
 *      que recibe el cliente.
 *
 *   Si NO hay handler, Spring usa el DefaultHandlerExceptionResolver
 *   y devuelve respuestas "feas" (un mapa con timestamp y status).
 *   Por eso este advice añade valor real: controlas el formato.
 *
 * Orden de los handlers:
 *   Spring prueba de MÁS ESPECÍFICO a MÁS GENÉRICO. Por eso
 *   el handler de Exception.class va ÚLTIMO (es el "fallback").
 * ============================================================
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * Caso 1: VALIDACIÓN (@Valid falla en el controller).
     *
     *   Se lanza cuando el JSON entrante NO cumple las anotaciones
     *   de validación de los records (modelo): @NotNull, @Min, @Max,
     *   @Positive, @NotBlank, etc.
     *
     *   La excepción trae un BindingResult con TODOS los errores;
     *   los mapeamos a nuestra lista de FieldError para que el
     *   cliente reciba un JSON limpio y útil.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidation(MethodArgumentNotValidException ex,
                                                     HttpServletRequest request) {
        List<ApiError.FieldError> errores = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(fe -> new ApiError.FieldError(fe.getField(), fe.getDefaultMessage()))
                .toList();

        return build(HttpStatus.BAD_REQUEST,
                "Los datos enviados no son válidos",
                request,
                errores);
    }

    /**
     * Caso 2: JSON malformado o tipo de dato incorrecto.
     *
     *   Se lanza cuando Jackson no puede parsear el body. Ejemplos:
     *     - El body no es un JSON válido (llaves de más, comas mal puestas)
     *     - Un campo llega con un tipo que no encaja (ej. "abc" en un Integer)
     *     - El body viene vacío
     *
     *   Sin este handler, Spring devolvería un 400 con un cuerpo
     *   "estándar" poco descriptivo. Aquí lo envolvemos en nuestro
     *   ApiError unificado.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiError> handleNotReadable(HttpMessageNotReadableException ex,
                                                      HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST,
                "El cuerpo de la petición está malformado o tiene tipos incorrectos",
                request,
                List.of());
    }

    /**
     * Caso 3: CUALQUIER otra excepción no controlada (catch-all).
     *
     *   Este handler es el último recurso: si algo explota en el
     *   servicio o en el controller por un motivo NO previsto
     *   (NullPointerException, ArithmeticException, etc.), aquí
     *   lo convertimos en un 500 controlado en vez de exponer el
     *   stacktrace al cliente (que sería un problema de seguridad).
     *
     *   En un proyecto real aquí se enviaría una notificación
     *   (Slack, Sentry, etc.). Para examen, basta con loguearlo.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGeneric(Exception ex, HttpServletRequest request) {
        // Logueamos el stacktrace en el servidor para poder depurar.
        // OJO: NO lo enviamos al cliente (filtramos info sensible).
        log.error("Error no controlado en {}: {}", request.getRequestURI(), ex.getMessage(), ex);

        return build(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ha ocurrido un error inesperado",
                request,
                List.of());
    }

    /**
     * Helper privado: arma el ResponseEntity con el ApiError uniforme.
     * Centraliza la construcción para que los 3 handlers de arriba
     * no repitan la misma lógica y para garantizar que TODAS las
     * respuestas de error llevan el helpUrl de http.cat.
     *
     *   - status:    código HTTP (se usa también para status y error)
     *   - message:   mensaje legible para humanos
     *   - request:   para extraer el path
     *   - fieldErrors: lista de errores de validación (vacía si no aplica)
     */
    private ResponseEntity<ApiError> build(HttpStatus status,
                                           String message,
                                           HttpServletRequest request,
                                           List<ApiError.FieldError> fieldErrors) {
        ApiError body = new ApiError(
                LocalDateTime.now(),
                status.value(),
                status.getReasonPhrase(),
                message,
                request.getRequestURI(),
                MDC.get("correlationId"),
                ApiError.helpUrlFor(status.value()),
                fieldErrors);

        return ResponseEntity.status(status).body(body);
    }
}
