// =========================================================================
// LECCIÓN: Introducción a Variables, DOM y Funciones en JavaScript
// =========================================================================
//
// ¿QUÉ VAMOS A APRENDER EN ESTA LECCIÓN?
// ----------------------------------------
// 1. Qué es el DOM y cómo JavaScript puede "tocar" la página web.
// 2. Qué son las variables y para qué sirven.
// 3. Qué son las funciones y cómo se ejecutan cuando el usuario hace clic.
// 4. Cómo cambiar colores, tamaños y visibilidad de elementos HTML desde JS.
//
// ANALOGÍA: Imagina que la página web es una MARIONETA y JavaScript es
// el TITIRITERO que mueve los hilos. El DOM es el conjunto de hilos
// que conectan al titiritero con cada parte de la marioneta.
// =========================================================================


// -------------------------------------------------------------------------
// CONCEPTOS BÁSICOS: Entorno Global
// -------------------------------------------------------------------------
//
// Cuando abres una página web en el navegador, JavaScript ya tiene
// acceso a 3 "herramientas" automáticas, sin que tú hagas nada:
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │  HERRAMIENTA  │  ¿QUÉ ES?              │  ANALOGÍA                  │
// ├──────────────────────────────────────────────────────────────────────┤
// │  window       │  La pestaña entera     │  Es como la "casa" donde   │
// │               │  del navegador.        │  vive tu página web.       │
// ├──────────────────────────────────────────────────────────────────────┤
// │  console      │  Pantalla de depuración│  Es como un "cuaderno de   │
// │               │  para ver mensajes.    │  notas" solo para ti.      │
// ├──────────────────────────────────────────────────────────────────────┤
// │  document     │  El árbol HTML de la   │  Es el "mapa" de todos los │
// │  (el DOM)     │  página renderizada.   │  elementos de tu página.   │
// └──────────────────────────────────────────────────────────────────────┘
//
// VARIABLES PROPIAS (Concepto):
// -------------------------------------------------------------------------
// Una variable es como una CAJA con una ETIQUETA donde guardamos datos.
//
//   ┌──────────────────────────────────────────────┐
//   │  let goles = 5;                              │
//   │                                              │
//   │  [CAJA etiquetada "goles"] → contiene → 5    │
//   └──────────────────────────────────────────────┘
//
// ¿Por qué usamos 'let' y no 'var'?
// - 'let' es moderno (ES6, año 2015) y se comporta de forma predecible.
// - 'var' es antiguo y puede causar errores difíciles de encontrar.
// - También existe 'const', que es como una caja CERRADA CON CANDADO:
//   una vez que guardas algo dentro, no puedes cambiarlo.
//
// ┌────────────────────────────────────────────────────────────────────┐
// │  TIPO      │  ¿SE PUEDE REASIGNAR?  │  ANALOGÍA                  │
// ├────────────────────────────────────────────────────────────────────┤
// │  let       │  Sí                    │  Una caja abierta           │
// │  const     │  No                    │  Una caja con candado       │
// │  var       │  Sí (pero es antiguo)  │  Una caja vieja y confusa  │
// └────────────────────────────────────────────────────────────────────┘

// Imprime un mensaje en la consola nada más cargar el script.
// Esto nos confirma que el archivo JS se cargó correctamente.
// Si NO ves este mensaje en la consola, algo falla con la vinculación.
console.log("HOLA desde fuera");


// -------------------------------------------------------------------------
// FUNCIÓN 1: Modificar estilos del DOM
// -------------------------------------------------------------------------
//
// ¿QUÉ ES UNA FUNCIÓN?
// Una función es un BLOQUE de código con nombre que se ejecuta
// cuando alguien lo "llama" (por ejemplo, al hacer clic en un botón).
//
//   ANALOGÍA: Una función es como una RECETA de cocina.
//   - La receta tiene un nombre (ej: "saludar").
//   - Tiene pasos (las líneas de código dentro de { ... }).
//   - No se cocina sola: alguien tiene que decir "¡haz esta receta!"
//     (eso es "llamar" o "invocar" la función).
//
// Esta función se ejecuta cuando el usuario hace clic en el botón "SALUDA".
// El vínculo está en el HTML: onclick="saludar()"
function saludar() {
    // Mostramos un mensaje en la consola para confirmar que la función se ejecutó.
    // Es como dejar una nota: "¡Pasé por aquí!"
    console.log("Hola desde adentro");
    
    // -------------------------------------------------------------------------
    // PASO 1: CAPTURAR el elemento del DOM
    // -------------------------------------------------------------------------
    // document.getElementById("btnsaluda") busca en todo el HTML el elemento
    // que tenga id="btnsaluda" y lo guarda en la variable 'botonsaludo'.
    //
    //   ANALOGÍA: Es como decir "ve a la habitación y tráeme el objeto
    //   que tiene la etiqueta 'btnsaluda'".
    //
    //   ┌────────────────────────────────────────────────────────────┐
    //   │  HTML:  <button id="btnsaluda">SALUDA</button>            │
    //   │                            ↓                               │
    //   │  JS:    let botonsaludo = document.getElementById(...)     │
    //   │                            ↓                               │
    //   │  [Variable botonsaludo] → apunta al botón del HTML        │
    //   └────────────────────────────────────────────────────────────┘
    //
    // ¿Qué pasaría si escribimos mal el id?
    // → getElementById devolvería 'null' (nada), y las líneas siguientes
    //   darían ERROR porque no puedes cambiar el estilo de "nada".
    let botonsaludo = document.getElementById("btnsaluda");
    
    // Mostramos la ID del elemento capturado, para verificar que es correcto.
    // Si en la consola ves "undefined", algo salió mal con la captura.
    console.log(botonsaludo.id);
    
    // -------------------------------------------------------------------------
    // PASO 2: MODIFICAR el estilo del elemento capturado
    // -------------------------------------------------------------------------
    // .style nos permite cambiar CUALQUIER propiedad CSS del elemento.
    // En este caso, cambiamos el color de fondo a rojo.
    //
    //   ┌──────────────────────────────────────────────────────────────┐
    //   │  EN CSS sería:           background-color: red;              │
    //   │  EN JS es:               .style.backgroundColor = "red";     │
    //   │                                                              │
    //   │  NOTA: En JS, las propiedades CSS con guion (-) se escriben  │
    //   │  en camelCase:                                               │
    //   │    background-color  →  backgroundColor                      │
    //   │    font-size         →  fontSize                              │
    //   │    border-radius     →  borderRadius                          │
    //   └──────────────────────────────────────────────────────────────┘
    //
    // ¿Qué pasaría si usamos "background-color" en JS?
    // → Daría ERROR de sintaxis, porque JS interpreta el guion como resta.
    botonsaludo.style.backgroundColor = "red";
}


// -------------------------------------------------------------------------
// FUNCIÓN 2: Lectura de propiedades del objeto 'window'
// -------------------------------------------------------------------------
//
// Esta función lee información del navegador (tamaño, URL) y además
// cambia el color del botón. Se ejecuta al hacer clic en "Mostrar Info Pantalla".
//
// NOTA: Usamos nomenclatura camelCase para los nombres (mostrarInfoPantalla).
// camelCase = primera palabra en minúscula, siguientes empiezan en MAYÚSCULA.
//
//   ┌──────────────────────────────────────────────────────────┐
//   │  Correcto (camelCase):  mostrarInfoPantalla              │
//   │  Incorrecto:            mostrar_info_pantalla (snake_case│
//   │  Incorrecto:            MostrarInfoPantalla (PascalCase) │
//   └──────────────────────────────────────────────────────────┘
function mostrarInfoPantalla() {
    // -------------------------------------------------------------------------
    // LEER LA URL ACTUAL
    // -------------------------------------------------------------------------
    // window.location.href contiene la dirección completa de la página actual.
    //
    //   ANALOGÍA: Es como mirar la dirección postal de la casa donde estás.
    //   Si tu archivo se llama "index.html" y está en tu escritorio,
    //   la URL será algo como: file:///C:/Users/.../index.html
    //
    // Guardamos el valor en una variable para poder usarlo después.
    let ubicacion = window.location.href;
    console.log("URL actual:", window.location.href);
    console.log("Variable ubicación:", ubicacion);
    
    // -------------------------------------------------------------------------
    // LEER EL TAMAÑO DEL NAVEGADOR (viewport)
    // -------------------------------------------------------------------------
    // window.innerWidth  = ancho visible de la página (en píxeles).
    // window.innerHeight = alto visible de la página (en píxeles).
    //
    //   ┌────────────────────────────────────────┐
    //   │  ┌──────────────────────────────┐      │
    //   │  │                              │      │
    //   │  │     ÁREA VISIBLE             │ ← innerHeight
    //   │  │     (viewport)               │      │
    //   │  │                              │      │
    //   │  └──────────────────────────────┘      │
    //   │         ↑ innerWidth                    │
    //   │         PESTAÑA DEL NAVEGADOR           │
    //   └────────────────────────────────────────┘
    //
    // ¿Para qué sirve saber el tamaño?
    // → Para hacer diseños "responsive" (que se adaptan al tamaño de pantalla).
    //   Ej: si el ancho es menor que 600px, podrías ocultar una columna.
    let ancho = window.innerWidth;
    console.log("Ancho:", window.innerWidth);
    
    let alto = window.innerHeight;
    console.log("Alto:", window.innerHeight);
    
    // -------------------------------------------------------------------------
    // CAMBIAR ESTILOS DEL BOTÓN
    // -------------------------------------------------------------------------
    // Igual que en la función saludar(), capturamos el botón por su id
    // y le cambiamos el color de fondo Y el color del texto.
    let botonInfoPantalla = document.getElementById("btninfo");
    console.log(botonInfoPantalla.id);
    
    // Cambiamos DOS propiedades: fondo verde y texto blanco.
    // Se pueden cambiar tantas propiedades como quieras, una por línea.
    botonInfoPantalla.style.backgroundColor = "green";
    botonInfoPantalla.style.color = "white";
}


// -------------------------------------------------------------------------
// FUNCIÓN 3: Ocultar Elementos (Manipulación CSS)
// -------------------------------------------------------------------------
//
// Esta función hace que dos botones DESAPAREZCAN de la pantalla.
// Se ejecuta al hacer clic en el botón "Ocultar".
//
// CONCEPTO CLAVE: display = "none"
// -------------------------------------------------------------------------
// Cuando pones display: "none" a un elemento, es como si ese elemento
// NUNCA hubiera existido en la página. No ocupa espacio, no se ve,
// pero SIGUE ESTANDO en el código HTML (se puede "resucitar").
//
//   ┌──────────────────────────────────────────────────────────────────┐
//   │  PROPIEDAD           │  ¿SE VE?  │  ¿OCUPA ESPACIO?             │
//   ├──────────────────────────────────────────────────────────────────┤
//   │  display: "block"    │  Sí       │  Sí (comportamiento normal)  │
//   │  display: "none"     │  No       │  No (desaparece del flujo)   │
//   │  visibility: "hidden"│  No       │  Sí (espacio en blanco)      │
//   │  opacity: 0          │  No       │  Sí (invisible pero existe)  │
//   └──────────────────────────────────────────────────────────────────┘
//
//   ANALOGÍA:
//   - display: "none"     → Sacar un mueble de la habitación.
//   - visibility: "hidden" → Tapar el mueble con una sábana invisible.
//   - opacity: 0           → El mueble es transparente, pero te tropiezas con él.
function ocultar() {
    // PASO 1: Capturamos los tres botones del DOM.
    // Necesitamos tener "acceso" a cada botón para poder modificarlo.
    let botonsaludo = document.getElementById("btnsaluda");
    let botonInfoPantalla = document.getElementById("btninfo");
    let ocultarBoton = document.getElementById("btnocultar");
    
    // PASO 2: Ocultamos dos de los tres botones.
    // Al aplicar display = "none", los botones desaparecen de la vista.
    // IMPORTANTE: Siguen existiendo en el DOM, solo son invisibles.
    // Podríamos "resucitarlos" poniendo display = "block" de nuevo.
    botonInfoPantalla.style.display = "none";
    botonsaludo.style.display = "none";
    
    // NOTA: El botón "ocultarBoton" NO recibe display: "none",
    // por eso es el ÚNICO que queda visible en la pantalla.
    //
    // ¿Qué pasaría si también ocultáramos este botón?
    // → La página quedaría sin ningún botón visible y el usuario
    //   no podría hacer nada más (a menos que recargue la página).
}


// =========================================================================
// RESUMEN: Conceptos clave aprendidos en esta lección
// =========================================================================
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO                  │  EJEMPLO                          │  USO  │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Variable (let)            │  let ancho = 500;                 │       │
// │                            │  → Caja reasignable con datos    │  1    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Función                   │  function saludar() { ... }       │       │
// │                            │  → Bloque de código reutilizable │  2    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  getElementById            │  document.getElementById("mi-id") │       │
// │                            │  → Buscar un elemento por su ID  │  3    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  .style.propiedad          │  .style.backgroundColor = "red"   │       │
// │                            │  → Cambiar CSS desde JavaScript  │  4    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  display = "none"          │  elemento.style.display = "none"  │       │
// │                            │  → Ocultar un elemento del DOM   │  5    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  console.log()             │  console.log("mensaje")           │       │
// │                            │  → Imprimir en la consola        │  6    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  window.location.href      │  → URL actual de la página       │  7    │
// │  window.innerWidth/Height  │  → Tamaño del viewport           │  8    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  onclick (en HTML)         │  <button onclick="saludar()">    │       │
// │                            │  → Conectar botón con función    │  9    │
// └─────────────────────────────────────────────────────────────────────────┘
//
// RECUERDA:
// - El DOM es el "puente" entre HTML y JavaScript.
// - Las variables guardan datos, las funciones guardan acciones.
// - Con .style puedes cambiar CUALQUIER propiedad CSS de CUALQUIER elemento.
// - display: "none" oculta, pero NO destruye el elemento.
// =========================================================================
