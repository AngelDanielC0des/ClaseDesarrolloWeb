# Lección: Tarjeta de Estadísticas de Partido (CSS Grid y JS DOM)

Esta lección enseña cómo combinar una maquetación CSS avanzada y precisa (usando Flexbox y CSS Grid) con JavaScript para crear un componente dinámico que simula los gráficos de estadísticas de periódicos deportivos (como As o Marca).

## 🎯 Objetivos de la Lección
1. **CSS Custom Properties (Variables):** Utilizar `:root` para gestionar la paleta de colores del diseño.
2. **CSS Grid para Diseños Simétricos:** Crear layouts matemáticamente perfectos del 50/50 mediante `1fr 1fr`.
3. **Posicionamiento Absoluto Dinámico:** Entender cómo modificar atributos de maquetación (`width: X%`) desde JavaScript.
4. **Trucos Visuales:** Usar `transform: scaleX(-1)` para espejar el crecimiento de una barra de progreso.
5. **Cálculos JS Básicos:** Extraer datos de un objeto JSON estructurado, realizar operaciones matemáticas y evitar errores comunes (división por cero).
6. **Inyección en el DOM:** Actualizar contenido (`textContent`), imágenes (`src`) y estilos (`style.width`) con JavaScript.

## 📂 Archivos del Ejercicio
* **`index.html`:** Estructura semántica base. Los valores numéricos y URLs de imágenes están vacíos intencionadamente.
* **`style.css`:** Contiene todas las reglas visuales, variables de color y los "trucos" del diseño (Box Model, Overflow, Grid).
* **`index.js`:** La lógica pura. Define los datos estáticos (mock), selecciona los elementos del DOM, realiza la matemática de porcentajes y "pinta" la tarjeta en milisegundos.
