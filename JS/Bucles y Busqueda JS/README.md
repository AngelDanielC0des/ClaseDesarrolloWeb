# Lección: Bucles y Búsqueda de Caracteres en JavaScript

Esta lección está enfocada en enseñar la lógica de iteración (recorrer cadenas de texto) y la eficiencia de memoria al buscar coincidencias en JavaScript.

## 🎯 Objetivos de la Lección
1. **Iteración Eficiente:** Usar el bucle `for...of` para recorrer _strings_ carácter por carácter sin crear copias innecesarias en la memoria RAM.
2. **Cláusulas de Guarda:** Implementar validaciones tempranas (`if (!palabra || !letra) return;`) para evitar que la función trabaje si faltan datos de entrada.
3. **Escucha de Eventos:** Separar la lógica JS del HTML utilizando `addEventListener` en lugar del antiguo atributo `onclick` en línea.
4. **Análisis Comparativo (Rendimiento y Memoria):** El archivo JS incluye ejemplos comentados con diferentes aproximaciones para resolver el mismo problema (`split`, `indexOf`, `RegExp`) explicando sus pros y contras a nivel de consumo de recursos computacionales.

## 📂 Archivos del Ejercicio
* **`index.html`:** Formulario sencillo para recoger la "palabra" (o texto) y la "letra" a buscar.
* **`index.js`:** Contiene la lógica activa (bucle `for...of`) y un detallado anexo comentado que explora otras cuatro metodologías algorítmicas para búsqueda en strings.
