const form = document.getElementById('registroForm');
const resultado = document.getElementById('resultado');

form.addEventListener('submit', function(event) {
    // Evita que el formulario envíe los datos y recargue la página
    event.preventDefault();
    
    // Oculta el formulario y muestra el contenedor de la imagen
    form.style.display = 'none';
    resultado.classList.remove('hidden');
});