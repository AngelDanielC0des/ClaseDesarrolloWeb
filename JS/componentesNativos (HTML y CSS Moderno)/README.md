# Componentes Nativos - HTML y CSS Moderno (2023-2024)

## 🎯 Objetivo

Aprender las features más recientes de HTML y CSS que **reducen la necesidad de JavaScript** y hacen el desarrollo web más eficiente, accesible y moderno.

## 📚 Conceptos que aprenderás

### 1. Popover API (HTML 2023)

Crea popovers y modales **sin JavaScript**, solo con atributos HTML.

**Atributos:**
- `popover` - Crea un popover automático (se cierra al hacer clic fuera)
- `popover="manual"` - Popover que solo se cierra con botón
- `popovertarget="id"` - Botón que abre/cierra el popover
- `popovertargetaction="toggle|show|hide"` - Acción del botón

**Ejemplo:**
```html
<!-- Botón que abre el popover -->
<button popovertarget="mi-popover">Abrir</button>

<!-- El popover (oculto por defecto) -->
<div id="mi-popover" popover>
    <h3>Título del popover</h3>
    <p>Contenido del popover</p>
</div>
```

**Ventajas:**
- ✅ Sin JavaScript
- ✅ Accesible por defecto (Escape para cerrar, focus trap)
- ✅ Mejor rendimiento
- ✅ Estilizable con CSS (`::backdrop`)

### 2. CSS :has() - Parent Selector (CSS 2023)

El selector más esperado en 20 años de CSS. Permite seleccionar un elemento **padre** basándose en sus **hijos**.

**Sintaxis:**
```css
/* Selecciona .card que CONTIENE una imagen */
.card:has(img) {
    border-color: blue;
}

/* Selecciona form que CONTIENE un input inválido */
form:has(input:invalid) {
    border-color: red;
}

/* Selecciona .card que NO contiene imagen */
.card:not(:has(img)) {
    background: gray;
}
```

**Casos de uso:**
| Selector | Qué hace |
|----------|----------|
| `.card:has(img)` | Cards con imagen |
| `.card:has(button:disabled)` | Cards con botón deshabilitado |
| `form:has(input:invalid)` | Formularios con errores |
| `.list:has(> li:nth-child(5))` | Listas con 5+ items |
| `.parent:has(.a, .b)` | Padres con `.a` O `.b` |

**Antes vs Ahora:**
```javascript
// ANTES (con JavaScript)
document.querySelectorAll('.card').forEach(card => {
    if (card.querySelector('img')) {
        card.classList.add('has-image');
    }
});

// AHORA (solo CSS)
.card:has(img) {
    /* estilos */
}
```

### 3. Container Queries (CSS 2023)

Aplica estilos basándose en el **tamaño del contenedor padre**, no en el tamaño de la ventana.

**Sintaxis:**
```css
/* PASO 1: Definir el contenedor */
.card-container {
    container-type: inline-size;
    container-name: card;
}

/* PASO 2: Aplicar estilos según el tamaño del contenedor */
@container card (min-width: 400px) {
    .card {
        flex-direction: row;  /* Horizontal si el contenedor es ancho */
    }
}

@container card (max-width: 399px) {
    .card {
        flex-direction: column;  /* Vertical si el contenedor es estrecho */
    }
}
```

**Diferencia con Media Queries:**

| Media Queries | Container Queries |
|---------------|-------------------|
| `@media (min-width: 768px)` | `@container (min-width: 400px)` |
| Basado en la **ventana** | Basado en el **contenedor** |
| Global (afecta a todo) | Local (solo al contenedor) |
| Componentes NO reutilizables | Componentes reutilizables |

**Unidades de Container Query:**
- `cqw` - 1% del ancho del contenedor
- `cqh` - 1% de la altura del contenedor
- `cqi` - 1% del tamaño inline
- `cqb` - 1% del tamaño block

### 4. CSS Nesting (CSS 2024)

Anidamiento nativo de CSS, como SASS/LESS, pero sin preprocesadores.

**Sintaxis:**
```css
/* ANTES (sin nesting) */
.nav { background: #333; }
.nav ul { list-style: none; }
.nav ul li { display: inline; }
.nav ul li a { color: white; }
.nav ul li a:hover { color: blue; }

/* AHORA (con nesting nativo) */
.nav {
    background: #333;
    
    ul {
        list-style: none;
        
        li {
            display: inline;
            
            a {
                color: white;
                
                &:hover {
                    color: blue;
                }
            }
        }
    }
}
```

**El operador `&`:**
- `&` referencia al selector padre
- `&:hover` = `.nav:hover`
- `&.active` = `.nav.active`
- `& .child` = `.nav .child`

**Ventajas:**
- ✅ No necesitas compilar SASS/LESS
- ✅ Mejor rendimiento
- ✅ Código más organizado
- ✅ Soportado en todos los navegadores modernos (2024)

## 🚀 Cómo usar este ejercicio

1. Abre `index.html` en tu navegador
2. Explora cada sección:
   - **Popover API**: Haz clic en los botones para abrir popovers
   - **CSS :has()**: Observa cómo las tarjetas cambian según su contenido
   - **Container Queries**: Redimensiona el contenedor arrastrando la esquina
   - **CSS Nesting**: Pasa el ratón sobre los enlaces del menú
3. Abre la consola (F12) para ver ejemplos adicionales

## 💡 Casos de uso reales

### Popover API
```html
<!-- Menú de usuario -->
<button popovertarget="user-menu">👤 Mi cuenta</button>
<div id="user-menu" popover>
    <a href="/profile">Perfil</a>
    <a href="/settings">Configuración</a>
    <a href="/logout">Cerrar sesión</a>
</div>

<!-- Tooltip informativo -->
<button popovertarget="help">❓</button>
<div id="help" popover>
    <p>Ayuda: Haz clic en cualquier tarjeta para ver detalles</p>
</div>
```

### CSS :has()
```css
/* Resaltar formularios con errores */
form:has(input:invalid) {
    border: 2px solid red;
}

/* Ocultar secciones vacías */
.section:not(:has(> *)) {
    display: none;
}

/* Cambiar layout de card según contenido */
.card:has(img) {
    grid-template-columns: 1fr 2fr;
}
```

### Container Queries
```css
/* Componente de producto reutilizable */
.product-container {
    container-type: inline-size;
}

@container (min-width: 500px) {
    .product {
        display: grid;
        grid-template-columns: 200px 1fr;
    }
}
```

## 📊 Comparación de features

| Feature | Año | Reemplaza a | Soporte |
|---------|-----|-------------|---------|
| Popover API | 2023 | Modales custom con JS | Chrome 114+, Firefox 125+ |
| CSS :has() | 2023 | JavaScript para parent selectors | Chrome 105+, Firefox 121+ |
| Container Queries | 2023 | Media Queries para componentes | Chrome 105+, Firefox 110+ |
| CSS Nesting | 2024 | Preprocesadores (SASS/LESS) | Chrome 120+, Firefox 117+ |

## 🎓 Buenas prácticas

1. **Usa Popover API** en lugar de librerías de modales cuando sea posible
2. **Usa :has()** para reducir JavaScript en selecciones condicionales
3. **Usa Container Queries** para componentes que se usan en diferentes contextos
4. **Usa CSS Nesting** para código más organizado (ya no necesitas SASS)
5. **Mantente actualizado**: CSS está evolucionando muy rápido (2023-2024)

## 🔗 Recursos adicionales

- [MDN: Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API)
- [MDN: CSS :has()](https://developer.mozilla.org/en-US/docs/Web/CSS/:has)
- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries)
- [MDN: CSS Nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_nesting)

## ✅ Checklist de aprendizaje

- [ ] Sé crear popovers sin JavaScript usando la Popover API
- [ ] Entiendo la diferencia entre `popover` y `popover="manual"`
- [ ] Sé usar `:has()` para seleccionar padres según sus hijos
- [ ] Entiendo la diferencia entre Media Queries y Container Queries
- [ ] Sé definir un contenedor con `container-type`
- [ ] Sé usar `@container` para aplicar estilos según el contenedor
- [ ] Sé usar CSS Nesting para anidar selectores
- [ ] Entiendo el operador `&` en CSS Nesting
