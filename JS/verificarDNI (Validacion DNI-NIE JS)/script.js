// ======================================================================
// LECCIÓN: Validación de DNI/NIE en España (Algoritmo Oficial)
// ======================================================================
// En este archivo aplicamos el algoritmo matemático del Ministerio del Interior
// para validar la correspondencia entre los números de un DNI o NIE y su letra final.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  ¿QUÉ ES EL DNI?                                                    │
// │  El DNI (Documento Nacional de Identidad) tiene 8 números + 1 letra │
// │  Ejemplo:  12345678Z                                                │
// │                                                                     │
// │  ¿QUÉ ES EL NIE?                                                    │
// │  El NIE (Número de Identidad de Extranjero) empieza por X, Y o Z   │
// │  Ejemplo:  X1234567A                                                │
// │                                                                     │
// │  ¿POR QUÉ TIENEN LETRA?                                             │
// │  La letra es un "código de seguridad" para evitar errores al       │
// │  escribir el número. Si te equivocas en un dígito, la letra no     │
// │  coincidirá y el sistema detectará el error.                        │
// └─────────────────────────────────────────────────────────────────────┘

// ----------------------------------------------------------------------
// 1. REFERENCIAS AL DOM
// ----------------------------------------------------------------------
// CONCEPTO: document.getElementById()
//
// El DOM (Document Object Model) es como un "árbol" que representa
// todos los elementos de tu página HTML. Con getElementById() buscamos
// un elemento por su "nombre" (id) y guardamos una referencia a él.
//
// Analogía: Es como buscar una caja en un almacén por su etiqueta.
// Si la caja se llama "numeroDNI", la buscamos y guardamos su ubicación.
//
// ¿Por qué usamos 'let'?
// ┌──────────────────────────────────────────────────────────────────┐
// │  let   = Variable que PUEDE cambiar de valor después             │
// │  const = Variable que NUNCA cambia de valor (constante)          │
// │  var   = Versión antigua de let (evitar usarla hoy en día)       │
// └──────────────────────────────────────────────────────────────────┘
let numeroDNI = document.getElementById('numeroDNI');
let letraDNI = document.getElementById('letraDNI');
let templateFallo = document.getElementById('templateFallo');
let templateAcierto = document.getElementById('templateAcierto');
let resultadoDNI = document.getElementById('resultadodni');

// ----------------------------------------------------------------------
// 2. CONSTANTE OFICIAL
// ----------------------------------------------------------------------
// Esta es la secuencia de letras estipulada por el gobierno.
// El índice de cada letra corresponde al resto de la división (0-22).
//
// IMPORTANTE: Usamos 'const' porque esta secuencia NUNCA cambia.
// Si intentaras reasignarla, JavaScript daría error.
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  ÍNDICE:  0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16... │
// │  LETRA:   T  R  W  A  G  M  Y  F  P  D  X  B  N  J  Z  S  Q... │
// │                                                                   │
// │  Ejemplo: Si el resto es 0 → Letra T                             │
// │           Si el resto es 1 → Letra R                             │
// │           Si el resto es 22 → Letra E                            │
// └──────────────────────────────────────────────────────────────────┘
const SECUENCIA_LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE";

// ----------------------------------------------------------------------
// 3. FUNCIÓN PRINCIPAL DE VALIDACIÓN
// ----------------------------------------------------------------------
// CONCEPTO: ¿Qué es una función?
//
// Una función es un "bloque de código reutilizable". En lugar de escribir
// el mismo código 10 veces, lo metes en una función y la "llamas" cuando
// la necesites.
//
// Analogía: Es como una receta de cocina. La escribes una vez y la usas
// cada vez que quieras hacer ese plato.
//
// Esta función se ejecuta cuando el usuario pulsa el botón "Verificar".
function verificarDNI() {

    // Limpiamos el contenedor de resultados antes de inyectar uno nuevo.
    // replaceChildren() sin argumentos vacía todo el contenido del nodo.
    //
    // ¿Por qué limpiamos? Si el usuario pulsa el botón 5 veces sin limpiar,
    // vería 5 mensajes de resultado acumulados. Al limpiar, solo vemos
    // el resultado de la última verificación.
    resultadoDNI.replaceChildren();

    // --- A) OBTENER Y LIMPIAR VALORES ---
    // .value obtiene el texto que el usuario escribió en el campo.
    // .trim() elimina espacios al principio y final.
    // .toUpperCase() convierte a mayúsculas para evitar errores (ej: 'z' vs 'Z').
    //
    // Analogía: Es como limpiar una manzana antes de comerla.
    // El usuario puede escribir " 12345678z " con espacios y minúsculas,
    // pero nosotros necesitamos "12345678Z" limpio.
    let numero = numeroDNI.value.trim().toUpperCase();
    let letra = letraDNI.value.trim().toUpperCase();

    // Validación básica temprana (Cláusula de Guarda)
    //
    // CONCEPTO: Cláusula de Guarda (Guard Clause)
    // Es una comprobación que hacemos AL PRINCIPIO de una función para
    // salirnos rápidamente si algo no está bien. Así evitamos ejecutar
    // código innecesario.
    //
    // El símbolo '!' significa "NO". Entonces '!numero' significa
    // "si NO hay número" (si está vacío).
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  !numero  →  true si el campo está vacío                     │
    // │  !letra   →  true si el campo está vacío                     │
    // │  ||       →  operador "O" (basta con que uno sea true)       │
    // └──────────────────────────────────────────────────────────────┘
    if (!numero || !letra) {
        alert("Rellena ambos campos");
        return; // Detiene la ejecución de la función
    }

    // --- B) SOPORTE PARA NIE (Extranjeros) ---
    // Los NIE empiezan por X, Y o Z. Para el cálculo matemático,
    // estas letras equivalen a los prefijos numéricos 0, 1 y 2 respectivamente.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  NIE empieza por X  →  Se sustituye por 0                    │
    // │  NIE empieza por Y  →  Se sustituye por 1                    │
    // │  NIE empieza por Z  →  Se sustituye por 2                    │
    // │                                                              │
    // │  Ejemplo: X1234567  →  01234567                              │
    // │  Ejemplo: Y9876543  →  19876543                              │
    // └──────────────────────────────────────────────────────────────┘
    //
    // .startsWith('X') devuelve true si el texto empieza por 'X'.
    // .slice(1) corta el texto desde la posición 1 hasta el final,
    //           es decir, elimina la primera letra.
    if (numero.startsWith('X')) {
        // Ejemplo: X1234567 se convierte en 01234567
        numero = '0' + numero.slice(1);
    } else if (numero.startsWith('Y')) {
        // Ejemplo: Y1234567 se convierte en 11234567
        numero = '1' + numero.slice(1);
    } else if (numero.startsWith('Z')) {
        // Ejemplo: Z1234567 se convierte en 21234567
        numero = '2' + numero.slice(1);
    }

    // --- C) CONVERSIÓN Y CÁLCULO ---
    // Convertimos la cadena de texto (String) resultante a Número (Number)
    //
    // CONCEPTO: Conversión de tipos (Type Casting)
    // JavaScript guarda todo como texto (string) cuando viene de un input.
    // Pero para hacer matemáticas, necesitamos números de verdad.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  "12345678"  →  Es un STRING (texto)                         │
    // │  12345678    →  Es un NUMBER (número)                        │
    // │                                                              │
    // │  "12345678" + 1  =  "123456781"  ← ¡Concatena, no suma!     │
    // │  12345678 + 1    =  12345679     ← Suma correctamente        │
    // └──────────────────────────────────────────────────────────────┘
    numero = Number(numero);

    // Verificamos que la conversión fue exitosa (no contiene símbolos extraños)
    // isNaN significa "Is Not a Number" (Es No-Número)
    //
    // Si el usuario escribió algo como "12A45678", al convertirlo
    // obtendremos NaN (Not a Number), que es la forma de JavaScript
    // de decir "esto no es un número válido".
    if (isNaN(numero)) {
        alert("Documento inválido");
        return;
    }

    // -------------------------------------------------------------------------
    // EL ALGORITMO OFICIAL: El operador Módulo (%)
    // -------------------------------------------------------------------------
    // El módulo (%) devuelve el RESTO de una división, no el resultado.
    //
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  10 / 3 = 3 (con resto 1)                                       │
    // │  10 % 3 = 1  ← El módulo nos da el RESTO                        │
    // │                                                                  │
    // │  23 / 23 = 1 (con resto 0)                                      │
    // │  23 % 23 = 0  ← El módulo nos da 0                              │
    // │                                                                  │
    // │  25 / 23 = 1 (con resto 2)                                      │
    // │  25 % 23 = 2  ← El módulo nos da 2                              │
    // │                                                                  │
    // │  12345678 / 23 = 536768 (con resto 14)                          │
    // │  12345678 % 23 = 14  ← Ese 14 es el índice de la letra          │
    // └──────────────────────────────────────────────────────────────────┘
    //
    // ¿Por qué entre 23? Porque hay 23 letras posibles en la secuencia.
    // El resto siempre será un número entre 0 y 22, que usamos como
    // "posición" para buscar la letra correcta.
    let resto = numero % SECUENCIA_LETRAS.length;

    // 3. Buscar qué letra se encuentra en ese índice dentro de la secuencia oficial
    //
    // CONCEPTO: Acceso por índice
    // Los strings (y arrays) en JavaScript empiezan a contar desde 0.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  SECUENCIA_LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE"                │
    // │  Índice 0 → 'T'                                              │
    // │  Índice 1 → 'R'                                              │
    // │  Índice 14 → 'Z'                                             │
    // └──────────────────────────────────────────────────────────────┘
    let letraCorrecta = SECUENCIA_LETRAS[resto];

    // --- D) INYECCIÓN DEL RESULTADO EN EL DOM ---
    // Comparamos la letra que introdujo el usuario con la letra correcta.
    //
    // CONCEPTO: === vs ==
    // ┌──────────────────────────────────────────────────────────────┐
    // │  ===  Compara valor Y tipo (recomendado)                     │
    // │  ==   Compara solo valor (puede dar resultados raros)        │
    // │                                                              │
    // │  "5" === 5  →  false (string vs number)                      │
    // │  "5" == 5   →  true  (convierte automáticamente)             │
    // └──────────────────────────────────────────────────────────────┘
    if (letra === letraCorrecta) {
        // Si coinciden: Clonamos el template de Acierto y lo insertamos
        //
        // CONCEPTO: <template> y cloneNode()
        // Un <template> es un "molde" HTML oculto que el usuario no ve.
        // Lo clonamos para poder usarlo varias veces sin romper el original.
        // cloneNode(true) significa "clona todo, incluyendo los hijos".
        let clon = templateAcierto.content.cloneNode(true);
        resultadoDNI.appendChild(clon);
    } else {
        // Si NO coinciden: Clonamos el template de Fallo y lo insertamos
        let clon = templateFallo.content.cloneNode(true);
        resultadoDNI.appendChild(clon);
    }
}

// ======================================================================
// RESUMEN: Conceptos clave aprendidos en este archivo
// ======================================================================
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO              │  QUÉ HACE                                  │
// ├─────────────────────────────────────────────────────────────────────┤
// │  getElementById()      │  Busca un elemento HTML por su id         │
// │  let / const           │  Declaran variables (cambiable / fija)    │
// │  .trim()               │  Elimina espacios al inicio y final       │
// │  .toUpperCase()        │  Convierte texto a MAYÚSCULAS             │
// │  .startsWith()         │  Comprueba si un texto empieza por...     │
// │  .slice(1)             │  Corta el texto desde la posición 1       │
// │  Number()              │  Convierte texto a número                 │
// │  isNaN()               │  Comprueba si algo NO es un número        │
// │  % (módulo)            │  Devuelve el RESTO de una división        │
// │  string[indice]        │  Accede a una letra por su posición       │
// │  cloneNode(true)       │  Clona un elemento HTML completo          │
// │  appendChild()         │  Añade un elemento como hijo de otro      │
// │  replaceChildren()     │  Vacía un contenedor HTML                 │
// │  Cláusula de guarda    │  Validación temprana para salir rápido    │
// └─────────────────────────────────────────────────────────────────────┘
//
// FLUJO DEL ALGORITMO:
// 1. Obtener datos del usuario → 2. Limpiar datos → 3. Validar que existen
// 4. Convertir NIE a número → 5. Calcular resto (módulo 23)
// 6. Buscar letra en la secuencia → 7. Comparar con la letra del usuario
// 8. Mostrar resultado (acierto o fallo)