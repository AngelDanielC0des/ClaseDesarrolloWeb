document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del HTML
    const entradaDeBusqueda = document.getElementById('entradaDeBusqueda');
    const botonBuscar = document.getElementById('botonBuscar');
    const contenedorDeResultados = document.getElementById('contenedorDeResultados');

    // Escuchar el clic del botón
    botonBuscar.addEventListener('click', realizarBusqueda);

    // Permitir buscar al presionar la tecla "Enter"
    entradaDeBusqueda.addEventListener('keypress', (eventoTeclado) => {
        if (eventoTeclado.key === 'Enter') {
            realizarBusqueda();
        }
    });
    

    // Función principal para conectar con la API
    async function realizarBusqueda() {
        const textoBuscado = entradaDeBusqueda.value.trim();
        
        // Si el campo está vacío, no hacer nada
        if (!textoBuscado) return;

        // Mostrar estado de carga
        contenedorDeResultados.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">Buscando canciones...</p>';

        // Construir el enlace correcto de la API de iTunes
        const enlaceDeLaApi = `https://itunes.apple.com/search?term=${encodeURIComponent(textoBuscado)}&entity=song&limit=12`;

        try {
            // Petición al servidor de Apple
            const respuestaDelServidor = await fetch(enlaceDeLaApi);
            
            if (!respuestaDelServidor.ok) {
                throw new Error('Error en la conexión con los servidores de iTunes');
            }
            
            // Convertir la respuesta a formato JSON
            const datosObtenidos = await respuestaDelServidor.json();
            
            // Pasar la lista de resultados a nuestra función encargada de dibujar el HTML
            mostrarResultadosEnPantalla(datosObtenidos.results);
            
        } catch (errorDetectado) {
            console.error('Se detectó un error:', errorDetectado);
            contenedorDeResultados.innerHTML = '<p style="text-align:center; color: red; grid-column: 1 / -1;">Hubo un error al realizar la búsqueda. Intenta nuevamente.</p>';
        }
    }
    /*Ejemplo con .then en vez de con async await:
    // Fíjate que ya no lleva la palabra "async" al principio
function realizarBusqueda() {
    const textoBuscado = entradaDeBusqueda.value.trim();
    
    if (!textoBuscado) return;

    contenedorDeResultados.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">Buscando canciones...</p>';

    const enlaceDeLaApi = `https://itunes.apple.com/search?term=${encodeURIComponent(textoBuscado)}&entity=song&limit=12`;

    // Consumo de la API usando promesas encadenadas
    fetch(enlaceDeLaApi)
        .then(respuestaDelServidor => {
            if (!respuestaDelServidor.ok) {
                // Si la respuesta no es correcta, lanzamos un error que atrapará el .catch()
                throw new Error('Error en la conexión con los servidores de iTunes');
            }
            // Pasamos los datos al siguiente .then en formato JSON
            return respuestaDelServidor.json();
        })
        .then(datosObtenidos => {
            // Aquí ya tenemos los datos listos para pintar en pantalla
            mostrarResultadosEnPantalla(datosObtenidos.results);
        })
        .catch(errorDetectado => {
            // Este bloque atrapa CUALQUIER error que ocurra en el fetch o en los .then anteriores
            console.error('Se detectó un error:', errorDetectado);
            contenedorDeResultados.innerHTML = '<p style="text-align:center; color: red; grid-column: 1 / -1;">Hubo un error al realizar la búsqueda. Intenta nuevamente.</p>';
        });
} */



    // Función para dibujar las tarjetas en el HTML
    function mostrarResultadosEnPantalla(listaDeCanciones) {
        // Limpiar resultados anteriores
        contenedorDeResultados.innerHTML = ''; 

        // Validar si no hay resultados
        if (listaDeCanciones.length === 0) {
            contenedorDeResultados.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No se encontraron canciones para tu búsqueda.</p>';
            return;
        }

        // Iterar sobre cada canción y crear su tarjeta en el HTML
        listaDeCanciones.forEach(cancionActual => {
            const elementoTarjeta = document.createElement('div');
            elementoTarjeta.className = 'tarjeta-musical';

            // Nota: las propiedades trackName, artistName, artworkUrl100 y previewUrl 
            // no se traducen porque así las envía la API de Apple.
            elementoTarjeta.innerHTML = `
                <img src="${cancionActual.artworkUrl100}" alt="Portada de ${cancionActual.trackName}">
                <div class="informacion-de-tarjeta">
                    <h3>${cancionActual.trackName}</h3>
                    <p>${cancionActual.artistName}</p>
                    ${cancionActual.previewUrl ? `<audio controls src="${cancionActual.previewUrl}"></audio>` : '<p><i>Muestra de audio no disponible</i></p>'}
                </div>
            `;
            
            // Agregar la tarjeta al contenedor principal
            contenedorDeResultados.appendChild(elementoTarjeta);
        });
    }
});