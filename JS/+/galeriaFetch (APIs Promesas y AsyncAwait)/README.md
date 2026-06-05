# 🎮 Pokédex - Galería con Fetch API, Promesas y Async/Await

## 📚 Conceptos que aprenderás

Este ejercicio cubre todo lo necesario para consumir datos de internet en JavaScript moderno:

### 1. ¿Qué es una API?
Una **API** (Application Programming Interface) es un conjunto de URLs que un servidor expone para que otras aplicaciones puedan pedirle datos.

```
GET https://pokeapi.co/api/v2/pokemon/1 → Devuelve datos de Bulbasaur (JSON)
```

### 2. ¿Qué es la Asincronía?
Cuando pedimos datos a un servidor, la respuesta **no es instantánea**. JavaScript **no se pausa** mientras espera; sigue ejecutando código. Esto es la **programación asíncrona**.

```javascript
console.log("1. Antes");
fetch("https://api..."); // Esto tarda tiempo
console.log("2. Después"); // Se ejecuta ANTES de que llegue la respuesta
// El orden en consola será: "1. Antes", "2. Después", y luego los datos
```

### 3. Promesas (Promises)
Una **Promesa** es un objeto que representa el resultado **futuro** de una operación asíncrona.

**Estados de una promesa:**
- `pending`: Pendiente (aún no terminó)
- `fulfilled`: Cumplida (terminó con éxito)
- `rejected`: Rechazada (falló)

```javascript
const promesa = fetch("https://api...");

promesa
    .then(response => response.json())  // Se ejecuta si tiene éxito
    .then(data => console.log(data))     // Se ejecuta con los datos
    .catch(error => console.error(error)); // Se ejecuta si falla
```

### 4. `fetch()` - Peticiones HTTP nativas
`fetch(url)` hace una petición HTTP GET y devuelve una **Promesa**.

```javascript
fetch("https://pokeapi.co/api/v2/pokemon/1")
    .then(response => {
        // response NO son los datos, es el objeto Response
        if (!response.ok) throw new Error("Error HTTP");
        return response.json(); // Parsea el JSON (también asíncrono)
    })
    .then(data => {
        // Ahora sí tenemos los datos del Pokémon
        console.log(data.name); // "bulbasaur"
    });
```

### 5. `async/await` - La forma moderna
`async/await` es "azúcar sintáctico" sobre Promesas que hace el código asíncrono parecer síncrono.

```javascript
// SIN async/await (cadenas de .then)
function obtenerPokemon() {
    fetch("https://pokeapi.co/api/v2/pokemon/1")
        .then(response => response.json())
        .then(data => console.log(data));
}

// CON async/await (más legible)
async function obtenerPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/1");
    const data = await response.json();
    console.log(data);
}
```

**Reglas:**
- `async` se pone antes de `function` (siempre devuelve una Promesa)
- `await` se pone antes de una Promesa para esperar su resultado
- `await` **solo** se puede usar dentro de una función `async`

### 6. `try/catch` - Manejo de errores
Captura errores en código asíncrono sin que la app se rompa.

```javascript
async function obtenerPokemon() {
    try {
        const response = await fetch("https://api...");
        if (!response.ok) throw new Error("No encontrado");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error:", error);
        // Aquí puedes mostrar un mensaje al usuario
    }
}
```

### 7. `Promise.all()` - Múltiples promesas en paralelo
Ejecuta varias promesas **simultáneamente** y espera a que **todas** terminen.

```javascript
const urls = [
    "https://pokeapi.co/api/v2/pokemon/1",
    "https://pokeapi.co/api/v2/pokemon/2",
    "https://pokeapi.co/api/v2/pokemon/3"
];

// Creamos un array de promesas
const promesas = urls.map(url => fetch(url).then(r => r.json()));

// Esperamos a que TODAS se resuelvan
const resultados = await Promise.all(promesas);
// resultados = [bulbasaur, ivysaur, venusaur]
```

**Ventaja:** Es mucho más rápido que hacer los fetch uno por uno.

## 🎯 Funcionalidades del ejercicio

- **Galería paginada**: Navega por páginas de Pokémon
- **Búsqueda**: Busca por nombre o ID
- **Pokémon aleatorio**: Botón para descubrir Pokémon al azar
- **Vista de detalle**: Modal con estadísticas completas
- **Estados de carga**: Loading spinner y mensajes de error
- **Peticiones paralelas**: Uso de `Promise.all()` para velocidad

## 🚀 Cómo ejecutar

1. Abre `index.html` en tu navegador (necesitas conexión a internet)
2. Navega por las páginas con los botones
3. Busca un Pokémon por nombre (ej: "pikachu") o ID (ej: "25")
4. Haz clic en cualquier tarjeta para ver sus detalles
5. Abre la consola (F12) para ver las URLs que se están consultando

## 💡 Comparación: Antes vs Ahora

### Forma antigua (callbacks anidados - "Callback Hell")
```javascript
fetch(url, function(response) {
    response.json(function(data) {
        procesar(data, function(resultado) {
            // Más callbacks...
        });
    });
});
```

### Forma moderna (async/await)
```javascript
const response = await fetch(url);
const data = await response.json();
const resultado = await procesar(data);
```

## 📝 Ejercicios propuestos

1. Añade un filtro por tipo (fuego, agua, planta, etc.)
2. Implementa un sistema de "favoritos" guardado en localStorage
3. Añade la funcionalidad de comparar dos Pokémon lado a lado
4. Crea un buscador con autocompletado (fetch mientras escribes)
