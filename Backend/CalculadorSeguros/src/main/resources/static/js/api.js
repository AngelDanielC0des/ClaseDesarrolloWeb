/**
 * api.js
 * ----------------------------------------------------------------
 * Capa de comunicación con el backend. Es la ÚNICA parte del frontend
 * que sabe que existe un servidor y una URL. Si mañana la API cambia
 * de ruta o se añade autenticación, solo se toca este archivo.
 *
 * Exporta:
 *   - calcular(tipo, body): hace POST a /demo/{tipo} y devuelve
 *     { status, ok, data, correlationId }. NO lanza excepciones
 *     de red: si el fetch falla, propaga el error para que el
 *     orquestador (app.js) lo muestre.
 */

export async function calcular(tipo, body) {
    const resp = await fetch(`/demo/${tipo}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    // Puede que el backend devuelva un body que no sea JSON válido
    // (poco probable, pero por seguridad usamos .catch para
    // que data sea null en ese caso en vez de reventar).
    const data = await resp.json().catch(() => null);

    return {
        status: resp.status,
        ok: resp.ok,
        data,
        // El CorrelationIdFilter del backend inyecta esta cabecera
        // en CADA respuesta. Si el cliente la manda en su request
        // (X-Request-Id), el filtro la respeta; si no, genera una.
        correlationId: resp.headers.get('X-Request-Id')
    };
}
