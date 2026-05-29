# 💰 Calculadora Financiera - Módulos ES6 (Import/Export)

## 📚 Conceptos que aprenderás

Este ejercicio cubre la **arquitectura modular** de JavaScript moderno, esencial para proyectos reales:

### 1. ¿Qué son los Módulos ES6?
Los módulos permiten **dividir el código en archivos separados**, cada uno con responsabilidades específicas. Cada archivo puede **exportar** lo que otros necesitan y **importar** lo que le hace falta.

```
mathUtils.js  →  Lógica matemática pura
domUtils.js   →  Manipulación del DOM
app.js        →  Orquestador principal
```

### 2. `export` - Exportar desde un módulo

#### Named Exports (Exportaciones con nombre)
```javascript
// mathUtils.js
export function sumar(a, b) {
    return a + b;
}

export const PI = 3.14159;

// También se pueden exportar varias cosas al final
function restar(a, b) { return a - b; }
function multiplicar(a, b) { return a * b; }

export { restar, multiplicar };
```

#### Default Export (Exportación por defecto)
Solo puede haber **una** por archivo:
```javascript
// mathUtils.js
export default {
    sumar,
    restar,
    multiplicar
};
```

### 3. `import` - Importar desde otro módulo

#### Named Import (Importación con nombre)
```javascript
// app.js
import { sumar, PI } from './mathUtils.js';

console.log(sumar(2, 3)); // 5
console.log(PI);          // 3.14159
```

#### Default Import (Importación por defecto)
```javascript
// app.js
import mathUtils from './mathUtils.js';

console.log(mathUtils.sumar(2, 3)); // 5
```

#### Namespace Import (Importar todo como objeto)
```javascript
// app.js
import * as mathUtils from './mathUtils.js';

console.log(mathUtils.sumar(2, 3)); // 5
```

#### Renombrar imports
```javascript
import { sumar as add, PI as pi } from './mathUtils.js';
```

### 4. `<script type="module">` en HTML
Para usar módulos en el navegador, el `<script>` debe tener `type="module"`:

```html
<!-- INCORRECTO: No funcionará import/export -->
<script src="app.js"></script>

<!-- CORRECTO: Habilita el sistema de módulos -->
<script type="module" src="app.js"></script>
```

**Características de `type="module"`:**
- Se ejecuta con `defer` automáticamente (después de parsear HTML)
- Tiene su propio scope (no contamina el scope global)
- Solo funciona servido por HTTP (no con `file://`)

## 🎯 Arquitectura del ejercicio

```
┌─────────────────────────────────────────────────────────────┐
│                        app.js                                │
│  (Orquestador: importa, conecta eventos, coordina)          │
│                                                              │
│  import { calcularCuotaMensual } from './mathUtils.js'      │
│  import { renderizarResultados } from './domUtils.js'       │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
┌─────────────────────┐    ┌─────────────────────────────────┐
│    mathUtils.js     │    │         domUtils.js              │
│                     │    │                                   │
│ • calcularCuota()   │    │ • renderizarResultados()         │
│ • calcularTotal()   │    │ • agregarAlHistorial()           │
│ • formatearMoneda() │    │ • mostrarMensaje()               │
│                     │    │ • validarDatos()                 │
│ (Lógica pura,       │    │                                   │
│  sin DOM)           │    │ (Solo DOM, sin lógica)           │
└─────────────────────┘    └─────────────────────────────────┘
```

### Ventajas de esta arquitectura:

1. **Separación de responsabilidades**: Cada archivo hace UNA cosa
2. **Reutilización**: `mathUtils.js` se puede usar en Node.js, React, etc.
3. **Testeabilidad**: Las funciones matemáticas se pueden testear sin DOM
4. **Mantenibilidad**: Cambiar el diseño solo afecta a `domUtils.js`
5. **Colaboración**: Varios desarrolladores pueden trabajar en paralelo

## 🚀 Cómo ejecutar

**IMPORTANTE:** Los módulos ES6 requieren un servidor HTTP. No funcionan con `file://`.

### Opciones para servir localmente:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (npx)
npx serve

# Con VS Code: extensión "Live Server"
```

Luego abre `http://localhost:8000` en tu navegador.

## 💡 Buenas prácticas

### ✅ Hacer:
- Un módulo = una responsabilidad
- Exportar solo lo necesario (API mínima)
- Usar rutas relativas (`./mathUtils.js`, no `mathUtils.js`)
- Incluir la extensión `.js` en los imports

### ❌ Evitar:
- Módulos que hacen demasiadas cosas
- Importar todo cuando solo necesitas una función
- Dependencias circulares (A importa B, B importa A)

## 📝 Ejercicios propuestos

1. Crea un nuevo módulo `validationUtils.js` con funciones de validación
2. Añade un módulo `chartUtils.js` que dibuje un gráfico de amortización
3. Implementa un conversor de divisas como módulo separado
4. Añade tests unitarios para `mathUtils.js` (con Jest o Vitest)
