/**
 * ======================================================================
 * LECCIÓN: Formulario Avanzado — Lógica de Validación y Eventos HTML5
 * ======================================================================
 * En este archivo aprenderás:
 * 
 * 1. Cómo interactuar con controles HTML5 de rango (<input type="range">)
 *    y actualizar etiquetas de salida (<output>) en tiempo real.
 * 2. Uso del control de color (<input type="color">) y su lectura.
 * 3. Cómo medir e interactuar con el elemento escalar <meter>.
 * 4. Cómo actualizar dinámicamente una barra de progreso (<progress>).
 * 5. Control de validación nativa mediante JavaScript (Constraint Validation API):
 *    - form.checkValidity() → Comprueba si todos los campos son válidos.
 *    - input.checkValidity() y las clases de validación.
 * 6. Gestión de animaciones CSS disparadas desde eventos JS.
 * ======================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    // ------------------------------------------------------------------
    // 1. SELECCIÓN DE ELEMENTOS DEL DOM
    // ------------------------------------------------------------------
    const formulario = document.getElementById("registro-form");
    const barraProgreso = document.getElementById("barra-progreso");
    
    // Elementos de Entrada (Inputs)
    const inputNombre = document.getElementById("nombre");
    const inputEmail = document.getElementById("email");
    const inputUrl = document.getElementById("sitio-web");
    const inputFecha = document.getElementById("fecha-nacimiento");
    const inputEdad = document.getElementById("edad");
    const inputCiudad = document.getElementById("ciudad");
    const inputPases = document.getElementById("pases");
    const inputColor = document.getElementById("color-camiseta");
    const inputPassword = document.getElementById("password");
    const inputTerminos = document.getElementById("terminos");

    // Elementos de Salida/Monitoreo
    const pasesOutput = document.getElementById("pases-output");
    const hexColorVal = document.getElementById("hex-color-val");
    const medidorFuerza = document.getElementById("medidor-fuerza");
    const fuerzaTexto = document.getElementById("fuerza-texto");
    
    // Mensaje de éxito
    const mensajeExito = document.getElementById("mensaje-exito");
    const botonNuevoRegistro = document.getElementById("btn-nuevo-registro");

    // Lista de campos requeridos para calcular el progreso general
    const camposRequeridos = [
        inputNombre,
        inputEmail,
        inputUrl,
        inputFecha,
        inputEdad,
        inputCiudad,
        inputPassword,
        inputTerminos
    ];

    // ------------------------------------------------------------------
    // 2. ACTUALIZACIÓN DE CONTROLES EN TIEMPO REAL
    // ------------------------------------------------------------------

    /**
     * CONCEPTO CLAVE: Evento 'input'
     * ─────────────────────────────
     * El evento 'input' se dispara inmediatamente cada vez que el valor del 
     * elemento cambia. Es el más recomendado para rangos, colores y textos, 
     * ya que es instantáneo (a diferencia del evento 'change', que suele
     * esperar a que el usuario pierda el foco).
     */

    // Actualizar el valor del pase adicional (Range → Output)
    inputPases.addEventListener("input", (event) => {
        // Asignamos el valor numérico al elemento <output> de forma nativa
        pasesOutput.value = event.target.value;
    });

    // Actualizar el indicador de texto del color seleccionado
    inputColor.addEventListener("input", (event) => {
        const colorHex = event.target.value.toUpperCase();
        hexColorVal.textContent = colorHex;
    });

    // ------------------------------------------------------------------
    // 3. MEDIDOR DE FORTALEZA DE CONTRASEÑA (<meter>)
    // ------------------------------------------------------------------
    inputPassword.addEventListener("input", () => {
        const passwordValue = inputPassword.value;
        let fuerza = 0;

        // Reglas sencillas para evaluar la fortaleza
        if (passwordValue.length >= 6) fuerza++; // Regla 1: Longitud mínima
        if (/[A-Z]/.test(passwordValue)) fuerza++;  // Regla 2: Tiene mayúsculas
        if (/[0-9]/.test(passwordValue)) fuerza++;  // Regla 3: Tiene números
        if (/[^A-Za-z0-9]/.test(passwordValue)) fuerza++; // Regla 4: Carácter especial

        // Actualizamos el valor del elemento <meter>
        medidorFuerza.value = fuerza;

        // Actualizamos el texto descriptivo
        switch (fuerza) {
            case 0:
            case 1:
                fuerzaTexto.textContent = "Muy Débil";
                fuerzaTexto.style.color = "var(--color-error)";
                break;
            case 2:
                fuerzaTexto.textContent = "Débil";
                fuerzaTexto.style.color = "var(--color-alerta)";
                break;
            case 3:
                fuerzaTexto.textContent = "Fuerte";
                // Color verde claro
                fuerzaTexto.style.color = "#a3e635";
                break;
            case 4:
                fuerzaTexto.textContent = "Muy Seguro";
                fuerzaTexto.style.color = "var(--color-exito)";
                break;
        }
    });

    // ------------------------------------------------------------------
    // 4. CÁLCULO DINÁMICO DE PROGRESO DEL FORMULARIO (<progress>)
    // ------------------------------------------------------------------
    function actualizarProgreso() {
        let completados = 0;

        camposRequeridos.forEach(campo => {
            // Un checkbox se considera completo si está seleccionado (.checked)
            if (campo.type === "checkbox") {
                if (campo.checked) completados++;
            } else {
                // Un texto/fecha se considera completo si no está vacío y pasa la validación individual
                if (campo.value.trim() !== "" && campo.checkValidity()) {
                    completados++;
                }
            }
        });

        // Calculamos el porcentaje
        const porcentaje = Math.round((completados / camposRequeridos.length) * 100);
        
        // Modificamos el valor de la barra de progreso nativa
        barraProgreso.value = porcentaje;
    }

    // Escuchamos el evento 'input' en todos los campos para actualizar la barra en vivo
    camposRequeridos.forEach(campo => {
        campo.addEventListener("input", actualizarProgreso);
    });

    // ------------------------------------------------------------------
    // 5. VALIDACIÓN DEL FORMULARIO EN SUBMIT
    // ------------------------------------------------------------------
    formulario.addEventListener("submit", (event) => {
        // Evitamos el envío por defecto (recarga de la página)
        event.preventDefault();

        /**
         * CONCEPTO CLAVE: Constraint Validation API
         * ─────────────────────────────────────────
         * - checkValidity(): Comprueba si el elemento (o todo el formulario)
         *   cumple con las restricciones HTML5 (required, email, pattern, minlength...).
         *   Devuelve 'true' si es válido y 'false' en caso contrario.
         */
        const esValido = formulario.checkValidity();

        if (!esValido) {
            // Añadimos la clase para que CSS active los estilos :invalid / :valid
            formulario.classList.add("was-validated");

            // Lanzamos la animación de vibración (shake) en la tarjeta
            const contenedor = document.querySelector(".contenedor-formulario");
            contenedor.classList.add("formulario-error");

            // Quitamos la clase de error tras finalizar la animación (0.4s)
            // para que pueda volver a dispararse en el siguiente envío erróneo
            setTimeout(() => {
                contenedor.classList.remove("formulario-error");
            }, 400);

            console.warn("El formulario contiene errores de validación. Envío cancelado.");
        } else {
            // Si es válido, ocultamos el formulario y mostramos el éxito
            formulario.classList.add("oculto");
            mensajeExito.classList.remove("oculto");
            console.log("¡Formulario de registro enviado con éxito!");
        }
    });

    // ------------------------------------------------------------------
    // 6. REINICIO DEL FORMULARIO
    // ------------------------------------------------------------------
    botonNuevoRegistro.addEventListener("click", () => {
        // Reiniciamos los valores de todos los inputs nativos del formulario
        formulario.reset();

        // Quitamos la clase de validación de CSS
        formulario.classList.remove("was-validated");

        // Reestablecemos salidas manuales
        pasesOutput.value = 0;
        hexColorVal.textContent = "#6366F1";
        medidorFuerza.value = 0;
        fuerzaTexto.textContent = "Muy Débil";
        fuerzaTexto.style.color = "var(--color-error)";

        // Recalculamos la barra de progreso (volverá a 0%)
        actualizarProgreso();

        // Alternamos vistas
        mensajeExito.classList.add("oculto");
        formulario.classList.remove("oculto");
    });
});
