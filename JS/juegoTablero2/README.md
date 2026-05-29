# Lección: Formulario Avanzado + Tablero Interactivo (SPA con Validación)

Esta lección combina todo lo aprendido anteriormente en un proyecto más completo: una **aplicación de una sola página (SPA)** con formulario de registro validado y un juego de tablero interactivo.

## Objetivos de la Lección
1. **Modo estricto (`'use strict'`):** Activar las reglas estrictas de JavaScript para detectar errores antes.
2. **Referencias DOM centralizadas:** Guardar todas las referencias al inicio para eficiencia y legibilidad.
3. **Validación completa de formularios:** Validar nombre, contraseña fuerte (con expresiones regulares), edad (mayor de 18) y aceptación de términos.
4. **Toggle de visibilidad de contraseña:** Alternar entre `type="password"` y `type="text"` con iconos y accesibilidad.
5. **Creación dinámica de elementos:** Usar `createElement` + `appendChild` para generar el tablero desde un array de colores.
6. **Gestión de estado simple:** Contador de celdas negras y detección de fin de juego.
7. **Accesibilidad (a11y):** Uso de `role`, `tabindex`, `aria-label` y eventos de teclado para que la app sea usable por todos.
8. **Modal de Bootstrap:** Mostrar una ventana emergente al finalizar el juego.

## Archivos del Ejercicio
* **`app.html`:** Estructura HTML con las dos páginas (formulario y tablero) y el modal.
* **`styles.css`:** Estilos de la interfaz, cuadrícula del tablero y animaciones.
* **`script.js`:** Toda la lógica: validación, navegación entre páginas, creación del tablero y gestión del juego.
