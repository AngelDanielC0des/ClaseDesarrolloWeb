// api/clima.js

/** * Mapa en memoria para el registro de peticiones por IP (Rate Limiting).
 * @type {Map<string, {contador: number, inicio: number}>} 
 */
const registroPeticionesIP = new Map();

/**
 * Controlador principal (Serverless Function) para consultar el clima.
 * Protege la API Key y limita las peticiones para evitar abusos.
 * * @param {Object} solicitud - Objeto request de Vercel.
 * @param {Object} respuesta - Objeto response de Vercel.
 */
export default async function controladorClima(solicitud, respuesta) {
    const { latitud, longitud } = solicitud.query;
    const claveApi = process.env.WEATHER_API_KEY;

    // --- 1. LÍMITE DE PETICIONES (RATE LIMITING) ---
    const ipCliente = solicitud.headers['x-forwarded-for'] || solicitud.socket.remoteAddress || 'ip-desconocida';
    const horaActual = Date.now();
    const VENTANA_TIEMPO_MS = 60 * 60 * 1000; // 1 hora
    const LIMITE_PETICIONES = 10;

    if (registroPeticionesIP.has(ipCliente)) {
        const estadoIP = registroPeticionesIP.get(ipCliente);
        
        if (horaActual - estadoIP.inicio < VENTANA_TIEMPO_MS) {
            if (estadoIP.contador >= LIMITE_PETICIONES) {
                return respuesta.status(429).json({ error: 'Límite de peticiones superado (10/hora). Inténtalo más tarde.' });
            }
            estadoIP.contador++;
        } else {
            registroPeticionesIP.set(ipCliente, { contador: 1, inicio: horaActual });
        }
    } else {
        registroPeticionesIP.set(ipCliente, { contador: 1, inicio: horaActual });
    }

    // --- 2. VALIDACIÓN DE PARÁMETROS ---
    if (!latitud || !longitud) {
        return respuesta.status(400).json({ error: 'Faltan parámetros de latitud y longitud.' });
    }

    if (!claveApi) {
        return respuesta.status(500).json({ error: 'Configuración de servidor incompleta (API Key).' });
    }

    try {
        // --- 3. PETICIONES EN PARALELO (OpenWeatherMap) ---
        const urlActual = `https://api.openweathermap.org/data/2.5/weather?lang=es&units=metric&appid=${claveApi}&lat=${latitud}&lon=${longitud}`;
        const urlPronostico = `https://api.openweathermap.org/data/2.5/forecast?lang=es&units=metric&appid=${claveApi}&lat=${latitud}&lon=${longitud}`;
        
        const [respuestaActual, respuestaPronostico] = await Promise.all([
            fetch(urlActual),
            fetch(urlPronostico)
        ]);

        const datosActual = await respuestaActual.json();
        const datosPronostico = await respuestaPronostico.json();

        if (!respuestaActual.ok || !respuestaPronostico.ok) {
            return respuesta.status(respuestaActual.status).json({ error: 'Error al consultar el servicio meteorológico externo.' });
        }

        // --- 4. RESPUESTA UNIFICADA ---
        return respuesta.status(200).json({
            climaActual: datosActual,
            pronostico: datosPronostico
        });

    } catch (error) {
        console.error("Error en controladorClima:", error);
        return respuesta.status(500).json({ error: 'Error interno al procesar la solicitud meteorológica.' });
    }
}