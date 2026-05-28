/**
 * ======================================================================
 * LECCIÓN: Tarjeta de Producto — JavaScript y Atributos data-*
 * ======================================================================
 * En este archivo aprenderás:
 * 
 * 1. Cómo interactuar con el elemento nativo <dialog> mediante JavaScript.
 * 2. Métodos nativos para abrir y cerrar diálogos:
 *    - showModal() → Abre el modal deteniendo la interacción con el fondo
 *                    y colocando el foco del teclado dentro.
 *    - close()     → Cierra el modal.
 * 3. Cómo leer los atributos personalizados data-* (Dataset API).
 * 4. Cómo inyectar dinámicamente información en el DOM.
 * ======================================================================
 */

// Esperamos a que el DOM esté completamente cargado por seguridad
// (aunque usamos 'defer' en el HTML, esta es una buena práctica recomendada)
document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------------------------
    // 1. SELECCIÓN DE ELEMENTOS DEL DOM
    // ------------------------------------------------------------------
    
    // El botón que abre el modal
    const botonVerDetalles = document.getElementById("btn-ver-detalles");
    
    // El elemento modal nativo (<dialog>)
    const modalProducto = document.getElementById("modal-producto");
    
    // La tarjeta del producto que contiene los atributos data-*
    const tarjetaProducto = document.querySelector(".tarjeta-producto");
    
    // El div dentro del modal donde inyectaremos la información de los data-*
    const contenedorDatos = document.getElementById("info-datos-producto");

    // ------------------------------------------------------------------
    // 2. FUNCIÓN PARA LEER Y MOSTRAR ATRIBUTOS data-*
    // ------------------------------------------------------------------
    function mostrarDatosPersonalizados() {
        /**
         * CONCEPTO CLAVE: dataset API
         * ──────────────────────────
         * Los atributos "data-*" de HTML se mapean automáticamente en el
         * objeto JavaScript `.dataset` de ese elemento.
         * 
         * Reglas de conversión de nombres:
         * - Se quita el prefijo "data-".
         * - Se convierte a camelCase (junta palabras quitando guiones y
         *   poniendo en mayúscula la siguiente letra).
         * 
         * Ejemplos en nuestro HTML:
         * - data-producto-id  => dataset.productoId
         * - data-precio       => dataset.precio
         * - data-categoria    => dataset.categoria
         * - data-en-oferta     => dataset.enOferta
         */
        const id = tarjetaProducto.dataset.productoId;
        const precio = tarjetaProducto.dataset.precio;
        const categoria = tarjetaProducto.dataset.categoria;
        const enOferta = tarjetaProducto.dataset.enOferta;

        // Limpiamos el contenedor para evitar duplicados si se pulsa varias veces
        contenedorDatos.innerHTML = "";

        // Creamos una cabecera para explicar lo que estamos haciendo
        const titulo = document.createElement("h3");
        titulo.textContent = "Datos extraídos de atributos 'data-*' con JS:";
        contenedorDatos.appendChild(titulo);

        // Creamos una lista desordenada (<ul>) para mostrar los datos
        const lista = document.createElement("ul");
        lista.className = "lista-datos-tecnicos";

        // Creamos y añadimos cada elemento a la lista
        lista.innerHTML = `
            <li><strong>ID del Producto (data-producto-id):</strong> <code>${id}</code></li>
            <li><strong>Precio (data-precio):</strong> <code>${precio} €</code></li>
            <li><strong>Categoría (data-categoria):</strong> <code>${categoria}</code></li>
            <li><strong>¿Está rebajado? (data-en-oferta):</strong> <code>${enOferta}</code></li>
        `;

        contenedorDatos.appendChild(lista);
    }

    // ------------------------------------------------------------------
    // 3. CONTROL DE LA VENTANA MODAL (<dialog>)
    // ------------------------------------------------------------------
    
    // Evento al hacer clic en el botón de abrir detalles
    botonVerDetalles.addEventListener("click", () => {
        
        // Primero, leemos e inyectamos los datos del producto
        mostrarDatosPersonalizados();

        /**
         * CONCEPTO CLAVE: showModal() vs show()
         * ─────────────────────────────────────
         * - showModal(): Abre el <dialog> de forma MODAL. 
         *   Coloca el diálogo en el "top layer" (capa superior absoluta,
         *   incluso por encima de elementos con z-index alto), crea el
         *   fondo difuminado (::backdrop), deshabilita el scroll del resto de la
         *   página y atrapa el tabulador dentro del modal para accesibilidad.
         * 
         * - show(): Abre el <dialog> de forma NO-MODAL.
         *   El elemento se vuelve visible pero se comporta como un elemento
         *   estático o posicionado normal (no bloquea el resto de la página
         *   ni crea ::backdrop).
         */
        modalProducto.showModal();
    });

    /**
     * TRUCO DE ACCESIBILIDAD Y EXPERIENCIA DE USUARIO:
     * El diálogo nativo se puede cerrar automáticamente pulsando la tecla "Escape".
     * Además, si el usuario hace clic fuera de la caja de contenido del modal
     * (es decir, en el ::backdrop oscuro), es una buena práctica cerrarlo.
     * 
     * ¿Cómo funciona este truco?
     * Al hacer clic en el <dialog>, el evento detecta la posición del clic.
     * Si las coordenadas quedan fuera de la "caja" interna (el div .modal-contenido),
     * significa que el usuario hizo clic en el backdrop.
     */
    modalProducto.addEventListener("click", (event) => {
        // Obtenemos los límites rectangulares del diálogo
        const rect = modalProducto.getBoundingClientRect();
        
        // Si el clic ocurrió fuera de esos límites, cerramos el diálogo
        const clicFuera = (
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom
        );

        if (clicFuera) {
            modalProducto.close();
        }
    });

    /**
     * NOTA SOBRE EL BOTÓN DE CERRAR INTERNO:
     * En el HTML, el botón de "Cerrar" está dentro de un formulario con:
     * <form method="dialog">
     * Esto significa que al pulsar ese botón, el formulario hace submit y
     * el navegador CIERRA el modal automáticamente, sin necesidad de que
     * escribamos código JavaScript adicional para el botón cerrar. ¡Es nativo!
     */
    
    // ------------------------------------------------------------------
    // 4. EVENTOS DE MONITOREO (Solo para aprendizaje)
    // ------------------------------------------------------------------
    
    // El elemento <dialog> dispara un evento llamado "close" cuando se cierra
    modalProducto.addEventListener("close", () => {
        console.log("El modal del producto ha sido cerrado. (Retorno: " + modalProducto.returnValue + ")");
    });
});
