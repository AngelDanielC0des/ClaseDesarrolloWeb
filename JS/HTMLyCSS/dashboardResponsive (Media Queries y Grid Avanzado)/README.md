# Lección 3: Dashboard Responsive — Media Queries y Grid Avanzado

En esta lección aprenderás a construir interfaces complejas adaptables (Dashboards) mediante técnicas avanzadas de maquetación con CSS Grid, distribución por áreas nombradas, carga y gestión nativa de elementos multimedia y sistemas de preferencias persistentes (Modo Claro/Oscuro).

## 🎯 Objetivos de la Lección
1. Construir layouts complejos de múltiples columnas y filas mediante `grid-template-areas`.
2. Crear diseños totalmente responsivos para móvil, tablet y escritorio usando Media Queries (`@media`).
3. Dominar la integración nativa de reproductores de vídeo (`<video>`) y audio (`<audio>`).
4. Utilizar secciones desplegables nativas con `<details>` y `<summary>` estilizadas en CSS.
5. Permitir la edición dinámica del contenido de texto mediante el atributo HTML `contenteditable`.
6. Implementar carruseles con efectos táctiles fluidos utilizando la tecnología CSS `scroll-snap`.
7. Programar un alternador de temas Claro/Oscuro con persistencia local (`localStorage`) que modifique variables de CSS.

---

## 🛠️ Conceptos Clave de HTML5 Aprendidos

### 1. Elementos Multimedia Nativos
* **`<video>` y `<audio>`**: Etiquetas nativas que permiten incrustar archivos multimedia con controles automáticos del navegador sin recurrir a plugins pesados. Admiten la etiqueta interna `<source>` para especificar múltiples formatos como respaldo (por ejemplo: `.mp4` y `.webm` o `.mp3` y `.ogg`).

### 2. Secciones Colapsables (`<details>` y `<summary>`)
* Evita el uso de librerías de JS para acordeones. El navegador gestiona el estado abierto/cerrado añadiendo o quitando el atributo `open` a la etiqueta `<details>`. Se puede personalizar el marcador desplegable estilizando la cabecera `<summary>`.

### 3. Edición de Texto Nativa (`contenteditable`)
* Al añadir el atributo `contenteditable="true"` a un elemento HTML (como un `<h1>` o un `<p>`), el usuario puede editar su texto directamente desde la pantalla. Sus cambios se pueden capturar en JavaScript escuchando el evento `blur` (pérdida de foco).

### 4. Bloques de Código y Citas
* **`<pre>`**: Conserva los espacios, tabulaciones y saltos de línea de la fuente original.
* **`<code>`**: Etiqueta semántica para representar código de programación.
* **`<cite>`**: Define semánticamente una referencia o cita bibliográfica sobre el origen del contenido.

---

## 🎨 Conceptos Clave de CSS Moderno

### 1. CSS Grid por Áreas (`grid-template-areas`)
Permite mapear visualmente el esqueleto de nuestro sitio asignando nombres a secciones y colocándolas directamente en una rejilla:
```css
.contenedor {
    display: grid;
    grid-template-areas:
        "header header"
        "sidebar main"
        "footer footer";
}
```

### 2. Media Queries (`@media`)
* Permiten aplicar estilos CSS de manera condicional según las dimensiones de la pantalla del usuario (por ejemplo, ocultar elementos en móvil, cambiar tamaños de letra o reordenar el Grid en pantallas de escritorio).

### 3. Scroll Snap (Carrusel Táctil)
* **`scroll-snap-type: x mandatory`**: Aplica al contenedor, obligando a las tarjetas interiores a ajustarse magnéticamente en el eje horizontal al terminar el deslizamiento.
* **`scroll-snap-align: start`**: Aplica a cada tarjeta interna para indicar que su inicio debe alinearse con el borde del contenedor.

### 4. Filtros de Imagen (`filter`)
* Permite aplicar efectos gráficos directos sobre imágenes, tales como desenfoques (`blur()`), escalas de grises (`grayscale()`), ajustes de brillo (`brightness()`) o contraste.

### 5. `aspect-ratio`
* Fija una relación de aspecto proporcional exacta (ej. `16 / 9`) garantizando que el elemento mantenga sus proporciones al cambiar el tamaño de la pantalla, previniendo distorsiones.

---

## 📂 Estructura de Archivos del Ejercicio
* `index.html`: Estructura del panel de control con todas las secciones de log, código, multimedia y acordeones detalladamente documentada.
* `styles.css`: Distribución de la grilla principal, estilos aplicables a los acordeones, filtros en hover para imágenes y media queries para móvil, tablet y escritorio.
* `script.js`: Controlador para alternar y recordar el Modo Claro/Oscuro mediante variables de CSS, y código para registrar la edición del título editable.
