// =========================================================================
// LECCIÓN: Temporizadores en JavaScript (setTimeout)
// =========================================================================
//
// ¿QUÉ ES UN TEMPORIZADOR?
// ────────────────────────
// Imagina que pones una ALARMA en tu móvil para dentro de 5 minutos.
// Tú sigues haciendo otras cosas, y cuando suena la alarma, haces
// lo que tenías planeado.
//
// setTimeout() hace EXACTAMENTE eso:
//   "Oye navegador, dentro de X milisegundos, ejecuta este código."
//
//   ┌─────────────────────────────────────────────────────────────┐
//   │  LÍNEA DEL TIEMPO:                                          │
//   │                                                             │
//   │  0s          1s          2s          3s          4s    5s   │
//   │  │───────────│───────────│───────────│───────────│─────│    │
//   │  ↑                                                  ↑      │
//   │  "Ponemos la alarma"                      "¡SUENA LA ALARMA!"│
//   │  (se registra el setTimeout)              (se ejecuta el    │
//   │                                            alert)           │
//   └─────────────────────────────────────────────────────────────┘
//
// CONCEPTO CLAVE: Programación Asíncrona
// ───────────────────────────────────────
// JavaScript normalmente ejecuta las cosas UNA DETRÁS DE OTRA
// (síncrono). Pero setTimeout es ASÍNCRONO:
//
//   ┌─────────────────────────────────────────────────────────────┐
//   │  SÍNCRONO (normal):        ASÍNCRONO (setTimeout):          │
//   │                                                             │
//   │  Paso 1 → Paso 2 → Paso 3  Paso 1 → Paso 3 (sin esperar)  │
//   │                                  ↓                          │
//   │                              (5 seg después)                │
//   │                                  ↓                          │
//   │                              Paso 2 (la alarma suena)       │
//   └─────────────────────────────────────────────────────────────┘
//
// Esto significa que el navegador NO se queda "congelado" esperando.
// Sigue funcionando normalmente y cuando pasa el tiempo, ejecuta
// el código programado.

// =========================================================================
// ESTRUCTURA DE setTimeout():
// =========================================================================
//
// ┌──────────────────────────────────────────────────────────────────┐
// │                                                                  │
// │   setTimeout( función, milisegundos );                          │
// │                │           │                                     │
// │                │           └─ CUÁNTO esperar (en milisegundos)   │
// │                │              1000ms = 1 segundo                 │
// │                │              5000ms = 5 segundos                │
// │                │              60000ms = 1 minuto                 │
// │                │                                                 │
// │                └─ QUÉ ejecutar (una función/callback)            │
// │                   Puede ser:                                     │
// │                   - Arrow function: () => { ... }                │
// │                   - Función tradicional: function() { ... }      │
// │                   - Nombre de función: miFuncion                 │
// │                                                                  │
// └──────────────────────────────────────────────────────────────────┘
//
// TABLA DE CONVERSIÓN DE TIEMPO:
// ┌────────────────┬───────────────────┐
// │  Milisegundos  │  Equivalencia     │
// ├────────────────┼───────────────────┤
// │  1000          │  1 segundo        │
// │  2000          │  2 segundos       │
// │  5000          │  5 segundos       │
// │  10000         │  10 segundos      │
// │  30000         │  30 segundos      │
// │  60000         │  1 minuto         │
// │  300000        │  5 minutos        │
// └────────────────┴───────────────────┘
//
// 1er parámetro: La función que queremos ejecutar (aquí usamos una Arrow Function).
// 2do parámetro: El tiempo de espera en milisegundos (5000ms = 5 segundos).

setTimeout(() => {
    // Esta línea se ejecutará DENTRO DE 5 SEGUNDOS, no ahora.
    // alert() muestra una ventana emergente en el navegador.
    // Es como una notificación que el usuario DEBE cerrar.
    alert('Hola');
}, 5000);

// ¿QUÉ PASA SI EJECUTAMOS CÓDIGO DESPUÉS DEL setTimeout?
// ──────────────────────────────────────────────────────
// El código de abajo se ejecuta INMEDIATAMENTE, no espera 5 segundos.
// Esto demuestra que setTimeout es ASÍNCRONO.
//
//   console.log("A");              ← Se muestra AHORA (inmediato)
//   setTimeout(() => {
//       console.log("B");          ← Se muestra en 5 segundos
//   }, 5000);
//   console.log("C");              ← Se muestra AHORA (inmediato)
//
//   Orden en consola: A, C, ...5 segundos... B

/*
// =========================================================================
// EXTRA 1: FUNCIÓN EQUIVALENTE CON SINTAXIS TRADICIONAL
// =========================================================================
//
// COMPARACIÓN: Arrow Function vs Función Tradicional
// ┌──────────────────────────────────────────────────────────────────┐
// │  ARROW FUNCTION (moderna)     │  FUNCIÓN TRADICIONAL (clásica)  │
// ├───────────────────────────────┼─────────────────────────────────┤
// │  () => { alert('Hola'); }     │  function() { alert('Hola'); }  │
// │  Más corta y moderna          │  Más larga pero más explícita  │
// │  No tiene su propio 'this'    │  Tiene su propio 'this'        │
// └──────────────────────────────────────────────────────────────────┘
//
// Ambas hacen EXACTAMENTE lo mismo. La arrow function es simplemente
// una forma más corta de escribirlo (desde ES6, año 2015).

setTimeout(function() {
    alert('Hola desde la función tradicional');
}, 5000);
*/

/*
// =========================================================================
// EXTRA 2: ¿CÓMO DETENER UN TEMPORIZADOR? (clearTimeout)
// =========================================================================
//
// Imagina que pusiste una alarma pero ya no la necesitas.
// ¿Qué haces? La cancelas. En JavaScript usamos clearTimeout().
//
// PASOS:
//   1. Guardar el setTimeout en una VARIABLE (como un ticket de la alarma)
//   2. Usar clearTimeout(variable) para cancelarlo antes de que suene
//
//   ┌─────────────────────────────────────────────────────────────┐
//   │  LÍNEA DEL TIEMPO CON CANCELACIÓN:                          │
//   │                                                             │
//   │  0s          1s          2s          3s          4s    5s   │
//   │  │───────────│───────────│───────────│─────X                 │
//   │  ↑                                      ↑                   │
//   │  "Ponemos alarma"              "¡CANCELAMOS!"               │
//   │  (let miAlarma =               (clearTimeout(miAlarma))     │
//   │   setTimeout(...))              La alarma NUNCA suena       │
//   └─────────────────────────────────────────────────────────────┘
//
// Si necesitas cancelar el temporizador antes de que suene, 
// debes guardarlo en una variable:
let miAlarma = setTimeout(() => alert('No sonará'), 5000);
clearTimeout(miAlarma); // Esto cancela la bomba de tiempo
//
// ¿CUÁNDO SE USA ESTO EN LA VIDA REAL?
// ─────────────────────────────────────
// - Un usuario escribe en un buscador: esperamos 500ms antes de
//   buscar. Si sigue escribiendo, cancelamos la búsqueda anterior.
// - Un carrusel de imágenes: si el usuario hace clic en "siguiente",
//   cancelamos el avance automático temporizado.
// - Un tooltip: si el usuario quita el ratón antes de 1 segundo,
//   cancelamos la aparición del tooltip.
*/


// ======================================================================
// RESUMEN: CONCEPTOS CLAVE APRENDIDOS EN ESTA LECCIÓN
// ======================================================================
//
// ┌────┬──────────────────────┬──────────────────────────────────────────┐
// │ #  │ CONCEPTO             │ ¿PARA QUÉ SIRVE?                        │
// ├────┼──────────────────────┼──────────────────────────────────────────┤
// │ 1  │ setTimeout()         │ Ejecutar código DESPUÉS de un tiempo    │
// │    │                      │ determinado (una sola vez)              │
// ├────┼──────────────────────┼──────────────────────────────────────────┤
// │ 2  │ Milisegundos         │ Unidad de tiempo en JS. 1000ms = 1s     │
// │    │                      │ Siempre usamos ms, nunca segundos       │
// ├────┼──────────────────────┼──────────────────────────────────────────┤
// │ 3  │ Arrow Function       │ Forma corta de escribir funciones:      │
// │    │ () => { ... }        │ () => { código }. Se usa mucho como     │
// │    │                      │ callback en setTimeout y eventos        │
// ├────┼──────────────────────┼──────────────────────────────────────────┤
// │ 4  │ Callback             │ Pasar una función como argumento a      │
// │    │                      │ otra función. La función "llamada de    │
// │    │                      │ vuelta" se ejecuta en el momento justo  │
// ├────┼──────────────────────┼──────────────────────────────────────────┤
// │ 5  │ Asincronía           │ El código NO se ejecuta en orden        │
// │    │                      │ estricto. setTimeout permite que el     │
// │    │                      │ navegador siga funcionando mientras     │
// │    │                      │ espera el tiempo                        │
// ├────┼──────────────────────┼──────────────────────────────────────────┤
// │ 6  │ clearTimeout()       │ Cancelar un temporizador antes de que   │
// │    │                      │ se ejecute. Necesitas guardar el        │
// │    │                      │ setTimeout en una variable primero      │
// └────┴──────────────────────┴──────────────────────────────────────────┘
//
// IDEA PRINCIPAL:
// setTimeout es tu primera puerta al mundo ASÍNCRONO de JavaScript.
// En el mundo real, casi todo es asíncrono: peticiones a servidores,
// animaciones, eventos de usuario... Entender que el código puede
// ejecutarse "más tarde" es FUNDAMENTAL para programar en JS.
//
// DIFERENCIA CON setInterval:
// ┌──────────────────────────────────────────────────────────────────┐
// │  setTimeout              │  setInterval                         │
// ├──────────────────────────┼──────────────────────────────────────┤
// │  Se ejecuta UNA vez      │  Se ejecuta REPETIDAMENTE            │
// │  "Haz esto en 5 seg"     │  "Haz esto cada 5 seg, sin parar"   │
// │  Como una alarma         │  Como un reloj que suena cada hora   │
// └──────────────────────────────────────────────────────────────────┘
