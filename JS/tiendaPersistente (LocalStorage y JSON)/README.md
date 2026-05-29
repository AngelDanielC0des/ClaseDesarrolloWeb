# ✅ Lista de Tareas Persistente - LocalStorage y JSON

## 📚 Conceptos que aprenderás

Este ejercicio cubre la **persistencia de datos en el navegador**, esencial para cualquier aplicación web moderna:

### 1. Web Storage API
El navegador ofrece dos mecanismos para guardar datos localmente:

#### `localStorage`
- Los datos persisten **indefinidamente** (hasta que el usuario los borre)
- Compartidos entre todas las pestañas del mismo origen
- Capacidad: ~5-10 MB
- **Uso típico:** preferencias de usuario, carrito de compras, datos de sesión largos

#### `sessionStorage`
- Los datos se borran al **cerrar la pestaña**
- Aislados por pestaña (no se comparten)
- Capacidad: ~5-10 MB
- **Uso típico:** estado temporal de formularios, filtros de página

### 2. Métodos de Storage

```javascript
// Guardar un valor
localStorage.setItem('nombre', 'Ana');
sessionStorage.setItem('filtro', 'activos');

// Leer un valor (devuelve null si no existe)
const nombre = localStorage.getItem('nombre'); // "Ana"

// Borrar una clave
localStorage.removeItem('nombre');

// Borrar TODO el storage
localStorage.clear();

// Ver cuántas claves hay
const cantidad = localStorage.length;

// Ver el nombre de la clave en el índice N
const clave = localStorage.key(0);
```

### 3. JSON (JavaScript Object Notation)
`localStorage` **solo guarda strings**. Para guardar objetos o arrays, necesitamos convertirlos:

```javascript
const usuario = { nombre: "Ana", edad: 25 };

// Guardar: Objeto → String
const jsonString = JSON.stringify(usuario);
// jsonString = '{"nombre":"Ana","edad":25}'
localStorage.setItem('usuario', jsonString);

// Leer: String → Objeto
const stringGuardado = localStorage.getItem('usuario');
const usuarioRecuperado = JSON.parse(stringGuardado);
// usuarioRecuperado = { nombre: "Ana", edad: 25 }
```

### 4. `JSON.stringify()` - Objeto a String
```javascript
JSON.stringify({ a: 1, b: 2 });     // '{"a":1,"b":2}'
JSON.stringify([1, 2, 3]);          // '[1,2,3]'
JSON.stringify("hola");             // '"hola"'
JSON.stringify(42);                 // '42'
JSON.stringify(true);               // 'true'
JSON.stringify(null);               // 'null'
JSON.stringify(undefined);          // undefined (no se puede)
```

### 5. `JSON.parse()` - String a Objeto
```javascript
JSON.parse('{"nombre":"Ana"}');     // { nombre: "Ana" }
JSON.parse('[1,2,3]');              // [1, 2, 3]
JSON.parse('"hola"');               // "hola"
JSON.parse('42');                   // 42
JSON.parse('invalid');              // Error: SyntaxError
```

### 6. `setInterval()` - Ejecución periódica
Ejecuta una función **cada X milisegundos**, de forma repetitiva.

```javascript
// Ejecutar cada 3 segundos
const id = setInterval(() => {
    console.log("Hola cada 3 segundos");
}, 3000);

// Detener el intervalo
clearInterval(id);
```

### 7. `setTimeout()` vs `setInterval()`

```javascript
// setTimeout: Se ejecuta UNA VEZ después de X ms
setTimeout(() => console.log("Una vez"), 3000);

// setInterval: Se ejecuta CADA X ms (infinitamente)
setInterval(() => console.log("Repetido"), 3000);
```

## 🎯 Funcionalidades del ejercicio

- **Crear tareas** con prioridad (alta, media, baja)
- **Marcar como completadas** con checkbox
- **Filtrar** por estado (todas, pendientes, completadas)
- **Persistencia automática** con localStorage
- **Auto-guardado** cada 5 segundos con setInterval
- **Filtro persistente** con sessionStorage
- **Información del storage** en tiempo real
- **Acciones masivas** (completar todas, eliminar)

## 🚀 Cómo ejecutar

1. Abre `index.html` en tu navegador
2. Agrega algunas tareas
3. **Recarga la página** → Las tareas siguen ahí (localStorage)
4. Cambia el filtro y recarga → El filtro se mantiene (sessionStorage)
5. Cierra la pestaña y abre una nueva → El filtro se resetea (sessionStorage)
6. Abre DevTools → Application → Local Storage para ver los datos

## 💡 Casos de uso reales

### Carrito de compras
```javascript
// Guardar carrito
const carrito = [{ id: 1, producto: "Laptop", cantidad: 1 }];
localStorage.setItem('carrito', JSON.stringify(carrito));

// Recuperar al volver a la página
const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
```

### Preferencias del usuario
```javascript
// Guardar tema oscuro/claro
localStorage.setItem('tema', 'oscuro');

// Aplicar al cargar
const tema = localStorage.getItem('tema');
document.body.classList.toggle('dark', tema === 'oscuro');
```

### Borrador de formulario
```javascript
// Guardar mientras escribe
input.addEventListener('input', (e) => {
    sessionStorage.setItem('borrador_email', e.target.value);
});

// Recuperar al volver
input.value = sessionStorage.getItem('borrador_email') || '';
```

## 📝 Ejercicios propuestos

1. Añade la funcionalidad de editar tareas existentes
2. Implementa un sistema de categorías o etiquetas
3. Añade fechas de vencimiento con alertas visuales
4. Exporta las tareas a un archivo JSON descargable
5. Importa tareas desde un archivo JSON
