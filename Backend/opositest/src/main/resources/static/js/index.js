document.addEventListener("DOMContentLoaded", function() {
    
    // 1. Capturar los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get('nombre');
    const edad = params.get('edad');

    console.log("Datos detectados en URL -> Nombre:", nombre, "Edad:", edad);

    if (nombre && edad) {
        // 2. Intentar buscar los elementos en el HTML existente
        let nombreEtiqueta = document.getElementById('nombreUsuario');
        let edadEtiqueta = document.getElementById('edadUsuario');
        let cajaSaludo = document.getElementById('saludo-personalizado-box');

        // PLAN B: Si las etiquetas no existen en el HTML, las creamos por código directamente
        if (!nombreEtiqueta || !edadEtiqueta) {
            console.log("Los IDs no se encontraron en el HTML. Creando elementos dinámicamente...");
            
            // Creamos una cajita flotante al principio de la página
            cajaSaludo = document.createElement('div');
            cajaSaludo.style.background = '#f4f4f4';
            cajaSaludo.style.padding = '15px';
            cajaSaludo.style.borderLeft = '5px solid #e76f51';
            cajaSaludo.style.margin = '20px';
            
            cajaSaludo.innerHTML = `<p>¡Hola, me llamo <strong id="nombreUsuario">${nombre}</strong> y tengo <span id="edadUsuario">${edad}</span> años!</p>`;
            
            // La insertamos arriba del todo en el body para que se vea sí o sí
            document.body.insertBefore(cajaSaludo, document.body.firstChild);
        } else {
            // PLAN A: Si los IDs sí existían en el HTML, simplemente los llenamos
            nombreEtiqueta.innerText = nombre;
            edadEtiqueta.innerText = edad;
            cajaSaludo.style.display = 'block';
        }
    }
});
