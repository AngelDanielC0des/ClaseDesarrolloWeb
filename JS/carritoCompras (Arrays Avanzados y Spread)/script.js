// =========================================================================
// LECCIÓN: Arrays Avanzados, Arrow Functions y Spread Operator (ES6+)
// =========================================================================
// Este ejercicio demuestra las herramientas más potentes de JavaScript moderno
// para trabajar con arrays: map(), filter(), reduce(), arrow functions (() => {})
// y el operador spread/rest (...).
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: ¿Qué método usar en cada situación?
// -------------------------------------------------------------------------
// ┌──────────────┬──────────────────────────────┬─────────────────────────┐
// │   Método     │  ¿Qué hace?                  │  ¿Qué devuelve?         │
// ├──────────────┼──────────────────────────────┼─────────────────────────┤
// │   map()      │  Transforma cada elemento    │  Nuevo array (mismo     │
// │              │  uno por uno                 │  tamaño que el original)│
// │   filter()   │  Selecciona solo los que     │  Nuevo array (igual o   │
// │              │  cumplan una condición       │  más pequeño)           │
// │   reduce()   │  Acumula todos en un solo    │  Un solo valor          │
// │              │  valor (suma, objeto, etc.)  │  (número, objeto, etc.) │
// │   find()     │  Busca el PRIMERO que        │  Un elemento (o         │
// │              │  cumpla la condición         │  undefined si no hay)   │
// │   forEach()  │  Recorre el array (sin       │  Nada (undefined)       │
// │              │  devolver nada)              │  Solo ejecuta código    │
// └──────────────┴──────────────────────────────┴─────────────────────────┘
//
// Analogía del mundo real:
// - map() = Una fábrica: entran piezas crudas, salen productos terminados
// - filter() = Un portero de discoteca: solo deja pasar a los mayores de edad
// - reduce() = Una hucha: todos meten monedas y al final tienes el total
// - find() = Buscar una aguja en un pajar: paras en cuanto la encuentras
// - forEach() = Pasar lista en clase: nombras a cada alumno pero no devuelves nada

// -------------------------------------------------------------------------
// 1. BASE DE DATOS DE PRODUCTOS (Array de Objetos)
// -------------------------------------------------------------------------
// Cada producto es un objeto con propiedades. Este patrón es idéntico al que
// recibirías de una API real o base de datos.
//
// ¿QUÉ ES UN ARRAY?
// Imagina una lista de la compra escrita en papel. Cada línea es un elemento.
// En JavaScript, un array es exactamente eso: una lista ordenada de cosas.
//
// ¿QUÉ ES UN OBJETO?
// Imagina una ficha de producto en una tienda: tiene nombre, precio, categoría...
// Un objeto en JavaScript es como esa ficha: un conjunto de propiedades (clave: valor).
//
// ESTRUCTURA VISUAL DE NUESTROS DATOS:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  productos (array)                                                  │
// │  ┌───────────────────────────────────────────────────────────────┐  │
// │  │  [0] { id: 1, nombre: "Auriculares...", precio: 29.99, ... }  │  │
// │  │  [1] { id: 2, nombre: "Teclado...", precio: 89.99, ... }      │  │
// │  │  [2] { id: 3, nombre: "Ratón...", precio: 24.99, ... }        │  │
// │  │  ...                                                          │  │
// │  └───────────────────────────────────────────────────────────────┘  │
// └─────────────────────────────────────────────────────────────────────┘
//
// ¿POR QUÉ USAMOS 'const'?
// Porque la variable 'productos' siempre apuntará al MISMO array.
// Aunque modifiquemos su contenido (añadir/quitar elementos), la variable
// en sí nunca cambiará de referencia. Es como una caja con etiqueta fija:
// puedes cambiar lo que hay dentro, pero la caja sigue siendo la misma.

const productos = [
    { id: 1, nombre: "Auriculares Bluetooth", precio: 29.99, categoria: "electrónica" },
    { id: 2, nombre: "Teclado Mecánico", precio: 89.99, categoria: "electrónica" },
    { id: 3, nombre: "Ratón Inalámbrico", precio: 24.99, categoria: "electrónica" },
    { id: 4, nombre: "Monitor 27\"", precio: 299.99, categoria: "electrónica" },
    { id: 5, nombre: "Webcam HD", precio: 59.99, categoria: "electrónica" },
    { id: 6, nombre: "Alfombrilla XL", precio: 19.99, categoria: "accesorios" },
    { id: 7, nombre: "Hub USB-C", precio: 39.99, categoria: "accesorios" },
    { id: 8, nombre: "Soporte Portátil", precio: 34.99, categoria: "accesorios" }
];

// -------------------------------------------------------------------------
// 2. ESTADO DEL CARRITO (Array vacío que iremos llenando)
// -------------------------------------------------------------------------
// Usamos 'let' porque el carrito cambiará (añadiremos/quitaremos productos).
//
// ¿POR QUÉ 'let' Y NO 'const'?
// ┌─────────────┬──────────────────────────────────────────────────────┐
// │  Palabra    │  ¿Cuándo usarla?                                     │
// ├─────────────┼──────────────────────────────────────────────────────┤
// │  const      │  Cuando la variable NUNCA cambiará de valor          │
// │             │  Ejemplo: const PI = 3.14159                         │
// │  let        │  Cuando la variable SÍ cambiará de valor             │
// │             │  Ejemplo: let carrito = []; carrito = [producto1]    │
// │  var        │  ¡EVITAR! Es la forma antigua (antes de ES6)         │
// │             │  Tiene comportamientos confusos con los scopes       │
// └─────────────┴──────────────────────────────────────────────────────┘
//
// Analogía:
// - const = Tu DNI: nunca cambia, es el mismo toda la vida
// - let = Tu dirección: puedes mudarte y cambiarla
// - var = Un post-it que se cae y se pierde: impredecible, mejor no usarlo
let carrito = [];

// -------------------------------------------------------------------------
// 3. REFERENCIAS AL DOM
// -------------------------------------------------------------------------
// El DOM (Document Object Model) es la representación de tu HTML en JavaScript.
// Imagina que el HTML es una casa y el DOM es el plano: JavaScript usa el plano
// para encontrar habitaciones (elementos) y modificarlas.
//
// document.getElementById('id') busca un elemento por su atributo id="..."
// Es como buscar a una persona por su DNI: cada id es único en la página.
//
// ¿POR QUÉ GUARDAMOS LAS REFERENCIAS EN VARIABLES?
// Porque buscar un elemento en el DOM es "costoso" (tarda tiempo).
// Si lo guardamos en una variable, solo lo buscamos UNA vez y luego
// reutilizamos la referencia. Es como guardar un contacto en la agenda
// en vez de buscar su número cada vez que quieres llamarle.
const catalogo = document.getElementById('catalogo');
const listaCarrito = document.getElementById('listaCarrito');
const totalPrecio = document.getElementById('totalPrecio');
const precioMax = document.getElementById('precioMax');
const precioValor = document.getElementById('precioValor');

// -------------------------------------------------------------------------
// 4. ARROW FUNCTIONS (() => {})
// -------------------------------------------------------------------------
// Las arrow functions son una forma más concisa de escribir funciones.
// Diferencias clave con las funciones tradicionales:
// - Sintaxis más corta: (parametros) => { cuerpo }
// - Si solo hay una expresión, se puede omitir las llaves y el 'return'
// - NO tienen su propio 'this' (heredan el del contexto padre)
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: Función tradicional vs Arrow Function
// -------------------------------------------------------------------------
// ┌───────────────────────────────┬───────────────────────────────────────┐
// │  Función tradicional          │  Arrow Function                       │
// ├───────────────────────────────┼───────────────────────────────────────┤
// │  function sumar(a, b) {       │  const sumar = (a, b) => a + b;       │
// │      return a + b;            │                                       │
// │  }                            │                                       │
// ├───────────────────────────────┼───────────────────────────────────────┤
// │  function doble(x) {          │  const doble = x => x * 2;            │
// │      return x * 2;            │  (sin paréntesis si hay 1 parámetro)  │
// │  }                            │                                       │
// ├───────────────────────────────┼───────────────────────────────────────┤
// │  function saludar() {         │  const saludar = () => "Hola";        │
// │      return "Hola";           │  (paréntesis vacíos si no hay params) │
// │  }                            │                                       │
// └───────────────────────────────┴───────────────────────────────────────┘
//
// Analogía:
// - Función tradicional = Una receta completa con todos los pasos escritos
// - Arrow function = Una nota rápida: "mezclar harina + huevos = masa"
// Ambas hacen lo mismo, pero la segunda es más directa y rápida de leer.

// Ejemplo de arrow function concisa (una sola línea):
const formatearPrecio = (precio) => precio.toFixed(2);
// Equivalente tradicional: function formatearPrecio(precio) { return precio.toFixed(2); }
//
// ¿QUÉ HACE .toFixed(2)?
// Redondea un número a 2 decimales y lo convierte en string.
// Ejemplo: 29.99456.toFixed(2) → "29.99"
// Es útil para mostrar precios con formato de moneda (siempre 2 decimales).

// -------------------------------------------------------------------------
// 5. MÉTODO MAP() - Transformar arrays
// -------------------------------------------------------------------------
// map() crea un NUEVO array transformando cada elemento del array original.
// NO modifica el array original (es "inmutable").
// Sintaxis: array.map((elemento) => { return elementoTransformado })
//
// -------------------------------------------------------------------------
// FLUJO VISUAL DE map():
// -------------------------------------------------------------------------
// Array original:     [producto1, producto2, producto3]
//                          │           │           │
//                          ▼           ▼           ▼
// Transformación:    [tarjeta1,   tarjeta2,   tarjeta3]
// Array resultado:    [tarjeta1,   tarjeta2,   tarjeta3]
//
// Analogía:
// Imagina una cadena de montaje en una fábrica de juguetes:
// - Entran piezas de plástico (elementos del array original)
// - Cada pieza pasa por una máquina que la transforma (la función que le pasas)
// - Salen juguetes terminados (elementos del nuevo array)
// - Las piezas originales NO se modifican, solo se copian y transforman
//
// ¿QUÉ PASARÍA SI USÁRAMOS UN BUCLE FOR EN VEZ DE map()?
// - Tendríamos que crear manualmente un array vacío
// - Tendríamos que hacer push() manualmente en cada iteración
// - El código sería más largo y propenso a errores
// - map() es más "declarativo": dice QUÉ quieres, no CÓMO hacerlo

function renderizarCatalogo(productosAMostrar) {
    // Limpiamos el catálogo actual
    // ¿POR QUÉ LIMPIAMOS? Porque si no, cada vez que filtremos se añadirían
    // los productos nuevos DEBAJO de los anteriores, duplicando la lista.
    // innerHTML = '' borra todo el contenido HTML del elemento.
    catalogo.innerHTML = '';

    // MAP: Transformamos cada producto en una tarjeta HTML
    // map() recorre el array y devuelve un nuevo array con las tarjetas creadas
    //
    // FLUJO:
    // productosAMostrar = [{id:1, nombre:"Auriculares"...}, {id:2, ...}, ...]
    //         │                        │
    //         ▼                        ▼
    //     map() aplica          map() aplica
    //     la función            la función
    //         │                        │
    //         ▼                        ▼
    // tarjetas = [<div class="producto-card">...</div>, <div>...</div>, ...]
    const tarjetas = productosAMostrar.map((producto) => {
        // Creamos el elemento div para la tarjeta
        // document.createElement('div') crea un <div> "en memoria"
        // Todavía NO está en la página, solo existe como objeto JavaScript
        const card = document.createElement('div');
        card.className = 'producto-card';
        
        // Template literals (``) para interpolar variables en strings
        // Las comillas invertidas (backticks) permiten meter variables dentro
        // del string usando ${variable}. Es mucho más legible que concatenar
        // con el operador + (ejemplo: "<h3>" + producto.nombre + "</h3>")
        card.innerHTML = `
            <h3>${producto.nombre}</h3>
            <p class="precio">${formatearPrecio(producto.precio)}€</p>
            <p><small>${producto.categoria}</small></p>
            <button onclick="agregarAlCarrito(${producto.id})">Añadir al carrito</button>
        `;
        // ¿QUÉ ES onclick?
        // Es un "event handler": le dice al botón qué función ejecutar cuando
        // el usuario haga clic. Es como poner una etiqueta en un interruptor
        // que dice "al pulsar, enciende la luz de la cocina".
        
        return card; // map() recoge este return y lo añade al nuevo array
    });

    // Ahora 'tarjetas' es un array de elementos <div> listos para inyectar
    // Usamos forEach para añadir cada tarjeta al DOM
    //
    // ¿POR QUÉ forEach Y NO map?
    // Porque NO queremos transformar ni devolver nada, solo EJECUTAR una acción
    // (añadir al DOM) por cada elemento. forEach es para "hacer algo con cada uno"
    // sin esperar un resultado de vuelta.
    //
    // appendChild() = "añadir hijo". Inserta el elemento dentro del contenedor.
    // Es como colgar un cuadro en una pared: el cuadro (tarjeta) pasa a formar
    // parte de la pared (catálogo).
    tarjetas.forEach((tarjeta) => catalogo.appendChild(tarjeta));
}

// -------------------------------------------------------------------------
// 6. OPERADOR SPREAD (...) - Copiar y combinar arrays/objetos
// -------------------------------------------------------------------------
// El operador spread (...) "expande" un array u objeto en sus elementos individuales.
// Usos principales:
// - Copiar arrays: const copia = [...original]
// - Combinar arrays: const combinado = [...array1, ...array2]
// - Copiar objetos: const copia = {...original}
// - Añadir propiedades a objetos: const nuevo = {...original, nuevaProp: valor}
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: Con spread vs Sin spread
// -------------------------------------------------------------------------
// ┌─────────────────────────────┬─────────────────────────────────────────┐
// │  CON spread (...)           │  SIN spread (forma antigua)             │
// ├─────────────────────────────┼─────────────────────────────────────────┤
// │  const copia = [...array]   │  const copia = array.slice()            │
// │  const copia = {...obj}     │  const copia = Object.assign({}, obj)   │
// │  const nuevo = {...obj,     │  const nuevo = Object.assign({}, obj,   │
// │      prop: valor}           │      { prop: valor })                   │
// └─────────────────────────────┴─────────────────────────────────────────┘
//
// -------------------------------------------------------------------------
// ¿POR QUÉ ES IMPORTANTE COPIAR (INMUTABILIDAD)?
// -------------------------------------------------------------------------
// Imagina que tienes una foto de un documento original.
// - Si modificas la FOTO, el original sigue intacto (COPIA = spread)
// - Si modificas el ORIGINAL directamente, lo pierdes para siempre (SIN spread)
//
// En programación, modificar datos originales causa bugs difíciles de encontrar.
// Por eso SIEMPRE copiamos antes de modificar.
//
// Analogía:
// - Spread = Fotocopiadora: haces una copia idéntica y trabajas sobre la copia
// - Sin spread = Trabajar sobre el original: si te equivocas, lo rompes

function agregarAlCarrito(idProducto) {
    // Buscamos el producto en el array original usando find()
    // find() devuelve el PRIMER elemento que cumpla la condición
    //
    // ¿CÓMO FUNCIONA find()?
    // Recorre el array uno por uno y se PARA en el primero que cumpla la condición.
    // Es como buscar un libro en una estantería: vas mirando uno por uno
    // y te paras en cuanto encuentras el que buscas.
    //
    // ¿QUÉ DEVUELVE SI NO ENCUENTRA NADA?
    // Devuelve undefined (que significa "no existe").
    const producto = productos.find((p) => p.id === idProducto);

    if (!producto) return; // Guard clause: si no existe, salimos
    // ¿QUÉ ES UN GUARD CLAUSE?
    // Es una comprobación al principio de la función que detecta casos inválidos
    // y sale inmediatamente. Es como un portero que mira tu entrada y si no es
    // válida, te dice "no puedes pasar" sin dejarte entrar al local.
    //
    // ¿POR QUÉ !producto?
    // El operador ! niega un valor. Si producto es undefined (falso),
    // !undefined es true, así que entramos en el if y hacemos return (salimos).

    // SPREAD: Creamos una COPIA del producto con una nueva propiedad 'cantidad'
    // Esto es importante: NO modificamos el objeto original del catálogo
    //
    // VISUALMENTE:
    // producto original:       { id: 1, nombre: "Auriculares", precio: 29.99 }
    //                                    │
    //                                    ▼  spread (...) copia todo
    // productoEnCarrito:       { id: 1, nombre: "Auriculares", precio: 29.99, cantidad: 1 }
    //                                                              ▲
    //                                                              └── nueva propiedad
    const productoEnCarrito = { ...producto, cantidad: 1 };
    // Equivalente sin spread:
    // const productoEnCarrito = Object.assign({}, producto, { cantidad: 1 });

    // Añadimos la copia al carrito
    // push() añade un elemento al FINAL del array
    // Es como poner un producto al final de la cinta del supermercado
    carrito.push(productoEnCarrito);

    // Actualizamos la vista
    // Cada vez que cambia el carrito, hay que "repintar" la pantalla
    // para que el usuario vea los cambios. Es como actualizar una pizarra
    // cada vez que alguien escribe algo nuevo.
    renderizarCarrito();
}

// -------------------------------------------------------------------------
// 7. MÉTODO FILTER() - Filtrar arrays
// -------------------------------------------------------------------------
// filter() crea un NUEVO array con solo los elementos que cumplan una condición.
// Sintaxis: array.filter((elemento) => condicionBooleana)
// Si la condición es true, el elemento se incluye; si es false, se descarta.
//
// -------------------------------------------------------------------------
// FLUJO VISUAL DE filter():
// -------------------------------------------------------------------------
// Array original:     [10€, 50€, 30€, 80€, 20€]
//                          │    │    │    │    │
// Condición: <= 40€       ✓    ✗    ✓    ✗    ✓
//                          │         │         │
// Array resultado:    [10€,       30€,       20€]
//
// Analogía:
// Imagina un portero de discoteca con una lista de invitados:
// - Mira cada persona (elemento del array)
// - Comprueba si cumple la condición (mayor de 18 años)
// - Si cumple (true) → entra (se incluye en el nuevo array)
// - Si no cumple (false) → se queda fuera (se descarta)
// - La lista original no cambia: las personas siguen existiendo fuera
//
// ¿QUÉ PASARÍA SI NINGUNO CUMPLE LA CONDICIÓN?
// filter() devuelve un array vacío []. No da error, simplemente no hay resultados.
// Es como si el portero no dejara pasar a nadie: la discoteca queda vacía.

function filtrarPorPrecio(precioMaximo) {
    // FILTER: Devuelve solo los productos cuyo precio sea <= precioMaximo
    //
    // EJEMPLO CON precioMaximo = 50:
    // productos = [{precio: 29.99}, {precio: 89.99}, {precio: 24.99}, ...]
    //                 29.99 <= 50 ✓    89.99 <= 50 ✗    24.99 <= 50 ✓
    // resultado = [{precio: 29.99}, {precio: 24.99}, ...]
    const productosFiltrados = productos.filter((producto) => producto.precio <= precioMaximo);
    
    // Renderizamos solo los productos filtrados
    // Llamamos a renderizarCatalogo con el array filtrado en vez del completo
    renderizarCatalogo(productosFiltrados);
}

// -------------------------------------------------------------------------
// 8. MÉTODO REDUCE() - Acumular valores
// -------------------------------------------------------------------------
// reduce() "reduce" todo el array a un solo valor (número, objeto, etc.).
// Es el método más potente y versátil de los tres.
// Sintaxis: array.reduce((acumulador, elemento) => { return nuevoAcumulador }, valorInicial)
//
// -------------------------------------------------------------------------
// FLUJO VISUAL DE reduce() (ejemplo: sumar precios):
// -------------------------------------------------------------------------
// Array:          [10€, 20€, 30€]     valorInicial = 0
//
// Iteración 1:    acumulador = 0,  elemento = 10€  →  return 0 + 10 = 10
// Iteración 2:    acumulador = 10, elemento = 20€  →  return 10 + 20 = 30
// Iteración 3:    acumulador = 30, elemento = 30€  →  return 30 + 30 = 60
//
// Resultado final: 60€
//
// -------------------------------------------------------------------------
// TABLA: ¿Qué significa cada parámetro de reduce()?
// -------------------------------------------------------------------------
// ┌────────────────┬──────────────────────────────────────────────────────┐
// │  Parámetro     │  ¿Qué es?                                            │
// ├────────────────┼──────────────────────────────────────────────────────┤
// │  acumulador    │  La "caja" donde vamos guardando el resultado        │
// │                │  parcial. En cada iteración tiene el valor de la     │
// │                │  iteración anterior.                                 │
// │  elemento      │  El elemento actual del array que estamos procesando │
// │  valorInicial  │  El valor con el que empieza el acumulador           │
// │                │  (normalmente 0 para sumas, [] para arrays, etc.)    │
// └────────────────┴──────────────────────────────────────────────────────┘
//
// Analogía:
// Imagina una hucha donde varios amigos meten dinero:
// - La hucha empieza vacía (valorInicial = 0)
// - Cada amigo mete su dinero (elemento)
// - El acumulador es el total que hay en la hucha en cada momento
// - Al final, reduce() te dice cuánto hay en total en la hucha
//
// ¿QUÉ PASARÍA SI NO PONEMOS VALOR INICIAL?
// El acumulador empieza con el PRIMER elemento del array.
// Esto puede causar bugs si el array está vacío (da error).
// Por eso SIEMPRE ponemos un valor inicial (0 para sumas).

function calcularTotal() {
    // REDUCE: Sumamos todos los precios del carrito
    // El acumulador empieza en 0 (segundo parámetro de reduce)
    const total = carrito.reduce((acumulador, producto) => {
        // En cada iteración, sumamos el precio del producto al acumulador
        return acumulador + producto.precio;
    }, 0); // 0 es el valor inicial del acumulador

    return total;
}

// -------------------------------------------------------------------------
// 9. RENDERIZAR CARRITO (Combinando todo lo aprendido)
// -------------------------------------------------------------------------
// Esta función combina map() y reduce() para:
// 1. Crear los elementos visuales del carrito (map)
// 2. Calcular el precio total (reduce)
//
// Es un ejemplo perfecto de cómo los métodos de array se combinan
// en aplicaciones reales. No se usan de forma aislada, sino juntos.
function renderizarCarrito() {
    listaCarrito.innerHTML = '';

    // MAP para crear los <li> del carrito
    //
    // ¿POR QUÉ USAMOS EL ÍNDICE (indice)?
    // Porque cada botón "Eliminar" necesita saber QUÉ producto eliminar.
    // El índice es la posición del producto en el array (0, 1, 2...).
    // Al hacer clic en "Eliminar", le pasamos ese índice a eliminarDelCarrito().
    //
    // map() puede recibir un segundo parámetro: el índice del elemento actual.
    // Sintaxis: array.map((elemento, indice) => { ... })
    const items = carrito.map((producto, indice) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${producto.nombre} - ${formatearPrecio(producto.precio)}€</span>
            <button onclick="eliminarDelCarrito(${indice})">Eliminar</button>
        `;
        return li;
    });

    // Inyectamos todos los items al DOM
    items.forEach((item) => listaCarrito.appendChild(item));

    // REDUCE para calcular y mostrar el total
    const total = calcularTotal();
    totalPrecio.textContent = formatearPrecio(total);
}

// -------------------------------------------------------------------------
// 10. ELIMINAR DEL CARRITO (Uso de splice y spread)
// -------------------------------------------------------------------------
// Para eliminar un producto del carrito:
// 1. Copiamos el carrito (spread) para no modificar el original directamente
// 2. Usamos splice() para eliminar el elemento en la posición indicada
// 3. Reemplazamos el carrito con la nueva copia
//
// -------------------------------------------------------------------------
// TABLA: splice() vs slice() - ¡No confundir!
// -------------------------------------------------------------------------
// ┌───────────┬──────────────────────────────┬────────────────────────────┐
// │  Método   │  ¿Qué hace?                  │  ¿Modifica el original?    │
// ├───────────┼──────────────────────────────┼────────────────────────────┤
// │  splice() │  Elimina/inserta elementos    │  SÍ, modifica el array   │
// │           │  en una posición concreta     │  original                │
// │  slice()  │  Extrae una porción del array │  NO, devuelve una copia  │
// │           │  sin modificar el original    │                          │
// └───────────┴──────────────────────────────┴────────────────────────────┘
//
// Analogía:
// - splice() = Quitar una página de un libro: el libro queda modificado
// - slice() = Fotocopiar unas páginas: el libro original sigue intacto

function eliminarDelCarrito(indice) {
    // Creamos una COPIA del carrito usando spread (inmutabilidad)
    // ¿POR QUÉ COPIAMOS? Porque splice() modifica el array, y queremos
    // mantener el principio de inmutabilidad (no tocar el original).
    const nuevoCarrito = [...carrito];
    
    // splice() modifica el array eliminando elementos
    // Primer parámetro: índice donde empezar
    // Segundo parámetro: cuántos elementos eliminar
    //
    // EJEMPLO:
    // nuevoCarrito = [A, B, C, D]
    // nuevoCarrito.splice(1, 1)  →  elimina 1 elemento desde la posición 1
    // nuevoCarrito = [A, C, D]   (B fue eliminado)
    //
    // ¿QUÉ PASARÍA SI USÁRAMOS splice(1, 2)?
    // Eliminaría 2 elementos: [A, D] (B y C eliminados)
    nuevoCarrito.splice(indice, 1);
    
    // Reemplazamos el carrito con la nueva copia
    // Aquí es donde realmente "actualizamos" el carrito.
    // La variable 'carrito' ahora apunta al nuevo array sin el producto eliminado.
    carrito = nuevoCarrito;
    
    renderizarCarrito();
}

// -------------------------------------------------------------------------
// 11. VACIAR CARRITO
// -------------------------------------------------------------------------
// Para vaciar el carrito, simplemente reasignamos la variable a un array vacío.
//
// ¿POR QUÉ NO USAMOS carrito.length = 0?
// Técnicamente funcionaría, pero reasignar a [] es más explícito y claro.
// Es como tirar la lista de la compra a la basura y coger un papel nuevo
// en vez de borrar cada línea del papel original.
function vaciarCarrito() {
    carrito = []; // Simplemente reasignamos a un array vacío
    renderizarCarrito();
}

// -------------------------------------------------------------------------
// 12. EVENT LISTENERS (Escuchadores de Eventos)
// -------------------------------------------------------------------------
// Un "event listener" es como un vigilante que espera a que algo ocurra
// (un clic, una tecla pulsada, etc.) y cuando ocurre, ejecuta una función.
//
// Sintaxis: elemento.addEventListener('tipoEvento', funcionAEjecutar)
//
// -------------------------------------------------------------------------
// TABLA: Tipos de eventos más comunes
// -------------------------------------------------------------------------
// ┌──────────────┬──────────────────────────────────────────────────────┐
// │  Evento      │  ¿Cuándo se dispara?                                 │
// ├──────────────┼──────────────────────────────────────────────────────┤
// │  'click'     │  Cuando el usuario hace clic en un elemento          │
// │  'input'     │  Cuando el valor de un input cambia (mientras        │
// │              │  el usuario escribe o mueve un slider)               │
// │  'change'    │  Cuando el valor cambia Y el usuario sale del campo  │
// │  'submit'    │  Cuando se envía un formulario                       │
// │  'keydown'   │  Cuando se pulsa una tecla                           │
// └──────────────┴──────────────────────────────────────────────────────┘
//
// Analogía:
// Un event listener es como poner una alarma en una puerta:
// - La alarma está siempre vigilando (el listener está siempre escuchando)
// - Cuando alguien abre la puerta (el evento ocurre)
// - La alarma suena (la función se ejecuta)

// Actualizar el valor del slider en tiempo real
// El evento 'input' se dispara CADA VEZ que el usuario mueve el slider
// (no solo cuando lo suelta, eso sería 'change').
precioMax.addEventListener('input', (e) => {
    // e.target es el elemento que disparó el evento (el slider)
    // e.target.value es el valor actual del slider
    precioValor.textContent = e.target.value;
});

// Botón filtrar
// Cuando el usuario hace clic en "Filtrar", leemos el valor del slider,
// lo convertimos a número (Number()) y llamamos a filtrarPorPrecio().
//
// ¿POR QUÉ Number()?
// Porque el valor del slider viene como STRING (texto), no como número.
// "50" (string) NO es lo mismo que 50 (número).
// Si no convertimos, las comparaciones de precio fallarían.
document.getElementById('btnFiltrar').addEventListener('click', () => {
    const precioMaximo = Number(precioMax.value);
    filtrarPorPrecio(precioMaximo);
});

// Botón mostrar todos
// Restaura el catálogo completo sin filtros
document.getElementById('btnMostrarTodos').addEventListener('click', () => {
    renderizarCatalogo(productos);
});

// Botón vaciar
// Cuando pasamos una función como referencia (sin paréntesis), se ejecuta
// cuando el evento ocurre. Escribir vaciarCarrito es lo mismo que
// escribir () => vaciarCarrito()
document.getElementById('btnVaciar').addEventListener('click', vaciarCarrito);

// -------------------------------------------------------------------------
// 13. INICIALIZACIÓN
// -------------------------------------------------------------------------
// Renderizamos el catálogo completo al cargar la página.
//
// ¿POR QUÉ HAY QUE LLAMAR A ESTA FUNCIÓN AL FINAL?
// Porque si no la llamamos, la página se mostraría vacía.
// El HTML solo tiene contenedores vacíos (<div id="catalogo"></div>).
// JavaScript es el que RELLENA esos contenedores con contenido dinámico.
//
// Esta línea es como "encender la luz" al abrir la tienda:
// sin ella, el usuario vería una página en blanco.
renderizarCatalogo(productos);

// -------------------------------------------------------------------------
// RESUMEN DE CONCEPTOS APRENDIDOS
// -------------------------------------------------------------------------
//
// ┌─────┬──────────────────────────┬────────────────────────────────────────┐
// │  #  │  Concepto                │  Idea clave                            │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  1  │  Arrow Functions         │  (params) => expresión                 │
// │     │                          │  Forma corta de escribir funciones     │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  2  │  map()                   │  Transforma cada elemento              │
// │     │                          │  Devuelve array del mismo tamaño       │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  3  │  filter()                │  Filtra según condición                │
// │     │                          │  Devuelve array igual o más pequeño    │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  4  │  reduce()                │  Acumula todo en un solo valor         │
// │     │                          │  Siempre poner valor inicial (0)       │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  5  │  find()                  │  Busca el PRIMERO que cumpla           │
// │     │                          │  Devuelve el elemento o undefined      │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  6  │  Spread (...)            │  Copia arrays/objetos                  │
// │     │                          │  No modifica los originales            │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  7  │  Template Literals (``)  │  Strings con ${variables} dentro       │
// │     │                          │  Más legible que concatenar con +      │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  8  │  const vs let            │  const = no cambia, let = sí cambia    │
// │     │                          │  var = ¡evitar! (antiguo y confuso)    │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │  9  │  Inmutabilidad           │  Nunca modificar datos originales      │
// │     │                          │  Siempre copiar antes de cambiar       │
// ├─────┼──────────────────────────┼────────────────────────────────────────┤
// │ 10  │  Event Listeners         │  addEventListener('evento', función)   │
// │     │                          │  Ejecuta código cuando algo ocurre     │
// └─────┴──────────────────────────┴────────────────────────────────────────┘
//
// CONSEJO FINAL:
// Cuando dudes entre map(), filter() o reduce(), pregúntate:
// - ¿Quiero TRANSFORMAR cada elemento? → map()
// - ¿Quiero SELECCIONAR algunos elementos? → filter()
// - ¿Quiero un SOLO VALOR a partir de todos? → reduce()
// -------------------------------------------------------------------------
