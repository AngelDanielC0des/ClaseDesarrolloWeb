/**
 * ======================================================================
 * LECCIÓN: Dashboard Responsive — JavaScript, Temas y contenteditable
 * ======================================================================
 * En este archivo aprenderás:
 * 
 * 1. Cómo alternar clases en el DOM para crear un sistema de temas
 *    claro/oscuro controlado por variables CSS.
 * 2. Uso del almacenamiento local (localStorage) para persistir las
 *    preferencias del usuario.
 * 3. Cómo interceptar cambios realizados en elementos que tienen el
 *    atributo 'contenteditable="true"'.
 * ======================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ------------------------------------------------------------------
    // 1. ALTERNANCIA DE TEMA (DARK / LIGHT MODE)
    // ------------------------------------------------------------------
    const botonTema = document.getElementById("btn-tema");
    const iconoTema = botonTema.querySelector(".icono-tema");
    const textoTema = botonTema.querySelector(".texto-tema");
    
    // Obtenemos la preferencia guardada por el usuario (si existe)
    const temaGuardado = localStorage.getItem("dashboard-theme") || "oscuro";

    // Función para aplicar el tema seleccionado
    function aplicarTema(tema) {
        if (tema === "claro") {
            // Quitamos el tema oscuro y añadimos el claro
            document.body.classList.remove("tema-oscuro");
            document.body.classList.add("tema-claro");
            
            // Actualizamos el botón a la opción del tema opuesto
            iconoTema.textContent = "🌙";
            textoTema.textContent = "Modo Oscuro";
            
            localStorage.setItem("dashboard-theme", "claro");
        } else {
            // Quitamos el tema claro y añadimos el oscuro
            document.body.classList.remove("tema-claro");
            document.body.classList.add("tema-oscuro");
            
            // Actualizamos el botón a la opción del tema opuesto
            iconoTema.textContent = "☀️";
            textoTema.textContent = "Modo Claro";
            
            localStorage.setItem("dashboard-theme", "oscuro");
        }
    }

    // Inicializamos el tema al cargar la página
    aplicarTema(temaGuardado);

    // Evento para alternar el tema al hacer clic en el botón
    botonTema.addEventListener("click", () => {
        const esClaroActual = document.body.classList.contains("tema-claro");
        // Cambiamos al tema opuesto
        aplicarTema(esClaroActual ? "oscuro" : "claro");
    });


    // ------------------------------------------------------------------
    // 2. CAPTURA DE TEXTO EN contenteditable
    // ------------------------------------------------------------------
    const tituloEditable = document.querySelector(".logo-texto");

    // Cargamos el nombre personalizado del dashboard si se guardó previamente
    const tituloGuardado = localStorage.getItem("dashboard-titulo");
    if (tituloGuardado) {
        tituloEditable.textContent = tituloGuardado;
    }

    /**
     * CONCEPTO CLAVE: Eventos en contenteditable
     * ──────────────────────────────────────────
     * Un elemento editable con 'contenteditable' no tiene eventos de formulario
     * típicos como 'change' o 'submit'. Para saber cuándo el usuario ha
     * terminado de editar su contenido, podemos escuchar:
     * 
     * - 'blur': Se dispara cuando el elemento PIERDE EL FOCO (el usuario
     *   hace clic fuera o pulsa Enter para salir).
     * - 'input': Se dispara carácter a carácter conforme el usuario escribe.
     */
    tituloEditable.addEventListener("blur", () => {
        const nuevoTitulo = tituloEditable.textContent.trim();
        
        if (nuevoTitulo !== "") {
            // Guardamos el título personalizado en el navegador
            localStorage.setItem("dashboard-titulo", nuevoTitulo);
            console.log(`Título del Dashboard guardado: "${nuevoTitulo}"`);
        } else {
            // Si el usuario borró todo, restauramos un título por defecto
            tituloEditable.textContent = "Panel de Control";
            localStorage.removeItem("dashboard-titulo");
        }
    });

    // Permitir salir de la edición al presionar la tecla Enter
    tituloEditable.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            // Evitamos que introduzca un salto de línea en el h1
            event.preventDefault();
            // Quitamos el foco (dispara el evento 'blur')
            tituloEditable.blur();
        }
    });
});
