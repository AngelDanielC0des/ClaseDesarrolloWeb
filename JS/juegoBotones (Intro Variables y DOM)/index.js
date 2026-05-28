// =========================================================================
// LECCIÓN: Introducción a Variables, DOM y Funciones en JavaScript
// =========================================================================

// -------------------------------------------------------------------------
// CONCEPTOS BÁSICOS: Entorno Global
// -------------------------------------------------------------------------
// VARIABLES PREDEFINIDAS DEL NAVEGADOR:
// - window: El objeto principal que representa la pestaña del navegador entera.
// - console: Herramienta de depuración para imprimir mensajes.
// - document (DOM): El árbol de etiquetas HTML renderizado en la página.

// VARIABLES PROPIAS (Concepto):
// Son los espacios de memoria que creamos para nuestro programa.
// Ej: número de goles a favor, número de goles en contra, nombre del trabajador.

// Imprime un mensaje en la consola nada más cargar el script.
console.log("HOLA desde fuera");


// -------------------------------------------------------------------------
// FUNCIÓN 1: Modificar estilos del DOM
// -------------------------------------------------------------------------
// Función asociada al botón "SALUDA"
function saludar() {
    console.log("Hola desde adentro");
    
    // Obtenemos el elemento HTML por su atributo 'id'
    let botonsaludo = document.getElementById("btnsaluda");
    
    // Mostramos la ID del elemento capturado por consola
    console.log(botonsaludo.id);
    
    // Modificamos sus estilos CSS directamente desde JS (Inline Styles)
    botonsaludo.style.backgroundColor = "red";
}


// -------------------------------------------------------------------------
// FUNCIÓN 2: Lectura de propiedades del objeto 'window'
// -------------------------------------------------------------------------
// NOTA: Usamos nomenclatura camelCase para los nombres (mostrarInfoPantalla).
function mostrarInfoPantalla() {
    // Lectura de la URL actual de la página (href)
    let ubicacion = window.location.href;
    console.log("URL actual:", window.location.href);
    console.log("Variable ubicación:", ubicacion);
    
    // Lectura del tamaño del navegador (viewport visible)
    let ancho = window.innerWidth;
    console.log("Ancho:", window.innerWidth);
    
    let alto = window.innerHeight;
    console.log("Alto:", window.innerHeight);
    
    // Interacción con el DOM: Cambiar color de este botón
    let botonInfoPantalla = document.getElementById("btninfo");
    console.log(botonInfoPantalla.id);
    
    botonInfoPantalla.style.backgroundColor = "green";
    botonInfoPantalla.style.color = "white";
}


// -------------------------------------------------------------------------
// FUNCIÓN 3: Ocultar Elementos (Manipulación CSS)
// -------------------------------------------------------------------------
function ocultar() {
    // 1. Seleccionamos los tres botones existentes en el DOM
    let botonsaludo = document.getElementById("btnsaluda");
    let botonInfoPantalla = document.getElementById("btninfo");
    let ocultarBoton = document.getElementById("btnocultar");
    
    // 2. Aplicamos la propiedad display="none" para hacerlos desaparecer
    // IMPORTANTE: Esto elimina temporalmente el elemento del flujo visual,
    // pero sigue existiendo en el código HTML/DOM.
    botonInfoPantalla.style.display = "none";
    botonsaludo.style.display = "none";
    
    // NOTA: Como 'ocultarBoton' no tiene la regla display="none",
    // será el único botón que quede visible en la pantalla.
}
