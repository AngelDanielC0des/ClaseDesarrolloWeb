// ======================================================================
// LECCIÓN: Archivo de Pruebas y Alternativas
// ======================================================================
// Este archivo parece ser un "borrador" o zona de pruebas del alumno
// donde se estaba experimentando con variables globales y la función.

var bd = true;

// ATENCIÓN: Al leer el valor aquí (en el scope global), se captura
// el texto en el instante en que carga la página (normalmente vacío),
// y no cuando el usuario hace clic en un botón.
var palabraOriginal = document.getElementById("palabra") ? document.getElementById("palabra").value : "";
  
function esPalindromo(palabraOriginal) {
    let palabraReves = "";

    // Bucle para invertir la palabra
    // NOTA: Se ha corregido un error tipográfico en el código original 
    // ('palabraOrignal' a 'palabraOriginal')
    for (let i = palabraOriginal.length - 1; i >= 0; i--) {
        // Trazabilidad: console.log útil para ver qué letra estamos procesando
        console.log("Letra procesada:", palabraOriginal[i]);
        let letraActual = palabraOriginal[i];
        palabraReves = palabraReves + letraActual;
    }

    if (palabraReves == palabraOriginal) {
        console.log(`${palabraOriginal} es un palíndromo`);
    } else { 
        console.log(`${palabraOriginal} no es un palíndromo`);
    }
}

console.log("bd = " + bd);

// EXTRA: MÉTODOS ALTERNATIVOS (Lo que pedía el ejercicio original)

/* 
// Alternativa 1: Métodos de Array encadenados (La forma moderna y rápida)
function esPalindromoModerna(palabra) {
    // 1. split('') separa la palabra en un array de letras
    // 2. reverse() invierte el array
    // 3. join('') vuelve a unir el array en un string
    let reves = palabra.split('').reverse().join('');
    return palabra === reves;
}

// Alternativa 2: Versión Recursiva (Para el punto 4 EXTRA del ejercicio)
function esPalindromoRecursiva(palabra) {
    // Caso base: si la palabra tiene 0 o 1 letra, es palíndromo
    if (palabra.length <= 1) return true;
    
    // Si la primera y la última letra son distintas, no es palíndromo
    if (palabra[0] !== palabra[palabra.length - 1]) return false;
    
    // Llamada recursiva: recortamos la primera y última letra y volvemos a evaluar
    return esPalindromoRecursiva(palabra.slice(1, -1));
}
*/