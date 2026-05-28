# Lección: Bases de Datos en Memoria y Tablas Dinámicas

Esta lección documenta cómo gestionar un sistema de datos basado puramente en el cliente (Front-End) simulando una base de datos con Arrays de Objetos y conectándola con una tabla HTML interactiva.

## 🎯 Objetivos de la Lección
1. **Arrays de Objetos (JSON simulado):** Estructurar múltiples datos heterogéneos dentro de una colección ordenada (lista de alumnos).
2. **Creación Dinámica del DOM (`createElement`):** Abandonar el código HTML estático. Usar JS para "fabricar" en el aire etiquetas HTML (`<tr>`, `<td>`, `<button>`), llenarlas de datos y, finalmente, inyectarlas en la tabla (`appendChild`).
3. **Iteración de Colecciones (`forEach`):** Recorrer el array de alumnos de forma limpia y declarativa para inyectarlos todos a la vez.
4. **Destrucción de Nodos (`remove()`):** Implementar la funcionalidad contraria a crear: localizar un nodo específico del DOM (la fila del alumno) y purgarlo de la memoria cuando el usuario hace clic en su botón de "Borrar".
5. **Estadística y Cálculos:** Practicar la algoritmia iterativa buscando valores máximos/mínimos y calculando promedios matemáticos a través de un bucle `for...of`.

## 📂 Archivos del Ejercicio
* **`alumnos.html`:** Esqueleto base de la tabla, con etiquetas semánticas obligatorias (`<thead>`, `<tbody id="bodytabla">`) que actúan de contenedores vacíos esperando instrucciones de JavaScript.
* **`alumnos.js`:** Núcleo de la aplicación. Contiene los datos estáticos (el "mock"), y un conjunto de funciones modulares (Crear, Listar, Borrar, Calcular Estadísticas).
