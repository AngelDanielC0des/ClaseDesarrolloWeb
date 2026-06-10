const contactForm = document.getElementById('contact-form');
const userNameInput = document.getElementById('user-name');
const nameError = document.getElementById('name-error');
const successStatus = document.getElementById('success-status');
const servicesLink = document.getElementById('services-link');

// Indica si el campo ya ha sido validado al menos una vez (por blur o por submit).
// Es la pieza central del patrón "reward early, punish late": mientras es false no se
// muestra ningún error durante la primera escritura; una vez es true, el evento 'input'
// pasa a re-evaluar para RETIRAR el error en cuanto el dato vuelve a ser válido.
let hasBeenValidated = false;

// [ACCESIBILIDAD - Control de teclado en elementos deshabilitados]
// Aunque el cursor indique 'not-allowed', un usuario de teclado puede alcanzar el enlace
// por tabulación y pulsar "Enter". Interceptar el clic bloquea el comportamiento nativo y
// evita el salto brusco al ancla '#', que desorientaría a quien no ve la pantalla.
servicesLink.addEventListener('click', (event) => {
    event.preventDefault();
});

// Única fuente de verdad de la validación. Refleja el estado actual del campo en la UI y
// en la semántica de asistencia, y devuelve si el valor es válido. La regla es deliberadamente
// mínima —nombre no vacío tras recortar espacios— porque cualquier longitud mínima excluiría
// nombres reales cortos o mononímicos.
function validateName() {
    const value = userNameInput.value.trim();
    const isValid = value.length > 0;

    if (isValid) {
        nameError.textContent = '';
        // [WCAG 4.1.2] Devolver aria-invalid a "false" informa a la tecnología de asistencia
        // de que el campo ha dejado de estar en error.
        userNameInput.setAttribute('aria-invalid', 'false');
    } else {
        nameError.textContent = 'Introduce tu nombre para continuar.';
        // [WCAG 4.1.2] Marcar aria-invalid="true" permite al lector anunciar el campo como
        // erróneo y, si procede, alterar su tono o emitir una alerta específica.
        userNameInput.setAttribute('aria-invalid', 'true');
    }

    return isValid;
}

// "Punish late": el primer aviso no llega mientras el usuario teclea, sino al abandonar el
// campo. Así se valida cuando es razonable suponer que ha terminado de escribir, evitando los
// anuncios entrecortados que 'aria-live' produciría al evaluar en cada pulsación.
userNameInput.addEventListener('blur', () => {
    hasBeenValidated = true;
    validateName();
});

// "Reward early": solo después del primer fallo se evalúa en tiempo real, y con el objetivo de
// limpiar el error en el instante en que el usuario lo corrige —nunca para regañar durante la
// escritura inicial, que es cuando 'hasBeenValidated' aún es false.
userNameInput.addEventListener('input', () => {
    if (hasBeenValidated) {
        validateName();
    }
});

// [CLEAN CODE / SEGURIDAD] 'addEventListener' sustituye a los manejadores inline tipo
// 'onsubmit="..."', reduciendo la superficie de inyección de código en el marcado.
contactForm.addEventListener('submit', (event) => {
    // Detiene la recarga del documento, preservando la posición del foco.
    event.preventDefault();

    // El envío es siempre un punto de validación, con independencia de la interacción previa.
    hasBeenValidated = true;

    if (!validateName()) {
        // [ACCESIBILIDAD - Gestión activa del foco] Llevar el foco al campo erróneo es
        // indispensable: sin esto, el foco del teclado quedaría flotando y el usuario sin vista
        // no sabría qué falló. Al moverlo aquí, escucha el nombre del campo y su error asociado
        // (vía aria-describedby) en un solo flujo.
        userNameInput.focus();
        return;
    }

    // --- ÉXITO ---
    // Reseteo nativo del formulario y vuelta al estado base de validación.
    contactForm.reset();
    userNameInput.setAttribute('aria-invalid', 'false');
    nameError.textContent = '';

    // Tras el reset el campo vuelve a estar vacío y "limpio": restablecer el flag devuelve el
    // comportamiento "reward early" para el próximo registro, de modo que no se muestren errores
    // mientras se escribe de nuevo desde cero.
    hasBeenValidated = false;

    // [WCAG 4.1.3] La confirmación se anuncia desde una región propia con role="status"
    // (aria-live="polite" implícito), separada del nodo de error para no mezclar semánticas.
    successStatus.textContent = 'Registro completado con éxito.';

    // Limpieza del mensaje tras unos segundos. No se reubica el foco: hacerlo sería un cambio
    // de contexto inesperado (WCAG 3.2) que arrancaría al usuario de donde estuviera leyendo.
    setTimeout(() => {
        successStatus.textContent = '';
    }, 4000);
});
