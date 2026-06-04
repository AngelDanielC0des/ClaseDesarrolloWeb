// Guardamos la API KEY en una constante limpia
const API_KEY = "bccb26b8d12744d0eceb1b3af07256c1";

function obtenerUbicacion() {
    if (navigator.geolocation) {
        console.log("Existe el API de geolocation");
        document.getElementById("resultado").textContent = "Solicitando ubicación ...";

        // Iniciamos la solicitud de ubicación
        navigator.geolocation.getCurrentPosition(ubicacionOk, ubicacionError);
    } else {
        alert("Navegador antiguo, sin acceso a la ubicación");
    }
}

function ubicacionOk(posicionObtenida) {
    let latitud = posicionObtenida.coords.latitude;
    let longitud = posicionObtenida.coords.longitude;

    document.getElementById("resultado").textContent = `LAT = ${latitud} LONG = ${longitud}`;

    // LLAMAMOS a la API del tiempo AQUÍ, ahora que ya tenemos las coordenadas reales
    consultarClima(latitud, longitud);
}

function ubicacionError(error) {
    // El parámetro que devuelve el navegador es un objeto, el código está en error.code
    switch(error.code) {
        case 1: 
            alert("Sin permiso del usuario");
            break;
        case 2: 
            alert("Sin acceso a la ubicación");
            break;
        case 3: 
            alert("Se demoró demasiado");
            break;
        default: 
            alert("Error desconocido");
    }
    document.getElementById("resultado").textContent = `SIN ACCESO A LA UBICACIÓN`;
}

// Nueva función encargada exclusivamente de la petición HTTP
function consultarClima(latitud, longitud) {
    // Construimos la URL correctamente sin espacios internos
    const URL = `https://api.openweathermap.org/data/2.5/weather?lang=es&units=metric&appid=${API_KEY}&lat=${latitud}&lon=${longitud}`;

    fetch(URL)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al conectar con OpenWeatherMap");
            }
            return response.json(); // Convertimos la respuesta a JSON
        })
        .then(datosClima => {
            console.log("JSON recibido:", datosClima); // Paso 2: Mostrar por consola
            mostrarDatos(datosClima);
        })
        .catch(err => {
            console.error("Hubo un problema con el fetch:", err);
        });
}

function mostrarDatos(datos) {
    const contenedor = document.getElementById("resultado");
    
    // Al ser un objeto directo (no un array), accedemos a sus propiedades sin forEach
    const li = document.createElement("li");
    li.textContent = `En ${datos.name} hace una temperatura de ${datos.main.temp}°C`;
    
    // Lo añadimos al contenedor de tu HTML
    contenedor.appendChild(li);
}

// EJECUCIÓN: Iniciamos todo el proceso automáticamente al cargar el script
obtenerUbicacion();