document.getElementById('imcForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que la página se recargue

    const peso = document.getElementById('peso').value;
    const altura = document.getElementById('altura').value;
    const resultBox = document.getElementById('resultado');

    // URL relativa apuntando a tu Servlet CalculoIMC
    const url = `CalculoIMC?peso=${peso}&altura=${altura}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                // Si el servidor responde con error (ej. 400 Bad Request), manejamos el texto
                return response.text().then(text => { throw new Error(text) });
            }
            return response.json(); // Convertimos la respuesta a JSON
        })
        .then(data => {
            // Mapeo exacto de las claves generadas por el formato String.format del Servlet
            resultBox.className = "result-box success";
            resultBox.style.display = "block";
            resultBox.innerHTML = `Tu IMC es: ${data.imcNumerico.toFixed(2)}<br>Clasificación: ${data.imcNominal}`;
        })
        .catch(error => {
            // Manejo de errores de validación del Servlet o caídas de red
            resultBox.className = "result-box error";
            resultBox.style.display = "block";
            resultBox.textContent = error.message || "Error al conectar con el servidor.";
        });
});