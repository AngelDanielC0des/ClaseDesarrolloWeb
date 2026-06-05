// =========================================================================
// MÓDULO: mathUtils.js - Utilidades Matemáticas
// =========================================================================
// Este archivo contiene SOLO lógica matemática pura.
// No sabe nada del DOM, ni de HTML, ni de CSS.
// Esto se llama "Separación de Responsabilidades" (Single Responsibility).
//
// ANALOGÍA DEL MUNDO REAL:
// Imagina una cocina profesional. Hay ESTACIONES separadas:
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Estación de cortes    →  mathUtils.js (solo cálculos)             │
// │  Estación de emplatado →  domUtils.js (solo pintar en pantalla)   │
// │  Chef principal        →  app.js (coordina todo)                  │
// │                                                                     │
// │  Cada estación hace UNA sola cosa y lo hace bien.                  │
// │  Si el chef necesita cortar algo, lo manda a la estación de cortes │
// │  (no corta él mismo en la mesa del comensal).                      │
// └─────────────────────────────────────────────────────────────────────┘
//
// VENTAJAS de separar la lógica matemática en su propio archivo:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Ventaja           │  ¿Por qué importa?                            │
// ├────────────────────┼───────────────────────────────────────────────┤
// │  Fácil de testear  │  No necesitas navegador para probar cálculos  │
// │  Reutilizable      │  Puedes usarlo en Node.js, React, etc.       │
// │  Código más limpio │  Cada archivo es pequeño y enfocado           │
// │  Mantenible        │  Si hay un bug en un cálculo, sabes dónde     │
// └─────────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// EXPORTACIÓN: Named Exports (Exportaciones con nombre)
// -------------------------------------------------------------------------
// Usamos 'export' antes de cada función/constante que queremos hacer pública.
// Otros archivos podrán importarlas con: import { nombre } from './mathUtils.js'
//
// ¿QUÉ SIGNIFICA "EXPORTAR"?
// Por defecto, todo lo que declaras en un archivo es PRIVADO.
// Nadie de fuera puede verlo. 'export' es como poner algo en el ESCAPARATE:
// "Esto está disponible para quien lo quiera usar".
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  mathUtils.js (este archivo)                                        │
// │ ┌───────────────────────────────────────────────────────────────┐   │
// │ │  export function calcularCuotaMensual()  ← En el escaparate  │   │
// │ │  export function formatearMoneda()       ← En el escaparate  │   │
// │ │  function funcionSecreta()               ← Oculto (privado)  │   │
// │ └───────────────────────────────────────────────────────────────┘   │
// └─────────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// FUNCIÓN: Calcular cuota mensual de un préstamo
// -------------------------------------------------------------------------
// Fórmula matemática estándar para préstamos amortizables (sistema francés):
// Cuota = C * (i * (1+i)^n) / ((1+i)^n - 1)
//
// ¿QUÉ ES UN PRÉSTAMO AMORTIZABLE?
// Es un préstamo donde pagas la MISMA cantidad cada mes.
// Pero dentro de esa cantidad, la proporción cambia:
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  MES 1:  Cuota = 500€  →  400€ intereses + 100€ capital           │
// │  MES 2:  Cuota = 500€  →  395€ intereses + 105€ capital           │
// │  ...                                                                │
// │  MES 120: Cuota = 500€ →   5€ intereses + 495€ capital            │
// │                                                                     │
// │  Al principio pagas MÁS intereses, al final pagas MÁS capital.     │
// │  Pero la cuota total SIEMPRE es la misma.                          │
// └─────────────────────────────────────────────────────────────────────┘
//
// Donde:
//   C = Capital prestado (cantidad que pides al banco)
//   i = Interés mensual (interés anual / 12 / 100)
//   n = Número total de cuotas (años * 12)

export function calcularCuotaMensual(capital, interesAnual, anios) {
    // Convertimos el interés anual porcentual a interés mensual decimal.
    // ¿Por qué? Porque la fórmula trabaja con meses, no con años.
    // Ejemplo: 5% anual → 5/100 = 0.05 → 0.05/12 = 0.004167 mensual
    const interesMensual = (interesAnual / 100) / 12;
    
    // Número total de cuotas (pagos mensuales).
    // Ejemplo: 10 años × 12 meses = 120 pagos
    const numeroCuotas = anios * 12;
    
    // Caso especial: si el interés es 0%, no hay fórmula compleja.
    // La cuota es simplemente el capital dividido entre los meses.
    // Ejemplo: 12000€ / 120 meses = 100€/mes (sin intereses)
    // ¿Por qué comprobamos esto? Porque si i=0, la fórmula daría 0/0 (error).
    if (interesMensual === 0) {
        return capital / numeroCuotas;
    }
    
    // Aplicamos la fórmula de amortización francesa.
    // Math.pow(base, exponente) eleva base a la potencia exponente.
    // (1+i)^n = factor de capitalización
    // Ejemplo: Math.pow(1.004167, 120) = 1.647...
    const factor = Math.pow(1 + interesMensual, numeroCuotas);
    
    // Cuota mensual = Capital * (i * factor) / (factor - 1)
    // Este es el resultado final: lo que pagarás cada mes.
    const cuota = capital * (interesMensual * factor) / (factor - 1);
    
    return cuota;
}

// -------------------------------------------------------------------------
// FUNCIÓN: Calcular el total a pagar durante toda la vida del préstamo
// -------------------------------------------------------------------------
// Es la suma de TODAS las cuotas mensuales durante todos los años.

export function calcularTotalPagar(cuotaMensual, anios) {
    // Total = cuota mensual × número de meses (12 por cada año)
    // Ejemplo: 500€/mes × 10 años × 12 meses = 60.000€
    return cuotaMensual * anios * 12;
}

// -------------------------------------------------------------------------
// FUNCIÓN: Calcular el total de intereses pagados
// -------------------------------------------------------------------------
// Los intereses son el "coste extra" de pedir dinero prestado.
// Es la diferencia entre lo que devuelves y lo que pediste.

export function calcularTotalIntereses(totalPagar, capital) {
    // Intereses = Total pagado - Capital prestado
    // Ejemplo: Si pediste 50.000€ y devolviste 60.000€ → intereses = 10.000€
    return totalPagar - capital;
}

// -------------------------------------------------------------------------
// FUNCIÓN: Formatear número como moneda (euros)
// -------------------------------------------------------------------------
// Convierte un número como 1234.5 en un texto como "1.234,50 €".
//
// ¿Por qué no usar toFixed(2) directamente?
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Método              │  Resultado        │  Problema               │
// ├──────────────────────┼───────────────────┼─────────────────────────┤
// │  (1234.5).toFixed(2) │  "1234.50"        │  Sin separador de miles │
// │                      │                   │  Punto en vez de coma   │
// ├──────────────────────┼───────────────────┼─────────────────────────┤
// │  Intl.NumberFormat   │  "1.234,50 €"     │  ¡Formato correcto!    │
// │  ('es-ES', currency) │                   │  Respeta el locale      │
// └──────────────────────┴───────────────────┴─────────────────────────┘
//
// Intl.NumberFormat es la API nativa de internacionalización de JS.
// 'es-ES' = español de España (usa punto para miles, coma para decimales).

export function formatearMoneda(cantidad) {
    // Intl.NumberFormat crea un formateador reutilizable.
    // Lo guardamos en una variable para no crear uno nuevo cada vez.
    const formateador = new Intl.NumberFormat('es-ES', {
        style: 'currency',        // Formato de moneda (añade el símbolo €)
        currency: 'EUR',          // Moneda: euros
        minimumFractionDigits: 2  // Siempre 2 decimales (ej: 100 → "100,00 €")
    });
    
    return formateador.format(cantidad);
}

// -------------------------------------------------------------------------
// FUNCIÓN: Calcular tabla de amortización (desglose mes a mes)
// -------------------------------------------------------------------------
// Devuelve un array con el desglose de cada cuota: cuánto va a capital
// y cuánto va a intereses. Es como un "extracto bancario" detallado.
//
// EJEMPLO DE RESULTADO (para un préstamo de 1000€ al 5% a 1 año):
// ┌──────┬──────────┬──────────────┬──────────────┬──────────────┐
// │ Mes  │ Cuota    │ Intereses    │ Capital      │ Pendiente    │
// ├──────┼──────────┼──────────────┼──────────────┼──────────────┤
// │  1   │  85,60€  │   4,17€      │  81,44€      │  918,56€     │
// │  2   │  85,60€  │   3,83€      │  81,78€      │  836,78€     │
// │  3   │  85,60€  │   3,49€      │  82,12€      │  754,66€     │
// │ ...  │  ...     │   ...        │  ...         │  ...         │
// │ 12   │  85,60€  │   0,35€      │  85,25€      │    0,00€     │
// └──────┴──────────┴──────────────┴──────────────┴──────────────┘
//
// Observa: la cuota es SIEMPRE la misma, pero los intereses BAJAN
// y el capital SUBE con cada mes.

export function calcularAmortizacion(capital, interesAnual, anios) {
    const interesMensual = (interesAnual / 100) / 12;
    const cuotaMensual = calcularCuotaMensual(capital, interesAnual, anios);
    const numeroCuotas = anios * 12;
    
    // capitalPendiente = lo que aún debes al banco.
    // Empieza siendo el total del préstamo y va bajando cada mes.
    let capitalPendiente = capital;
    const tabla = [];
    
    // Bucle que simula cada mes del préstamo.
    for (let mes = 1; mes <= numeroCuotas; mes++) {
        // Intereses del mes = capital pendiente × interés mensual.
        // Cuanto MENOS debas, MENOS intereses pagas.
        const interesesMes = capitalPendiente * interesMensual;
        
        // Capital amortizado = cuota - intereses.
        // Es la parte de tu pago que REALMENTE reduce la deuda.
        const capitalAmortizado = cuotaMensual - interesesMes;
        
        // Actualizamos el capital pendiente (restamos lo amortizado).
        capitalPendiente -= capitalAmortizado;
        
        // Añadimos una fila a la tabla con los datos de este mes.
        // Math.max(0, capitalPendiente) evita que aparezca -0.01 por
        // errores de redondeo de los números decimales en JavaScript.
        tabla.push({
            mes,
            cuota: cuotaMensual,
            intereses: interesesMes,
            capital: capitalAmortizado,
            pendiente: Math.max(0, capitalPendiente)
        });
    }
    
    return tabla;
}

// -------------------------------------------------------------------------
// EXPORTACIÓN: Default Export (Exportación por defecto)
// -------------------------------------------------------------------------
// Un módulo puede tener UNA SOLA exportación por defecto.
// Se importa sin llaves: import mathUtils from './mathUtils.js'
//
// COMPARACIÓN: Named Export vs Default Export
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Named Export                    │  Default Export                 │
// ├──────────────────────────────────┼─────────────────────────────────┤
// │  export function foo() {}        │  export default { foo, bar }    │
// │  Se importa con llaves:          │  Se importa SIN llaves:         │
// │  import { foo } from './m.js'    │  import m from './m.js'         │
// │  Puedes exportar MUCHAS cosas    │  Solo UNA por archivo           │
// │  El nombre DEBE coincidir        │  Puedes ponerle el nombre       │
// │                                  │  que quieras al importar        │
// └──────────────────────────────────┴─────────────────────────────────┘
//
// Aquí agrupamos TODAS las funciones en un objeto y lo exportamos como default.
// Es útil si alguien quiere importar todo de una vez.

export default {
    calcularCuotaMensual,
    calcularTotalPagar,
    calcularTotalIntereses,
    formatearMoneda,
    calcularAmortizacion
};

// =========================================================================
// RESUMEN DE CONCEPTOS APRENDIDOS
// =========================================================================
//
// ┌─────┬──────────────────────────┬──────────────────────────────────────┐
// │  #  │ Concepto                 │ En una frase                         │
// ├─────┼──────────────────────────┼──────────────────────────────────────┤
// │  1  │ export (named)           │ Hace pública una función por nombre  │
// │  2  │ export default           │ Exportación principal (una por arch) │
// │  3  │ Separación de resp.      │ Cada archivo hace UNA sola cosa      │
// │  4  │ Función pura             │ Mismo input → mismo output, sin DOM  │
// │  5  │ Intl.NumberFormat        │ Formatea números según el país       │
// │  6  │ Math.pow(base, exp)      │ Eleva base a la potencia exponente   │
// │  7  │ Math.max(a, b)           │ Devuelve el mayor de dos valores     │
// │  8  │ Amortización francesa    │ Cuota fija, intereses decrecientes   │
// └─────┴──────────────────────────┴──────────────────────────────────────┘
//
// PATRÓN CLAVE: Este módulo NO sabe que existe HTML, CSS ni el navegador.
// Solo hace cálculos. Eso lo hace portable y fácil de testear.
// =========================================================================
