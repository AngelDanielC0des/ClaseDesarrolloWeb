// app.js

/**
 * @typedef {Object} ConfiguracionGlobal
 * @property {string} API_CLIMA_URL - Ruta hacia el controlador backend en Vercel.
 * @property {string} NOMINATIM_BUSQUEDA_URL - Endpoint para buscar ciudades.
 * @property {string} NOMINATIM_INVERSO_URL - Endpoint para obtener ciudad por coordenadas.
 */
const CONFIGURACION = {
    API_CLIMA_URL: "/api/clima",
    NOMINATIM_BUSQUEDA_URL: "https://nominatim.openstreetmap.org/search",
    NOMINATIM_INVERSO_URL: "https://nominatim.openstreetmap.org/reverse"
};

/** @type {Object} Instancia global del mapa Leaflet */
let mapaMeteorologico;

/** @type {Object} Instancia global del marcador arrastrable */
let marcadorUbicacion;

// --- INICIALIZACIÓN ---
document.addEventListener("DOMContentLoaded", () => {
    inicializarTemaVisual();
    inicializarMapaInteractvo();
    vincularEventosUsuario();
});

/**
 * Inicializa la preferencia de tema (Claro/Oscuro) basada en localStorage o sistema.
 */
function inicializarTemaVisual() {
    const botonTema = document.getElementById("boton-tema");
    const temaGuardado = localStorage.getItem("tema_preferido");
    const sistemaPrefiereOscuro = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    let temaActual = temaGuardado || (sistemaPrefiereOscuro ? "oscuro" : "claro");
    document.documentElement.setAttribute("data-tema", temaActual);
    botonTema.textContent = temaActual === "oscuro" ? "☀️" : "🌙";

    botonTema.addEventListener("click", alternarTemaVisual);
}

/**
 * Cambia dinámicamente el tema de la aplicación.
 */
function alternarTemaVisual() {
    const esOscuro = document.documentElement.getAttribute("data-tema") === "oscuro";
    const nuevoTema = esOscuro ? "claro" : "oscuro";
    const botonTema = document.getElementById("boton-tema");
    
    document.documentElement.setAttribute("data-tema", nuevoTema);
    localStorage.setItem("tema_preferido", nuevoTema);
    botonTema.textContent = nuevoTema === "oscuro" ? "☀️" : "🌙";
}

/**
 * Configura la instancia de Leaflet, la capa base de OpenStreetMap y el marcador.
 */
function inicializarMapaInteractvo() {
    const coordenadasMadrid = [40.416775, -3.703790];
    
    mapaMeteorologico = L.map('mapa-interactivo').setView(coordenadasMadrid, 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(mapaMeteorologico);

    marcadorUbicacion = L.marker(coordenadasMadrid, { draggable: true }).addTo(mapaMeteorologico);
    
    // Mover marcador con un click en el mapa
    mapaMeteorologico.on('click', (eventoMapa) => marcadorUbicacion.setLatLng(eventoMapa.latlng));
}

/**
 * Asigna los escuchadores de eventos a los botones e inputs.
 */
function vincularEventosUsuario() {
    const formularioBusqueda = document.getElementById("formulario-buscador");
    const botonGps = document.getElementById("boton-gps");
    const botonClima = document.getElementById("boton-obtener-clima");

    formularioBusqueda.addEventListener("submit", gestionarBusquedaCiudad);
    botonGps.addEventListener("click", gestionarUbicacionGps);
    botonClima.addEventListener("click", procesarConsultaMeteorologica);
}

// --- SISTEMA DE NOTIFICACIONES ---

/**
 * Genera un mensaje flotante temporal (Toast).
 * @param {string} mensaje - Texto a mostrar.
 * @param {'info'|'exito'|'error'} tipo - Categoría estilística del mensaje.
 */
function mostrarNotificacionFlotante(mensaje, tipo = "info") {
    const contenedor = document.getElementById("contenedor-notificaciones");
    const notificacion = document.createElement("div");
    
    notificacion.className = `notificacion notificacion--${tipo}`;
    notificacion.textContent = mensaje;
    notificacion.setAttribute("role", "alert");
    
    contenedor.appendChild(notificacion);
    setTimeout(() => notificacion.remove(), 4300);
}

// --- CONTROLADORES DE ACCIÓN ---

/**
 * Captura el envío del formulario, consulta Nominatim y mueve el mapa.
 * @param {Event} evento - Evento de envío del formulario.
 */
async function gestionarBusquedaCiudad(evento) {
    evento.preventDefault(); // Evita recargar la página

    const entradaDatos = document.getElementById("entrada-busqueda");
    const botonBuscar = document.getElementById("boton-buscar");
    const consultaTexto = entradaDatos.value.trim();
    
    if (!consultaTexto) return mostrarNotificacionFlotante("Ingresa una ciudad válida.", "error");

    cambiarEstadoBoton(botonBuscar, true, "Buscando...");

    try {
        const urlPeticion = `${CONFIGURACION.NOMINATIM_BUSQUEDA_URL}?format=json&q=${encodeURIComponent(consultaTexto)}&limit=1`;
        const respuesta = await fetch(urlPeticion);
        if (!respuesta.ok) throw new Error("Error en el servidor de mapas.");
        
        const datosUbicacion = await respuesta.json();

        if (datosUbicacion.length > 0) {
            const latitud = parseFloat(datosUbicacion[0].lat);
            const longitud = parseFloat(datosUbicacion[0].lon);
            
            mapaMeteorologico.flyTo([latitud, longitud], 13);
            marcadorUbicacion.setLatLng([latitud, longitud]);
            mostrarNotificacionFlotante("Ciudad localizada.", "exito");
        } else {
            mostrarNotificacionFlotante("No encontramos esa ciudad.", "error");
        }
    } catch (error) {
        mostrarNotificacionFlotante("Hubo un problema de conexión con el buscador.", "error");
    } finally {
        cambiarEstadoBoton(botonBuscar, false, "Buscar");
    }
}

/**
 * Solicita los permisos del navegador para acceder a las coordenadas físicas del usuario.
 */
function gestionarUbicacionGps() {
    const botonGps = document.getElementById("boton-gps");
    if (!navigator.geolocation) return mostrarNotificacionFlotante("Navegador sin soporte GPS.", "error");

    cambiarEstadoBoton(botonGps, true, "Localizando tu posición...");

    navigator.geolocation.getCurrentPosition(
        (posicionExito) => {
            const { latitude: latitud, longitude: longitud } = posicionExito.coords;
            mapaMeteorologico.flyTo([latitud, longitud], 14);
            marcadorUbicacion.setLatLng([latitud, longitud]);
            
            mostrarNotificacionFlotante("Ubicación satelital obtenida.", "exito");
            cambiarEstadoBoton(botonGps, false, "<span aria-hidden='true'>📍</span> Usar mi ubicación actual");
        },
        () => {
            cambiarEstadoBoton(botonGps, false, "<span aria-hidden='true'>📍</span> Usar mi ubicación actual");
            mostrarNotificacionFlotante("Permiso GPS denegado por el usuario.", "error");
        }
    );
}

/**
 * Inicia la petición a Vercel para obtener datos del clima y actualiza el DOM.
 */
async function procesarConsultaMeteorologica() {
    const { lat, lng: lon } = marcadorUbicacion.getLatLng();
    gestionarEstadoCargaUI(true);

    try {
        const nombreCiudadResuelto = await obtenerNombreGeocodificado(lat, lon);
        
        const urlServidor = `${CONFIGURACION.API_CLIMA_URL}?latitud=${lat}&longitud=${lon}`;
        const respuesta = await fetch(urlServidor);
        const paqueteDatos = await respuesta.json();
        
        if (!respuesta.ok) {
            throw new Error(paqueteDatos.error || "Fallo general en la consulta climática.");
        }

        renderizarClimaActual(paqueteDatos.climaActual, nombreCiudadResuelto);
        renderizarPronostico(paqueteDatos.pronostico);
        
        gestionarEstadoCargaUI(false);
        mostrarNotificacionFlotante("Modelo meteorológico actualizado.", "exito");

    } catch (error) {
        ocultarTarjetaClima();
        mostrarNotificacionFlotante(error.message, "error");
    }
}

// --- SERVICIOS AUXILIARES ---

/**
 * Geocodificación Inversa: Convierte coordenadas en un nombre legible.
 * @param {number} lat - Latitud.
 * @param {number} lon - Longitud.
 * @returns {Promise<string>} Nombre del lugar o texto genérico.
 */
async function obtenerNombreGeocodificado(lat, lon) {
    try {
        const urlInversa = `${CONFIGURACION.NOMINATIM_INVERSO_URL}?format=json&lat=${lat}&lon=${lon}`;
        const respuesta = await fetch(urlInversa);
        const datos = await respuesta.json();
        
        return datos.address.city || datos.address.town || datos.address.village || datos.name || "Ubicación seleccionada";
    } catch {
        return "Ubicación seleccionada";
    }
}

// --- RENDERIZADO Y ESTADOS UI (DOM) ---

/**
 * Modifica el DOM para reflejar el estado de carga (Skeleton o Datos Reales).
 * @param {boolean} cargando - Indica si se debe mostrar el skeleton.
 */
function gestionarEstadoCargaUI(cargando) {
    const botonClima = document.getElementById("boton-obtener-clima");
    const tarjetaPrincipal = document.getElementById("tarjeta-clima");
    const esqueleto = document.getElementById("cargador-esqueleto");
    const contenedorDatos = document.getElementById("datos-clima");

    tarjetaPrincipal.classList.remove("tarjeta-clima--oculta");
    tarjetaPrincipal.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (cargando) {
        cambiarEstadoBoton(botonClima, true, "Consultando satélites climáticos...");
        tarjetaPrincipal.setAttribute("aria-busy", "true");
        esqueleto.classList.remove("esqueleto-carga--oculto");
        contenedorDatos.classList.add("tarjeta-clima__datos--ocultos");
    } else {
        cambiarEstadoBoton(botonClima, false, "Obtener clima del punto seleccionado");
        tarjetaPrincipal.setAttribute("aria-busy", "false");
        esqueleto.classList.add("esqueleto-carga--oculto");
        contenedorDatos.classList.remove("tarjeta-clima__datos--ocultos");
    }
}

/**
 * Oculta la tarjeta en caso de error crítico.
 */
function ocultarTarjetaClima() {
    document.getElementById("tarjeta-clima").classList.add("tarjeta-clima--oculta");
    cambiarEstadoBoton(document.getElementById("boton-obtener-clima"), false, "Obtener clima del punto seleccionado");
}

/**
 * Actualiza el DOM con los datos del clima actual.
 * @param {Object} datos - JSON de OpenWeather (Actual).
 * @param {string} nombreResuelto - Nombre de ciudad geocodificada.
 */
function renderizarClimaActual(datos, nombreResuelto) {
    const ciudadFinal = datos.name ? datos.name : nombreResuelto;
    const codigoPais = datos.sys.country ? `, ${datos.sys.country}` : "";

    document.getElementById("texto-ciudad").textContent = `${ciudadFinal}${codigoPais}`;
    document.getElementById("texto-temperatura").textContent = Math.round(datos.main.temp);
    document.getElementById("texto-descripcion").textContent = datos.weather[0].description;
    document.getElementById("texto-humedad").textContent = datos.main.humidity;
    document.getElementById("texto-viento").textContent = datos.wind.speed;
    document.getElementById("icono-clima").src = `https://openweathermap.org/img/wn/${datos.weather[0].icon}@2x.png`;
}

/**
 * Inyecta las tarjetas del carrusel del pronóstico extendido.
 * @param {Object} datos - JSON de OpenWeather (Pronóstico).
 */
function renderizarPronostico(datos) {
    const contenedorArrastrable = document.getElementById("contenedor-pronostico");
    contenedorArrastrable.innerHTML = ""; // Limpieza previa

    const listaPronostico = datos.list;
    const LIMITE_TARJETAS = 15; // Muestra aprox. 2 días (cada 3 horas)
    
    for (let i = 0; i < Math.min(LIMITE_TARJETAS, listaPronostico.length); i++) {
        const elementoPronostico = listaPronostico[i];
        const objetoFecha = new Date(elementoPronostico.dt * 1000);
        
        const formatoHora = objetoFecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const formatoDia = objetoFecha.toLocaleDateString('es-ES', { weekday: 'short' });

        const tarjetaDia = document.createElement("article");
        tarjetaDia.className = "pronostico__item";
        tarjetaDia.setAttribute("role", "listitem");
        tarjetaDia.innerHTML = `
            <span class="pronostico__tiempo">${formatoDia} ${formatoHora}</span>
            <img class="pronostico__icono" src="https://openweathermap.org/img/wn/${elementoPronostico.weather[0].icon}.png" alt="Icono de previsión" loading="lazy">
            <span class="pronostico__temperatura">${Math.round(elementoPronostico.main.temp)}°C</span>
        `;
        
        contenedorArrastrable.appendChild(tarjetaDia);
    }
}

/**
 * Cambia el estado de un botón (habilitado/deshabilitado) y su texto.
 * @param {HTMLElement} boton - Elemento del DOM.
 * @param {boolean} estadoBloqueo - True si debe deshabilitarse.
 * @param {string} textoNuevo - Texto a insertar en el botón.
 */
function cambiarEstadoBoton(boton, estadoBloqueo, textoNuevo) {
    boton.disabled = estadoBloqueo;
    boton.innerHTML = textoNuevo;
}