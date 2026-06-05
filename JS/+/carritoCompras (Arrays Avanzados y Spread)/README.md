# 🛒 Carrito de Compras - Arrays Avanzados y Spread Operator

## 📚 Conceptos que aprenderás

Este ejercicio cubre las herramientas más importantes de JavaScript moderno (ES6+) para trabajar con arrays y datos:

### 1. Arrow Functions `() => {}`
Las arrow functions son una forma más concisa de escribir funciones.

```javascript
// Función tradicional
function sumar(a, b) {
    return a + b;
}

// Arrow function
const sumar = (a, b) => a + b;
```

**Diferencias clave:**
- Sintaxis más corta
- Si solo hay una expresión, se omite `return` y las llaves
- NO tienen su propio `this` (heredan del contexto padre)

### 2. Método `map()` - Transformar arrays
Crea un **nuevo array** transformando cada elemento del original.

```javascript
const numeros = [1, 2, 3];
const dobles = numeros.map(n => n * 2);
// dobles = [2, 4, 6]
// numeros sigue siendo [1, 2, 3] (inmutable)
```

### 3. Método `filter()` - Filtrar arrays
Crea un **nuevo array** con solo los elementos que cumplan una condición.

```javascript
const precios = [10, 50, 30, 80];
const baratos = precios.filter(precio => precio < 40);
// baratos = [10, 30]
```

### 4. Método `reduce()` - Acumular valores
"Reduce" todo el array a un solo valor (número, objeto, etc.).

```javascript
const precios = [10, 20, 30];
const total = precios.reduce((acumulador, precio) => acumulador + precio, 0);
// total = 60
```

### 5. Operador Spread `...`
"Expande" un array u objeto en sus elementos individuales.

```javascript
// Copiar arrays
const original = [1, 2, 3];
const copia = [...original];

// Combinar arrays
const array1 = [1, 2];
const array2 = [3, 4];
const combinado = [...array1, ...array2]; // [1, 2, 3, 4]

// Copiar objetos
const persona = { nombre: "Ana", edad: 25 };
const copia = { ...persona };

// Añadir propiedades
const personaConTrabajo = { ...persona, trabajo: "Desarrolladora" };
```

### 6. Método `find()` - Buscar elementos
Devuelve el **primer elemento** que cumpla la condición.

```javascript
const productos = [
    { id: 1, nombre: "Laptop" },
    { id: 2, nombre: "Móvil" }
];
const laptop = productos.find(p => p.id === 1);
// laptop = { id: 1, nombre: "Laptop" }
```

### 7. Template Literals `` ` ``
Strings con variables interpoladas.

```javascript
const nombre = "Ana";
const saludo = `Hola, ${nombre}!`; // "Hola, Ana!"
```

## 🎯 Funcionalidades del ejercicio

- **Catálogo de productos**: Renderizado dinámico con `map()`
- **Filtro por precio**: Uso de `filter()` con slider interactivo
- **Carrito de compras**: Añadir/eliminar productos
- **Cálculo de total**: Uso de `reduce()` para sumar precios
- **Inmutabilidad**: Uso de spread para no modificar datos originales

## 🚀 Cómo ejecutar

1. Abre `index.html` en tu navegador
2. Explora el catálogo de productos
3. Usa el slider para filtrar por precio
4. Añade productos al carrito y observa el total
5. Abre la consola (F12) para ver los comentarios didácticos

## 💡 Buenas prácticas aplicadas

- **Inmutabilidad**: Nunca modificamos arrays/objetos originales, siempre creamos copias
- **Funciones puras**: Las funciones no tienen efectos secundarios inesperados
- **Código declarativo**: Usamos `map`, `filter`, `reduce` en lugar de bucles `for`
- **Separación de responsabilidades**: Cada función hace una sola cosa

## 📝 Ejercicios propuestos

1. Añade una función para ordenar productos por precio (menor a mayor)
2. Implementa un buscador por nombre usando `filter()`
3. Añade la funcionalidad de aumentar/disminuir cantidad en el carrito
4. Calcula el precio medio de los productos usando `reduce()`
