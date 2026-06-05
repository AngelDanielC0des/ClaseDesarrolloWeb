const API_KEY = "bccb26b8d12744d0eceb1b3af07256c1"; 


const MENSAJES_ERROR_GEO = {
    [GeolocationPositionError.PERMISSION_DENIED]: "Sin permiso del usuario.",
    [GeolocationPositionError.POSITION_UNAVAILABLE]: "Sin acceso a la ubicación.",
    [GeolocationPositionError.TIMEOUT]: "Se demoró demasiado en obtener la ubicación."
};

document.getElementById("obtenerUbicacion").addEventListener("click", obtenerUbicacion);

function obtenerUbicacion() {
    const contenedorResultado = document.getElementById("resultado");

    if (!navigator.geolocation) {
        alert("Tu navegador no soporta geolocalización.");
        return;
    }

    contenedorResultado.textContent = "Solicitando ubicación...";
    
    navigator.geolocation.getCurrentPosition(ubicacionOk, ubicacionError);
}


async function ubicacionOk(posicionObtenida) {
    const { latitude: lat, longitude: lon } = posicionObtenida.coords;
    const contenedorResultado = document.getElementById("resultado");
    
    contenedorResultado.textContent = `Cargando datos climáticos...`;

    const url = `https://api.openweathermap.org/data/2.5/weather?lang=es&units=metric&appid=${API_KEY}&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;

    try {
        const respuesta = await fetch(url);
        
        if (!respuesta.ok) {
            throw new Error(`Error ${respuesta.status}: No se pudo obtener el clima.`);
        }

        const datosTiempo = await respuesta.json();
        
        // Renderizado del éxito
        contenedorResultado.textContent = `Ciudad: ${datosTiempo.name} | Temp: ${datosTiempo.main.temp}°C`;
        console.log("Datos recibidos:", datosTiempo);

    } catch (error) {
        // Manejo de error específico para el fetch
        console.error("Error en la consulta:", error);
        contenedorResultado.textContent = "Error al obtener el clima. Intenta de nuevo.";
        alert(error.message);
    }
}

function ubicacionError(error) {
    const mensajeMostrar = MENSAJES_ERROR_GEO[error.code] || "Error desconocido.";
    
    alert(mensajeMostrar);
    document.getElementById("resultado").textContent = "SIN ACCESO A LA UBICACIÓN";
}