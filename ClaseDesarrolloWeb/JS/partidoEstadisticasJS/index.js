// 1. SELECCIÓN DE ELEMENTOS DEL DOM
const localDarkBox = document.querySelector('.local .dark-box');
const visitorDarkBox = document.querySelector('.visitor .dark-box')
const logoLocal = document.getElementById('logoLocal');
const logoVisitante = document.getElementById('logoVisitante');
const localApuerta = document.getElementById('localApuerta');
const localFuera = document.getElementById('localFuera');
const visitanteApurta = document.getElementById('visitanteApurta');
const visitanteFuera = document.getElementById('visitanteFuera');
const localBloqueados = document.getElementById('localBloqueados');
const visitanteBloqueados = document.getElementById('visitanteBloqueados');

// 2. TU OBJETO JSON (DATOS)
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

// 3. FUNCIÓN AUTOMÁTICA
function actualizarEstadisticas(datos) {
    // A) Pintar textos y escudos
    logoLocal.src = datos.equipoLocal.escudo;
    logoLocal.alt = datos.equipoLocal.nombre;
    logoVisitante.src = datos.equipoVisitantes.escudo;
    logoVisitante.alt = datos.equipoVisitantes.nombre;

    localApuerta.textContent = datos.equipoLocal.remates.apuerta;
    localFuera.textContent = datos.equipoLocal.remates.fuera;
    visitanteApurta.textContent = datos.equipoVisitantes.remates.apuerta;
    visitanteFuera.textContent = datos.equipoVisitantes.remates.fuera;

    localBloqueados.textContent = datos.equipoLocal.remates.bloqueados;
    visitanteBloqueados.textContent = datos.equipoVisitantes.remates.bloqueados;

    // B) Cálculos automáticos de porcentajes
    // --- Equipo Local ---
    const totalLocal = datos.equipoLocal.remates.fuera + datos.equipoLocal.remates.apuerta;
    // Usamos un condicional por si el total es 0 (evita el error de dividir por cero)
    const pctLocal = totalLocal > 0 ? (datos.equipoLocal.remates.apuerta / totalLocal) * 100 : 0;

    // --- Equipo Visitante ---
    const totalVisitante = datos.equipoVisitantes.remates.fuera + datos.equipoVisitantes.remates.apuerta;
    const pctVisitante = totalVisitante > 0 ? (datos.equipoVisitantes.remates.apuerta / totalVisitante) * 100 : 0;

    // C) Inyectar los porcentajes calculados en las variables CSS del HTML
    localDarkBox.style.width = `${pctLocal}%`;
    visitorDarkBox.style.width = `${pctVisitante}%`;
}


// 4. EJECUTAR LA FUNCIÓN
// Solo tienes que invocarla pasándole tus datos
actualizarEstadisticas(estadisticasRemates);