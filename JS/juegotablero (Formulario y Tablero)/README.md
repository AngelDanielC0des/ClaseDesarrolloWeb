# Lección: Eventos de Formulario y preventDefault() en JavaScript

Esta lección enseña la técnica fundamental para crear "Single Page Applications" (SPAs): evitar que el navegador recargue la página al enviar un formulario.

## 🎯 Objetivos de la Lección
1. **Atributos de Formulario HTML5:** Entender el uso de `type="date"`, `type="password"`, `type="submit"` y la validación nativa con `required`.
2. **Escucha del evento `submit`:** Aprender por qué es más robusto escuchar el envío completo del `<form>` (`addEventListener('submit')`) en lugar del simple clic de un botón (`onclick`).
3. **Control del flujo (El secreto `preventDefault`):** Usar `event.preventDefault()` para bloquear el comportamiento predeterminado del navegador (recarga de la página web), permitiendo gestionar los datos o la vista puramente desde JavaScript en el cliente.
4. **Manipulación de Clases (DOM):** Usar `classList.remove('hidden')` como un método moderno y seguro para cambiar el aspecto visual de un elemento, en contraste con la modificación directa de estilos en línea (`style.display`).

## 📂 Archivos del Ejercicio
* **`index.html`:** Formulario de registro moderno con validación básica embebida.
* **`styles.css`:** Hoja de estilos responsable de la estética de tarjeta (Card UI) y el estado oculto inicial (`.hidden`).
* **`script.js`:** Breve lógica de intercepción del envío de datos que alterna entre la vista del formulario y la vista de "éxito/juego" (imagen del tablero).
