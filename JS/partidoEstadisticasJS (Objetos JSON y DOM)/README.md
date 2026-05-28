# Lección: Tarjeta de Estadísticas de Partido (CSS Grid y JS DOM)

Esta lección es una reimplementación del ejercicio de maquetación CSS de la tarjeta de estadísticas, pero con un enfoque más profundo en la manipulación del DOM y el uso de **Objetos JSON**.

## 🎯 Objetivos de la Lección
1. **Modelado de Datos (JSON):** Aprender a estructurar información compleja en objetos de JavaScript (arrays anidados, propiedades y valores) simulando una respuesta de un servidor o API.
2. **Inyección en el DOM:** Actualizar contenido dinámicamente (`textContent`), imágenes (`src`) y atributos de accesibilidad (`alt`) leyendo desde el objeto JSON.
3. **Cálculos Matemáticos:** Extraer datos del objeto JSON para realizar cálculos en tiempo real (porcentajes) y prevenir errores matemáticos (división por cero).
4. **CSS Custom Properties y CSS Grid:** Utilizar variables para la paleta de colores y `grid-template-columns: 1fr 1fr` para crear layouts simétricos perfectos.
5. **Modificación de Estilos Dinámicos:** Inyectar los resultados matemáticos calculados como valores porcentuales dentro de la propiedad `style.width` de los elementos HTML.

## 📂 Archivos del Ejercicio
* **`index.html`:** Estructura semántica base. Los valores numéricos y URLs de imágenes están vacíos intencionadamente.
* **`style.css`:** Contiene todas las reglas visuales, variables de color y los "trucos" del diseño (Box Model, Overflow, Grid).
* **`index.js`:** La lógica pura. Define los datos estáticos (mock) usando notación de Objetos JSON, selecciona los elementos del DOM, realiza la matemática de porcentajes y "pinta" la tarjeta dinámicamente.
