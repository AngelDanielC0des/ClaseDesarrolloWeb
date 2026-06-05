# Ranking de Jugadores - Métodos Inmutables ES2023-2024

## 🎯 Objetivo

Aprender los métodos más recientes de JavaScript para trabajar con arrays **sin mutar el original**. Esto es fundamental en programación funcional y en frameworks modernos como React.

## 📚 Conceptos que aprenderás

### 1. toSorted() - Ordenar sin mutar (ES2023)

Crea un **nuevo array ordenado**, dejando el original intacto.

| Método | Muta el original | Devuelve |
|--------|------------------|----------|
| `sort()` | ✅ Sí | El mismo array ordenado |
| `toSorted()` | ❌ No | Un **nuevo** array ordenado |

**Ejemplo:**
```javascript
const numeros = [3, 1, 4, 1, 5];

// Forma antigua (mutable)
numeros.sort();
console.log(numeros);  // [1, 1, 3, 4, 5] ¡El original cambió!

// Forma moderna (inmutable)
const ordenados = numeros.toSorted();
console.log(numeros);    // [3, 1, 4, 1, 5] ¡El original NO cambió!
console.log(ordenados);  // [1, 1, 3, 4, 5]
```

### 2. toReversed() - Invertir sin mutar (ES2023)

Crea un **nuevo array invertido**.

```javascript
const letras = ['a', 'b', 'c'];

const invertidas = letras.toReversed();
console.log(letras);     // ['a', 'b', 'c'] ¡Sin cambios!
console.log(invertidas); // ['c', 'b', 'a']
```

### 3. toSpliced() - Insertar/eliminar sin mutar (ES2023)

Crea un **nuevo array** insertando y/o eliminando elementos.

```javascript
const colores = ['rojo', 'verde', 'azul'];

// Eliminar 1 elemento en posición 1
const sinVerde = colores.toSpliced(1, 1);
console.log(colores);   // ['rojo', 'verde', 'azul'] ¡Sin cambios!
console.log(sinVerde);  // ['rojo', 'azul']

// Insertar elemento en posición 1
const conAmarillo = colores.toSpliced(1, 0, 'amarillo');
console.log(conAmarillo);  // ['rojo', 'amarillo', 'verde', 'azul']
```

### 4. with() - Reemplazar elemento sin mutar (ES2023)

Crea un **nuevo array** con un elemento reemplazado.

```javascript
const numeros = [10, 20, 30];

const actualizados = numeros.with(1, 99);
console.log(numeros);     // [10, 20, 30] ¡Sin cambios!
console.log(actualizados); // [10, 99, 30]

// Soporta índices negativos
const ultimoCambiado = numeros.with(-1, 100);
console.log(ultimoCambiado); // [10, 20, 100]
```

### 5. findLast() y findLastIndex() - Buscar desde el final (ES2023)

Buscan el **último** elemento que cumpla una condición.

```javascript
const mensajes = [
    { user: 'Ana', texto: 'Hola' },
    { user: 'Carlos', texto: '¿Qué tal?' },
    { user: 'Ana', texto: 'Bien' },
    { user: 'Ana', texto: 'Adiós' }
];

// find() busca desde el principio
const primerAna = mensajes.find(m => m.user === 'Ana');
console.log(primerAna.texto);  // 'Hola'

// findLast() busca desde el final
const ultimaAna = mensajes.findLast(m => m.user === 'Ana');
console.log(ultimaAna.texto);  // 'Adiós'

// findLastIndex() devuelve el índice
const indiceUltima = mensajes.findLastIndex(m => m.user === 'Ana');
console.log(indiceUltima);  // 3
```

### 6. Object.groupBy() - Agrupar elementos (ES2024)

Agrupa elementos de un array en un objeto según una función.

```javascript
const productos = [
    { nombre: 'Manzana', tipo: 'fruta' },
    { nombre: 'Zanahoria', tipo: 'verdura' },
    { nombre: 'Plátano', tipo: 'fruta' },
    { nombre: 'Brócoli', tipo: 'verdura' }
];

const grupos = Object.groupBy(productos, p => p.tipo);

console.log(grupos);
// {
//   fruta: [{ nombre: 'Manzana', ... }, { nombre: 'Plátano', ... }],
//   verdura: [{ nombre: 'Zanahoria', ... }, { nombre: 'Brócoli', ... }]
// }
```

## 🚀 Cómo usar este ejercicio

1. Abre `index.html` en tu navegador
2. Haz clic en los botones de acciones para ver cada método en acción
3. Observa que el **ranking original nunca cambia** (inmutabilidad)
4. Abre la consola (F12) para ver las comparaciones detalladas

## 💡 Casos de uso reales

### React: Actualizar estado sin mutar
```javascript
// ❌ MAL (muta el estado directamente)
setTareas(tareas => {
    tareas.sort();  // ¡Muta el array original!
    return tareas;
});

// ✅ BIEN (inmutable)
setTareas(tareas => tareas.toSorted((a, b) => a.fecha - b.fecha));
```

### Chat: Mostrar últimos mensajes
```javascript
const mensajes = obtenerMensajes();

// Último mensaje de cada usuario
const ultimosPorUsuario = Object.groupBy(
    mensajes,
    m => m.userId
);

Object.entries(ultimosPorUsuario).forEach(([userId, msgs]) => {
    const ultimo = msgs.findLast(m => m.leido === false);
    console.log(`Último no leído de ${userId}:`, ultimo);
});
```

### Carrito de compras: Actualizar cantidad
```javascript
const carrito = [
    { id: 1, producto: 'Laptop', cantidad: 1 },
    { id: 2, producto: 'Mouse', cantidad: 2 }
];

// Actualizar cantidad del primer producto
const actualizado = carrito.with(0, {
    ...carrito[0],
    cantidad: 3
});
```

## 📊 Comparación: Mutable vs Inmutable

| Operación | Método mutable | Método inmutable |
|-----------|----------------|------------------|
| Ordenar | `sort()` | `toSorted()` |
| Invertir | `reverse()` | `toReversed()` |
| Insertar/eliminar | `splice()` | `toSpliced()` |
| Reemplazar | `array[i] = val` | `array.with(i, val)` |

## 🎓 Principio de inmutabilidad

**¿Por qué es importante?**

1. **React**: Mutar el estado directamente no dispara re-renders
2. **Redux**: Requiere inmutabilidad para detectar cambios
3. **Testing**: Las funciones puras son más fáciles de testear
4. **Debugging**: Es más fácil rastrear cambios
5. **Time-travel**: Puedes "volver atrás" si guardas estados anteriores

**Ejemplo visual:**
```
❌ Mutable:
  Original: [3, 1, 2]
  sort() → [1, 2, 3]
  ¡El original se perdió!

✅ Inmutable:
  Original: [3, 1, 2]
  toSorted() → [1, 2, 3]
  Original sigue siendo [3, 1, 2]
```

## 🔗 Recursos adicionales

- [MDN: Array.prototype.toSorted()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted)
- [MDN: Array.prototype.with()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/with)
- [MDN: Object.groupBy()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/groupBy)

## ✅ Checklist de aprendizaje

- [ ] Entiendo la diferencia entre métodos mutables e inmutables
- [ ] Sé usar `toSorted()` para ordenar sin mutar
- [ ] Sé usar `toReversed()` para invertir sin mutar
- [ ] Sé usar `toSpliced()` para insertar/eliminar sin mutar
- [ ] Sé usar `with()` para reemplazar elementos sin mutar
- [ ] Sé usar `findLast()` para buscar desde el final
- [ ] Sé usar `Object.groupBy()` para agrupar elementos
- [ ] Entiendo por qué la inmutabilidad es importante en React
