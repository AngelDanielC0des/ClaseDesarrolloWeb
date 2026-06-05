# Lección 1: Tarjeta de Producto — Semántica HTML5 y CSS Moderno

En esta lección aprenderás a construir componentes web semánticos y modernos aplicando estándares avanzados de HTML5 y estilos de última generación en CSS.

## 🎯 Objetivos de la Lección
1. Comprender y aplicar etiquetas semánticas de HTML5 para estructurar correctamente la información y mejorar la accesibilidad (SEO/lectores de pantalla).
2. Usar imágenes responsivas avanzadas mediante `<picture>` y `<source>`.
3. Crear ventanas modales interactivas 100% nativas y accesibles utilizando la etiqueta `<dialog>`.
4. Implementar efectos de diseño modernos con CSS (sombras, transformaciones en hover, pseudo-elementos y el efecto de desenfoque *glassmorphism*).
5. Intercambiar datos entre HTML5 y JavaScript de forma limpia a través de atributos personalizados `data-*`.

---

## 🛠️ Conceptos Clave de HTML5 Aprendidos

### 1. La etiqueta `<dialog>`
Es el elemento nativo para crear cajas de diálogo o ventanas modales.
* **Ventajas:** No requiere complejas estructuras de `div` ni bibliotecas externas. Controla el foco del teclado para accesibilidad y bloquea la interacción del fondo automáticamente al abrirse en modo modal.
* **Métodos JS principales:** 
  * `dialog.showModal()`: Abre el diálogo como un modal flotante centrado sobre una capa oscura (backdrop).
  * `dialog.close()`: Cierra el diálogo.
* **Cierre nativo:** Al pulsar la tecla `Escape`, el navegador cierra el diálogo automáticamente. Además, si usamos un formulario interno con `method="dialog"`, al enviar el formulario (hacer click en el botón de cerrar), el modal se cierra solo sin necesidad de añadir código JavaScript extra.

### 2. Diseño Responsivo de Imágenes con `<picture>`
Permite al navegador decidir qué imagen cargar según las condiciones de la pantalla (ancho del dispositivo, formato soportado, etc.).
* Funciona evaluando las etiquetas `<source>` de arriba a abajo y cargando la primera que cumpla la condición `media` (por ejemplo, `media="(min-width: 768px)"`).
* Incluye un elemento `<img>` final como alternativa de seguridad (*fallback*) obligatorio.

### 3. Contenedor Semántico `<figure>` y `<figcaption>`
* `<figure>` agrupa contenido ilustrativo de forma independiente al flujo del texto (como fotos, diagramas o código).
* `<figcaption>` asocia un pie explicativo o título directamente al elemento visual del contenedor de forma accesible.

### 4. Textos Semánticos Especiales
* `<mark>`: Resalta texto que es relevante según la búsqueda o contexto del usuario (el navegador lo sombrea en amarillo de manera predeterminada).
* `<abbr>`: Identifica abreviaturas o siglas. Su atributo `title` provee un recuadro informativo emergente (*tooltip*) al posicionar el ratón.
* `<time>`: Define fechas y horas legibles para buscadores y lectores de pantalla a través de la propiedad `datetime="AAAA-MM-DD"`.

### 5. Atributos de Datos Personalizados `data-*`
Permiten almacenar información directamente en la estructura HTML del elemento. En JavaScript se recuperan sencillamente accediendo al objeto `.dataset` (convirtiendo guiones en mayúsculas camelCase).
* *Ejemplo HTML:* `data-precio-original="799.99"`
* *Ejemplo JS:* `elemento.dataset.precioOriginal`

---

## 🎨 Conceptos Clave de CSS Moderno

### 1. Variables CSS (Propiedades Personalizadas)
Definidas en `:root`, nos permiten almacenar valores globales (colores, fuentes, espaciados) y reutilizarlos. Facilitan el mantenimiento del código:
```css
:root {
    --color-principal: #3b82f6;
}
element {
    color: var(--color-principal);
}
```

### 2. Transiciones y Transformaciones (`transition` y `transform`)
* `transition` suaviza el cambio de propiedades CSS (como color, sombra o posición) a lo largo del tiempo.
* `transform` permite rotar (`rotate`), redimensionar (`scale`) o mover (`translate`) elementos de forma optimizada por hardware en estados como `:hover`.

### 3. Pseudo-elementos `::before` y `::after`
Permiten inyectar contenido decorativo directamente desde la hoja de estilos CSS sin sobrecargar el HTML. Se usa junto a la propiedad `content`.

### 4. Desenfoque de Fondos (`backdrop-filter`)
Permite aplicar filtros visuales (como `blur()` para desenfoque o `grayscale()` para escala de grises) al fondo que se encuentra *detrás* de un elemento translúcido. Esto nos permite simular el diseño esmerilado o *glassmorphism*.

---

## 📂 Estructura de Archivos del Ejercicio
* `index.html`: Estructura semántica del producto y del modal, minuciosamente comentada.
* `styles.css`: Estilos visuales adaptables, variables y transiciones de animación explicadas paso a paso.
* `script.js`: Controlador JavaScript para la apertura/cierre del modal y la lectura interactiva de los atributos `data-*`.
