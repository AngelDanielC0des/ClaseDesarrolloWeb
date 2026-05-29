// =========================================================================
// LECCIÓN: Intercepción de Eventos de Formulario (event.preventDefault)
// =========================================================================
//
// ¿QUÉ VAMOS A APRENDER EN ESTA LECCIÓN?
// ----------------------------------------
// 1. Cómo "escuchar" el envío de un formulario desde JavaScript.
// 2. Qué es event.preventDefault() y por qué es TAN importante.
// 3. Cómo alternar entre dos "vistas" (formulario ↔ resultado) sin recargar.
// 4. La diferencia entre cambiar estilos con .style vs. con classList.
//
// ANALOGÍA GENERAL:
// Imagina que el formulario es una CARTA que metes en un sobre.
// Por defecto, el navegador es el CARTERO que se lleva la carta al servidor.
// Con preventDefault(), le decimos al cartero: "¡Espera! Yo me encargo
// de leer la carta aquí mismo, no te la lleves."
// =========================================================================


// -------------------------------------------------------------------------
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// -------------------------------------------------------------------------
//
// Antes de hacer cualquier cosa, necesitamos "capturar" los elementos
// del HTML que vamos a usar. Es como preparar las herramientas antes
// de empezar a trabajar.
//
// Usamos 'const' porque estas referencias NUNCA van a cambiar:
// siempre apuntarán al mismo elemento del DOM.
//
//   ┌──────────────────────────────────────────────────────────────────┐
//   │  const vs let                                                    │
//   ├──────────────────────────────────────────────────────────────────┤
//   │  const form = ...;   →  No puedes reasignar: form = otraCosa    │
//   │                           daría ERROR.                           │
//   │  let  x = ...;       →  Sí puedes reasignar: x = 5; x = 10;    │
//   └──────────────────────────────────────────────────────────────────┘
//
// Capturamos el formulario entero (no solo un botón, sino TODO el <form>).
const form = document.getElementById('registroForm');
// Capturamos el contenedor que tiene la imagen oculta (inicialmente no se ve).
const resultado = document.getElementById('resultado');


// -------------------------------------------------------------------------
// 2. ESCUCHADOR DE EVENTOS (Event Listener)
// -------------------------------------------------------------------------
//
// ¿QUÉ ES UN EVENTO?
// Un evento es algo que EL USUARIO hace: un clic, una tecla, mover el ratón...
// JavaScript puede "escuchar" estos eventos y reaccionar a ellos.
//
//   ANALOGÍA: Es como poner una ALARMA en una puerta.
//   - La puerta es el formulario.
//   - La alarma es el addEventListener.
//   - Cuando alguien abre la puerta (submit), la alarma suena (se ejecuta la función).
//
// ¿Por qué escuchamos 'submit' y NO 'click' en el botón?
// ┌────────────────────────────────────────────────────────────────────────┐
// │  EVENTO ESCUCHADO  │  ¿SE DISPARA CON CLIC?  │  ¿SE DISPARA CON ENTER? │
// ├────────────────────────────────────────────────────────────────────────┤
// │  'click' en botón  │  Sí                     │  No                     │
// │  'submit' en form  │  Sí                     │  Sí                     │
// └────────────────────────────────────────────────────────────────────────┘
//
// Escuchar 'submit' es MEJOR porque cubre AMBAS formas de enviar.
// Si el usuario presiona "Enter" dentro de un input, también se envía.
//
// La función anónima function(event) se ejecuta cada vez que se dispara
// el evento 'submit' en el formulario.
// El parámetro 'event' es un OBJETO con información sobre lo que pasó.
form.addEventListener('submit', function(event) {
    
    // ---------------------------------------------------------------------
    // CONCEPTO CLAVE: event.preventDefault()
    // ---------------------------------------------------------------------
    //
    // ¿QUÉ PASA NORMALMENTE cuando se envía un formulario?
    // → El navegador recoge los datos, los manda al servidor (GET/POST)
    //   y RECARGA la página. Si no hay servidor, la página se recarga igual.
    //
    // ¿QUÉ QUEREMOS NOSOTROS?
    // → Manejar todo con JavaScript SIN que la página se recargue.
    //
    // ¿CÓMO LO LOGRAMOS?
    // → Con event.preventDefault(), que significa literalmente:
    //   "evento, prevén tu comportamiento por defecto".
    //
    //   ┌──────────────────────────────────────────────────────────────────┐
    //   │  SIN preventDefault()            │  CON preventDefault()         │
    //   ├──────────────────────────────────────────────────────────────────┤
    //   │  El navegador recarga la página  │  La página NO se recarga      │
    //   │  Los datos se envían al servidor │  JS controla todo             │
    //   │  Se pierde el estado actual      │  Se mantiene el estado        │
    //   │  La pantalla "parpadea"          │  Transición suave, sin flash  │
    //   └──────────────────────────────────────────────────────────────────┘
    //
    //   ANALOGÍA: Es como decirle al cartero "NO te lleves la carta,
    //   la voy a leer yo aquí mismo".
    //
    // ¿Qué pasaría si OLVIDAMOS esta línea?
    // → La página se recargaría instantáneamente y no veríamos ningún
    //   cambio visual porque todo se reinicia al recargar.
    event.preventDefault();
    
    
    // ---------------------------------------------------------------------
    // 3. MANIPULACIÓN VISUAL (Cambio de vistas)
    // ---------------------------------------------------------------------
    //
    // Ahora que evitamos la recarga, podemos controlar qué se ve y qué no.
    // La idea es sencilla: OCULTAR el formulario y MOSTRAR el resultado.
    //
    //   ┌──────────────────────────────────────────────────────────────┐
    //   │  ANTES del clic:                                             │
    //   │  ┌─────────────┐    ┌─────────────────┐                     │
    //   │  │ FORMULARIO  │    │ RESULTADO       │                     │
    //   │  │   VISIBLE   │    │   OCULTO        │                     │
    //   │  └─────────────┘    │  (class=hidden) │                     │
    //   │                     └─────────────────┘                     │
    //   │                                                              │
    //   │  DESPUÉS del clic:                                           │
    //   │  ┌─────────────┐    ┌─────────────────┐                     │
    //   │  │ FORMULARIO  │    │ RESULTADO       │                     │
    //   │  │   OCULTO    │    │   VISIBLE       │                     │
    //   │  │(display:none)│   │ (sin .hidden)   │                     │
    //   │  └─────────────┘    └─────────────────┘                     │
    //   └──────────────────────────────────────────────────────────────┘
    
    // OCULTAR el formulario:
    // Cambiamos su estilo 'display' a 'none' directamente (inline style).
    // Esto lo saca del flujo visual: desaparece y no ocupa espacio.
    //
    // ¿Por qué usamos .style.display aquí?
    // → Porque es rápido y directo para un cambio puntual.
    form.style.display = 'none';
    
    // MOSTRAR la imagen/resultado:
    // El elemento tenía la clase CSS 'hidden' que lo mantenía oculto
    // (en el CSS, .hidden { display: none; }).
    // Al quitarle esa clase con classList.remove(), vuelve a ser visible.
    //
    // ┌────────────────────────────────────────────────────────────────────┐
    // │  MÉTODO               │  ¿QUÉ HACE?              │  ¿CUÁNDO USAR? │
    // ├────────────────────────────────────────────────────────────────────┤
    // │  .style.display='none'│  Cambia estilo directo   │  Cambios       │
    // │                       │  (inline, alta prioridad)│  puntuales      │
    // ├────────────────────────────────────────────────────────────────────┤
    // │  .classList.remove()  │  Quita una clase CSS     │  Cuando el     │
    // │                       │  (más limpio y moderno)  │  estilo ya     │
    // │                       │                          │  existe en CSS │
    // ├────────────────────────────────────────────────────────────────────┤
    // │  .classList.add()     │  Añade una clase CSS     │  Para activar  │
    // │                       │                          │  un estado     │
    // ├────────────────────────────────────────────────────────────────────┤
    // │  .classList.toggle()  │  Alterna: si existe la   │  Para cambiar  │
    // │                       │  quita, si no la añade   │  entre 2 esta- │
    // │                       │                          │  dos (on/off)  │
    // └────────────────────────────────────────────────────────────────────┘
    //
    // ¿Por qué classList.remove es "mejor" que .style?
    // → Porque separa la PRESENTACIÓN (CSS) de la LÓGICA (JS).
    //   Si mañana quieres cambiar cómo se oculta, solo tocas el CSS,
    //   no el JavaScript.
    resultado.classList.remove('hidden');
});


// =========================================================================
// RESUMEN: Conceptos clave aprendidos en esta lección
// =========================================================================
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO                  │  EJEMPLO                          │  USO  │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  addEventListener          │  form.addEventListener('submit',  │       │
// │                            │    function(event) { ... });      │       │
// │                            │  → Escuchar eventos del usuario  │  1    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  event.preventDefault()    │  event.preventDefault();          │       │
// │                            │  → Evitar recarga del navegador  │  2    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Evento 'submit'           │  'submit' en <form>               │       │
// │                            │  → Captura clic Y tecla Enter    │  3    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  .style.display = 'none'   │  form.style.display = 'none';     │       │
// │                            │  → Ocultar elemento (inline)     │  4    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  classList.remove()        │  resultado.classList.remove(      │       │
// │                            │    'hidden');                     │       │
// │                            │  → Mostrar elemento (quita clase)│  5    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  const vs let              │  const form = ...; (no reasignable│       │
// │                            │  → Usar cuando el valor no cambia│  6    │
// └─────────────────────────────────────────────────────────────────────────┘
//
// RECUERDA:
// - Siempre usa preventDefault() cuando quieras manejar formularios con JS.
// - Escucha 'submit' en el <form>, no 'click' en el botón.
// - classList es más limpio que .style para alternar estados.
// - const para referencias que no cambian, let para las que sí.
// =========================================================================
