// =========================================================================
// LECCIÓN: Bucles y Búsqueda de Caracteres en JavaScript
// =========================================================================
// En este ejercicio buscamos cuántas veces aparece una letra dentro de
// una palabra o texto. Usamos diferentes métodos y comparamos su eficiencia.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  EJEMPLO DEL PROBLEMA:                                              │
// │  Palabra: "programacion"                                            │
// │  Letra a buscar: "o"                                                │
// │  Resultado: La letra "o" aparece 2 veces                            │
// │                                                                     │
// │  ¿Cómo lo hace un humano?                                           │
// │  Lee letra por letra: p-r-o-g-r-a-m-a-c-i-o-n                      │
// │  Cuando encuentra una "o", cuenta +1.                               │
// │                                                                     │
// │  ¡Eso es exactamente lo que hace el ordenador!                      │
// └─────────────────────────────────────────────────────────────────────┘

// =========================================================================
// FUNCIÓN ACTIVA (La más eficiente en memoria) - Bucle for...of
// =========================================================================
// Lee el texto directamente carácter por carácter. 
// Es el rey de la memoria porque no duplica el texto ni crea arrays intermedios.
//
// CONCEPTO: ¿Qué es una función?
// Una función es un bloque de código que puedes "llamar" cuando quieras.
// En lugar de copiar y pegar el mismo código 10 veces, lo metes en una
// función y la usas las veces que necesites.
function buscarLetra() {
    // Obtenemos los valores que el usuario escribió en los campos de texto.
    // .value nos da el contenido del input como un string.
    // 'const' porque estas variables NO van a cambiar dentro de la función.
    const palabra = document.getElementById("palabra").value; 
    const letra = document.getElementById("letra").value;
    
    // -------------------------------------------------------------------------
    // CONCEPTO: Cláusula de Guarda (Guard Clause)
    // -------------------------------------------------------------------------
    // Comprobamos si falta algún dato ANTES de seguir.
    // Si el usuario no escribió nada en alguno de los campos, salimos.
    //
    // El símbolo '!' significa "NO". Entonces '!palabra' significa
    // "si la palabra está vacía" (un string vacío es "falsy" en JavaScript).
    //
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  Valores "falsy" en JavaScript (se consideran false):            │
    // │  ""        → string vacío                                       │
    // │  0         → número cero                                        │
    // │  null      → valor nulo                                         │
    // │  undefined → no definido                                        │
    // │  NaN       → no es un número                                    │
    // │  false     → booleano falso                                     │
    // └──────────────────────────────────────────────────────────────────┘
    //
    // ¿Qué pasaría sin esta guarda? El bucle se ejecutaría igualmente
    // con datos vacíos, dando resultados incorrectos (contaría 0 veces
    // sin avisar al usuario de que no introdujo datos).
    if (!palabra || !letra) return;

    // Inicializamos el contador a 0. Cada vez que encontremos la letra,
    // le sumaremos 1.
    let contador = 0;

    // -------------------------------------------------------------------------
    // CONCEPTO: Bucle for...of
    // -------------------------------------------------------------------------
    // El bucle for...of recorre cada elemento de algo "iterable"
    // (como un string o un array) de forma automática.
    //
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  for (const variable of iterable) { ... }                        │
    // │                                                                  │
    // │  Ejemplo con "hola":                                             │
    // │  Vuelta 1: caracter = 'h'                                        │
    // │  Vuelta 2: caracter = 'o'                                        │
    // │  Vuelta 3: caracter = 'l'                                        │
    // │  Vuelta 4: caracter = 'a'                                        │
    // └──────────────────────────────────────────────────────────────────┘
    //
    // ¿Por qué for...of y no un for normal?
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  for normal:  for (let i=0; i<palabra.length; i++)               │
    // │               → Necesitas índice, condición, incremento          │
    // │               → Más código, más posibilidades de error           │
    // │                                                                  │
    // │  for...of:    for (const caracter of palabra)                    │
    // │               → Automático, más limpio y legible                 │
    // │               → No necesitas controlar el índice manualmente     │
    // └──────────────────────────────────────────────────────────────────┘
    for (const caracter of palabra) {
        // Comparamos el carácter actual con la letra que buscamos.
        // Si coinciden, incrementamos el contador en 1.
        //
        // CONCEPTO: contador++ es lo mismo que contador = contador + 1
        // Es una forma abreviada de sumar 1 a una variable.
        if (caracter === letra) {
            contador++;
        }
    }
    
    // Mostramos el resultado en la consola usando template literals.
    // Las comillas invertidas ` ` permiten incrustar variables con ${}.
    console.log(`La letra aparece ${contador} veces`);
}


// =========================================================================
// ESCUCHADOR DE EVENTOS (Event Listener)
// =========================================================================
// CONCEPTO: addEventListener
//
// En lugar de poner onclick="buscarLetra()" en el HTML (que mezcla
// presentación con lógica), usamos addEventListener para "escuchar"
// cuándo el usuario hace clic en el botón.
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  Forma ANTIGUA (en el HTML):                                     │
// │  <button onclick="buscarLetra()">Buscar</button>                 │
// │  → Mezcla HTML y JS. Difícil de mantener.                        │
// │                                                                  │
// │  Forma MODERNA (en el JS):                                       │
// │  boton.addEventListener("click", buscarLetra);                   │
// │  → Separa HTML y JS. Más limpio y profesional.                   │
// └──────────────────────────────────────────────────────────────────┘
//
// Analogía: Es como poner una alarma en una puerta.
// La alarma (addEventListener) "escucha" si alguien abre la puerta
// (evento "click") y cuando pasa, ejecuta una acción (buscarLetra).
const boton = document.getElementById("btnBuscar");
boton.addEventListener("click", buscarLetra);



/* =========================================================================
   OPCIONES ADICIONALES COMENTADAS (Para estudio de rendimiento y memoria)
   =========================================================================
   Estas funciones están comentadas para que no se ejecuten, pero puedes
   descomentarlas para experimentar con ellas.

    -------------------------------------------------------------------------
    OPCIÓN 1: El truco del .split()
    -------------------------------------------------------------------------
    // CONCEPTO: .split()
    // Divide un string en un array usando un separador.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  "hola".split("o")  →  ["h", "la"]                          │
    // │  "programacion".split("o")  →  ["pr", "gramaci", "n"]       │
    // │                                                              │
    // │  El truco: si dividimos por la letra buscada, el número     │
    // │  de fragmentos será (apariciones + 1).                       │
    // │  Entonces: apariciones = fragmentos.length - 1              │
    // └──────────────────────────────────────────────────────────────┘
    //
    // DEFECTO EN MEMORIA: Es malo para textos grandes. Tiene que cortar el texto 
    // y CREAR UN ARRAY con todos los fragmentos. Si procesas un texto masivo, 
    // JavaScript duplicará casi todo ese contenido en la memoria RAM solo para medir su .length.
    function buscarLetraSplit() {
        const palabra = document.getElementById("palabra").value; 
        const letra = document.getElementById("letra").value;
        if (!palabra || !letra) return;

        const contador = palabra.split(letra).length - 1;
        console.log(`[Split] Aparece ${contador} veces`);
    }

    -------------------------------------------------------------------------
    OPCIÓN 2: Bucle while con .indexOf()
    -------------------------------------------------------------------------
    // CONCEPTO: .indexOf()
    // Busca la primera aparición de un texto y devuelve su posición.
    // Si no lo encuentra, devuelve -1.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  "hola".indexOf("o")     →  1  (la 'o' está en posición 1)  │
    // │  "hola".indexOf("x")     →  -1 (no existe)                  │
    // │  "hola".indexOf("o", 2)  →  -1 (busca desde posición 2)     │
    // │                                                              │
    // │  El segundo parámetro indica desde dónde empezar a buscar.   │
    // │  Así podemos encontrar TODAS las apariciones, no solo la 1ª. │
    // └──────────────────────────────────────────────────────────────┘
    //
    // VIRTUD: Al igual que el for...of, consume casi cero memoria extra (solo dos números).
    // Además, es aún más rápido que el for...of porque NO lee todas las letras una a una;
    // salta directamente a las posiciones donde sabe que está la letra buscada.
    function buscarLetraIndexOf() {
        const palabra = document.getElementById("palabra").value; 
        const letra = document.getElementById("letra").value;
        if (!palabra || !letra) return;

        let contador = 0;
        let posicion = palabra.indexOf(letra);

        // Mientras indexOf encuentre la letra (no devuelva -1), seguimos.
        // En cada vuelta, empezamos a buscar desde la posición anterior + 1
        // para no encontrar la misma letra una y otra vez.
        while (posicion !== -1) {
            contador++;
            posicion = palabra.indexOf(letra, posicion + 1);
        }
        console.log(`[IndexOf] Aparece ${contador} veces`);
    }

    -------------------------------------------------------------------------
    OPCIÓN 3: Expresión Regular con .matchAll()
    -------------------------------------------------------------------------
    // CONCEPTO: Expresiones Regulares (RegExp)
    // Son "patrones" para buscar texto. Más potentes que una simple letra.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │  /a/g     → busca todas las 'a'                              │
    // │  /[0-9]/g → busca todos los dígitos                          │
    // │  /hola/i  → busca "hola" sin importar mayúsculas/minúsculas  │
    // │                                                              │
    // │  La 'g' al final significa "global" (busca TODAS, no solo 1) │
    // └──────────────────────────────────────────────────────────────┘
    //
    // ¿Por qué "escapamos" la letra? Porque algunos caracteres como
    // el punto (.) o el asterisco (*) tienen significado especial en
    // las RegExp. Si el usuario busca un ".", sin escapar buscaría
    // CUALQUIER carácter, no solo el punto.
    function buscarLetraRegExp() {
        const palabra = document.getElementById("palabra").value; 
        const letra = document.getElementById("letra").value;
        if (!palabra || !letra) return;

        // Escapamos caracteres especiales por seguridad (evita que rompa si buscan un punto o asterisco)
        const letraEscapada = letra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(letraEscapada, 'g');
        
        let contador = 0;

        for (const coincidencia of palabra.matchAll(regex)) {
            contador++;
        }
        console.log(`[RegExp] Aparece ${contador} veces`);

        // VIRTUD: .matchAll() devuelve un "Iterador", lo que significa que no genera todos los 
        // resultados en memoria de golpe (a diferencia del antiguo .match()), sino bajo demanda.
        // DEFECTO: Consume un poquito más de memoria que for...of porque tiene que compilar 
        // y guardar el objeto RegExp en el sistema.
    }

    =========================================================================
    TABLA COMPARATIVA DE TODOS LOS MÉTODOS
    =========================================================================
    ┌────────────────┬──────────────┬──────────────┬──────────────────────┐
    │  MÉTODO        │  VELOCIDAD   │  MEMORIA     │  DIFICULTAD          │
    ├────────────────┼──────────────┼──────────────┼──────────────────────┤
    │  for...of      │  Media       │  Muy baja    │  Fácil               │
    │  .split()      │  Rápida      │  Alta        │  Muy fácil           │
    │  .indexOf()    │  Muy rápida  │  Muy baja    │  Media               │
    │  RegExp        │  Rápida      │  Baja        │  Difícil             │
    └────────────────┴──────────────┴──────────────┴──────────────────────┘

    ¿Cuál usar?
    - Para aprender: for...of (entiendes cada paso)
    - Para textos cortos: cualquiera funciona bien
    - Para textos enormes: indexOf() (más rápido y poca memoria)
    - Para búsquedas complejas: RegExp (patrones, no solo letras)
*/

// ======================================================================
// RESUMEN: Conceptos clave aprendidos en este archivo
// ======================================================================
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO              │  QUÉ HACE                                  │
// ├─────────────────────────────────────────────────────────────────────┤
// │  const                 │  Variable que NO cambia de valor           │
// │  let                   │  Variable que SÍ puede cambiar             │
// │  getElementById()      │  Busca un elemento HTML por su id         │
// │  .value                │  Obtiene el texto de un input              │
// │  Cláusula de guarda    │  Validación temprana para salir rápido     │
// │  for...of              │  Recorre cada carácter de un string        │
// │  contador++            │  Suma 1 al contador (atajo)                │
// │  Template literals     │  Strings con variables: `${var}`           │
// │  addEventListener      │  Escucha eventos (clicks, teclas, etc.)    │
// │  .split()              │  Divide un string en un array              │
// │  .indexOf()            │  Busca la posición de un texto             │
// │  .matchAll()           │  Busca coincidencias con RegExp            │
// │  Valores "falsy"       │  "", 0, null, undefined, NaN, false        │
// └─────────────────────────────────────────────────────────────────────┘
//
// FLUJO DEL ALGORITMO (for...of):
// 1. Obtener palabra y letra del usuario
// 2. Validar que ambos datos existen (cláusula de guarda)
// 3. Inicializar contador a 0
// 4. Recorrer la palabra carácter por carácter
// 5. Si el carácter coincide con la letra → contador++
// 6. Mostrar resultado en consola
