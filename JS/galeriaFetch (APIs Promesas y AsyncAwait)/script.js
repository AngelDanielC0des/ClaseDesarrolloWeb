// =========================================================================
// LECCIÓN: Consumo de APIs, Promesas y Async/Await
// =========================================================================
// Este ejercicio enseña cómo obtener datos de internet (APIs externas)
// usando fetch(), y cómo manejar la asincronía con Promises y async/await.
// Usaremos la PokeAPI (https://pokeapi.co/) que es gratuita y no requiere API key.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  ¿QUÉ VAMOS A CONSTRUIR?                                           │
// │  Una Pokédex (galería de Pokémon) que:                             │
// │    - Pide datos a internet (a un servidor remoto)                  │
// │    - Muestra tarjetas con imágenes y nombres                       │
// │    - Permite buscar, paginar y ver detalles                        │
// │    - Maneja errores (¿qué pasa si no hay internet?)               │
// └─────────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// 1. CONCEPTO: ¿Qué es una API?
// -------------------------------------------------------------------------
// API (Application Programming Interface) es un conjunto de URLs (endpoints)
// que un servidor expone para que otras aplicaciones puedan pedirle datos.
//
// ANALOGÍA DEL MUNDO REAL:
// Imagina un restaurante. Tú (el cliente) no puedes entrar a la cocina.
// El CAMARERO (la API) lleva tu pedido a la cocina (el servidor)
// y te trae la comida (los datos) de vuelta.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  TÚ (navegador)          API (camarero)         SERVIDOR (cocina)  │
// │                                                                    │
// │  "Quiero datos de     →  /api/v2/pokemon/1  →  Busca en la BD     │
// │   Pikachu"            ←  { name: "pikachu"} ←  Prepara los datos  │
// └─────────────────────────────────────────────────────────────────────┘
//
// Ejemplo real: https://pokeapi.co/api/v2/pokemon/1 devuelve los datos de Bulbasaur.
// El navegador hace una petición HTTP GET a esa URL y recibe un JSON.
//
// ¿QUÉ ES JSON?
// ┌─────────────────────────────────────────────────────────────────────┐
// │  JSON = formato de texto para intercambiar datos                   │
// │  Es como un "objeto JavaScript" pero en formato texto:             │
// │                                                                     │
// │  Objeto JS:    { nombre: "Pikachu", vida: 35 }                     │
// │  JSON:         '{"nombre": "Pikachu", "vida": 35}'                 │
// │                                                                     │
// │  La diferencia: JSON usa comillas en las claves y es solo texto.   │
// └─────────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// 2. CONCEPTO: ¿Qué es la Asincronía?
// -------------------------------------------------------------------------
// Cuando pedimos datos a un servidor, la respuesta NO es instantánea.
// Puede tardar 100ms, 2 segundos, o fallar. JavaScript NO se "pausa"
// mientras espera; sigue ejecutando código. Esto es la PROGRAMACIÓN ASÍNCRONA.
//
// ANALOGÍA: Imagina que pones la lavadora.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  SÍNCRONO (bloqueante) - NO es así como funciona JS               │
// │ ┌─────────────────────────────────────────────────────────────┐     │
// │ │ 1. Pones lavadora → 2. Te sientas a esperar 1 hora        │     │
// │ │ → 3. Tiendes la ropa → 4. AHORA puedes hacer otras cosas  │     │
// │ │ (Pierdes 1 hora sin hacer NADA)                            │     │
// │ └─────────────────────────────────────────────────────────────┘     │
// │                                                                     │
// │  ASÍNCRONO (no bloqueante) - ASÍ funciona JS                       │
// │ ┌─────────────────────────────────────────────────────────────┐     │
// │ │ 1. Pones lavadora → 2. Cocinas, estudias, ves la tele     │     │
// │ │ → 3. La lavadora avisa (¡bip bip!) → 4. Tiendes            │     │
// │ │ (Aprovechas el tiempo de espera para hacer OTRAS cosas)    │     │
// │ └─────────────────────────────────────────────────────────────┘     │
// └─────────────────────────────────────────────────────────────────────┘
//
// Para manejar esto usamos: Promesas y async/await.

// -------------------------------------------------------------------------
// 3. CONCEPTO: ¿Qué es una Promesa (Promise)?
// -------------------------------------------------------------------------
// Una Promesa es un objeto que representa el resultado FUTURO de una operación asíncrona.
//
// ANALOGÍA: Cuando compras online, te dan un NÚMERO DE SEGUIMIENTO.
// Ese número es una "promesa": el paquete llegará (o no).
//
// Puede estar en 3 estados:
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Estado         │  Significado         │  Analogía paquete         │
// ├─────────────────┼──────────────────────┼───────────────────────────┤
// │  PENDING        │  Pendiente           │  "En tránsito"            │
// │  (pendiente)    │  Aún no terminó      │  El paquete va en camión  │
// ├─────────────────┼──────────────────────┼───────────────────────────┤
// │  FULFILLED      │  Cumplida            │  "Entregado"              │
// │  (cumplida)     │  Terminó con éxito   │  ¡El paquete llegó bien!  │
// ├─────────────────┼──────────────────────┼───────────────────────────┤
// │  REJECTED       │  Rechazada           │  "Devuelto"               │
// │  (rechazada)    │  Falló               │  El paquete se perdió     │
// └─────────────────────────────────────────────────────────────────────┘
//
// La promesa empieza en PENDING y luego pasa a FULFILLED o REJECTED.
// Una vez que cambia, NO puede volver a cambiar (es definitiva).

// -------------------------------------------------------------------------
// 4. CONCEPTO: fetch() - La función nativa para hacer peticiones HTTP
// -------------------------------------------------------------------------
// fetch(url) hace una petición HTTP GET a la URL y devuelve una PROMESA.
//
// IMPORTANTE: fetch() NO devuelve los datos directamente.
// Devuelve un objeto "Response" que CONTIENE los datos, pero hay que extraerlos.
//
// FLUJO COMPLETO DE FETCH (paso a paso):
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │                                                                     │
// │  fetch(url)                                                         │
// │    │                                                                │
// │    ▼                                                                │
// │  ┌──────────────────┐                                               │
// │  │  PROMESA         │  ← Se resuelve cuando el servidor responde   │
// │  │  (pending...)    │                                               │
// │  └──────┬───────────┘                                               │
// │         ▼                                                           │
// │  ┌──────────────────┐                                               │
// │  │  Response        │  ← Contiene: status, headers, body...        │
// │  │  (la respuesta)  │    PERO el body aún está en formato texto    │
// │  └──────┬───────────┘                                               │
// │         ▼                                                           │
// │  response.json()     ← Convierte el body de texto a objeto JS      │
// │    │                   (esto TAMBIÉN es asíncrono, devuelve         │
// │    ▼                    otra Promesa)                               │
// │  ┌──────────────────┐                                               │
// │  │  DATOS (objeto)  │  ← ¡Ahora sí! Tenemos los datos en JS       │
// │  │  { name: "..."}  │                                               │
// │  └──────────────────┘                                               │
// │                                                                     │
// └─────────────────────────────────────────────────────────────────────┘
//
// ¿Por qué DOS pasos? Porque fetch() separa:
// 1. "¿Llegó la respuesta?" (fetch)
// 2. "¿Puedo leer el contenido?" (response.json())
// Así puedes comprobar si hubo error ANTES de intentar leer los datos.

// -------------------------------------------------------------------------
// 5. CONFIGURACIÓN Y ESTADO
// -------------------------------------------------------------------------
// Estas son CONSTANTES y VARIABLES que usaremos en todo el programa.
// Las constantes (const) NO cambian nunca. Las variables (let) sí.

const BASE_URL = 'https://pokeapi.co/api/v2';
const POKEMON_POR_PAGINA = 12;
let paginaActual = 1;
let totalPokemon = 0;

// REFERENCIAS AL DOM
// Guardamos las referencias a elementos HTML para no buscarlos cada vez.
// Es como tener un "acceso directo" en lugar de buscar el archivo cada vez.
// document.getElementById('xxx') busca en el HTML el elemento con id="xxx".
const galeriaGrid = document.getElementById('galeriaGrid');
const estadoCarga = document.getElementById('estadoCarga');
const estadoError = document.getElementById('estadoError');
const paginaActualSpan = document.getElementById('paginaActual');
const modalDetalle = document.getElementById('modalDetalle');
const detalleContenido = document.getElementById('detalleContenido');

// -------------------------------------------------------------------------
// 6. ASYNC/AWAIT - La forma moderna de manejar asincronía
// -------------------------------------------------------------------------
// async/await es "azúcar sintáctico" sobre Promesas que hace el código
// asíncrono parecer síncrono (más legible).
//
// ANALOGÍA DE LA CAFETERÍA:
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  SIN async/await (cadenas de .then - como dar instrucciones        │
// │  por teléfono):                                                     │
// │ ┌─────────────────────────────────────────────────────────────┐     │
// │ │  fetch(url)                                                 │     │
// │ │    .then(response => response.json())   ← "Cuando llegues, │     │
// │ │    .then(data => hacerAlgo(data))          haz esto, luego  │     │
// │ │    .catch(error => manejarError(error))    esto otro..."    │     │
// │ │                                                             │     │
// │ │  Problema: Se enreda fácil con muchas operaciones seguidas  │     │
// │ └─────────────────────────────────────────────────────────────┘     │
// │                                                                     │
// │  CON async/await (como estar TÚ en la cafetería):                  │
// │ ┌─────────────────────────────────────────────────────────────┐     │
// │ │  const response = await fetch(url);    ← "Espera aquí"     │     │
// │ │  const data = await response.json();   ← "Ahora esto"      │     │
// │ │  hacerAlgo(data);                      ← "Y ahora esto"    │     │
// │ │                                                             │     │
// │ │  Ventaja: Se lee de arriba a abajo, como código normal      │     │
// │ └─────────────────────────────────────────────────────────────┘     │
// └─────────────────────────────────────────────────────────────────────┘
//
// REGLAS IMPORTANTES:
// - 'async': Se pone antes de 'function' para indicar que es asíncrona.
//            Siempre devuelve una Promesa.
// - 'await': Se pone antes de una Promesa para "esperar" su resultado.
//            SOLO se puede usar dentro de una función async.
//            Si lo usas fuera, da error de sintaxis.

async function obtenerListaPokemon(offset, limit) {
    // CONSTRUCCIÓN DE LA URL CON PARÁMETROS
    // Usamos TEMPLATE LITERALS (comillas invertidas ``) para insertar variables.
    // ${variable} se reemplaza por el valor de la variable.
    //
    // offset: desde qué Pokémon empezar (como "saltarse los primeros N")
    // limit: cuántos Pokémon traer (como "dame solo N resultados")
    //
    // Ejemplo: offset=0, limit=12 → primeros 12 Pokémon
    //          offset=12, limit=12 → Pokémon del 13 al 24
    const url = `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`;
    
    console.log(`📡 Fetching: ${url}`);

    // FETCH: Hace la petición HTTP y devuelve una Promesa.
    // 'await' "pausa" ESTA función (no todo el programa) hasta que
    // la promesa se resuelva. El navegador puede seguir haciendo otras cosas.
    const response = await fetch(url);
    
    // VERIFICACIÓN: response.ok es true si el status HTTP es 200-299 (éxito).
    //
    // CÓDIGOS HTTP MÁS COMUNES:
    // ┌────────┬──────────────────┬──────────────────────────────────┐
    // │ Código │ Significado      │ Ejemplo                          │
    // ├────────┼──────────────────┼──────────────────────────────────┤
    // │  200   │ OK (éxito)       │ Datos encontrados correctamente  │
    // │  404   │ Not Found        │ Pokémon no existe                │
    // │  500   │ Server Error     │ El servidor tiene un problema    │
    // └────────┴──────────────────┴──────────────────────────────────┘
    //
    // ¿Por qué comprobamos? Porque fetch() NO lanza error con 404.
    // fetch() solo falla si no hay conexión a internet.
    // Un 404 es una "respuesta válida" para fetch, aunque sea un error.
    if (!response.ok) {
        // 'throw new Error()' lanza un error que será capturado por try/catch.
        // Es como gritar "¡ALTO! ¡Algo salió mal!" para que el catch lo atrape.
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    
    // response.json() también es asíncrono: convierte el texto JSON
    // de la respuesta en un objeto JavaScript que podemos usar.
    // Sin esto, tendríamos un string de texto, no un objeto.
    const data = await response.json();
    
    // data tiene la forma: { count: 1302, next: "...", previous: "...", results: [...] }
    // - count: total de Pokémon disponibles
    // - next: URL de la siguiente página (o null si no hay)
    // - previous: URL de la página anterior (o null si es la primera)
    // - results: array con { name: "bulbasaur", url: "..." }
    return data;
}

// -------------------------------------------------------------------------
// 7. TRY/CATCH - Manejo de errores en código asíncrono
// -------------------------------------------------------------------------
// try/catch permite capturar errores sin que la app se rompa.
//
// ANALOGÍA: Es como llevar un paraguas cuando sales.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  SIN try/catch:                                                     │
// │ ┌─────────────────────────────────────────────────────────────┐     │
// │ │  Sales sin paraguas → Llueve → Te mojas → Te enfermas     │     │
// │ │  (El error se propaga y ROMPE toda la aplicación)           │     │
// │ └─────────────────────────────────────────────────────────────┘     │
// │                                                                     │
// │  CON try/catch:                                                     │
// │ ┌─────────────────────────────────────────────────────────────┐     │
// │ │  Sales con paraguas → Llueve → Abres paraguas → Sigues    │     │
// │ │  (El error se ATRAPA y la aplicación continúa)              │     │
// │ └─────────────────────────────────────────────────────────────┘     │
// └─────────────────────────────────────────────────────────────────────┘
//
// FLUJO:
//   try   → "Intenta ejecutar este código"
//   catch → "Si algo falla, ejecuta ESTO en vez de romper todo"

async function cargarPagina(pagina) {
    try {
        // A) MOSTRAR LOADING: enseñamos el spinner de "cargando..."
        // para que el usuario sepa que está pasando algo.
        mostrarEstado('cargando');
        
        // B) CALCULAR OFFSET: ¿desde qué Pokémon empezar?
        // Fórmula: (página - 1) × cantidad por página
        // Ejemplo: página 3, 12 por página → (3-1)*12 = 24 → empieza en el Pokémon 25
        const offset = (pagina - 1) * POKEMON_POR_PAGINA;
        
        // C) OBTENER LISTA: pedimos la lista de Pokémon a la API.
        // await espera a que termine antes de seguir a la siguiente línea.
        const data = await obtenerListaPokemon(offset, POKEMON_POR_PAGINA);
        
        // D) ACTUALIZAR ESTADO: guardamos los datos de paginación
        totalPokemon = data.count;
        paginaActual = pagina;
        actualizarPaginacion();
        
        // E) OBTENER DETALLES DE CADA POKEMON
        // data.results es un array de objetos { name: "bulbasaur", url: "..." }
        // Pero solo tiene nombre y URL, NO tiene imagen ni stats.
        // Necesitamos hacer fetch a cada URL para obtener los detalles completos.
        
        // PROMISE.ALL() - Ejecuta MÚLTIPLES promesas EN PARALELO
        //
        // ANALOGÍA: Imagina que necesitas pedir 12 pizzas a distintas pizzerías.
        //
        // ┌─────────────────────────────────────────────────────────────┐
        // │  SIN Promise.all() (secuencial - LENTO):                   │
        // │  Pedir pizza 1 → esperar → Pedir pizza 2 → esperar → ...   │
        // │  Tiempo total: 12 × 30 min = 360 min (¡6 horas!)           │
        // │                                                             │
        // │  CON Promise.all() (paralelo - RÁPIDO):                    │
        // │  Pedir las 12 pizzas a la vez → esperar a que lleguen      │
        // │  Tiempo total: ~30 min (la más lenta)                      │
        // └─────────────────────────────────────────────────────────────┘
        //
        // .map() crea un array de promesas (una por cada Pokémon).
        // Cada promesa hace fetch a la URL del Pokémon y parsea su JSON.
        const detallesPromises = data.results.map(pokemon => 
            fetch(pokemon.url).then(response => response.json())
        );
        
        // Esperamos a que TODAS las promesas se resuelvan.
        // El resultado es un array con los detalles de cada Pokémon.
        // Si UNA falla, Promise.all() rechaza todo (falla rápido).
        const pokemonDetalles = await Promise.all(detallesPromises);
        
        // F) RENDERIZAR: pintar las tarjetas en pantalla
        renderizarGaleria(pokemonDetalles);
        mostrarEstado('exito');
        
    } catch (error) {
        // Si CUALQUIER línea del try lanza un error, salta aquí.
        // El programa NO se rompe, simplemente mostramos el mensaje de error.
        console.error('❌ Error al cargar Pokémon:', error);
        mostrarEstado('error');
    }
}

// -------------------------------------------------------------------------
// 8. FUNCIÓN: Buscar Pokémon por nombre o ID
// -------------------------------------------------------------------------
// Esta función permite buscar un Pokémon específico.
// A diferencia de cargarPagina(), aquí solo buscamos UNO, no una lista.

async function buscarPokemon(query) {
    try {
        mostrarEstado('cargando');
        
        // .toLowerCase() convierte a minúsculas: "Pikachu" → "pikachu"
        // .trim() quita espacios al inicio y final: "  pikachu  " → "pikachu"
        // ¿Por qué? Porque la API espera el nombre en minúsculas y sin espacios.
        const busqueda = query.toLowerCase().trim();
        
        // Si la búsqueda está vacía (el usuario borró todo),
        // volvemos a cargar la página 1 en vez de buscar nada.
        if (!busqueda) {
            cargarPagina(1);
            return;
        }
        
        // La PokeAPI permite buscar por nombre o ID directamente.
        // Ejemplo: /pokemon/pikachu o /pokemon/25
        const url = `${BASE_URL}/pokemon/${busqueda}`;
        const response = await fetch(url);
        
        // Si el Pokémon no existe, la API devuelve 404.
        // Como fetch() no lanza error con 404, lo comprobamos nosotros.
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        
        const pokemon = await response.json();
        
        // Renderizamos solo uno (lo metemos en un array [] porque
        // renderizarGaleria espera un array).
        renderizarGaleria([pokemon]);
        mostrarEstado('exito');
        
    } catch (error) {
        console.error('❌ Error en búsqueda:', error);
        mostrarEstado('error');
    }
}

// -------------------------------------------------------------------------
// 9. FUNCIÓN: Obtener y mostrar detalle de un Pokémon
// -------------------------------------------------------------------------
// Se ejecuta cuando el usuario hace CLICK en una tarjeta de la galería.
// Carga los datos completos del Pokémon y los muestra en un modal (ventana emergente).

async function mostrarDetalle(id) {
    try {
        const url = `${BASE_URL}/pokemon/${id}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el detalle');
        }
        
        const pokemon = await response.json();
        renderizarDetalle(pokemon);
        
    } catch (error) {
        console.error('❌ Error al cargar detalle:', error);
    }
}

// -------------------------------------------------------------------------
// 10. FUNCIONES DE RENDERIZADO
// -------------------------------------------------------------------------
// "Renderizar" = pintar/dibujar elementos en la pantalla (en el HTML).
// Estas funciones reciben DATOS y los convierten en ELEMENTOS VISUALES.

function renderizarGaleria(pokemonList) {
    // .innerHTML = '' vacía el contenedor (borra las tarjetas anteriores).
    // Si no lo hiciéramos, las nuevas tarjetas se añadirían a las viejas.
    galeriaGrid.innerHTML = '';
    
    // .map() recorre el array y CREA UNO NUEVO con las tarjetas.
    // Es como una cadena de montaje: entra un Pokémon, sale una tarjeta.
    const tarjetas = pokemonList.map(pokemon => {
        // Creamos un nuevo elemento <div> (aún no está en la pantalla)
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        
        // OPTIONAL CHAINING (?.) - Acceso seguro a propiedades
        //
        // ¿Qué problema resuelve?
        // ┌─────────────────────────────────────────────────────────────┐
        // │  SIN optional chaining (PELIGROSO):                        │
        // │  pokemon.sprites.front_default                              │
        // │  → Si sprites es undefined: ¡ERROR! La app se rompe       │
        // │                                                             │
        // │  CON optional chaining (SEGURO):                           │
        // │  pokemon.sprites?.front_default                             │
        // │  → Si sprites es undefined: devuelve undefined (sin error) │
        // │  → El ?. es como preguntar "¿existe esto?" antes de entrar │
        // └─────────────────────────────────────────────────────────────┘
        //
        // El operador || (OR) da un valor de respaldo si lo anterior es undefined.
        // Intenta: 1º front_default → 2º official-artwork → 3º imagen placeholder
        const imagenUrl = pokemon.sprites?.front_default 
            || pokemon.sprites?.other?.['official-artwork']?.front_default 
            || 'https://via.placeholder.com/100?text=?';
        
        // TEMPLATE LITERAL: usamos backticks `` para crear HTML con variables.
        // ${variable} se reemplaza por el valor de la variable.
        // String(pokemon.id).padStart(3, '0') → rellena con ceros: 1 → "001"
        card.innerHTML = `
            <img src="${imagenUrl}" alt="${pokemon.name}">
            <h3>${pokemon.name}</h3>
            <p class="id">#${String(pokemon.id).padStart(3, '0')}</p>
        `;
        
        // Añadimos un event listener: cuando se haga click en la tarjeta,
        // se llamará a mostrarDetalle() con el ID de ese Pokémon.
        card.addEventListener('click', () => mostrarDetalle(pokemon.id));
        
        return card;
    });
    
    // .forEach() recorre las tarjetas y las AÑADE al contenedor del HTML.
    // .appendChild() mete el elemento dentro del contenedor (lo hace "hijo" suyo).
    tarjetas.forEach(card => galeriaGrid.appendChild(card));
}

function renderizarDetalle(pokemon) {
    // Igual que antes: buscamos la mejor imagen disponible con optional chaining.
    const imagenUrl = pokemon.sprites?.other?.['official-artwork']?.front_default 
        || pokemon.sprites?.front_default 
        || 'https://via.placeholder.com/150?text=?';
    
    // DESTRUCTURING: Extraemos propiedades de un objeto en variables individuales.
    //
    // ┌─────────────────────────────────────────────────────────────────┐
    // │  SIN destructuring:                                             │
    // │  const name = pokemon.name;                                     │
    // │  const id = pokemon.id;                                         │
    // │  const height = pokemon.height;                                 │
    // │  ... (muchas líneas repetitivas)                                │
    // │                                                                 │
    // │  CON destructuring:                                             │
    // │  const { name, id, height, weight, types, stats } = pokemon;   │
    // │  (una sola línea, mucho más limpio)                             │
    // └─────────────────────────────────────────────────────────────────┘
    const { name, id, height, weight, types, stats } = pokemon;
    
    // .map() + .join('') = crea un string HTML con todos los tipos.
    // .join('') une los elementos del array sin separador (los pega).
    const tiposHTML = types.map(t => 
        `<span class="tipo tipo-${t.type.name}">${t.type.name}</span>`
    ).join('');
    
    // Lo mismo para las estadísticas (HP, Attack, Defense, etc.)
    const statsHTML = stats.map(s => `
        <div class="info-item">
            <label>${s.stat.name}</label>
            <span>${s.base_stat}</span>
        </div>
    `).join('');
    
    // Inyectamos todo el HTML en el contenedor del modal.
    // La altura y peso vienen en decímetros y hectogramos,
    // por eso dividimos entre 10 para obtener metros y kilogramos.
    // .toFixed(1) redondea a 1 decimal: 7.34 → "7.3"
    detalleContenido.innerHTML = `
        <div class="detalle-pokemon">
            <img src="${imagenUrl}" alt="${name}">
            <h2>${name}</h2>
            <p class="id">#${String(id).padStart(3, '0')}</p>
            <div class="tipos">${tiposHTML}</div>
            
            <div class="detalle-info">
                <div class="info-item">
                    <label>Altura</label>
                    <span>${(height / 10).toFixed(1)} m</span>
                </div>
                <div class="info-item">
                    <label>Peso</label>
                    <span>${(weight / 10).toFixed(1)} kg</span>
                </div>
                ${statsHTML}
            </div>
        </div>
    `;
    
    // .classList.remove('hidden') quita la clase CSS "hidden",
    // haciendo que el modal se muestre (estaba oculto con display:none).
    modalDetalle.classList.remove('hidden');
}

// -------------------------------------------------------------------------
// 11. FUNCIONES AUXILIARES
// -------------------------------------------------------------------------
// Funciones "de apoyo" que realizan tareas pequeñas y reutilizables.

function mostrarEstado(estado) {
    // Primero ocultamos TODO (añadimos la clase 'hidden' a todos).
    // Así nos aseguramos de que solo se ve uno a la vez.
    estadoCarga.classList.add('hidden');
    estadoError.classList.add('hidden');
    galeriaGrid.classList.add('hidden');
    
    // Luego mostramos solo el que corresponda según el estado.
    // switch es como un if/else if pero más limpio cuando comparamos
    // una sola variable contra varios valores posibles.
    switch (estado) {
        case 'cargando':
            estadoCarga.classList.remove('hidden');
            break;
        case 'error':
            estadoError.classList.remove('hidden');
            break;
        case 'exito':
            galeriaGrid.classList.remove('hidden');
            break;
    }
}

function actualizarPaginacion() {
    // Math.ceil() redondea HACIA ARRIBA: 5.1 → 6, 5.9 → 6, 5.0 → 5
    // Lo usamos porque si hay 130 Pokémon y caben 12 por página,
    // necesitamos 11 páginas (no 10.83).
    const totalPaginas = Math.ceil(totalPokemon / POKEMON_POR_PAGINA);
    paginaActualSpan.textContent = `Página ${paginaActual} de ${totalPaginas}`;
}

function pokemonAleatorio() {
    // Math.random() genera un número decimal entre 0 y 1 (ej: 0.7342).
    // Math.floor() redondea HACIA ABAJO: 7.9 → 7.
    // La fórmula: Math.floor(Math.random() * MAX) + MIN
    // genera un entero aleatorio entre MIN y MAX.
    const idAleatorio = Math.floor(Math.random() * 10000) + 1;
    buscarPokemon(String(idAleatorio));
}

// -------------------------------------------------------------------------
// 12. EVENT LISTENERS (Escuchadores de eventos)
// -------------------------------------------------------------------------
// Un "event listener" es una función que se ejecuta cuando el usuario
// hace algo: clicar un botón, pulsar una tecla, mover el ratón, etc.
//
// addEventListener('evento', función) conecta una acción del usuario
// con una función de nuestro código.

// Botón "Buscar": al hacer click, lee el texto del input y busca.
document.getElementById('btnBuscar').addEventListener('click', () => {
    const query = document.getElementById('inputBusqueda').value;
    buscarPokemon(query);
});

// Input de búsqueda: al pulsar Enter, busca (para no tener que clicar el botón).
// e.key contiene la tecla pulsada. e.target es el elemento donde se pulsó.
document.getElementById('inputBusqueda').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        buscarPokemon(e.target.value);
    }
});

// Botón "Pokémon aleatorio": al hacer click, busca un Pokémon random.
document.getElementById('btnAleatorio').addEventListener('click', pokemonAleatorio);

// Botón "Anterior": retrocede una página (si no estamos ya en la primera).
document.getElementById('btnAnterior').addEventListener('click', () => {
    if (paginaActual > 1) {
        cargarPagina(paginaActual - 1);
    }
});

// Botón "Siguiente": avanza una página.
document.getElementById('btnSiguiente').addEventListener('click', () => {
    cargarPagina(paginaActual + 1);
});

// Botón "Cerrar" del modal: añade la clase 'hidden' para ocultarlo.
document.getElementById('btnCerrar').addEventListener('click', () => {
    modalDetalle.classList.add('hidden');
});

// Click en el FONDO del modal (fuera del contenido): también lo cierra.
// e.target === modalDetalle comprueba que el click fue en el fondo,
// no en el contenido del modal (no queremos cerrar si clican dentro).
modalDetalle.addEventListener('click', (e) => {
    if (e.target === modalDetalle) {
        modalDetalle.classList.add('hidden');
    }
});

// -------------------------------------------------------------------------
// 13. INICIALIZACIÓN
// -------------------------------------------------------------------------
// Esta línea se ejecuta cuando el navegador termina de cargar el script.
// Carga la primera página de Pokémon para que el usuario vea algo de inmediato.
cargarPagina(1);

// =========================================================================
// RESUMEN DE CONCEPTOS APRENDIDOS
// =========================================================================
//
// ┌─────┬───────────────────┬────────────────────────────────────────────┐
// │  #  │ Concepto          │ En una frase                               │
// ├─────┼───────────────────┼────────────────────────────────────────────┤
// │  1  │ API               │ URLs que devuelven datos (normalmente JSON)│
// │  2  │ Asincronía        │ Operaciones que NO bloquean el programa    │
// │  3  │ Promesa           │ Objeto que representa un resultado futuro  │
// │  4  │ fetch(url)        │ Función nativa para peticiones HTTP        │
// │  5  │ async             │ Marca una función como asíncrona           │
// │  6  │ await             │ Espera a que una Promesa se resuelva       │
// │  7  │ try/catch         │ Captura errores sin romper la app          │
// │  8  │ Promise.all()     │ Ejecuta múltiples promesas en paralelo     │
// │  9  │ response.ok       │ Verifica si la respuesta HTTP fue exitosa  │
// │ 10  │ response.json()   │ Parsea el cuerpo JSON (también asíncrono)  │
// │ 11  │ Optional chain ?. │ Accede a propiedades sin riesgo de error   │
// │ 12  │ Destructuring     │ Extrae propiedades de objetos en variables │
// │ 13  │ Template literals │ Strings con variables usando backticks ``  │
// │ 14  │ Event listeners   │ Funciones que responden a acciones del user│
// └─────┴───────────────────┴────────────────────────────────────────────┘
//
// FLUJO COMPLETO DE ESTA APP:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  Usuario hace click → Event listener → Función async →             │
// │  → fetch(url) → await response → await .json() →                   │
// │  → Datos → Renderizar → Usuario ve tarjetas                        │
// │                                                                     │
// │  Si algo falla en cualquier paso → catch → Mostrar error           │
// └─────────────────────────────────────────────────────────────────────┘
// =========================================================================
