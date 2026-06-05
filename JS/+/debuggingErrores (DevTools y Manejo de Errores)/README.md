# Debugging y Manejo de Errores - DevTools del Navegador

## Objetivo

Dominar las herramientas de depuración del navegador (Chrome DevTools) y aprender patrones profesionales de manejo de errores en JavaScript. Un buen desarrollador no solo escribe código que funciona, sino que sabe diagnosticar y resolver problemas cuando algo falla.

## Conceptos que aprenderás

### 1. La familia `console.*` - Más allá de `console.log`

JavaScript ofrece muchos métodos de console que la mayoría de desarrolladores desconoce:

```javascript
console.log('Mensaje normal');
console.warn('Advertencia');           // Icono amarillo
console.error('Error grave');          // Icono rojo
console.table(arrayDeObjetos);         // Tabla formateada
console.group('Grupo');                // Agrupa mensajes
console.groupEnd();                    // Cierra el grupo
console.time('cronometro');            // Inicia un cronómetro
console.timeEnd('cronometro');         // Muestra el tiempo transcurrido
console.trace();                       // Muestra la pila de llamadas
console.count('etiqueta');             // Cuenta cuántas veces se llama
console.assert(condicion, 'mensaje');  // Solo muestra si la condición es falsa
```

### 2. `debugger` - Breakpoints en el código

La sentencia `debugger` pausa la ejecución del código cuando las DevTools están abiertas, permitiéndote inspeccionar variables paso a paso.

```javascript
function procesarDatos(datos) {
    debugger;  // La ejecución se pausa aquí si DevTools está abierta
    // Puedes inspeccionar "datos", avanzar paso a paso, etc.
    return datos.map(item => item.nombre);
}
```

### 3. Las pestañas de DevTools

| Pestaña | Para qué sirve |
|---------|---------------|
| **Elements** | Inspeccionar y modificar HTML/CSS en vivo |
| **Console** | Ejecutar JS, ver logs y errores |
| **Sources** | Ver código fuente, poner breakpoints, depurar paso a paso |
| **Network** | Ver peticiones HTTP, tiempos de carga, respuestas |
| **Performance** | Grabar y analizar el rendimiento de la página |
| **Application** | Inspeccionar localStorage, sessionStorage, cookies |
| **Memory** | Detectar fugas de memoria |

### 4. `try/catch/finally` - Manejo de errores

```javascript
try {
    // Código que PUEDE fallar
    const datos = JSON.parse(textoInvalido);
} catch (error) {
    // Se ejecuta SOLO si algo falla en el try
    console.error('Error al parsear:', error.message);
} finally {
    // Se ejecuta SIEMPRE, haya error o no
    console.log('Operación finalizada');
}
```

### 5. Errores personalizados con `class extends Error`

```javascript
class ValidationError extends Error {
    constructor(campo, mensaje) {
        super(mensaje);
        this.name = 'ValidationError';
        this.campo = campo;
    }
}

throw new ValidationError('email', 'Email inválido');
```

### 6. `window.onerror` y `window.onunhandledrejection`

Capturadores globales de errores que no fueron manejados:

```javascript
window.onerror = function(mensaje, archivo, linea, columna, error) {
    console.error(`Error global: ${mensaje} en ${archivo}:${linea}`);
};

window.onunhandledrejection = function(event) {
    console.error('Promesa rechazada sin catch:', event.reason);
};
```

### 7. Patrones de manejo de errores

| Patrón | Cuándo usarlo |
|--------|---------------|
| **Fail Fast** | Validar al inicio y lanzar error inmediatamente |
| **Graceful Degradation** | Si algo falla, mostrar algo parcial en vez de nada |
| **Retry** | Reintentar operaciones que pueden fallar temporalmente (red) |
| **Fallback** | Tener un plan B cuando algo falla |

## Cómo usar este ejercicio

1. Abre `index.html` en tu navegador
2. **Abre las DevTools** (F12 o Ctrl+Shift+I)
3. Ve probando cada sección con las DevTools abiertas
4. Observa la consola para ver los diferentes tipos de output
5. Prueba a poner breakpoints en la pestaña Sources

## Secciones del ejercicio

1. **Console Master**: Prueba todos los métodos de console
2. **Try/Catch Lab**: Experimenta con diferentes tipos de errores
3. **Error Factory**: Crea y lanza errores personalizados
4. **Async Error Handler**: Manejo de errores en código asíncrono
5. **Global Error Net**: Captura errores no manejados
6. **Debug Challenge**: Ejercicio interactivo de debugging

## Ejercicios propuestos

1. Añade un sistema de logging con niveles (debug, info, warn, error)
2. Implementa un patrón de retry para peticiones fetch fallidas
3. Crea un panel de errores visible en la UI (no solo en consola)
4. Usa la pestaña Network para inspeccionar las peticiones fetch del ejercicio

## Recursos adicionales

- [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools)
- [MDN: Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN: try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

## Checklist de aprendizaje

- [ ] Sé usar `console.table()`, `console.group()`, `console.time()` y `console.trace()`
- [ ] Entiendo cómo funciona `debugger` y los breakpoints en DevTools
- [ ] Sé usar `try/catch/finally` correctamente
- [ ] Sé crear clases de error personalizadas
- [ ] Entiendo la diferencia entre errores síncronos y asíncronos
- [ ] Sé capturar errores globales con `window.onerror`
- [ ] Conozco los patrones Retry, Fallback y Graceful Degradation
