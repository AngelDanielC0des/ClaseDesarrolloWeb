package com.angel.calculadorseguros.filtro;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * ============================================================
 *            FILTRO DE CORRELACIÓN (REQUEST ID)
 * ============================================================
 *
 * ¿Qué es un Filter en Spring?
 *   Es un componente que se ejecuta ANTES y DESPUÉS del controller,
 *   dentro de la cadena del servlet (FilterChain). Sirve para
 *   tareas transversales (logging, auth, CORS, tracing, etc.) que
 *   no tienen que ver con la lógica de negocio.
 *
 *   El orden conceptual de una petición es:
 *     SERVLET -> [FILTRO 1] -> [FILTRO 2] -> DISPATCHER SERVLET
 *             -> CONTROLLER -> SERVICIO -> ...
 *     y de vuelta, en orden inverso.
 *
 * ¿Por qué OncePerRequestFilter y no implementar Filter a secas?
 *   Porque Spring garantiza que el filtro se ejecute UNA SOLA VEZ
 *   por petición, incluso si la request se reenvía internamente
 *   (forward/include). Es la clase base recomendada por Spring
 *   para filtros HTTP modernos.
 *
 * ¿Qué hace este filtro?
 *   1) Lee o genera un ID único por petición (cabecera X-Request-Id).
 *   2) Lo guarda en MDC para que aparezca en TODOS los logs de
 *      esa petición sin tener que pasarlo manualmente.
 *   3) Lo devuelve en la respuesta (cabecera X-Request-Id) para
 *      que el cliente pueda referenciarlo si hay un problema.
 *   4) Loguea inicio y fin de la petición con la duración en ms.
 *
 * ¿Qué es MDC (Mapped Diagnostic Context)?
 *   Es un mapa thread-local (org.slf4j.MDC) que Spring Boot expone
 *   automáticamente en el patrón de log. Si en application.properties
 *   pones %X{correlationId}, ese valor aparece en cada línea de log
 *   asociada a esa petición, sin que tengas que concatenarlo tú.
 *
 * ¿Cómo se "comunica" con el GlobalExceptionHandler?
 *   Vía MDC. El handler hace MDC.get("correlationId") para sacar
 *   el mismo ID y meterlo en el cuerpo del error.
 * ============================================================
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // se ejecuta lo antes posible en la cadena
public class CorrelationIdFilter extends OncePerRequestFilter {

    private static final String HEADER = "X-Request-Id";
    private static final String MDC_KEY = "correlationId";

    // Logger propio (SLF4J) en vez del 'logger' de la clase padre
    // porque el de OncePerRequestFilter es commons-logging y no soporta varargs.
    private static final Logger log = LoggerFactory.getLogger(CorrelationIdFilter.class);

    /**
     * El corazón del filtro. Spring lo invoca una vez por petición.
     *
     *  - request  : la petición HTTP entrante
     *  - response : la respuesta que estamos construyendo
     *  - chain    : la cadena de filtros; al llamar a chain.doFilter,
     *               dejamos que la petición siga su curso
     *               (siguiente filtro -> dispatcher -> controller).
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        // 1) Si el cliente ya nos mandó un X-Request-Id lo respetamos
        //    (típico cuando hay un API gateway o un frontend que ya
        //    genera IDs). Si no, generamos uno nuevo.
        String correlationId = request.getHeader(HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        // 2) Lo guardamos en MDC (para los logs) y en la respuesta
        //    (para que el cliente lo vea). ANTES de doFilter, porque
        //    una vez que el response está commiteado, fijar cabeceras
        //    puede no tener efecto.
        MDC.put(MDC_KEY, correlationId);
        response.setHeader(HEADER, correlationId);

        long inicio = System.currentTimeMillis();
        log.info("--> {} {}", request.getMethod(), request.getRequestURI());

        try {
            // 3) Continuamos la cadena: aquí es donde se ejecutan el resto
            //    de filtros, el controller, el servicio, etc.
            chain.doFilter(request, response);
        } finally {
            // 4) El bloque finally se ejecuta SIEMPRE, tanto si todo fue
            //    bien como si saltó una excepción. Es el sitio perfecto
            //    para "limpiar" el MDC y para loguear el resultado.
            long duracion = System.currentTimeMillis() - inicio;
            log.info("<-- {} {} ({} ms, status {})",
                    request.getMethod(), request.getRequestURI(),
                    duracion, response.getStatus());

            // CRUCIAL: si no limpias, el hilo del pool de Tomcat puede
            // reutilizarse y el siguiente request "heredaría" este ID.
            MDC.remove(MDC_KEY);
        }
    }
}
