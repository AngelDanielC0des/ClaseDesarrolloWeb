const API_KEY = "TU_API_KEY_AQUÍ";

// Reemplazo del switch por un objeto literal con constantes nativas (Código limpio y autodocumentado)
const MENSAJES_ERROR_GEO = {
    [GeolocationPositionError.PERMISSION_DENIED]: "Sin permiso del usuario.",
    [GeolocationPositionError.POSITION_UNAVAILABLE]: "Sin acceso a la ubicación.",
    [GeolocationPositionError.TIMEOUT]: "Se demoró demasiado en obtener la ubicación."
};

// Escucha de eventos separada de la lógica de la función
document.getElementById("obtenerUbicacion").addEventListener("click", obtenerUbicacion);

function obtenerUbicacion() {
    const contenedorResultado = document.getElementById("resultado");

    // Cláusula de guarda: Si no existe la API, cortamos la ejecución temprano
    if (!navigator.geolocation) {
        alert("Navegador antiguo, sin acceso a la ubicación");
        return;
    }

    console.log("Existe el API de geolocation");
    contenedorResultado.textContent = "Solicitando ubicación ...";
    
    navigator.geolocation.getCurrentPosition(ubicacionOk, ubicacionError);
}

function ubicacionOk(posicionObtenida) {
    // Desestructuración de objetos para extraer limpiamente latitud y longitud
    const { latitude: lat, longitude: lon } = posicionObtenida.coords;
    
    document.getElementById("resultado").textContent = `LAT = ${lat} LONG = ${lon}`;

    const url = `https://api.openweathermap.org/data/2.5/weather?lang=es&units=metric&appid=${API_KEY}&lat=${lat}&lon=${lon}`;
    console.log("Invocando al API del tiempo en la URL:", url);

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then(datosTiempo => {
            console.log("¡JSON recibido con éxito!");
            console.dir(datosTiempo);
        })
        .catch(error => {
            console.error("Hubo un problema al consultar el clima:", error);
        });
}

function ubicacionError(error) {
    // Buscamos el mensaje correspondiente en nuestro objeto. Si no existe, usamos uno por defecto.
    const mensajeMostrar = MENSAJES_ERROR_GEO[error.code] || "Error desconocido.";
    
    alert(mensajeMostrar);
    document.getElementById("resultado").textContent = "SIN ACCESO A LA UBICACIÓN";
}