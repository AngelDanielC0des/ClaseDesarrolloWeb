// ======================================================================
// LECCIÓN: Validación de DNI/NIE en España (Algoritmo Oficial)
// ======================================================================
// En este archivo aplicamos el algoritmo matemático del Ministerio del Interior
// para validar la correspondencia entre los números de un DNI o NIE y su letra final.

// ----------------------------------------------------------------------
// 1. REFERENCIAS AL DOM
// ----------------------------------------------------------------------
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
const SECUENCIA_LETRAS = "TRWAGMYFPDXBNJZSQVHLCKE";

// ----------------------------------------------------------------------
// 3. FUNCIÓN PRINCIPAL DE VALIDACIÓN
// ----------------------------------------------------------------------
function verificarDNI() {

    // Limpiamos el contenedor de resultados antes de inyectar uno nuevo.
    // replaceChildren() sin argumentos vacía todo el contenido del nodo.
    resultadoDNI.replaceChildren();

    // --- A) OBTENER Y LIMPIAR VALORES ---
    // .trim() elimina espacios al principio y final.
    // .toUpperCase() convierte a mayúsculas para evitar errores (ej: 'z' vs 'Z').
    let numero = numeroDNI.value.trim().toUpperCase();
    let letra = letraDNI.value.trim().toUpperCase();

    // Validación básica temprana (Cláusula de Guarda)
    if (!numero || !letra) {
        alert("Rellena ambos campos");
        return; // Detiene la ejecución de la función
    }

    // --- B) SOPORTE PARA NIE (Extranjeros) ---
    // Los NIE empiezan por X, Y o Z. Para el cálculo matemático,
    // estas letras equivalen a los prefijos numéricos 0, 1 y 2 respectivamente.
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
    numero = Number(numero);

    // Verificamos que la conversión fue exitosa (no contiene símbolos extraños)
    // isNaN significa "Is Not a Number" (Es No-Número)
    if (isNaN(numero)) {
        alert("Documento inválido");
        return;
    }

    // EL ALGORITMO OFICIAL:
    // 1. Dividir el número completo entre 23 (la cantidad de letras posibles)
    // 2. Obtener el Resto de esa división (operador Módulo '%')
    let resto = numero % SECUENCIA_LETRAS.length;

    // 3. Buscar qué letra se encuentra en ese índice dentro de la secuencia oficial
    let letraCorrecta = SECUENCIA_LETRAS[resto];

    // --- D) INYECCIÓN DEL RESULTADO EN EL DOM ---
    if (letra === letraCorrecta) {
        // Si coinciden: Clonamos el template de Acierto y lo insertamos
        let clon = templateAcierto.content.cloneNode(true);
        resultadoDNI.appendChild(clon);
    } else {
        // Si NO coinciden: Clonamos el template de Fallo y lo insertamos
        let clon = templateFallo.content.cloneNode(true);
        resultadoDNI.appendChild(clon);
    }
}