// ======================================================================
// LECCIÓN: Inyección Dinámica de Datos DOM y Cálculos (Estadísticas AS)
// ======================================================================
// Este script tiene la función de leer datos JSON de un partido
// (como remates a puerta y fuera) y actualizar el HTML y CSS
// en tiempo real. Esto simula cómo funcionan las webs de deportes reales.

// ----------------------------------------------------------------------
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ----------------------------------------------------------------------
// Usamos document.querySelector para seleccionar las barras gráficas.
// Representan el porcentaje visual de tiros "A PUERTA".
const localDarkBox = document.querySelector('.local .dark-box');
const visitorDarkBox = document.querySelector('.visitor .dark-box');

// Seleccionamos todos los elementos donde inyectaremos texto e imágenes
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
// En un proyecto real, estos datos vendrían de un servidor (API Fetch).
// Aquí los definimos localmente en una estructura jerárquica de objetos.
let estadisticasRemates = {
    titulo: "REMATES",
    equipoLocal: {
        nombre: "Bayern",
        escudo: "bayern.png", // Nombre de la imagen del escudo
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
// Esta función recibe el objeto JSON por parámetro y distribuye
// sus datos en los elementos HTML correspondientes.
function actualizarEstadisticas(datos) {
    
    // --- A) PINTAR TEXTOS E IMÁGENES ---
    // Actualizamos el src de la imagen (la ruta) y el alt (accesibilidad)
    logoLocal.src = datos.equipoLocal.escudo;
    logoLocal.alt = datos.equipoLocal.nombre;
    logoVisitante.src = datos.equipoVisitantes.escudo;
    logoVisitante.alt = datos.equipoVisitantes.nombre;

    // Actualizamos el textContent con los datos numéricos de los remates
    localApuerta.textContent = datos.equipoLocal.remates.apuerta;
    localFuera.textContent = datos.equipoLocal.remates.fuera;
    visitanteApurta.textContent = datos.equipoVisitantes.remates.apuerta;
    visitanteFuera.textContent = datos.equipoVisitantes.remates.fuera;

    localBloqueados.textContent = datos.equipoLocal.remates.bloqueados;
    visitanteBloqueados.textContent = datos.equipoVisitantes.remates.bloqueados;


    // --- B) CÁLCULOS MATEMÁTICOS DE PORCENTAJES ---
    // Queremos saber qué porcentaje de los tiros totales fueron "A Puerta".
    // Fórmula: (Tiros a puerta / Tiros Totales) * 100
    
    // Equipo Local: Sumamos puerta + fuera para el total
    const totalLocal = datos.equipoLocal.remates.fuera + datos.equipoLocal.remates.apuerta;
    // Operador ternario (? :): Si el total > 0 calculamos, si no ponemos 0. 
    // Evita el error "Infinity" si un equipo lleva 0 remates totales.
    const pctLocal = totalLocal > 0 ? (datos.equipoLocal.remates.apuerta / totalLocal) * 100 : 0;

    // Equipo Visitante: Mismo cálculo
    const totalVisitante = datos.equipoVisitantes.remates.fuera + datos.equipoVisitantes.remates.apuerta;
    const pctVisitante = totalVisitante > 0 ? (datos.equipoVisitantes.remates.apuerta / totalVisitante) * 100 : 0;


    // --- C) INYECTAR ESTILOS CSS DESDE JAVASCRIPT ---
    // Modificamos el estilo "en línea" del elemento HTML.
    // Usamos Template Literals (``) para concatenar la variable con el símbolo "%".
    // Esto hará que la caja oscura crezca o encoja automáticamente.
    localDarkBox.style.width = `${pctLocal}%`;
    visitorDarkBox.style.width = `${pctVisitante}%`;
}

// ----------------------------------------------------------------------
// 4. EJECUTAR LA FUNCIÓN
// ----------------------------------------------------------------------
// Llamamos a la función y le pasamos nuestra base de datos simulada.
actualizarEstadisticas(estadisticasRemates);