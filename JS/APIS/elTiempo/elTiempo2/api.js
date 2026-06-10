/**
 * MÓDULO DE COMUNICACIÓN CON LA API DE CLIMA (api.js)
 * * Este archivo se encarga exclusivamente de la persistencia y recuperación de datos externos.
 * Sigue el principio de responsabilidad única: no sabe cómo se pinta la UI ni cómo funciona el mapa.
 */

const API_KEY = "bccb26b8d12744d0eceb1b3af07256c1"; 

/**
 * Obtiene los datos meteorológicos actuales desde OpenWeatherMap de forma asíncrona.
 * * @param {number} lat - Latitud geográfica.
 * @param {number} lon - Longitud geográfica.
 * @param {AbortSignal} signal - Señal para vincular la petición a un mecanismo de cancelación.
 * @returns {Promise<Object>} - Promesa que resuelve con los datos del clima en formato JSON.
 */
export async function obtenerClima(lat, lon, signal) {
    // Construcción de la URL con parámetros: unidades métricas (°C) e idioma español
    const url = `https://api.openweathermap.org/data/2.5/weather?lang=es&units=metric&appid=${API_KEY}&lat=${lat}&lon=${lon}`;
    
    // fetch() inicia una petición HTTP. Le pasamos 'signal' en las opciones para poder abortarla si es necesario.
    const respuesta = await fetch(url, { signal });
    
    // La propiedad 'ok' es un booleano (true si el status HTTP está entre 200 y 299)
    if (!respuesta.ok) {
        // Si el servidor responde con un error (ej: 401 Unauthorized o 404), la API suele enviar un JSON explicativo.
        // Usamos catch() vacío por si la respuesta no es un JSON válido, evitando que el flujo rompa aquí.
        const datosError = await respuesta.json().catch(() => ({}));
        
        // Lanzamos un error con el mensaje específico de OpenWeatherMap (ej: "city not found") o uno genérico.
        throw new Error(datosError.message || "No se pudo obtener el clima en este momento.");
    }
    
    // Si todo salió bien, deserializamos el cuerpo de la respuesta a un objeto JavaScript accesible.
    return await respuesta.json();
}
