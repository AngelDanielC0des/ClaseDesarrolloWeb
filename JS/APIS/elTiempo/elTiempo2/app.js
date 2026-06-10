/**
 * EVALUACIÓN DEL CÓDIGO ORIGINAL: 85/100
 * * ¿Por qué esta nota?
 * - Puntos fuertes: Excelente separación de conceptos (MVC/Modular), estructura limpia en CSS, 
 * y un uso impecable de AbortController para prevenir condiciones de carrera (race conditions).
 * - Áreas de mejora (Resueltas en esta versión): El botón de GPS estaba declarado pero sin lógica, 
 * y las consultas al mapa se hacían "a ciegas" sin un marcador visual que confirmara el punto exacto.
 * * MÓDULO ORQUESTADOR PRINCIPAL (app.js)
 * Controla el flujo de la aplicación, reacciona a los eventos de usuario y comunica la API con la UI.
 */

import { obtenerClima } from './api.js';
import * as UI from './ui.js';

// 'abortController' guardará la instancia para cancelar peticiones HTTP que queden obsoletas.
let abortController = null;

// 'marcador' guardará la referencia visual única del pin sobre el mapa MapLibre.
let marcador = null; 

// CONFIGURACIÓN DE MAPTILER: Restauramos tu llave para habilitar el callejero detallado
const MAPTILER_KEY = "0UfQn5cXzRYMSxLZj2tX";

/**
 * Inicialización del mapa interactivo usando la librería MapLibre GL.
 * Crea una instancia del mapa dentro del contenedor del DOM especificado.
 * CONFIGURACIÓN CORREGIDA: Se apunta al estilo 'streets-v2' de MapTiler para ver las calles.
 */
const map = new maplibregl.Map({
    container: 'map', // ID del elemento HTML donde se renderizará el lienzo del mapa.
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`, // Hoja de estilos vectorial con calles detalladas.
    center: [-3.7038, 40.4168], // Coordenadas de inicio en formato [Longitud, Latitud] (Madrid por defecto).
    zoom: 11 // Nivel de zoom urbano inicial (ideal para ver calles y carreteras).
});

/**
 * Orquesta el proceso de control de peticiones, renderizado de carga, 
 * posicionamiento del marcador y captura de errores.
 * * @param {number} lat - Latitud del punto a consultar.
 * @param {number} lon - Longitud del punto a consultar.
 */
async function manejarConsulta(lat, lon) {
    // 1. CONTROL DE ASINCRONÍA SIMULTÁNEA:
    // Si el usuario hace click rápido varias veces, abortamos la petición anterior en curso.
    if (abortController) abortController.abort();
    
    // Creamos una nueva instancia del controlador para la petición actual.
    abortController = new AbortController();
    
    // 2. ESTADO DE CARGA: Cambiamos la interfaz a estado "buscando..." para mejorar la UX.
    UI.renderLoading();

    // 3. GESTIÓN DEL MARCADOR VISUAL:
    // NOTA TÉCNICA: MapLibre GL utiliza el estándar geográfico [Longitud, Latitud], al revés que OpenWeatherMap.
    if (!marcador) {
        // 1. Creamos un elemento div desde JavaScript
        const el = document.createElement('div');
        // 2. Le asignamos tu clase CSS animada
        el.className = 'marcador-gps'; 
        
        // 3. Le pasamos el elemento personalizado al marcador de MapLibre
        marcador = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(map);
    } else {
        // Si ya existe, solo lo movemos de lugar
        marcador.setLngLat([lon, lat]);
    }

    // 4. FLUJO DE PETICIÓN SEGURO:
    try {
        // Solicitamos los datos pasando la señal de cancelación (.signal)
        const data = await obtenerClima(lat, lon, abortController.signal);
        // Si la promesa se resuelve con éxito, enviamos el objeto de datos al módulo UI.
        UI.renderClima(data);
    } catch (error) {
        // Si el error fue provocado adrede por nuestro .abort(), lo ignoramos silenciosamente.
        // Si es cualquier otro error (red, API caída, etc.), lo enviamos a la interfaz.
        if (error.name !== 'AbortError') {
            UI.renderError(error.message);
        }
    }
}

// ==========================================
// ESCUCHADORES DE EVENTOS (EVENT LISTENERS)
// ==========================================

/**
 * Evento para consultar las coordenadas del centro del mapa actual.
 */
document.getElementById('btn-mapa').addEventListener('click', () => {
    // map.getCenter() devuelve un objeto de tipo LngLat nativo de MapLibre.
    // Usamos desestructuración de objetos para extraer de golpe las propiedades 'lat' y 'lng'.
    const { lat, lng } = map.getCenter();
    manejarConsulta(lat, lng);
});

/**
 * Evento para consultar el clima usando la ubicación real del dispositivo (GPS).
 */
document.getElementById('btn-gps').addEventListener('click', () => {
    // Validación de API de navegador: Comprobamos si el entorno soporta Geolocalización.
    if (!navigator.geolocation) {
        return UI.renderError("Tu navegador no soporta geolocalización.");
    }

    UI.renderLoading();

    /**
     * navigator.geolocation.getCurrentPosition() es un método asíncrono basado en callbacks.
     * Solicita al sistema operativo las coordenadas actuales a través de hardware (GPS, redes Wi-Fi).
     * Parámetros: Callback de éxito, Callback de error, y Objeto de configuración técnica.
     */
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // ÉXITO: El usuario aceptó y el hardware devolvió la posición.
            const { latitude, longitude } = position.coords;

            /**
             * Método map.flyTo(): Desplaza la cámara del mapa mediante una animación suave y fluida 
             * (efecto cinemático de vuelo) hacia el nuevo destino especificado.
             * - center: Coordenadas de destino [Longitud, Latitud].
             * - zoom: Modifica dinámicamente la altura de la cámara al llegar (16 es ideal para nivel de calle).
             */
            map.flyTo({ center: [longitude, latitude], zoom: 16 });

            // Ejecutamos la consulta del clima para esas coordenadas físicas.
            manejarConsulta(latitude, longitude);
        },
        (error) => {
            // ERROR: El usuario denegó el permiso, se agotó el tiempo o no hay señal GPS.
            UI.renderError("Permiso de ubicación denegado o señal débil.");
        },
        { 
            enableHighAccuracy: true, // Fuerza al dispositivo a usar GPS real en lugar de triangulación IP aproximada.
            timeout: 5000 // Si en 5 segundos el hardware no responde, salta al callback de error (evita esperas eternas).
        }
    );
});