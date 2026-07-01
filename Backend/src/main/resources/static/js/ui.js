/**
 * ui.js
 * ----------------------------------------------------------------
 * Capa de presentación. Es la ÚNICA parte del frontend que toca
 * el DOM (lectura de inputs, pintado de errores, pintado de la
 * respuesta, loading state del botón).
 *
 * El resto de módulos (validators, api, app) reciben y devuelven
 * datos puros. Esto facilita testearlos y reutilizarlos.
 *
 * Convenciones del HTML que este módulo espera:
 *   - <form id="form-{tipo}">           → un form por tipo de seguro
 *   - <input data-form="{tipo}">         → inputs agrupados por form
 *   - <input data-field="{nombre}">      → nombre del campo en el body
 *   - <span class="error-msg">           → hermano del input para errores
 *   - <button type="submit">             → botón de envío del form
 *   - <pre id="salida">                  → zona de respuesta (JSON)
 *   - <p id="correlacion">               → zona del correlation ID
 *   - <div id="cat"> con <img id="cat-img"> → zona del gato (http.cat)
 */

const SELECTOR_INPUTS = (tipo) => `[data-form="${tipo}"]`;

export function construirBody(tipo) {
    const body = {};
    document.querySelectorAll(SELECTOR_INPUTS(tipo)).forEach(input => {
        const field = input.dataset.field;
        if (input.type === 'checkbox') {
            body[field] = input.checked;
        } else if (input.type === 'number') {
            // parseFloat de '' da NaN. Lo mandamos como null para
            // que el backend lo rechace con @NotNull en vez de
            // aceptarlo como 0 (que NO es lo que el usuario quiso).
            body[field] = input.value === '' ? null : parseFloat(input.value);
        } else {
            body[field] = input.value;
        }
    });
    return body;
}

export function setFieldError(input, message) {
    input.classList.add('input-error');
    const span = input.parentElement.querySelector('.error-msg');
    if (span) span.textContent = message;
}

export function clearFieldError(input) {
    input.classList.remove('input-error');
    const span = input.parentElement.querySelector('.error-msg');
    if (span) span.textContent = '';
}

export function clearAllErrors(tipo) {
    document.querySelectorAll(SELECTOR_INPUTS(tipo)).forEach(clearFieldError);
}

/**
 * errores: [{ field, message }, ...] devuelto por validators.js
 * Busca en TODO el documento el input que tenga data-field = field.
 * Como cada campo del modelo solo aparece en un form, no hay
 * ambigüedad.
 */
export function marcarErrores(errores) {
    errores.forEach(({ field, message }) => {
        if (field === '_form') return; // error genérico, no asociado a input
        const input = document.querySelector(`[data-field="${field}"]`);
        if (input) setFieldError(input, message);
    });
}

/**
 * Pinta la respuesta del backend en la zona de salida.
 * Si la respuesta es un error (ok=false) y trae el helpUrl de
 * http.cat, muestra además la imagen del gato correspondiente.
 *
 * Nota sobre CORS: usamos <img src> directamente. El navegador
 * carga imágenes cross-origin sin necesidad de la cabecera
 * Access-Control-Allow-Origin (esa solo aplica a fetch/XHR).
 * Si intentáramos hacer fetch a http.cat, SÍ habría CORS porque
 * http.cat no envía esa cabecera; por eso optamos por <img>.
 */
export function mostrarResultado({ status, ok, data, correlationId }) {
    const salida = document.getElementById('salida');
    const correlacion = document.getElementById('correlacion');
    salida.className = ok ? 'ok' : 'err';
    salida.textContent = `HTTP ${status}\n` + JSON.stringify(data, null, 2);
    correlacion.textContent = correlationId
        ? `Correlation ID: ${correlationId}`
        : 'Correlation ID: —';

    mostrarGato(ok, status, data);
}

export function mostrarErrorRed(mensaje) {
    const salida = document.getElementById('salida');
    const correlacion = document.getElementById('correlacion');
    salida.className = 'err';
    salida.textContent = 'Error de red: ' + mensaje;
    correlacion.textContent = 'Correlation ID: —';
    ocultarGato();
}

export function setLoading(form, isLoading) {
    const boton = form.querySelector('button[type="submit"]');
    if (!boton) return;
    if (!boton.dataset.originalText) {
        boton.dataset.originalText = boton.textContent;
    }
    boton.disabled = isLoading;
    boton.textContent = isLoading ? 'Calculando…' : boton.dataset.originalText;
}

/**
 * Muestra u oculta la imagen del gato de http.cat según el resultado.
 * Defensivo: valida que la URL sea http(s) antes de asignarla a <img>
 * y, si la imagen FALLA al cargar (http.cat caído, sin red, etc.),
 * oculta el bloque para no mostrar un icono de imagen rota.
 */
function mostrarGato(ok, status, data) {
    const cat = document.getElementById('cat');
    const img = document.getElementById('cat-img');
    const caption = cat ? cat.querySelector('.cat-caption') : null;
    if (!cat || !img) return;

    if (!ok && data && esUrlSegura(data.helpUrl)) {
        img.src = data.helpUrl;
        img.alt = `HTTP ${status} - gato de error (http.cat)`;
        if (caption) caption.textContent = data.helpUrl;
        // Si la imagen falla al cargar (http.cat caído, sin red, etc.),
        // ocultamos el bloque para no mostrar un icono de imagen rota.
        img.onerror = () => ocultarGato();
        cat.classList.remove('hidden');
    } else {
        ocultarGato();
    }
}

function ocultarGato() {
    const cat = document.getElementById('cat');
    if (cat) cat.classList.add('hidden');
}

/**
 * Defensa: solo aceptamos URLs http(s) en el src del <img>.
 * Evita asignar 'javascript:', 'data:' malicioso, etc.
 */
function esUrlSegura(url) {
    return typeof url === 'string'
        && url.length > 0
        && (url.startsWith('http://') || url.startsWith('https://'));
}
