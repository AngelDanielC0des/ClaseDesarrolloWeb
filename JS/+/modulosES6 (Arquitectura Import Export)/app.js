// =========================================================================
// MÓDULO PRINCIPAL: app.js - Inyector y Orquestador
// =========================================================================
// Este es el archivo principal que "orquesta" los otros módulos.
//
// ANALOGÍA: Imagina un DIRECTOR DE ORQUESTA.
// El director no toca ningún instrumento, pero:
// - Sabe qué músicos (módulos) tiene
// - Les dice CUÁNDO tocar
// - Coordina que todo suene bien junto
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  app.js (Director de orquesta)                                      │
// │                                                                     │
// │  "mathUtils, calcula la cuota"                                      │
// │  "domUtils, pinta el resultado"                                     │
// │  "domUtils, añade al historial"                                     │
// │                                                                     │
// │  Su trabajo es:                                                     │
// │  1. IMPORTAR las funciones que necesita de otros módulos            │
// │  2. Conectar los event listeners del DOM                            │
// │  3. Coordinar la lógica: leer datos → calcular → renderizar         │
// └─────────────────────────────────────────────────────────────────────┘
//
// NOTA IMPORTANTE: Este archivo se carga con <script type="module"> en HTML.
// El atributo type="module" es OBLIGATORIO para usar import/export.
// Sin él, el navegador no reconocerá las palabras clave import/export.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  INCORRECTO:  <script src="app.js"></script>                       │
// │               → Error: Cannot use import outside a module           │
// │                                                                     │
// │  CORRECTO:    <script type="module" src="app.js"></script>         │
// │               → Funciona correctamente                              │
// └─────────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// 1. IMPORTACIONES
// -------------------------------------------------------------------------
// Hay varias formas de importar. Veamos las 3 principales:
//
// COMPARACIÓN DE FORMAS DE IMPORTAR:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Forma              │  Sintaxis                  │  ¿Cuándo usar?  │
// ├─────────────────────┼────────────────────────────┼─────────────────┤
// │  Named Import       │  import { foo } from '...' │  Necesitas      │
// │  (con llaves)       │                            │  funciones sueltas│
// ├─────────────────────┼────────────────────────────┼─────────────────┤
// │  Default Import     │  import mod from '...'     │  El módulo tiene│
// │  (sin llaves)       │                            │  export default │
// ├─────────────────────┼────────────────────────────┼─────────────────┤
// │  Namespace Import   │  import * as mod from '...'│  Quieres TODO   │
// │  (todo como objeto) │                            │  bajo un nombre │
// └─────────────────────────────────────────────────────────────────────┘

// FORMA A: Named Imports (importar funciones específicas por nombre)
// Usamos llaves {} y los nombres EXACTOS de lo exportado con 'export'.
// El nombre DEBE coincidir con el del archivo original (no puedes renombrar).
import { 
    calcularCuotaMensual, 
    calcularTotalPagar, 
    calcularTotalIntereses,
    formatearMoneda 
} from './mathUtils.js';

import { 
    renderizarResultados, 
    agregarAlHistorial, 
    limpiarHistorial,
    mostrarMensaje,
    obtenerDatosFormulario,
    validarDatos
} from './domUtils.js';

// FORMA B: Default Import (importar la exportación por defecto)
// Sin llaves, con el nombre que queramos (podemos inventar el nombre).
// import mathUtils from './mathUtils.js';
// mathUtils.calcularCuotaMensual(...)

// FORMA C: Namespace Import (importar TODO como un objeto)
// Todo lo exportado se agrupa bajo un nombre de objeto.
// import * as mathUtils from './mathUtils.js';
// mathUtils.calcularCuotaMensual(...)

// -------------------------------------------------------------------------
// 2. FUNCIÓN PRINCIPAL: Calcular préstamo
// -------------------------------------------------------------------------
// Esta función orquesta todo el flujo. Es el "corazón" de la aplicación.
//
// FLUJO COMPLETO (de arriba a abajo):
// ┌─────────────────────────────────────────────────────────────────────┐
// │                                                                     │
// │  1. OBTENER DATOS del formulario (¿qué escribió el usuario?)       │
// │         ↓                                                           │
// │  2. VALIDAR datos (¿tienen sentido los números?)                   │
// │         ↓                                                           │
// │     ¿Válido?                                                        │
// │     ├── NO → Mostrar errores y SALIR                               │
// │     └── SÍ ↓                                                        │
// │  3. CALCULAR resultados (cuota, total, intereses)                  │
// │         ↓                                                           │
// │  4. CREAR OBJETO con los resultados                                │
// │         ↓                                                           │
// │  5. RENDERIZAR en el DOM (pintar en pantalla)                      │
// │         ↓                                                           │
// │  6. AGREGAR al historial (guardar en la lista)                     │
// │                                                                     │
// └─────────────────────────────────────────────────────────────────────┘

function calcularPrestamo() {
    // A) OBTENER DATOS del formulario (función de domUtils).
    // Lee los 3 inputs (capital, interés, años) y los devuelve como objeto.
    const datos = obtenerDatosFormulario();
    
    // B) VALIDAR datos (función de domUtils).
    // Comprueba que los valores tienen sentido (no negativos, no vacíos, etc.)
    const validacion = validarDatos(datos);
    
    if (!validacion.valido) {
        // Si hay errores, los mostramos y SALIMOS de la función (return).
        // .join('<br>') une los errores con saltos de línea HTML.
        // Ejemplo: "Error 1<br>Error 2" se ve como:
        //   Error 1
        //   Error 2
        const mensajeError = validacion.errores.join('<br>');
        mostrarMensaje(mensajeError, 'error');
        return;
    }
    
    // C) CALCULAR resultados usando las funciones de mathUtils.
    // Cada función hace UN cálculo específico (principio de responsabilidad única).
    const cuotaMensual = calcularCuotaMensual(datos.capital, datos.interes, datos.anios);
    const totalPagar = calcularTotalPagar(cuotaMensual, datos.anios);
    const totalIntereses = calcularTotalIntereses(totalPagar, datos.capital);
    
    // D) CREAR OBJETO de resultados.
    //
    // SHORTHAND DE PROPIEDADES ES6:
    // Cuando la clave y la variable tienen el MISMO nombre, se puede abreviar.
    //
    // ┌─────────────────────────────────────────────────────────────────┐
    // │  Forma larga:                                                   │
    // │  const resultados = {                                           │
    // │      cuotaMensual: cuotaMensual,    ← clave: variable          │
    // │      totalPagar: totalPagar,                                    │
    // │  };                                                             │
    // │                                                                 │
    // │  Forma corta (ES6 shorthand):                                   │
    // │  const resultados = {                                           │
    // │      cuotaMensual,           ← JS entiende: cuotaMensual: ...  │
    // │      totalPagar,                                                │
    // │  };                                                             │
    // └─────────────────────────────────────────────────────────────────┘
    const resultados = {
        capital: datos.capital,
        interes: datos.interes,
        anios: datos.anios,
        cuotaMensual,      // Equivalente a: cuotaMensual: cuotaMensual
        totalPagar,        // Equivalente a: totalPagar: totalPagar
        totalIntereses     // Equivalente a: totalIntereses: totalIntereses
    };
    
    // E) RENDERIZAR en el DOM (función de domUtils).
    // Pinta los resultados en la sección de resultados de la página.
    renderizarResultados(resultados);
    
    // F) AGREGAR al historial (función de domUtils).
    // Añade una línea al historial de cálculos realizados.
    agregarAlHistorial(resultados);
}

// -------------------------------------------------------------------------
// 3. EVENT LISTENERS (Escuchadores de eventos)
// -------------------------------------------------------------------------
// Un "event listener" ESPERA a que el usuario haga algo y entonces ejecuta código.
//
// ANALOGÍA: Es como un timbre de puerta.
// El timbre está ahí, esperando. Cuando alguien pulsa (evento 'click'),
// suena (se ejecuta la función).
//
// addEventListener('evento', función) = "Cuando pase X, haz Y"

// Botón "Calcular": al hacer click, ejecuta calcularPrestamo().
// NOTA: Pasamos calcularPrestamo SIN paréntesis.
// ¿Por qué? Porque queremos pasar la FUNCIÓN, no ejecutarla ahora.
// ┌─────────────────────────────────────────────────────────────────────┐
// │  calcularPrestamo   →  Pasa la función (se ejecutará al clicar)   │
// │  calcularPrestamo() →  Ejecuta AHORA (no queremos eso)            │
// └─────────────────────────────────────────────────────────────────────┘
document.getElementById('btnCalcular').addEventListener('click', calcularPrestamo);

// Botón "Limpiar": al hacer click, borra el historial y muestra confirmación.
// Aquí usamos una ARROW FUNCTION (función flecha) porque necesitamos
// ejecutar DOS líneas de código (no podemos pasar solo una referencia).
document.getElementById('btnLimpiar').addEventListener('click', () => {
    limpiarHistorial();
    mostrarMensaje('Historial limpiado correctamente', 'exito');
});

// Permitir calcular con Enter desde cualquier input.
// document.querySelectorAll('input') selecciona TODOS los inputs de la página.
// .forEach() recorre cada input y le añade el event listener.
//
// ¿QUÉ ES UNA ARROW FUNCTION?
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Función tradicional:                                               │
// │  function(e) { if (e.key === 'Enter') { calcularPrestamo(); } }    │
// │                                                                     │
// │  Arrow function (más corta):                                        │
// │  (e) => { if (e.key === 'Enter') { calcularPrestamo(); } }         │
// │                                                                     │
// │  Arrow function con una sola expresión (aún más corta):             │
// │  (e) => e.key === 'Enter' && calcularPrestamo()                    │
// └─────────────────────────────────────────────────────────────────────┘
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            calcularPrestamo();
        }
    });
});

// -------------------------------------------------------------------------
// 4. INICIALIZACIÓN
// -------------------------------------------------------------------------
// Estas líneas se ejecutan cuando el navegador carga el script.
// Son mensajes de depuración para el desarrollador (visibles en F12 > Consola).
console.log('📦 Calculadora financiero modular cargada');
console.log('Módulos importados: mathUtils.js, domUtils.js');

// =========================================================================
// RESUMEN: TIPOS DE EXPORT/IMPORT
// =========================================================================
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  EXPORTAR (desde un módulo)                                         │
// ├─────────────────────────────────────────────────────────────────────┤
// │                                                                     │
// │  Named Export (con nombre - puede haber muchos):                    │
// │    export function miFuncion() { ... }                              │
// │    export const miConstante = 42;                                   │
// │    export { funcion1, funcion2 };                                   │
// │                                                                     │
// │  Default Export (por defecto - solo UNO por archivo):               │
// │    export default function() { ... }                                │
// │    export default { funcion1, funcion2 };                           │
// │                                                                     │
// ├─────────────────────────────────────────────────────────────────────┤
// │  IMPORTAR (desde otro módulo)                                       │
// ├─────────────────────────────────────────────────────────────────────┤
// │                                                                     │
// │  Named Import (con llaves, nombre EXACTO):                          │
// │    import { miFuncion } from './archivo.js';                        │
// │    import { miFuncion as alias } from './archivo.js';               │
// │                                                                     │
// │  Default Import (sin llaves, nombre LIBRE):                         │
// │    import miModulo from './archivo.js';                             │
// │                                                                     │
// │  Namespace Import (todo como objeto):                               │
// │    import * as modulo from './archivo.js';                          │
// │                                                                     │
// ├─────────────────────────────────────────────────────────────────────┤
// │  HTML (obligatorio para que funcione en el navegador)               │
// ├─────────────────────────────────────────────────────────────────────┤
// │                                                                     │
// │    <script type="module" src="app.js"></script>                     │
// │    (type="module" es OBLIGATORIO para usar import/export)           │
// │                                                                     │
// └─────────────────────────────────────────────────────────────────────┘
//
// ┌─────┬──────────────────────────────┬────────────────────────────────────┐
// │  #  │ Concepto                     │ En una frase                       │
// ├─────┼──────────────────────────────┼────────────────────────────────────┤
// │  1  │ Módulos ES6                  │ Archivos que exportan/importan     │
// │  2  │ Named export/import          │ Exportar/importar por nombre {}    │
// │  3  │ Default export/import        │ Exportación principal (una/arch)   │
// │  4  │ Namespace import (*)         │ Importar todo como objeto          │
// │  5  │ type="module"                │ Obligatorio en HTML para módulos   │
// │  6  │ Orquestador                  │ Archivo que coordina otros módulos │
// │  7  │ Arrow functions              │ Funciones cortas con =>            │
// │  8  │ Property shorthand           │ { x } en vez de { x: x }          │
// │  9  │ Event listeners              │ Responder a acciones del usuario   │
// │ 10  │ Separación de resp.          │ Cada módulo hace UNA cosa          │
// └─────┴──────────────────────────────┴────────────────────────────────────┘
//
// ARQUITECTURA DE ESTA APP:
// ┌─────────────────────────────────────────────────────────────────────┐
// │                                                                     │
// │  app.js ──importa──→ mathUtils.js (cálculos)                        │
// │    │         └────→ domUtils.js (pintar HTML)                       │
// │    │                                                                │
// │    └─→ Usuario clica → obtenerDatos → validar → calcular →          │
// │        → renderizar → historial                                     │
// │                                                                     │
// │  Cada archivo tiene UNA responsabilidad.                            │
// │  app.js es el "jefe" que los coordina a todos.                     │
// │                                                                     │
// └─────────────────────────────────────────────────────────────────────┘
// =========================================================================
