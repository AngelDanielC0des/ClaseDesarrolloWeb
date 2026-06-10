const API_KEY = "bccb26b8d12744d0eceb1b3af07256c1";
const MAPTILER_KEY = "0UfQn5cXzRYMSxLZj2tX";
const contenedorResultado = document.getElementById("resultado");

// Control global para no duplicar marcadores en el mapa
let marcadorActual = null;

// 1. Inicialización del Mapa
const map = new maplibregl.Map({
    container: 'map',
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`,
    center: [-3.7038, 40.4168], // Madrid
    zoom: 11
});

// 2. Botón 1: Consultar centro del mapa
document.getElementById('btn-mapa').addEventListener('click', () => {
    const { lng, lat } = map.getCenter();
    
    // Validamos zoom mínimo antes de pedir clima
    if (map.getZoom() < 11) {
        contenedorResultado.textContent = "⚠️ Acércate un poco más en el mapa.";
    } else {
        obtenerClima(lat, lng);
    }
});

// 3. Botón 2: Geolocalización (GPS)
document.getElementById('btn-gps').addEventListener('click', () => {
    if (!navigator.geolocation) {
        contenedorResultado.textContent = "Tu navegador no soporta GPS.";
        return;
    }
    
    contenedorResultado.textContent = "Obteniendo posición...";
    
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;
            
            // Volamos al punto exacto con un nivel de zoom urbano detallado (16)
            map.flyTo({ center: [lon, lat], zoom: 16 }); 
            
            obtenerClima(lat, lon);
        },
        (err) => {
            contenedorResultado.textContent = "Error al obtener ubicación: " + err.message;
        }
    );
});

// 4. Función centralizada para renderizar el clima y el marcador gráfico
async function obtenerClima(lat, lon) {
    contenedorResultado.textContent = `Consultando clima en (${lat.toFixed(2)}, ${lon.toFixed(2)})...`;
    
    // Gestión del marcador interactivo tipo círculo
    if (marcadorActual) {
        marcadorActual.remove();
    }

    const elementoCirculo = document.createElement('div');
    elementoCirculo.className = 'marcador-gps'; 

    marcadorActual = new maplibregl.Marker({ element: elementoCirculo })
        .setLngLat([lon, lat])
        .addTo(map);

    const url = `https://api.openweathermap.org/data/2.5/weather?lang=es&units=metric&appid=${API_KEY}&lat=${lat}&lon=${lon}`;

  try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error("Error al obtener datos");
        
        const datos = await respuesta.json();
        
        // Obtención y estructuración de la imagen del clima
        const codigoIcono = datos.weather[0].icon;
        const urlIcono = `https://openweathermap.org/img/wn/${codigoIcono}@2x.png`;
        
        // 1. Limpiamos por completo el contenedor antes de añadir los nuevos elementos
        contenedorResultado.textContent = "";

        // 2. Creamos el contenedor principal (<div class="clima-contenedor">)
        const climaContenedor = document.createElement("div");
        climaContenedor.className = "clima-contenedor";

        // 3. Creamos la imagen del icono (<img>)
        const climaIcono = document.createElement("img");
        climaIcono.src = urlIcono;
        climaIcono.alt = datos.weather[0].description;
        climaIcono.className = "clima-icono";

        // 4. Creamos el bloque de texto (<div class="clima-texto">)
        const climaTexto = document.createElement("div");
        climaTexto.className = "clima-texto";

        // 5. Creamos la etiqueta para la ubicación (<strong>)
        const strongUbicacion = document.createElement("strong");
        strongUbicacion.textContent = `📍 ${datos.name || "Ubicación"}`;

        // 6. Creamos el salto de línea (<br>)
        const saltoLinea = document.createElement("br");

        // 7. Creamos la etiqueta para los datos del clima (<span>)
        const spanInfo = document.createElement("span");
        spanInfo.textContent = `🌡️ ${datos.main.temp}°C | ${datos.weather[0].description}`;

        // =========================================================
        // ENSAMBLAJE DE LOS ELEMENTOS (Árbol de nodos)
        // =========================================================
        
        // Metemos los textos dentro del contenedor de texto
        climaTexto.appendChild(strongUbicacion);
        climaTexto.appendChild(saltoLinea);
        climaTexto.appendChild(spanInfo);

        // Metemos el icono y el bloque de texto en el contenedor del clima
        climaContenedor.appendChild(climaIcono);
        climaContenedor.appendChild(climaTexto);

        // Finalmente, inyectamos todo el árbol estructurado en la interfaz
        contenedorResultado.appendChild(climaContenedor);

    } catch (error) {
        // En caso de error, también lo limpiamos y asignamos texto plano de forma segura
        contenedorResultado.textContent = "⚠️ Error al consultar el clima. Intenta de nuevo.";
        console.error(error);
    }
}