// =========================================================================
// MÓDULO: domUtils.js - Utilidades de Manipulación del DOM
// =========================================================================
// Este archivo contiene SOLO funciones que interactúan con el DOM.
// No contiene lógica de negocio ni cálculos matemáticos.
// Recibe datos ya procesados y se encarga de renderizarlos.
//
// ¿QUÉ ES EL DOM?
// DOM (Document Object Model) es la representación del HTML como un árbol
// de objetos que JavaScript puede leer y modificar.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Tu HTML:                                                           │
// │  <div id="app">                                                     │
// │    <h1>Hola</h1>                                                    │
// │    <p>Mundo</p>                                                     │
// │  </div>                                                             │
// │                                                                     │
// │  El DOM lo ve así:                                                  │
// │         div#app                                                     │
// │        /        \                                                   │
// │     h1            p                                                 │
// │     │             │                                                 │
// │   "Hola"       "Mundo"                                              │
// │                                                                     │
// │  JavaScript puede: LEER, MODIFICAR, AÑADIR y BORRAR nodos del DOM  │
// └─────────────────────────────────────────────────────────────────────┘
//
// RESPONSABILIDAD DE ESTE ARCHIVO:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  mathUtils.js  →  Calcula (no toca el HTML)                        │
// │  domUtils.js   →  Pinta en pantalla (no calcula nada)              │
// │                                                                     │
// │  Si cambiamos el diseño HTML, solo tocamos ESTE archivo.           │
// │  Las funciones de renderizado están centralizadas aquí.             │
// └─────────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// IMPORTACIÓN: Importamos solo lo que necesitamos de mathUtils
// -------------------------------------------------------------------------
// Solo importamos formatearMoneda porque la necesitamos para mostrar
// los resultados formateados. El resto de lógica matemática NO se usa aquí.
//
// ¿POR QUÉ no importamos todo?
// ┌─────────────────────────────────────────────────────────────────────┐
// │  MAL:  import * as math from './mathUtils.js'                      │
// │        → Importa TODO, incluso lo que no usas. Más peso.           │
// │                                                                     │
// │  BIEN: import { formatearMoneda } from './mathUtils.js'            │
// │        → Importa SOLO lo necesario. Más claro y eficiente.         │
// └─────────────────────────────────────────────────────────────────────┘

import { formatearMoneda } from './mathUtils.js';

// -------------------------------------------------------------------------
// FUNCIÓN: Renderizar resultados en el DOM
// -------------------------------------------------------------------------
// "Renderizar" = convertir datos en HTML visible en la pantalla.
// Recibe un objeto con los datos calculados y los inyecta en el HTML.
//
// FLUJO:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Datos (objeto JS)  →  Esta función  →  HTML visible en pantalla   │
// │  { capital: 50000 }                   <span>50.000,00 €</span>     │
// └─────────────────────────────────────────────────────────────────────┘

export function renderizarResultados(datos) {
    // DESESTRUCTURACIÓN: Extraemos las propiedades del objeto en variables.
    //
    // ┌─────────────────────────────────────────────────────────────────┐
    // │  SIN desestructuración (largo y repetitivo):                    │
    // │  const capital = datos.capital;                                 │
    // │  const interes = datos.interes;                                 │
    // │  const anios = datos.anios;                                     │
    // │  const cuotaMensual = datos.cuotaMensual;                      │
    // │  ...                                                            │
    // │                                                                 │
    // │  CON desestructuración (corto y limpio):                        │
    // │  const { capital, interes, anios, ... } = datos;               │
    // │                                                                 │
    // │  Es como abrir una caja y sacar todo de una vez.               │
    // └─────────────────────────────────────────────────────────────────┘
    const { capital, interes, anios, cuotaMensual, totalPagar, totalIntereses } = datos;
    
    // Seleccionamos el contenedor donde vamos a inyectar el HTML.
    // getElementById busca en el HTML el elemento con ese id.
    const contenedor = document.getElementById('resultadosContenido');
    
    // .innerHTML = `...` REEMPLAZA todo el contenido del contenedor.
    // Usamos TEMPLATE LITERALS (backticks ``) para mezclar HTML con variables.
    // ${expresión} se reemplaza por el valor de la expresión.
    //
    // NOTA: formatearMoneda() convierte números como 1234.5 en "1.234,50 €".
    contenedor.innerHTML = `
        <div class="resultado-grid">
            <div class="resultado-item">
                <label>Capital solicitado</label>
                <span>${formatearMoneda(capital)}</span>
            </div>
            <div class="resultado-item">
                <label>Interés anual</label>
                <span>${interes}%</span>
            </div>
            <div class="resultado-item">
                <label>Plazo</label>
                <span>${anios} años</span>
            </div>
            <div class="resultado-item">
                <label>Cuota mensual</label>
                <span>${formatearMoneda(cuotaMensual)}</span>
            </div>
            <div class="resultado-item">
                <label>Total a pagar</label>
                <span>${formatearMoneda(totalPagar)}</span>
            </div>
            <div class="resultado-item">
                <label>Total intereses</label>
                <span>${formatearMoneda(totalIntereses)}</span>
            </div>
        </div>
    `;
}

// -------------------------------------------------------------------------
// FUNCIÓN: Agregar un cálculo al historial
// -------------------------------------------------------------------------
// Añade una entrada al historial visible en pantalla.
// El historial es una lista <ul> donde cada cálculo es un <li>.
//
// ANALOGÍA: Es como un historial de pedidos en un restaurante.
// Cada vez que calculas un préstamo, se añade una línea al historial.

export function agregarAlHistorial(datos) {
    const lista = document.getElementById('listaHistorial');
    
    // Creamos un nuevo elemento <li> (aún no está en la pantalla).
    // Es como escribir en un papel antes de pegarlo en la pared.
    const li = document.createElement('li');
    
    // Fecha y hora actual formateada.
    // new Date() crea un objeto con la fecha/hora actual.
    // .toLocaleString() lo convierte en texto legible según el país.
    const ahora = new Date();
    const fecha = ahora.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Rellenamos el <li> con el contenido HTML.
    li.innerHTML = `
        <span>
            ${formatearMoneda(datos.capital)} al ${datos.interes}% 
            durante ${datos.anios} años → 
            <strong>${formatearMoneda(datos.cuotaMensual)}/mes</strong>
        </span>
        <span class="fecha">${fecha}</span>
    `;
    
    // .insertBefore(nuevo, referencia) inserta ANTES del elemento de referencia.
    // lista.firstChild = el primer hijo de la lista.
    // Así añadimos al PRINCIPIO (el más reciente arriba).
    //
    // ┌─────────────────────────────────────────────────────────────────┐
    // │  ANTES:                          DESPUÉS:                       │
    // │  <li>Cálculo antiguo</li>        <li>NUEVO cálculo</li>        │
    // │                                  <li>Cálculo antiguo</li>       │
    // └─────────────────────────────────────────────────────────────────┘
    //
    // Si usáramos .appendChild() se añadiría al FINAL (abajo).
    lista.insertBefore(li, lista.firstChild);
}

// -------------------------------------------------------------------------
// FUNCIÓN: Limpiar el historial completo
// -------------------------------------------------------------------------
// Borra TODOS los elementos <li> de la lista del historial.

export function limpiarHistorial() {
    const lista = document.getElementById('listaHistorial');
    // .innerHTML = '' vacía el contenido (borra todos los hijos).
    // Es como borrar toda la pizarra de un plumazo.
    lista.innerHTML = '';
}

// -------------------------------------------------------------------------
// FUNCIÓN: Mostrar mensaje de error o información
// -------------------------------------------------------------------------
// Función genérica para mostrar mensajes al usuario.
// Es reutilizable: sirve para errores, información y éxito.
//
// ¿QUÉ ES UN PARÁMETRO CON VALOR POR DEFECTO?
// tipo = 'info' significa: "si no me pasan 'tipo', usa 'info'".
// Así no es obligatorio pasar ese argumento al llamar la función.

export function mostrarMensaje(mensaje, tipo = 'info') {
    const contenedor = document.getElementById('resultadosContenido');
    
    // Definimos colores según el tipo de mensaje.
    // Usamos un OBJETO como "diccionario" de colores.
    //
    // ┌─────────────────────────────────────────────────────────────────┐
    // │  Tipo    │  Color      │  Uso                                  │
    // ├──────────┼─────────────┼───────────────────────────────────────┤
    // │  error   │  Rojo       │  Datos inválidos, fallos              │
    // │  info    │  Azul       │  Mensajes neutros                     │
    // │  exito   │  Verde      │  Operación completada                 │
    // └──────────┴─────────────┴───────────────────────────────────────┘
    const colores = {
        error: { fondo: '#fee', borde: '#e74c3c', texto: '#c0392b' },
        info: { fondo: '#e8f4fd', borde: '#3498db', texto: '#2980b9' },
        exito: { fondo: '#e8f8f5', borde: '#11998e', texto: '#0d7a6e' }
    };
    
    // colores[tipo] accede al color usando el valor de 'tipo' como clave.
    // || colores.info = si el tipo no existe, usa 'info' como respaldo.
    //
    // ┌─────────────────────────────────────────────────────────────────┐
    // │  tipo = 'error'  →  colores['error']  →  { fondo: '#fee',... } │
    // │  tipo = 'raro'   →  colores['raro']   →  undefined             │
    // │                        || colores.info →  { fondo: '#e8f4fd',.} │
    // └─────────────────────────────────────────────────────────────────┘
    const color = colores[tipo] || colores.info;
    
    // Inyectamos el HTML con estilos en línea (inline styles).
    // Usamos los colores del diccionario para personalizar la apariencia.
    contenedor.innerHTML = `
        <div style="
            background: ${color.fondo};
            border-left: 4px solid ${color.borde};
            color: ${color.texto};
            padding: 15px;
            border-radius: 8px;
            text-align: center;
        ">
            ${mensaje}
        </div>
    `;
}

// -------------------------------------------------------------------------
// FUNCIÓN: Obtener valores del formulario
// -------------------------------------------------------------------------
// Centraliza la lectura de los inputs para evitar repetir código.
//
// ¿POR QUÉ centralizar esto?
// Si mañana cambiamos el id de un input, solo lo cambiamos AQUÍ,
// no en 10 sitios diferentes del código.
//
// IMPORTANTE: Number() convierte el texto del input a número.
// Sin Number(), "50000" sería un string, no un número.
// ┌─────────────────────────────────────────────────────────────────────┐
// │  "50000" (string)  +  "100" (string)  =  "50000100" (¡concatena!) │
// │  50000 (number)    +  100 (number)    =  50100 (¡suma!)           │
// └─────────────────────────────────────────────────────────────────────┘

export function obtenerDatosFormulario() {
    const capital = Number(document.getElementById('capital').value);
    const interes = Number(document.getElementById('interes').value);
    const anios = Number(document.getElementById('anios').value);
    
    // Retornamos un objeto con los 3 valores.
    // Usamos SHORTHAND: cuando la clave y la variable se llaman igual,
    // podemos escribir { capital } en vez de { capital: capital }.
    return { capital, interes, anios };
}

// -------------------------------------------------------------------------
// FUNCIÓN: Validar datos del formulario
// -------------------------------------------------------------------------
// Comprueba que los datos introducidos por el usuario tienen sentido.
// Devuelve un objeto con { valido: boolean, errores: string[] }
//
// ¿POR QUÉ validar?
// Los usuarios pueden escribir cualquier cosa: letras, números negativos,
// dejar campos vacíos... Si no validamos, los cálculos darán resultados
// sin sentido o la app se romperá.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Entrada del usuario  │  ¿Válido?  │  Razón                       │
// ├───────────────────────┼────────────┼──────────────────────────────┤
// │  Capital: -500        │  NO        │  No puedes pedir dinero neg. │
// │  Capital: 0           │  NO        │  Tiene que ser al menos 100€ │
// │  Interés: 100%        │  NO        │  Ningún banco cobra tanto    │
// │  Años: 0              │  NO        │  El plazo mínimo es 1 año    │
// │  Capital: 50000       │  SÍ        │  Valor razonable             │
// └───────────────────────┴────────────┴──────────────────────────────┘

export function validarDatos(datos) {
    // Array donde iremos guardando los mensajes de error.
    // Si queda vacío, todo es válido.
    const errores = [];
    
    // !datos.capital es true si capital es 0, undefined, null o NaN.
    if (!datos.capital || datos.capital < 100) {
        errores.push('El capital debe ser al menos 100€');
    }
    
    if (datos.interes < 0 || datos.interes > 50) {
        errores.push('El interés debe estar entre 0% y 50%');
    }
    
    if (!datos.anios || datos.anios < 1 || datos.anios > 30) {
        errores.push('El plazo debe estar entre 1 y 30 años');
    }
    
    // Devolvemos un objeto con:
    // - valido: true si no hay errores (errores.length === 0)
    // - errores: el array de mensajes de error
    return {
        valido: errores.length === 0,
        errores
    };
}

// -------------------------------------------------------------------------
// EXPORTACIÓN POR DEFECTO
// -------------------------------------------------------------------------
// Agrupamos todas las funciones en un objeto y las exportamos como default.
// Permite importar todo de una vez: import domUtils from './domUtils.js'

export default {
    renderizarResultados,
    agregarAlHistorial,
    limpiarHistorial,
    mostrarMensaje,
    obtenerDatosFormulario,
    validarDatos
};

// =========================================================================
// RESUMEN DE CONCEPTOS APRENDIDOS
// =========================================================================
//
// ┌─────┬──────────────────────────────┬────────────────────────────────────┐
// │  #  │ Concepto                     │ En una frase                       │
// ├─────┼──────────────────────────────┼────────────────────────────────────┤
// │  1  │ DOM                          │ El HTML visto como árbol de objetos│
// │  2  │ document.getElementById()    │ Busca un elemento por su id        │
// │  3  │ document.createElement()     │ Crea un elemento nuevo (en memoria)│
// │  4  │ .innerHTML                   │ Lee o escribe el HTML de un elem.  │
// │  5  │ .insertBefore()              │ Inserta un elemento antes de otro  │
// │  6  │ .appendChild()               │ Añade un elemento al final         │
// │  7  │ Destructuring                │ Extrae props de objetos en vars    │
// │  8  │ Template literals            │ HTML con variables usando ``       │
// │  9  │ Parámetros por defecto       │ Valor automático si no se pasa arg │
// │ 10  │ Number()                     │ Convierte string a número          │
// │ 11  │ Validación                   │ Comprobar datos antes de usarlos   │
// │ 12  │ Import selectivo             │ Importar solo lo que necesitas     │
// └─────┴──────────────────────────────┴────────────────────────────────────┘
//
// PATRÓN CLAVE: Este módulo SOLO sabe de HTML y DOM.
// No calcula nada. Recibe datos ya procesados y los pinta en pantalla.
// =========================================================================
