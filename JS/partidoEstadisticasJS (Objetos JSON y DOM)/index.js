// ======================================================================
// LECCIÓN: Inyección Dinámica de Datos DOM y Cálculos (Estadísticas AS)
// ======================================================================
//
// ¿QUÉ HACE ESTE SCRIPT?
// ──────────────────────
// Imagina que estás viendo un partido de fútbol en una web deportiva
// (como Marca o ESPN). Las estadísticas (tiros, posesión, faltas...)
// NO están escritas en el HTML a mano. Vienen de un SERVIDOR en formato
// JSON y JavaScript las "inyecta" en la página web en tiempo real.
//
// Este script simula ese proceso:
//   1. Tiene datos guardados en un OBJETO JSON (como una ficha)
//   2. Busca los elementos HTML donde poner esos datos (el DOM)
//   3. Rellena textos, imágenes y calcula porcentajes
//   4. Modifica el CSS para que las barras crezcan o encojan
//
// FLUJO DE DATOS (como una cadena de montaje):
//
//   ┌──────────┐      ┌──────────────┐      ┌────────────┐
//   │  OBJETO  │ ───> │  JAVASCRIPT  │ ───> │   HTML     │
//   │  JSON    │      │  (este file) │      │  (página)  │
//   │ (datos)  │      │  (procesa)   │      │  (muestra) │
//   └──────────┘      └──────────────┘      └────────────┘
//
// En un proyecto real, el objeto JSON vendría de un servidor (API).
// Aquí lo tenemos "hardcodeado" (escrito a mano) para practicar.

// ----------------------------------------------------------------------
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ----------------------------------------------------------------------
//
// CONCEPTO: ¿Qué es el DOM?
// ─────────────────────────
// El DOM (Document Object Model) es como un "árbol genealógico" de tu
// página HTML. JavaScript puede acceder a cualquier elemento de ese
// árbol y modificarlo.
//
//   HTML original:          Árbol DOM:
//   <div class="local">        document
//     <div class="dark-box">      └── div.local
//     </div>                          └── div.dark-box  ← ¡Esta!
//   </div>
//
// ¿CÓMO BUSCAMOS ELEMENTOS?
// ┌──────────────────────────────────────────────────────────────────┐
// │  MÉTODO                  │  BUSCA POR...       │  DEVUELVE      │
// ├──────────────────────────┼─────────────────────┼────────────────┤
// │  querySelector('.clase') │  Clase CSS (.)      │  1er elemento  │
// │  getElementById('id')    │  ID único (#)       │  1 elemento    │
// │  querySelectorAll('.c')  │  Clase CSS (.)      │  TODOS (lista) │
// └──────────────────────────────────────────────────────────────────┘
//
// Las "dark-box" son las barras gráficas que muestran el porcentaje
// de tiros a puerta. Las seleccionamos para poder cambiar su anchura.
const localDarkBox = document.querySelector('.local .dark-box');
const visitorDarkBox = document.querySelector('.visitor .dark-box');

// Seleccionamos todos los elementos donde inyectaremos texto e imágenes.
// Cada uno tiene un ID único en el HTML (como su DNI).
//
// Analogía: Es como tener buzones con nombre.
//   logoLocal       → buzón donde pondremos la imagen del equipo local
//   localApuerta    → buzón donde pondremos los tiros a puerta del local
//   etc.
const logoLocal = document.getElementById('logoLocal');
const logoVisitante = document.getElementById('logoVisitante');
const localApuerta = document.getElementById('localApuerta');
const localFuera = document.getElementById('localFuera');
const visitanteApurta = document.getElementById('visitanteApurta');
const visitanteFuera = document.getElementById('visitanteFuera');
const localBloqueados = document.getElementById('localBloqueados');
const visitanteBloqueados = document.getElementById('visitanteBloqueados');

// ----------------------------------------------------------------------
// 2. OBJETO JSON (NUESTROS DATOS SIMULADOS)
// ----------------------------------------------------------------------
//
// CONCEPTO: ¿Qué es un Objeto JSON?
// ─────────────────────────────────
// Un objeto es como una FICHA de datos con pares "clave: valor".
// Imagina la ficha técnica de un equipo de fútbol:
//
// ┌─────────────────────────────────────────────────────┐
// │  EQUIPO                                             │
// │  ──────                                             │
// │  nombre:  "Bayern"        ← dato texto (string)     │
// │  escudo:  "bayern.png"    ← dato texto (ruta)       │
// │  color:   "#c60e1d"       ← dato texto (color hex)  │
// │  remates: { ... }         ← dato OBJETO anidado     │
// │           ├── fuera: 7     ← dato número            │
// │           ├── apuerta: 6  ← dato número            │
// │           └── bloqueados: 5← dato número            │
// └─────────────────────────────────────────────────────┘
//
// ACCESO A DATOS (notación de punto):
// ┌──────────────────────────────────────────────────────────────┐
// │  CÓDIGO                                    │  RESULTADO     │
// ├────────────────────────────────────────────┼────────────────┤
// │  estadisticasRemates.titulo                │  "REMATES"     │
// │  estadisticasRemates.equipoLocal.nombre    │  "Bayern"      │
// │  estadisticasRemates.equipoLocal.remates   │  {fuera:7,...} │
// │  estadisticasRemates.equipoLocal.remates.fuera │  7         │
// └──────────────────────────────────────────────────────────────┘
//
// ¿POR QUÉ USAMOS OBJETOS?
// Porque agrupan datos relacionados. En vez de tener 20 variables
// sueltas (nombreLocal, colorLocal, golesLocal...), tenemos TODO
// organizado dentro de un solo objeto. Es como tener una carpeta
// con todos los documentos de un proyecto, en vez de papeles sueltos.
//
// En un proyecto real, estos datos vendrían de un servidor (API Fetch).
// Aquí los definimos localmente en una estructura jerárquica de objetos.
let estadisticasRemates = {
    titulo: "REMATES",
    equipoLocal: {
        nombre: "Bayern",
        escudo: "bayern.png",
        color: "#c60e1d",
        remates: { fuera: 7, apuerta: 6, bloqueados: 5 }
    },
    equipoVisitantes: {
        nombre: "PSG",
        escudo: "psg.png",
        color: "#f8a116",
        remates: { fuera: 3, apuerta: 7, bloqueados: 5 }
    }
};

// ----------------------------------------------------------------------
// 3. FUNCIÓN AUTOMÁTICA DE ACTUALIZACIÓN
// ----------------------------------------------------------------------
//
// CONCEPTO: ¿Qué es una función?
// ──────────────────────────────
// Una función es como una MÁQUINA: le metes ingredientes (datos),
// los procesa, y saca un resultado (cambios en la página).
//
//   Entrada (parámetro)           Proceso              Salida
//   ┌──────────────┐      ┌──────────────────┐    ┌──────────────┐
//   │ objeto JSON  │ ───> │ actualizarEstad. │───>│ HTML pintado │
//   │  (datos)     │      │  (la máquina)    │    │  (resultado) │
//   └──────────────┘      └──────────────────┘    └──────────────┘
//
// ¿POR QUÉ USAMOS UNA FUNCIÓN?
// Porque si mañana cambian los datos (otro partido), solo tenemos
// que llamar a la función con datos nuevos. NO tocamos el código.
// Esto se llama "reutilización de código".
//
// Esta función recibe el objeto JSON por parámetro y distribuye
// sus datos en los elementos HTML correspondientes.
function actualizarEstadisticas(datos) {
    
    // --- A) PINTAR TEXTOS E IMÁGENES ---
    //
    // .src  → cambia la ruta de la imagen (como cambiar la foto de un perfil)
    // .alt  → texto alternativo para accesibilidad (lectores de pantalla)
    //
    // Analogía: Es como rellenar un formulario.
    //   "En el campo 'foto' del equipo local, pon la imagen bayern.png"
    //   "En el campo 'nombre' de la foto, pon 'Bayern'"
    logoLocal.src = datos.equipoLocal.escudo;
    logoLocal.alt = datos.equipoLocal.nombre;
    logoVisitante.src = datos.equipoVisitantes.escudo;
    logoVisitante.alt = datos.equipoVisitantes.nombre;

    // .textContent → cambia el TEXTO que se ve dentro de un elemento HTML
    //
    // Ejemplo visual:
    //   ANTES: <span id="localApuerta"></span>        (vacío)
    //   DESPUÉS: <span id="localApuerta">6</span>     (muestra "6")
    //
    // Estamos sacando los números del objeto JSON y metiéndolos en el HTML.
    localApuerta.textContent = datos.equipoLocal.remates.apuerta;
    localFuera.textContent = datos.equipoLocal.remates.fuera;
    visitanteApurta.textContent = datos.equipoVisitantes.remates.apuerta;
    visitanteFuera.textContent = datos.equipoVisitantes.remates.fuera;

    localBloqueados.textContent = datos.equipoLocal.remates.bloqueados;
    visitanteBloqueados.textContent = datos.equipoVisitantes.remates.bloqueados;


    // --- B) CÁLCULOS MATEMÁTICOS DE PORCENTAJES ---
    //
    // ¿QUÉ QUEREMOS CALCULAR?
    // Queremos saber qué porcentaje de los tiros totales fueron "A Puerta".
    //
    // Fórmula matemática:
    // ┌──────────────────────────────────────────────────────┐
    // │                                                      │
    // │   porcentaje = (tiros a puerta / tiros totales) × 100│
    // │                                                      │
    // │   Ejemplo Bayern:                                    │
    // │     tiros a puerta = 6                               │
    // │     tiros fuera    = 7                               │
    // │     tiros totales  = 6 + 7 = 13                      │
    // │     porcentaje     = (6 / 13) × 100 = 46.15%        │
    // │                                                      │
    // └──────────────────────────────────────────────────────┘
    
    // Equipo Local: Sumamos puerta + fuera para obtener el total de tiros
    const totalLocal = datos.equipoLocal.remates.fuera + datos.equipoLocal.remates.apuerta;

    // OPERADOR TERNARIO (? :) — El "if rápido"
    // ─────────────────────────────────────────
    // Es una forma compacta de escribir un if/else en UNA sola línea.
    //
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  SINTAXIS:                                                       │
    // │                                                                  │
    // │  condición ? valor_si_verdadero : valor_si_falso                │
    // │                                                                  │
    // │  EQUIVALE A:                                                     │
    // │  ┌────────────────────────────────────────┐                      │
    // │  │ if (totalLocal > 0) {                  │                      │
    // │  │     pctLocal = (apuerta/total) * 100;  │                      │
    // │  │ } else {                               │                      │
    // │  │     pctLocal = 0;                      │                      │
    // │  │ }                                      │                      │
    // │  └────────────────────────────────────────┘                      │
    // └──────────────────────────────────────────────────────────────────┘
    //
    // ¿POR QUÉ COMPROBAMOS totalLocal > 0?
    // Porque dividir entre 0 en JavaScript da "Infinity" (infinito),
    // y eso rompería nuestra barra de progreso. Si no hay tiros,
    // el porcentaje es 0, no infinito.
    //
    //   6 / 13 = 0.46  ✓  (normal)
    //   0 / 0  = NaN   ✗  (error matemático)
    //   6 / 0  = Infinity ✗  (error matemático)
    const pctLocal = totalLocal > 0 ? (datos.equipoLocal.remates.apuerta / totalLocal) * 100 : 0;

    // Equipo Visitante: Mismo cálculo exacto, pero con los datos del visitante
    const totalVisitante = datos.equipoVisitantes.remates.fuera + datos.equipoVisitantes.remates.apuerta;
    const pctVisitante = totalVisitante > 0 ? (datos.equipoVisitantes.remates.apuerta / totalVisitante) * 100 : 0;


    // --- C) INYECTAR ESTILOS CSS DESDE JAVASCRIPT ---
    //
    // CONCEPTO: Modificar CSS desde JavaScript
    // ─────────────────────────────────────────
    // JavaScript puede cambiar los estilos CSS de CUALQUIER elemento
    // en tiempo real. Es como si pudieras pintar la página mientras
    // el usuario la está viendo.
    //
    // .style.width → modifica la propiedad CSS "width" (anchura)
    //
    // TEMPLATE LITERALS (plantillas literales):
    // ┌──────────────────────────────────────────────────────────────┐
    // │  FORMA              │  EJEMPLO              │  RESULTADO    │
    // ├─────────────────────┼───────────────────────┼───────────────┤
    // │  Concatenar (+)     │  pctLocal + "%"       │  "46.15%"    │
    // │  Template literal   │  `${pctLocal}%`       │  "46.15%"    │
    // └──────────────────────────────────────────────────────────────┘
    //
    // Los template literals usan comillas invertidas (``) y ${} para
    // insertar variables dentro de un texto. Son más limpios y legibles
    // que usar el operador + para concatenar.
    //
    // RESULTADO VISUAL:
    // Si pctLocal = 46.15, la barra oscura ocupará el 46.15% del ancho.
    // Si pctVisitante = 70, la barra oscura ocupará el 70% del ancho.
    // Esto hará que la caja oscura crezca o encoja automáticamente.
    localDarkBox.style.width = `${pctLocal}%`;
    visitorDarkBox.style.width = `${pctVisitante}%`;
}

// ----------------------------------------------------------------------
// 4. EJECUTAR LA FUNCIÓN
// ----------------------------------------------------------------------
//
// Aquí es donde TODO ARRANCA. Hasta ahora solo habíamos DEFINIDO cosas:
//   - Seleccionamos elementos (sección 1)
//   - Creamos datos (sección 2)
//   - Creamos la función (sección 3)
//
// Pero NADA se había ejecutado todavía. Esta línea es la que
// "enciende la máquina": llama a la función y le pasa los datos.
//
// Analogía: Es como pulsar el botón START de la lavadora.
// La lavadora (función) estaba lista, la ropa (datos) estaba dentro,
// pero hasta que no pulsas START, no lava.
//
// Llamamos a la función y le pasamos nuestra base de datos simulada.
actualizarEstadisticas(estadisticasRemates);


// ======================================================================
// RESUMEN: CONCEPTOS CLAVE APRENDIDOS EN ESTA LECCIÓN
// ======================================================================
//
// ┌────┬────────────────────────┬──────────────────────────────────────┐
// │ #  │ CONCEPTO               │ ¿PARA QUÉ SIRVE?                    │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 1  │ Objeto JSON            │ Guardar datos relacionados en una   │
// │    │                        │ estructura organizada (clave:valor) │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 2  │ document.querySelector │ Buscar UN elemento HTML por su      │
// │    │                        │ clase CSS para poder manipularlo    │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 3  │ getElementById         │ Buscar UN elemento HTML por su ID   │
// │    │                        │ única (como buscar por DNI)         │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 4  │ .textContent           │ Cambiar el texto visible de un      │
// │    │                        │ elemento HTML desde JavaScript      │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 5  │ .src / .alt            │ Cambiar la imagen y su texto        │
// │    │                        │ alternativo (accesibilidad)         │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 6  │ Operador ternario      │ Escribir un if/else en una sola     │
// │    │ (condicion ? a : b)    │ línea. Útil para asignaciones       │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 7  │ Template literals (``) │ Insertar variables dentro de un     │
// │    │ ${variable}            │ texto sin usar concatenación (+)    │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 8  │ .style.width           │ Modificar el CSS de un elemento     │
// │    │                        │ en tiempo real desde JavaScript     │
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 9  │ Funciones              │ Crear bloques de código reutilizable│
// │    │                        │ que reciben datos y producen efectos│
// ├────┼────────────────────────┼──────────────────────────────────────┤
// │ 10 │ División por cero      │ Siempre comprobar que el divisor    │
// │    │                        │ no sea 0 para evitar Infinity/NaN   │
// └────┴────────────────────────┴──────────────────────────────────────┘
//
// IDEA PRINCIPAL:
// JavaScript actúa como "puente" entre los DATOS (JSON) y la PÁGINA (HTML).
// Los datos pueden cambiar en cualquier momento y JavaScript se encarga
// de actualizar la página automáticamente. Así funcionan las webs reales.
