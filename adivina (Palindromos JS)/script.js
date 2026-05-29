// ======================================================================
// LECCIÓN: Palíndromos en JavaScript
// ======================================================================
// Este archivo demuestra cómo comprobar si una palabra es un PALÍNDROMO.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  ¿QUÉ ES UN PALÍNDROMO?                                             │
// │  Es una palabra que se lee IGUAL de izquierda a derecha             │
// │  que de derecha a izquierda.                                        │
// │                                                                     │
// │  Ejemplos:  ANA  →  A-N-A  →  Se lee igual al revés               │
// │             OJO  →  O-J-O  →  Se lee igual al revés               │
// │             RADAR →  R-A-D-A-R  →  Se lee igual al revés          │
// │                                                                     │
// │  NO palíndromos:  HOLA  →  H-O-L-A  →  Al revés: A-L-O-H ≠       │
// │                   CASA  →  C-A-S-A  →  Al revés: A-S-A-C ≠       │
// └─────────────────────────────────────────────────────────────────────┘
//
// Este archivo también es una zona de pruebas donde se experimenta
// con variables globales y diferentes enfoques para resolver el problema.

// ----------------------------------------------------------------------
// CONCEPTO: Variables Globales
// ----------------------------------------------------------------------
// Una variable declarada FUERA de cualquier función es "global".
// Esto significa que CUALQUIER parte del código puede leerla o modificarla.
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  var   = Forma ANTIGUA de declarar variables (evitar)            │
// │  let   = Forma MODERNA de declarar variables que cambian         │
// │  const = Forma MODERNA de declarar variables que NO cambian      │
// │                                                                  │
// │  ¿Por qué evitar 'var'?                                          │
// │  - Permite redeclarar la misma variable (confuso)                │
// │  - Tiene un comportamiento raro con los bloques { }              │
// │  - let y const son más predecibles y seguros                     │
// └──────────────────────────────────────────────────────────────────┘
var bd = true;

// ATENCIÓN: Al leer el valor aquí (en el scope global), se captura
// el texto en el instante en que carga la página (normalmente vacío),
// y no cuando el usuario hace clic en un botón.
//
// CONCEPTO: El operador ternario (?)
// Es una forma corta de escribir un if/else en una sola línea.
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  condición ? valorSiTrue : valorSiFalse                          │
// │                                                                  │
// │  Ejemplo:                                                        │
// │  document.getElementById("palabra") ? .value : ""                │
// │                                                                  │
// │  Significa: "¿Existe el elemento 'palabra'?                      │
// │              Si SÍ existe → dame su .value                       │
// │              Si NO existe → dame un string vacío ""              │
// └──────────────────────────────────────────────────────────────────┘
//
// ¿Por qué hacemos esta comprobación? Porque si el script se carga
// antes de que el HTML exista, getElementById() devolvería null
// y al intentar acceder a .value daría error.
var palabraOriginal = document.getElementById("palabra") ? document.getElementById("palabra").value : "";
  
// ----------------------------------------------------------------------
// CONCEPTO: Funciones
// ----------------------------------------------------------------------
// Una función es un bloque de código reutilizable. Recibe "parámetros"
// (datos de entrada) y puede devolver un resultado.
//
// Analogía: Es como una licuadora. Le metes frutas (parámetros),
// la enciendes, y te devuelve un zumo (resultado).
//
// Esta función recibe una palabra y comprueba si es un palíndromo.
function esPalindromo(palabraOriginal) {
    // Creamos una variable vacía donde iremos construyendo la palabra al revés.
    // Empezamos con "" (string vacío) y vamos añadiendo letras una a una.
    let palabraReves = "";

    // -------------------------------------------------------------------------
    // CONCEPTO: Bucle for inverso (recorrer de atrás hacia adelante)
    // -------------------------------------------------------------------------
    // Un bucle for repite código mientras se cumpla una condición.
    //
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  Estructura del for:                                             │
    // │  for (inicio; condición; paso) { ... }                           │
    // │                                                                  │
    // │  Inicio:     let i = palabraOriginal.length - 1                  │
    // │              → Empezamos en la ÚLTIMA letra                      │
    // │              → Si la palabra es "ANA" (length=3), empezamos en 2 │
    // │                                                                  │
    // │  Condición:  i >= 0                                              │
    // │              → Seguimos mientras no lleguemos al principio       │
    // │                                                                  │
    // │  Paso:       i--                                                 │
    // │              → Restamos 1 en cada vuelta (vamos hacia atrás)     │
    // └──────────────────────────────────────────────────────────────────┘
    //
    // Ejemplo con "ANA":
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  Vuelta 1: i=2 → letra='A' → palabraReves = "A"                 │
    // │  Vuelta 2: i=1 → letra='N' → palabraReves = "AN"                │
    // │  Vuelta 3: i=0 → letra='A' → palabraReves = "ANA"               │
    // │                                                                  │
    // │  Resultado: palabraReves = "ANA" = palabraOriginal → PALÍNDROMO │
    // └──────────────────────────────────────────────────────────────────┘
    //
    // NOTA: Se ha corregido un error tipográfico en el código original 
    // ('palabraOrignal' a 'palabraOriginal')
    for (let i = palabraOriginal.length - 1; i >= 0; i--) {
        // Trazabilidad: console.log útil para ver qué letra estamos procesando
        //
        // CONCEPTO: console.log()
        // Muestra mensajes en la consola del navegador (F12 → pestaña Console).
        // Es muy útil para depurar (encontrar errores) en tu código.
        console.log("Letra procesada:", palabraOriginal[i]);
        
        // Guardamos la letra actual en una variable para mayor claridad.
        // palabraOriginal[i] accede a la letra en la posición i.
        let letraActual = palabraOriginal[i];
        
        // Concatenamos: añadimos la letra al final de palabraReves.
        //
        // CONCEPTO: Concatenación
        // Unir dos strings con el operador +.
        // ┌──────────────────────────────────────────────────────────────┐
        // │  "" + "A"   = "A"                                            │
        // │  "A" + "N"  = "AN"                                           │
        // │  "AN" + "A" = "ANA"                                          │
        // └──────────────────────────────────────────────────────────────┘
        palabraReves = palabraReves + letraActual;
    }

    // -------------------------------------------------------------------------
    // CONCEPTO: Comparación y Template Literals
    // -------------------------------------------------------------------------
    // Comparamos la palabra original con la palabra al revés.
    // Si son iguales, es un palíndromo. Si no, no lo es.
    //
    // CONCEPTO: Template Literals (plantillas literales)
    // Usamos comillas invertidas (backticks) ` ` para crear strings
    // con variables incrustadas usando ${variable}.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  Forma antigua:  palabra + " es un palíndromo"               │
    // │  Forma moderna:  `${palabra} es un palíndromo`               │
    // │                                                              │
    // │  Ambas hacen lo mismo, pero la moderna es más legible.       │
    // └──────────────────────────────────────────────────────────────┘
    if (palabraReves == palabraOriginal) {
        console.log(`${palabraOriginal} es un palíndromo`);
    } else { 
        console.log(`${palabraOriginal} no es un palíndromo`);
    }
}

// Mostramos el valor de la variable global 'bd' en la consola.
// Esto se ejecuta inmediatamente al cargar el script.
console.log("bd = " + bd);

// =========================================================================
// EXTRA: MÉTODOS ALTERNATIVOS (Lo que pedía el ejercicio original)
// =========================================================================
// Estos métodos están comentados (/* ... */) para que no se ejecuten,
// pero puedes descomentarlos para probarlos.

/* 
// -------------------------------------------------------------------------
// Alternativa 1: Métodos de Array encadenados (La forma moderna y rápida)
// -------------------------------------------------------------------------
// Este enfoque usa métodos incorporados de JavaScript para hacer lo mismo
// en menos líneas de código. Es más "declarativo" (dices QUÉ quieres,
// no CÓMO hacerlo paso a paso).
function esPalindromoModerna(palabra) {
    // 1. split('') separa la palabra en un array de letras
    //    "ANA" → ['A', 'N', 'A']
    //
    // 2. reverse() invierte el array
    //    ['A', 'N', 'A'] → ['A', 'N', 'A']
    //
    // 3. join('') vuelve a unir el array en un string
    //    ['A', 'N', 'A'] → "ANA"
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  "RADAR"                                                     │
    // │    → split('')  → ['R','A','D','A','R']                     │
    // │    → reverse()  → ['R','A','D','A','R']                     │
    // │    → join('')   → "RADAR"                                   │
    // │    → ¿"RADAR" === "RADAR"?  →  SÍ, es palíndromo            │
    // └──────────────────────────────────────────────────────────────┘
    let reves = palabra.split('').reverse().join('');
    return palabra === reves;
}

// -------------------------------------------------------------------------
// Alternativa 2: Versión Recursiva (Para el punto 4 EXTRA del ejercicio)
// -------------------------------------------------------------------------
// CONCEPTO: Recursión
// Una función recursiva es una función que SE LLAMA A SÍ MISMA.
//
// Analogía: Imagina unas muñecas rusas (matrioskas).
// Abres una, dentro hay otra, dentro otra... hasta llegar a la más
// pequeña que no se puede abrir (el "caso base").
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  Toda función recursiva necesita:                                │
// │  1. Caso base: Condición para PARAR de llamarse                  │
// │  2. Caso recursivo: Se llama a sí misma con un problema menor   │
// │                                                                  │
// │  Sin caso base = bucle infinito = crash del programa             │
// └──────────────────────────────────────────────────────────────────┘
function esPalindromoRecursiva(palabra) {
    // Caso base: si la palabra tiene 0 o 1 letra, es palíndromo
    // (una sola letra siempre se lee igual al revés)
    if (palabra.length <= 1) return true;
    
    // Si la primera y la última letra son distintas, no es palíndromo
    // (ya podemos parar, no hace falta seguir comprobando)
    if (palabra[0] !== palabra[palabra.length - 1]) return false;
    
    // Llamada recursiva: recortamos la primera y última letra y volvemos a evaluar
    // .slice(1, -1) quita la primera y la última letra
    //
    // Ejemplo con "RADAR":
    // ┌──────────────────────────────────────────────────────────────┐
    // │  Llamada 1: "RADAR" → R==R → slice(1,-1) → "ADA"            │
    // │  Llamada 2: "ADA"   → A==A → slice(1,-1) → "D"              │
    // │  Llamada 3: "D"     → length<=1 → return true               │
    // └──────────────────────────────────────────────────────────────┘
    return esPalindromoRecursiva(palabra.slice(1, -1));
}
*/

// ======================================================================
// RESUMEN: Conceptos clave aprendidos en este archivo
// ======================================================================
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO              │  QUÉ HACE                                  │
// ├─────────────────────────────────────────────────────────────────────┤
// │  var / let / const     │  Declarar variables (antiguo/moderno)     │
// │  Operador ternario     │  if/else en una línea: cond ? a : b      │
// │  Función               │  Bloque de código reutilizable            │
// │  Parámetro             │  Dato de entrada de una función           │
// │  Bucle for             │  Repite código un número de veces         │
// │  for inverso           │  Recorre de atrás hacia adelante          │
// │  string[indice]        │  Accede a una letra por su posición       │
// │  Concatenación (+)     │  Une dos strings                          │
// │  Template literals     │  Strings con variables: `${var}`          │
// │  console.log()         │  Muestra mensajes en la consola           │
// │  .split()              │  Separa un string en un array             │
// │  .reverse()            │  Invierte un array                        │
// │  .join()               │  Une un array en un string                │
// │  .slice(1, -1)         │  Recorta el primer y último carácter      │
// │  Recursión             │  Función que se llama a sí misma          │
// │  Caso base             │  Condición para parar la recursión        │
// └─────────────────────────────────────────────────────────────────────┘
//
// FLUJO DEL ALGORITMO (bucle for inverso):
// 1. Recibir la palabra → 2. Crear variable vacía para el revés
// 3. Recorrer la palabra desde la última letra hasta la primera
// 4. En cada vuelta, añadir la letra actual al string del revés
// 5. Comparar: ¿palabra original === palabra al revés?
// 6. Mostrar resultado en consola
