import BuscadorMusica from './BuscadorMusica.js';

// Inicialización asíncrona y segura de la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new BuscadorMusica({
        resultadosPorPagina: 9
    });
});