# Lección Final: Piedra, Papel o Tijera (Tragaperras JS)

Este proyecto representa un ejercicio avanzado y completo (estilo examen final) que engloba maquetación responsiva, accesibilidad web, animaciones CSS de alto rendimiento y lógica asíncrona de JavaScript.

## 🎯 Objetivos y Conceptos Cubiertos

### 1. Maquetación y Diseño (CSS)
* **Custom Properties:** Arquitectura de colores globales en `:root` para fácil mantenibilidad.
* **UI Responsiva:** Empleo de Flexbox y Media Queries para adaptar el juego a dispositivos móviles sin romper las proporciones.
* **Ocultamiento Accesible:** Técnicas para ocultar el círculo nativo de los `radio buttons` sin usar `display: none`, manteniendo su navegabilidad mediante el teclado (con el pseudo-selector `:focus-visible`).

### 2. Animaciones de Alto Rendimiento (CSS)
* **Hardware Acceleration:** Uso de la propiedad `will-change: transform` para instruir a la GPU sobre la animación inminente, garantizando 60fps en dispositivos lentos.
* **Matemática de Desplazamientos:** Construcción de un carrusel vertical continuo movido mediante `transform: translateY()`.

### 3. Lógica de Aplicación (JavaScript)
* **Estado Global:** Separación conceptual entre los datos de memoria (puntos, empates) y la visualización del DOM.
* **Lectura de Formularios:** Uso moderno de la API `FormData` acoplada al evento `submit`.
* **Motor Asíncrono de Animación:** Entendimiento del Event Loop del navegador mediante el doble anidamiento de `requestAnimationFrame()`, permitiendo reiniciar la ruleta instantáneamente sin que el usuario vea un "salto".
* **Listeners Temporales:** Implementación de `transitionend` con el flag `{ once: true }` para desencadenar la evaluación del ganador únicamente en el fotograma en que se detienen los carriles mecánicos.
* **Paradigma SPA (Single Page Application):** Sistema de reseteo limpio vía JS (`resetearEstadoDelJuego`) sin recurrir al arcaico `location.reload()`.

## 📂 Archivos del Proyecto
* **`index.html`:** Estructura semántica sembrada con los bloques repetidos de emojis que hacen de "cinta" física para la ruleta.
* **`styles.css`:** Todas las mecánicas visuales, incluyendo variables globales, transiciones y focus management.
* **`app.js`:** Lógica fuertemente documentada (Motor de estados, validaciones, RNG, Event Loop y cálculos de juego).
