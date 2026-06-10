/**
 * MÓDULO DE INTERFAZ DE USUARIO (ui.js)
 * * Dedicado exclusivamente a manipular el DOM (Document Object Model).
 * Centraliza las mutaciones visuales para que cambios en el diseño o HTML no afecten la lógica del negocio.
 */

// Caché del contenedor principal de resultados para evitar búsquedas repetitivas en el DOM.
const contenedor = document.getElementById('resultado');

/**
 * Inserta un indicador de carga en formato HTML.
 */
export const renderLoading = () => {
    contenedor.innerHTML = `<div class="loader">Consultando datos...</div>`;
};

/**
 * Muestra un mensaje de error formateado en pantalla para el usuario.
 * @param {string} mensaje - Texto descriptivo del error ocurrido.
 */
export const renderError = (mensaje) => {
    contenedor.innerHTML = `<div class="error">⚠️ ${mensaje}</div>`;
};

/**
 * Transforma los datos crudos del JSON de clima en elementos visuales legibles.
 * @param {Object} data - Objeto de respuesta que sigue la estructura oficial de OpenWeatherMap.
 */
export const renderClima = (data) => {
    // Desestructuración profunda para extraer propiedades del JSON de respuesta de OpenWeatherMap
    const { name, weather, main } = data;
    
    // 'weather' viene siempre como un Array de objetos. Extraemos el código de icono de la primera posición [0].
    const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;

    // Inyección atómica de HTML usando Template Literals para estructurar la tarjeta de resultados.
    contenedor.innerHTML = `
        <div class="clima-contenedor">
            <img src="${iconUrl}" alt="${weather[0].description}" class="clima-icono">
            <div class="clima-texto">
                <strong>📍 ${name}</strong><br>
                <span>🌡️ ${main.temp}°C | ${weather[0].description}</span>
            </div>
        </div>
    `;
};