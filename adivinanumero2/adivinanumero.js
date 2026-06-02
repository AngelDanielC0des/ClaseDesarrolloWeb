// Definimos las variables globales sin inicializarlas a ciegas
let numero_secreto;
const MAX_INTENTOS = 5;
let num_intentos = 0;

window.onload = function () {
    // 1. Recuperar o generar el número secreto
    const secretoGuardado = window.localStorage.getItem("numeroSecreto");
    
    if (secretoGuardado !== null) {
        // Si ya existía, lo transformamos a número entero
        numero_secreto = parseInt(secretoGuardado, 10);
    } else {
        // Si no existía, generamos uno nuevo y LO GUARDAMOS
        numero_secreto = Math.floor(Math.random() * 100) + 1;
        window.localStorage.setItem("numeroSecreto", numero_secreto);
    }

    // Chivato para desarrollo (eliminar en producción)
    console.log(`num secreto = ${numero_secreto}`);

    // 2. Recuperar los intentos actuales
    const intentosGuardados = window.localStorage.getItem("numeroDeIntentos");
    if (intentosGuardados !== null) {
        num_intentos = parseInt(intentosGuardados, 10);
    } else {
        num_intentos = 0;
    }

    // 3. Sincronizar la interfaz HTML nada más cargar la página
    actualizarInterfaz();
}

// Función auxiliar para no repetir código de maquetación
function actualizarInterfaz() {
    let etiquetaIntentos = document.getElementById('numintentos');
    etiquetaIntentos.textContent = MAX_INTENTOS - num_intentos;
}

function finJuego(ganador) {
    let imagen = document.getElementById('imgresultado');
    let botonReinicio = document.getElementById('reiniciar');
    
    if (ganador) {
        alert('Has acertado, ¡Enhorabuena!');
        imagen.src = 'victoria.gif';
    } else {
        alert('Has perdido, ¡GAME OVER!');
        imagen.src = 'derrota.gif';
    }
    
    botonReinicio.style.display = 'block';
    // Limpiamos el localStorage al terminar para que la próxima vez empiece de cero
    window.localStorage.clear();
}

function probar() {
    // Convertimos el input del usuario a número para comparar con seguridad (===)
    let num_usuario = parseInt(document.getElementById('numusuario').value, 10);
    
    // Validación extra por si el usuario le da a "Probar" vacío
    if (isNaN(num_usuario)) {
        alert("Por favor, introduce un número válido.");
        return;
    }

    if (num_usuario === numero_secreto) {
        finJuego(true);
    } else {
        // Ahora sí, sumará 1 de forma numérica (ej: 1 + 1 = 2)
        num_intentos = num_intentos + 1; 
        window.localStorage.setItem("numeroDeIntentos", num_intentos);
        
        actualizarInterfaz();

        if (num_intentos >= MAX_INTENTOS) {
            finJuego(false);
        } else {
            if (num_usuario > numero_secreto) {
                alert('El número buscado es menor');
            } else {
                alert('El número buscado es mayor');
            }
        }
    }
}

function reiniciar() {
    // Nos aseguramos de limpiar todo antes de recargar
    window.localStorage.clear();
    location.reload();
}