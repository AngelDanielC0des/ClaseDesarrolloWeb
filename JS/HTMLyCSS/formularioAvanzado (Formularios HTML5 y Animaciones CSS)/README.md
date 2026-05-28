# Lección 2: Formulario Avanzado — Formularios HTML5 y Animaciones CSS

En esta lección aprenderás a construir formularios interactivos modernos y accesibles utilizando los nuevos controles nativos de HTML5, validación automática del lado del cliente y animaciones fluidas con CSS para proporcionar una experiencia de usuario sobresaliente.

## 🎯 Objetivos de la Lección
1. Utilizar y entender los nuevos tipos de entrada (`range`, `color`, `date`, `number`, `email`, `url`) de HTML5.
2. Implementar listas de sugerencia nativas con `<datalist>`.
3. Utilizar elementos de medición y visualización nativos como `<output>`, `<progress>` y `<meter>`.
4. Controlar y estilizar formularios según su validez en CSS con `:valid` e `:invalid`.
5. Dominar el motor de animaciones de CSS usando `@keyframes` y la propiedad `animation`.
6. Entender la API de validación nativa de JavaScript (`checkValidity()`).

---

## 🛠️ Conceptos Clave de HTML5 Aprendidos

### 1. Elementos Escalares e Indicadores
* **`<progress>`**: Representa el progreso de una tarea de manera accesible. Útil para indicar el porcentaje de completitud (por ejemplo, el avance en un cuestionario).
* **`<meter>`**: Indica una medida escalar en un rango conocido o un valor fraccionario (por ejemplo, el espacio usado de disco duro o la robustez de una contraseña). El navegador cambia automáticamente su color nativo dependiendo de si el valor cae en la franja baja (`low`), alta (`high`) u óptima (`optimum`).
* **`<output>`**: Elemento semántico específico para inyectar y mostrar resultados de operaciones o cálculos matemáticos en tiempo real.

### 2. Entradas Avanzadas de Formulario
* **`type="range"`**: Control deslizante para seleccionar un valor numérico aproximado dentro de un intervalo.
* **`type="color"`**: Interfaz de selección de color nativa del sistema operativo. Devuelve un color en formato hexadecimal.
* **`type="date"`**: Selector de fecha en formato de calendario nativo adaptado a cada dispositivo.
* **`type="number"`**: Campo numérico estricto que admite los atributos `min`, `max` y `step`.
* **`type="email"` y `type="url"`**: Campos de texto con patrones de verificación automáticos integrados por el navegador.

### 3. Autocompletado con `<datalist>`
* Permite crear una lista de sugerencias de autocompletado en un input normal mediante `<option>`. El usuario conserva la libertad de escribir lo que quiera si no le convence ninguna sugerencia. Se vincula al input mediante el atributo `list="id-del-datalist"`.

---

## 🎨 Conceptos Clave de CSS Moderno

### 1. Animaciones CSS (`@keyframes` y `animation`)
* Con `@keyframes` declaramos el ciclo de vida de la animación (por ejemplo, de qué posición y opacidad parte y a cuál llega).
* Con la propiedad `animation` aplicamos y configuramos el comportamiento de esa animación en el elemento deseado (duración, retardo, tipo de aceleración, repetición, etc.).

### 2. Pseudo-clases de Validación y Estado
* **`:valid` y `:invalid`**: Aplican estilos a los elementos de formulario según pasen o no las reglas de validación asignadas.
* **`:focus-within`**: Se activa en un elemento contenedor si él mismo o alguno de sus descendientes recibe el foco del cursor.
* **`:placeholder-shown`**: Permite detectar si el marcador de posición del input está visible. Se usa en el truco CSS para crear etiquetas flotantes (*floating labels*) que se desplazan al escribir.
* **`:checked`**: Pseudo-clase que detecta si un checkbox o radio button está seleccionado, permitiéndonos maquetar selectores visualmente personalizados sobre el input nativo oculto.

### 3. Funciones Matemáticas Modernas
* **`calc()`**: Realiza operaciones aritméticas sencillas mezclando distintas unidades (ej. `width: calc(100% - 30px)`).
* **`clamp(min, preferred, max)`**: Define un valor intermedio ideal que varía según el tamaño de la pantalla, pero limitándolo estrictamente entre un mínimo y un máximo absoluto. Es muy usado para tipografía fluida y padding responsivo.

### 4. `accent-color`
* Permite pintar de forma rápida y directa con el color de nuestra marca los controles nativos interactivos de los navegadores (como el control deslizante, los checkboxes o los botones de opción).

---

## 📂 Estructura de Archivos del Ejercicio
* `index.html`: Formulario con todas las etiquetas semánticas y tipos de input comentados de forma didáctica.
* `styles.css`: Estilos visuales del formulario en modo oscuro, animaciones de entrada y de vibración por error, y trucos avanzados como labels flotantes o checkbox personalizado.
* `script.js`: Código JavaScript para interactuar en tiempo real con los valores de los inputs, calcular dinámicamente el progreso del formulario, estimar la fortaleza de la contraseña y controlar el envío.
