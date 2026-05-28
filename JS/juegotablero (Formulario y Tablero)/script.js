// =========================================================================
// LECCIÓN: Intercepción de Eventos de Formulario (event.preventDefault)
// =========================================================================

// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// Capturamos el formulario entero y el contenedor de la imagen oculta.
const form = document.getElementById('registroForm');
const resultado = document.getElementById('resultado');

// 2. ESCUCHADOR DE EVENTOS (Event Listener)
// En lugar de usar 'onclick' en el botón, escuchamos el evento 'submit' 
// en todo el formulario. Esto es mejor porque el evento 'submit' se dispara 
// tanto al hacer clic en el botón como al presionar la tecla "Enter" 
// estando dentro de cualquier input.
form.addEventListener('submit', function(event) {
    
    // ---------------------------------------------------------------------
    // CONCEPTO CLAVE: event.preventDefault()
    // ---------------------------------------------------------------------
    // Por defecto, al hacer submit, el navegador intenta enviar los datos 
    // por HTTP (GET/POST) a un servidor, y si no hay servidor definido, 
    // simplemente recarga la página.
    // Al usar preventDefault(), detenemos este comportamiento predeterminado,
    // permitiendo que nosotros manejemos la lógica 100% con JavaScript
    // sin que la página parpadee ni se recargue.
    event.preventDefault();
    
    
    // 3. MANIPULACIÓN VISUAL (Cambio de vistas)
    
    // Ocultamos el formulario modificando su estilo 'display' en línea.
    // Esto lo saca del flujo visual (desaparece).
    form.style.display = 'none';
    
    // Mostramos la imagen quitándole la clase 'hidden' (que tenía display: none).
    // Usar classList.remove() es una forma más limpia y moderna de 
    // manipular estilos que cambiar propiedades una a una en .style.
    resultado.classList.remove('hidden');
});