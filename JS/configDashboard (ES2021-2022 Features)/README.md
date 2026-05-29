# Dashboard de Configuración - Features Modernas ES2021-2022

## 🎯 Objetivo

Aprender las características más recientes y útiles de JavaScript moderno (ES2021-2022) que todo desarrollador debe conocer para escribir código más limpio, legible y moderno.

## 📚 Conceptos que aprenderás

### 1. Logical Assignment Operators (ES2021)

Operadores que combinan lógica con asignación:

| Operador | Equivalente | ¿Cuándo asigna? |
|----------|-------------|-----------------|
| `\|\|=` | `x = x \|\| y` | Solo si x es **falsy** |
| `&&=` | `x = x && y` | Solo si x es **truthy** |
| `??=` | `x = x ?? y` | Solo si x es **null o undefined** |

**Ejemplo:**
```javascript
let tema = '';
tema ||= 'light';  // Asigna 'light' porque '' es falsy

let volumen = 0;
volumen ??= 50;    // NO asigna porque 0 no es null/undefined
```

### 2. Array.at() - Índices negativos (ES2022)

Accede a elementos usando índices negativos para contar desde el final:

```javascript
const frutas = ['manzana', 'banana', 'cereza'];

frutas[0]      // 'manzana' (primer elemento)
frutas.at(0)   // 'manzana' (primer elemento)
frutas.at(-1)  // 'cereza' (último elemento) ¡NUEVO!
frutas.at(-2)  // 'banana' (penúltimo) ¡NUEVO!
```

**Ventaja:** Más limpio que `array[array.length - 1]`

### 3. structuredClone() - Clonación profunda (ES2022)

Crea una copia **profunda** e independiente de objetos y arrays:

```javascript
const original = {
    nombre: 'Ana',
    config: { tema: 'oscuro' }
};

// Copia superficial (problema: comparte objetos anidados)
const copiaSuperficial = { ...original };
copiaSuperficial.config.tema = 'claro';
console.log(original.config.tema);  // 'claro' ¡Se modificó!

// Copia profunda (solución: todo es independiente)
const copiaProfunda = structuredClone(original);
copiaProfunda.config.tema = 'claro';
console.log(original.config.tema);  // 'oscuro' ¡No se modificó!
```

### 4. Object.entries(), Object.values(), Object.keys() (ES2017)

Convierten objetos en arrays para poder iterarlos:

```javascript
const producto = { nombre: 'Laptop', precio: 999 };

Object.keys(producto)     // ['nombre', 'precio']
Object.values(producto)   // ['Laptop', 999]
Object.entries(producto)  // [['nombre', 'Laptop'], ['precio', 999]]

// Iterar sobre un objeto
for (const [clave, valor] of Object.entries(producto)) {
    console.log(`${clave}: ${valor}`);
}
```

## 🚀 Cómo usar este ejercicio

1. Abre `index.html` en tu navegador
2. Haz clic en los botones de la sección "Ejemplos Interactivos"
3. Abre la consola (F12) para ver las demostraciones detalladas
4. Usa los botones de configuración para ver las features en acción:
   - **Cargar valores por defecto**: Usa `structuredClone()`
   - **Aplicar configuración parcial**: Usa `??=` y `&&=`
   - **Resetear**: Limpia la configuración

## 💡 Casos de uso reales

### Logical Assignment
```javascript
// Configurar valores por defecto
userConfig.theme ||= 'light';
userConfig.language ??= 'es';

// Actualizar solo si existe
user.notifications &&= false;
```

### Array.at()
```javascript
// Obtener el último mensaje de un chat
const ultimoMensaje = mensajes.at(-1);

// Obtener la última coordenada de una ruta
const posicionActual = ruta.at(-1);

// Acceder al último carácter de un string
const ultimaLetra = palabra.at(-1);
```

### structuredClone()
```javascript
// Guardar estado para "deshacer"
const estadoAnterior = structuredClone(estadoActual);

// Pasar datos entre componentes sin compartir referencias
const datosParaComponente = structuredClone(datosOriginales);
```

### Object.entries/values/keys
```javascript
// Validar que un objeto tenga todas las propiedades
const tieneTodas = Object.keys(obj).length === propiedadesRequeridas.length;

// Filtrar propiedades numéricas
const soloNumeros = Object.entries(obj)
    .filter(([k, v]) => typeof v === 'number')
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
```

## 📊 Comparación de métodos

### Métodos de clonación

| Método | Profundidad | Rendimiento | Limitaciones |
|--------|-------------|-------------|--------------|
| `{ ...obj }` | Superficial | Muy rápido | Solo primer nivel |
| `Object.assign()` | Superficial | Rápido | Solo primer nivel |
| `JSON.parse/stringify` | Profunda | Lento | No soporta funciones, Date, etc. |
| `structuredClone()` | Profunda | Rápido | **Recomendado** ✅ |

### Acceso a arrays

| Método | Soporta negativos | Caso de uso |
|--------|-------------------|-------------|
| `array[i]` | ❌ No | Índices positivos conocidos |
| `array.at(i)` | ✅ Sí | Último elemento, penúltimo, etc. |

## 🎓 Buenas prácticas

1. **Usa `??=` en lugar de `||=`** cuando `0`, `false` o `""` sean valores válidos
2. **Usa `.at(-1)`** en lugar de `array[array.length - 1]` para mejor legibilidad
3. **Usa `structuredClone()`** cuando necesites copias profundas de objetos complejos
4. **Usa `Object.entries()`** para iterar sobre objetos con `for...of`
5. **Combina estas features** para escribir código más limpio y moderno

## 🔗 Recursos adicionales

- [MDN: Logical Assignment Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_OR_assignment)
- [MDN: Array.prototype.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)
- [MDN: structuredClone()](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
- [MDN: Object.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries)

## ✅ Checklist de aprendizaje

- [ ] Entiendo la diferencia entre `||=`, `&&=` y `??=`
- [ ] Sé cuándo usar cada operador de asignación lógica
- [ ] Puedo usar `.at()` con índices negativos
- [ ] Entiendo la diferencia entre copia superficial y profunda
- [ ] Sé usar `structuredClone()` para clonar objetos complejos
- [ ] Puedo iterar sobre objetos con `Object.entries()`
- [ ] Sé cuándo usar `keys()`, `values()` y `entries()`
