# Web APIs Modernas - APIs del Navegador

## Objetivo

Dominar las APIs modernas del navegador que permiten crear experiencias web avanzadas: detección de visibilidad de elementos, portapapeles, notificaciones, visibilidad de pestaña y pantalla completa. Estas APIs son esenciales para aplicaciones web profesionales en 2024-2025.

## Conceptos que aprenderás

### 1. IntersectionObserver - Detectar visibilidad de elementos

Permite ejecutar código cuando un elemento entra o sale del viewport (área visible de la pantalla). Es la base de:
- **Lazy Loading**: Cargar imágenes solo cuando el usuario las ve
- **Infinite Scroll**: Cargar más contenido al llegar al final
- **Animaciones al scroll**: Activar animaciones cuando un elemento aparece

```javascript
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // El elemento es visible en pantalla
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,  // Se activa cuando el 10% del elemento es visible
    rootMargin: '50px'  // Margen extra alrededor del viewport
});

observer.observe(miElemento);
```

**Propiedades del entry:**

| Propiedad | Qué indica |
|-----------|-----------|
| `isIntersecting` | `true` si el elemento es visible |
| `intersectionRatio` | Porcentaje visible (0 a 1) |
| `target` | El elemento observado |
| `boundingClientRect` | Posición y tamaño del elemento |

### 2. Clipboard API - Portapapeles del sistema

Permite leer y escribir en el portapapeles del usuario de forma asíncrona y segura.

```javascript
// Copiar texto al portapapeles
await navigator.clipboard.writeText('Texto copiado');

// Leer texto del portapapeles
const texto = await navigator.clipboard.readText();
```

**Ventajas sobre el método antiguo:**
- Asíncrono (no bloquea la UI)
- No necesita crear elementos `<textarea>` temporales
- Funciona con permisos del navegador

### 3. Page Visibility API - Detectar si la pestaña está activa

Permite saber si el usuario está viendo tu página o si cambió a otra pestaña.

```javascript
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // El usuario cambió de pestaña
        pausarVideo();
    } else {
        // El usuario volvió a la pestaña
        reanudarVideo();
    }
});
```

**Casos de uso:**
- Pausar vídeos/animaciones cuando no se ven
- Detener peticiones innecesarias
- Registrar tiempo real de uso

### 4. Web Notifications API - Notificaciones del navegador

Permite mostrar notificaciones del sistema operativo desde la web.

```javascript
// Pedir permiso al usuario
const permiso = await Notification.requestPermission();

// Mostrar notificación
if (permiso === 'granted') {
    new Notification('Título', {
        body: 'Mensaje de la notificación',
        icon: 'icono.png'
    });
}
```

### 5. Fullscreen API - Pantalla completa

Permite poner un elemento (o toda la página) en pantalla completa.

```javascript
// Entrar en pantalla completa
await elemento.requestFullscreen();

// Salir de pantalla completa
await document.exitFullscreen();
```

## Cómo usar este ejercicio

1. Abre `index.html` en tu navegador
2. Navega por las diferentes secciones
3. Haz scroll para ver IntersectionObserver en acción
4. Prueba cada API con los botones interactivos
5. Abre la consola (F12) para ver logs detallados

## Secciones del ejercicio

1. **IntersectionObserver**: Lazy loading de imágenes y animaciones al scroll
2. **Clipboard API**: Copiar y pegar texto
3. **Page Visibility**: Detección de pestaña activa
4. **Notifications**: Notificaciones del navegador
5. **Fullscreen**: Pantalla completa

## Ejercicios propuestos

1. Implementa un infinite scroll real con IntersectionObserver que cargue más items
2. Crea un botón "Compartir" que copie la URL actual al portapapeles
3. Añade un contador de tiempo que solo cuente cuando la pestaña está activa
4. Crea un modo "presentación" que ponga un elemento en pantalla completa

## Recursos adicionales

- [MDN: IntersectionObserver](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
- [MDN: Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [MDN: Page Visibility](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API)
- [MDN: Notifications](https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API)

## Checklist de aprendizaje

- [ ] Sé crear un IntersectionObserver para detectar visibilidad
- [ ] Entiendo los conceptos de `threshold` y `rootMargin`
- [ ] Sé implementar lazy loading de imágenes
- [ ] Sé copiar texto al portapapeles con `navigator.clipboard`
- [ ] Entiendo la Page Visibility API y `document.hidden`
- [ ] Sé pedir permisos y mostrar notificaciones del navegador
- [ ] Sé usar la Fullscreen API para pantalla completa
