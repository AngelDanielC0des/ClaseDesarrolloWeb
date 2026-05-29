// =========================================================================
// LECCIÓN: LocalStorage, SessionStorage, JSON y setInterval
// =========================================================================
// Este ejercicio enseña cómo guardar datos en el navegador para que persistan
// aunque el usuario cierre y vuelva a abrir la página. También aprenderemos
// a usar setInterval() para ejecutar código periódicamente.
//
// Analogía general:
// Imagina que esta app es una LISTA DE TAREAS en papel.
// - Sin localStorage: cada vez que cierras la app, tiras el papel a la basura.
// - Con localStorage: guardas el papel en un cajón, y al volver, lo sacas.
//
// ¿Qué vamos a construir?
// Una app de tareas (to-do list) que:
//   1. Guarda las tareas en el navegador (localStorage)
//   2. Recuerda el filtro seleccionado (sessionStorage)
//   3. Se auto-guarda cada 5 segundos (setInterval)

// -------------------------------------------------------------------------
// 1. CONCEPTO: Web Storage API (Almacenamiento en el navegador)
// -------------------------------------------------------------------------
// El navegador ofrece dos mecanismos para guardar datos localmente.
// "Localmente" significa: en TU ordenador, dentro del navegador.
// NO se envía a ningún servidor. Si borras los datos del navegador, se pierden.
//
// ┌───────────────────┬───────────────────────┬─────────────────────────┐
// │   Característica  │   localStorage        │   sessionStorage        │
// ├───────────────────┼───────────────────────┼─────────────────────────┤
// │   Duración        │   Para siempre        │   Hasta cerrar pestaña  │
// │                   │   (hasta borrar)      │                         │
// ├───────────────────┼───────────────────────┼─────────────────────────┤
// │   Compartido      │   Sí (todas las       │   No (solo esta         │
// │                   │   pestañas del mismo  │   pestaña)              │
// │                   │   origen)             │                         │
// ├───────────────────┼───────────────────────┼─────────────────────────┤
// │   Capacidad       │   ~5-10 MB            │   ~5-10 MB              │
// ├───────────────────┼───────────────────────┼─────────────────────────┤
// │   Uso típico      │   Preferencias,       │   Filtros temporales,   │
// │                   │   carrito, login      │   borradores            │
// ├───────────────────┼───────────────────────┼─────────────────────────┤
// │   ¿Sobrevive al   │   SÍ                  │   NO                    │
// │   cerrar navegador│                       │                         │
// └───────────────────┴───────────────────────┴─────────────────────────┘
//
// Analogía del mundo real:
// - localStorage  = Un ARMARIO en tu casa: lo que guardas ahí sigue ahí
//                   mañana, la semana que viene, el año que viene.
//                   Solo desaparece si TÚ lo tiras.
// - sessionStorage = Una PIZARRA en la oficina: escribes cosas mientras
//                   estás ahí, pero cuando te vas (cierras la pestaña),
//                   alguien la borra. Mañana empiezas de cero.
//
// ¿Qué pasaría si NO usáramos storage?
// → Cada vez que el usuario recarga la página, perdería todas sus tareas.
//   Sería como escribir en un papel y tirarlo cada 5 minutos.

// -------------------------------------------------------------------------
// 2. CONCEPTO: JSON (JavaScript Object Notation)
// -------------------------------------------------------------------------
// localStorage SOLO guarda strings (texto). No sabe guardar objetos ni arrays.
// Si intentas guardar un objeto directamente, se convierte en "[object Object]"
// (un texto inútil que no sirve para nada).
//
// Para solucionar esto, usamos JSON como "traductor":
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │                 FLUJO DE DATOS CON JSON                              │
// ├──────────────────────────────────────────────────────────────────────┤
// │                                                                      │
// │   GUARDAR:                                                           │
// │   Objeto JavaScript ──→ JSON.stringify() ──→ String ──→ localStorage│
// │   {id:1, texto:"Hola"}    '[{"id":1,...}]    texto plano  guardado  │
// │                                                                      │
// │   LEER:                                                              │
// │   localStorage ──→ String ──→ JSON.parse() ──→ Objeto JavaScript    │
// │   texto plano      '[{"id":1,...}]    {id:1, texto:"Hola"}  listo!  │
// │                                                                      │
// └──────────────────────────────────────────────────────────────────────┘
//
// Analogía:
// Imagina que quieres enviar un MUEBLE por correo. No puedes enviar el
// mueble montado, así que:
//   1. Lo DESMONTAS en piezas planas (JSON.stringify) → caja plana
//   2. Lo envías por correo (localStorage.setItem)
//   3. El destinatario lo MONTA de nuevo (JSON.parse) → mueble listo
//
// JSON.stringify(objeto) → Convierte objeto/array a string JSON
// JSON.parse(string)     → Convierte string JSON a objeto/array
//
// ¿Qué pasaría si guardáramos un objeto SIN stringify?
//   localStorage.setItem('tareas', [{id:1}]);
//   → Se guarda como "[object Object]" (texto inútil)
//   → Al leerlo con getItem, NO podríamos recuperar el objeto
//
// ¿Qué pasaría si leyéramos SIN parse?
//   const datos = localStorage.getItem('tareas');
//   → Obtendríamos un string, no un array. No podríamos hacer datos.push()

// -------------------------------------------------------------------------
// 3. CONFIGURACIÓN Y ESTADO
// -------------------------------------------------------------------------
// Usamos CONSTANTES (const) para valores que NUNCA cambian durante la
// ejecución del programa. Es una buena práctica porque:
//   1. Evita que accidentalmente cambiemos un valor importante
//   2. Deja claro a otros programadores que este valor es fijo
//   3. Si usamos el mismo texto en varios sitios, solo lo cambiamos aquí

const CLAVE_STORAGE = 'tareas_app';       // La "etiqueta" con la que guardamos las tareas
const CLAVE_FILTRO = 'filtro_activo';     // La "etiqueta" para el filtro seleccionado
const INTERVALO_GUARDADO = 5000;          // 5 segundos en milisegundos
                                           // (JavaScript mide el tiempo en milisegundos:
                                           //  1 segundo = 1000 milisegundos)

// Usamos LET para variables que SÍ van a cambiar su valor durante la ejecución.
let tareas = [];                    // Array que contendrá todas las tareas (empieza vacío)
let filtroActual = 'todas';         // Qué filtro está activo: 'todas', 'pendientes' o 'completadas'
let hayCambiosSinGuardar = false;   // "Bandera" (flag): nos avisa si hay datos nuevos
                                     // que aún no se han guardado en localStorage.
                                     // Es como una luz roja: si está en true, hay que guardar.

// -------------------------------------------------------------------------
// REFERENCIAS AL DOM
// -------------------------------------------------------------------------
// Aquí guardamos referencias a los elementos HTML que vamos a usar.
// Es como "buscar" los elementos una sola vez y guardarlos en variables
// para no tener que buscarlos cada vez que los necesitemos.
//
// document.getElementById('x') busca en el HTML un elemento con id="x".
// Si NO lo encuentra, devuelve null (y todo lo que hagamos con él dará error).
//
// Analogía: Es como buscar un libro en la biblioteca UNA VEZ,
// marcarlo con un post-it, y ya sabes dónde está para siempre.

const inputTarea = document.getElementById('inputTarea');
const selectPrioridad = document.getElementById('selectPrioridad');
const listaTareas = document.getElementById('listaTareas');
const contadorTotal = document.getElementById('contadorTotal');
const contadorPendientes = document.getElementById('contadorPendientes');
const contadorCompletadas = document.getElementById('contadorCompletadas');
const tamanoStorage = document.getElementById('tamanoStorage');
const ultimoGuardado = document.getElementById('ultimoGuardado');
const filtroGuardado = document.getElementById('filtroGuardado');
const indicadorGuardado = document.getElementById('indicadorGuardado');

// -------------------------------------------------------------------------
// 4. FUNCIONES DE LOCALSTORAGE
// -------------------------------------------------------------------------

// -------------------------------------------------------------------------
// FUNCIÓN: guardarTareas()
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Convierte nuestro array de tareas a texto (JSON) y lo
//              guarda en localStorage para que no se pierda.
// ¿POR QUÉ?    Porque si no guardamos, al recargar la página perdemos todo.
// ¿CUÁNDO?     Cada vez que creamos, borramos o modificamos una tarea.
//
// Usamos try/catch para manejar errores:
// ┌──────────────────────────────────────────────────────────────────────┐
// │   try { ... }    → "Intenta hacer esto"                             │
// │   catch(e) { ... } → "Si algo falla, haz esto otro en vez de       │
// │                       que la app se rompa"                          │
// └──────────────────────────────────────────────────────────────────────┘
// Analogía: Es como llevar un vaso de cristal con una bandeja (try).
// Si se cae (error), la bandeja lo atrapa (catch) y no se rompe en mil
// pedazos por el suelo.

function guardarTareas() {
    try {
        // PASO 1: Convertir el array de objetos a un string JSON.
        // JSON.stringify toma nuestro array de objetos JavaScript y lo
        // "aplasta" convirtiéndolo en un texto con formato JSON.
        // Ejemplo: [{id:1, texto:"Hola"}] → '[{"id":1,"texto":"Hola"}]'
        // Sin este paso, localStorage guardaría "[object Object]" (inútil).
        const jsonString = JSON.stringify(tareas);
        
        // PASO 2: Guardar el string en localStorage.
        // setItem(clave, valor) → guarda el valor asociado a la clave.
        // Si la clave ya existe, SOBRESCRIBE el valor anterior.
        // Es como un diccionario: cada clave tiene un único valor.
        localStorage.setItem(CLAVE_STORAGE, jsonString);
        
        // PASO 3: Actualizar el estado de la interfaz.
        hayCambiosSinGuardar = false;   // Ya guardamos, apagamos la "luz roja"
        actualizarInfoStorage();         // Mostramos cuánto espacio usamos
        mostrarIndicadorGuardado();      // Mostramos animación de "guardado"
        
        console.log('💾 Tareas guardadas en localStorage');
        
    } catch (error) {
        // Esto se ejecuta SOLO si algo falló dentro del try.
        // Puede fallar si el storage está lleno (~5MB máximo).
        // En vez de que la app se rompa, mostramos un mensaje al usuario.
        console.error('Error al guardar:', error);
        alert('Error: No se pudieron guardar las tareas. Almacenamiento lleno.');
    }
}

// -------------------------------------------------------------------------
// FUNCIÓN: cargarTareas()
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Lee las tareas guardadas en localStorage y las convierte
//              de vuelta a un array de objetos JavaScript.
// ¿POR QUÉ?    Para que al abrir la página, las tareas que el usuario
//              creó ayer sigan ahí hoy.
// ¿CUÁNDO?    Una sola vez, al cargar la página (en la inicialización).
//
// Es el proceso INVERSO a guardarTareas():
//   Guardar: Array → JSON.stringify → String → localStorage
//   Cargar:  localStorage → String → JSON.parse → Array

function cargarTareas() {
    try {
        // PASO 1: Leer el string guardado en localStorage.
        // getItem(clave) devuelve el string asociado a esa clave,
        // o NULL si la clave no existe (nunca se guardó nada).
        const jsonString = localStorage.getItem(CLAVE_STORAGE);
        
        // PASO 2: Comprobar si había algo guardado.
        if (jsonString) {
            // Había datos → los convertimos de string JSON a array de objetos.
            // JSON.parse es lo CONTRARIO de JSON.stringify:
            //   '{"id":1,"texto":"Hola"}' → {id: 1, texto: "Hola"}
            tareas = JSON.parse(jsonString);
            console.log('📂 Tareas cargadas desde localStorage:', tareas.length, 'tareas');
        } else {
            // No había nada guardado (primera vez que abre la app).
            // Empezamos con un array vacío.
            tareas = [];
            console.log('📂 No hay tareas guardadas, empezando desde cero');
        }
        
    } catch (error) {
        // Puede fallar si el JSON está corrupto (alguien modificó
        // manualmente el localStorage desde DevTools, por ejemplo).
        // En ese caso, empezamos de cero en vez de romper la app.
        console.error('Error al cargar:', error);
        tareas = [];
    }
}

// -------------------------------------------------------------------------
// FUNCIÓN: borrarStorage()
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Elimina SOLO la clave 'tareas_app' del localStorage.
// ¿POR QUÉ?    Para que el usuario pueda borrar todas sus tareas.
// ¿Diferencia con clear()? removeItem borra UNA clave, clear borra TODAS.
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │   Método                    │   Qué borra                           │
// ├─────────────────────────────┼───────────────────────────────────────┤
// │   removeItem('tareas_app')  │   Solo la clave 'tareas_app'         │
// │   clear()                   │   TODO el localStorage (todas las    │
// │                             │   claves de este origen)             │
// └─────────────────────────────┴───────────────────────────────────────┘

function borrarStorage() {
    // localStorage.removeItem(clave) elimina una clave específica.
    // Si la clave no existe, no pasa nada (no da error).
    localStorage.removeItem(CLAVE_STORAGE);
    console.log('🗑️ localStorage limpiado');
}

// Para borrar TODO el localStorage (todas las claves):
// localStorage.clear();
// ¡Cuidado! Esto borraría también datos de OTRAS apps que usen localStorage
// en el mismo dominio. Por eso preferimos removeItem (más seguro).

// -------------------------------------------------------------------------
// 5. FUNCIONES DE SESSIONSTORAGE
// -------------------------------------------------------------------------
// Usamos sessionStorage para guardar el filtro seleccionado.
// ¿Por qué sessionStorage y no localStorage?
// Porque el filtro es algo TEMPORAL: no importa si se olvida mañana.
// Solo nos interesa que si el usuario recarga la página, el filtro se mantenga.
// Pero al cerrar la pestaña, se olvida (que es lo deseable).
//
// Analogía:
// - Guardar el filtro en localStorage sería como tatuarte qué página
//   de un libro estás leyendo. Mañana ya no lo necesitas.
// - Guardarlo en sessionStorage es como usar un marcapáginas:
//   mientras lees (pestaña abierta), te marca la página.
//   Cuando cierras el libro (pestaña), se cae.

function guardarFiltro(filtro) {
    // Guardamos el filtro en sessionStorage (temporal, solo esta pestaña).
    // La API es idéntica a localStorage: setItem, getItem, removeItem.
    sessionStorage.setItem(CLAVE_FILTRO, filtro);
    // Actualizamos el texto que muestra qué filtro está guardado.
    filtroGuardado.textContent = filtro;
}

function cargarFiltro() {
    // Leemos el filtro guardado en sessionStorage.
    const filtro = sessionStorage.getItem(CLAVE_FILTRO);
    if (filtro) {
        // Si había un filtro guardado, lo aplicamos.
        filtroActual = filtro;
        // Actualizamos los botones de filtro para que el activo se vea resaltado.
        // querySelectorAll('.filtro-btn') busca TODOS los botones con clase 'filtro-btn'.
        // forEach recorre cada uno y le quita/poner la clase 'activo'
        // según si su data-filtro coincide con el filtro guardado.
        document.querySelectorAll('.filtro-btn').forEach(btn => {
            btn.classList.toggle('activo', btn.dataset.filtro === filtro);
        });
        filtroGuardado.textContent = filtro;
    }
    // Si NO había filtro guardado (null), no hacemos nada.
    // El filtro por defecto ('todas') ya está puesto en la variable filtroActual.
}

// -------------------------------------------------------------------------
// 6. FUNCIÓN: Crear una nueva tarea
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Crea un objeto "tarea" y lo añade al array.
// ¿POR QUÉ?    Es la acción principal de la app: el usuario escribe algo
//              y pulsa "Agregar", y se crea una nueva tarea.

function crearTarea(texto, prioridad) {
    // Creamos un OBJETO con todas las propiedades de la tarea.
    // Un objeto es como una ficha con campos rellenados.
    const nuevaTarea = {
        id: Date.now(),
        // Date.now() devuelve los milisegundos desde el 1 de enero de 1970.
        // Es una forma rápida de generar un ID "casi único".
        // ¿Por qué "casi"? Si crearas 2 tareas en el MISMO milisegundo,
        // tendrían el mismo ID. En una app real usaríamos UUIDs.
        
        texto: texto.trim(),
        // .trim() elimina los espacios al principio y al final.
        // Así "  comprar leche  " se guarda como "comprar leche".
        // ¿Qué pasaría sin trim? El usuario podría crear tareas "vacías"
        // llenas de espacios que parecerían tareas reales.
        
        prioridad: prioridad,
        // "alta", "media" o "baja" - viene del <select> del formulario.
        
        completada: false,
        // Toda tarea nueva empieza como NO completada (pendiente).
        
        fechaCreacion: new Date().toISOString()
        // Guardamos la fecha y hora exacta de creación en formato ISO.
        // Ejemplo: "2025-01-15T10:30:00.000Z"
        // Lo usaremos para mostrar cuándo se creó la tarea.
    };
    
    // Añadimos la tarea AL PRINCIPIO del array con unshift().
    // ┌──────────────────────────────────────────────────────────────┐
    // │   Método     │   Dónde añade    │   Ejemplo                 │
    // ├──────────────┼──────────────────┼───────────────────────────┤
    // │   push()     │   Al FINAL       │   [A,B] → [A,B,C]        │
    // │   unshift()  │   Al PRINCIPIO   │   [A,B] → [C,A,B]        │
    // └──────────────┴──────────────────┴───────────────────────────┘
    // Usamos unshift para que la tarea nueva aparezca ARRIBA en la lista.
    // Si usáramos push, aparecería abajo y el usuario no la vería.
    tareas.unshift(nuevaTarea);
    
    // Marcamos que hay cambios sin guardar (encendemos la "luz roja").
    // El auto-guardado verá esta bandera y guardará en el próximo ciclo.
    hayCambiosSinGuardar = true;
    
    // Actualizamos la pantalla (renderizar) y guardamos en localStorage.
    renderizarTareas();
    guardarTareas();
}

// -------------------------------------------------------------------------
// 7. FUNCIÓN: Toggle completada (marcar/desmarcar)
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Cambia una tarea de "pendiente" a "completada" o viceversa.
// ¿POR QUÉ?    Para que el usuario pueda marcar las tareas que ya hizo.
// "Toggle" significa "alternar" o "conmutar" (como un interruptor de luz).

function toggleCompletada(id) {
    // find() busca en el array la primera tarea cuyo id coincida.
    // La función flecha (t => t.id === id) se ejecuta para cada elemento
    // hasta que una devuelve true. Entonces find() devuelve ESE elemento.
    // Si ninguna coincide, devuelve undefined.
    const tarea = tareas.find(t => t.id === id);
    
    if (tarea) {
        // Invertimos el valor booleano con el operador NOT (!).
        // Si era true → pasa a false. Si era false → pasa a true.
        // Es como un interruptor: cada clic cambia el estado.
        //   !true  = false
        //   !false = true
        tarea.completada = !tarea.completada;
        hayCambiosSinGuardar = true;
        renderizarTareas();
        guardarTareas();
    }
}

// -------------------------------------------------------------------------
// 8. FUNCIÓN: Eliminar una tarea
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Borra una tarea del array para siempre.
// ¿POR QUÉ?    Para que el usuario pueda quitar tareas que ya no necesita.

function eliminarTarea(id) {
    // filter() crea un NUEVO array con solo los elementos que cumplan
    // la condición. En este caso: "que su id NO sea el que queremos borrar".
    //
    // ┌───────────────────────────────────────────────────────────────┐
    // │   ANTES: tareas = [{id:1}, {id:2}, {id:3}]                   │
    // │   eliminarTarea(2) → filter(t => t.id !== 2)                 │
    // │   DESPUÉS: tareas = [{id:1}, {id:3}]                         │
    // └───────────────────────────────────────────────────────────────┘
    //
    // ¿Por qué no usamos splice() en vez de filter()?
    // - splice() modifica el array original (mutación directa).
    // - filter() crea un array nuevo (más seguro, menos bugs).
    // Ambos funcionan, pero filter() es más "limpio" y predecible.
    tareas = tareas.filter(t => t.id !== id);
    hayCambiosSinGuardar = true;
    renderizarTareas();
    guardarTareas();
}

// -------------------------------------------------------------------------
// 9. FUNCIÓN: Renderizar tareas en el DOM
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Dibuja (pinta) todas las tareas en la pantalla.
// ¿POR QUÉ?    Porque el array 'tareas' está en memoria, pero el usuario
//              no puede verlo. Hay que convertirlo a elementos HTML visibles.
// "Renderizar" = convertir datos en algo visible en pantalla.
//
// ¿CUÁNDO se llama? Cada vez que cambia algo: crear, borrar, filtrar, etc.
// Es como repintar un cuadro cada vez que cambias algo del original.

function renderizarTareas() {
    // Primero, BORRAMOS todo lo que había en la lista.
    // innerHTML = '' vacía el contenido HTML del elemento.
    // ¿Por qué? Porque vamos a volver a pintar todas las tareas desde cero.
    // Es más fácil borrar y repintar que intentar actualizar solo lo que cambió.
    listaTareas.innerHTML = '';
    
    // FILTRAR según el filtro actual.
    // Dependiendo de qué filtro esté activo, mostramos unas tareas u otras.
    let tareasFiltradas;
    switch (filtroActual) {
        case 'pendientes':
            // Solo las tareas que NO están completadas (!t.completada)
            tareasFiltradas = tareas.filter(t => !t.completada);
            break;
        case 'completadas':
            // Solo las tareas que SÍ están completadas
            tareasFiltradas = tareas.filter(t => t.completada);
            break;
        default:
            // 'todas' → mostramos todo el array sin filtrar
            tareasFiltradas = tareas;
    }
    
    // MAP para crear los elementos <li> (uno por cada tarea).
    // map() recorre el array y por cada elemento, ejecuta una función
    // que DEVUELVE algo nuevo. Aquí, devuelve un elemento <li> de HTML.
    //
    // Analogía: map es como una cadena de montaje. Entran tareas (datos),
    // y por cada una, sale un elemento <li> (HTML listo para mostrar).
    const elementos = tareasFiltradas.map(tarea => {
        // Creamos un elemento <li> desde cero (no existe en el HTML aún).
        const li = document.createElement('li');
        
        // Le ponemos clases CSS para darle estilo.
        // Template literals (backticks ``) permiten meter variables dentro
        // de un string con ${variable}.
        // La expresión condicional (ternario) ${condicion ? 'a' : 'b'}
        // añade la clase 'completada' solo si la tarea está completada.
        li.className = `tarea-item prioridad-${tarea.prioridad}${tarea.completada ? ' completada' : ''}`;
        
        // Formateamos la fecha de creación para que sea legible.
        // new Date(string_ISO) convierte el string ISO a un objeto Date.
        // toLocaleDateString formatea la fecha según el idioma ('es-ES' = español de España).
        const fecha = new Date(tarea.fechaCreacion);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', {
            day: '2-digit',      // Día con 2 dígitos: "15"
            month: 'short',      // Mes abreviado: "ene"
            hour: '2-digit',     // Hora con 2 dígitos: "10"
            minute: '2-digit'    // Minuto con 2 dígitos: "30"
        });
        // Resultado: algo como "15 ene, 10:30"
        
        // Rellenamos el <li> con HTML interno.
        // El checkbox tiene 'checked' si la tarea está completada.
        // El ternario ${tarea.completada ? 'checked' : ''} inserta la
        // palabra "checked" o nada, según el estado.
        li.innerHTML = `
            <input type="checkbox" class="tarea-checkbox" ${tarea.completada ? 'checked' : ''}>
            <span class="tarea-texto">${tarea.texto}</span>
            <span class="tarea-prioridad">${tarea.prioridad}</span>
            <span class="tarea-fecha">${fechaFormateada}</span>
            <button class="tarea-eliminar">✕</button>
        `;
        
        // EVENT LISTENERS para cada tarea individual.
        // Cada checkbox necesita saber QUÉ tarea tiene que marcar/desmarcar.
        // Usamos una arrow function () => para "capturar" el id de esta tarea.
        // Esto se llama "closure" o "cierre": la función recuerda el valor
        // de tarea.id aunque la función se ejecute mucho después.
        const checkbox = li.querySelector('.tarea-checkbox');
        checkbox.addEventListener('change', () => toggleCompletada(tarea.id));
        
        const btnEliminar = li.querySelector('.tarea-eliminar');
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));
        
        return li;
    });
    
    // Inyectamos todos los <li> creados dentro del elemento <ul> de la lista.
    // appendChild añade un elemento hijo al final del elemento padre.
    elementos.forEach(el => listaTareas.appendChild(el));
    
    // Actualizamos los contadores (total, pendientes, completadas).
    actualizarContadores();
}

// -------------------------------------------------------------------------
// 10. FUNCIÓN: Actualizar contadores
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Calcula y muestra cuántas tareas hay en total,
//              cuántas están pendientes y cuántas completadas.
// ¿POR QUÉ?    Para que el usuario vea un resumen rápido de su progreso.

function actualizarContadores() {
    // .length devuelve la cantidad de elementos del array.
    const total = tareas.length;
    
    // Filtramos solo las completadas y contamos cuántas hay.
    const completadas = tareas.filter(t => t.completada).length;
    
    // Las pendientes son el total menos las completadas.
    // (Más rápido que volver a filtrar.)
    const pendientes = total - completadas;
    
    // Actualizamos el texto de cada contador en el HTML.
    // textContent cambia el texto visible del elemento.
    contadorTotal.textContent = total;
    contadorPendientes.textContent = pendientes;
    contadorCompletadas.textContent = completadas;
}

// -------------------------------------------------------------------------
// 11. FUNCIÓN: Actualizar información del storage
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Muestra cuánto espacio ocupan las tareas en localStorage.
// ¿POR QUÉ?    Para que el alumno vea que los datos ocupan espacio real
//              y entienda las limitaciones de capacidad.

function actualizarInfoStorage() {
    // Leemos el string guardado (o '' si no hay nada).
    const jsonString = localStorage.getItem(CLAVE_STORAGE) || '';
    
    // Calculamos el tamaño en bytes.
    // Blob es un objeto que representa datos "crudos".
    // Al crear un Blob con nuestro string, podemos preguntar su .size (tamaño).
    const bytes = new Blob([jsonString]).size;
    
    // Formateamos el tamaño para que sea legible.
    // Si es menos de 1024 bytes, lo mostramos en bytes.
    // Si es más, lo convertimos a KB (kilobytes) dividiendo entre 1024.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │   1 KB (Kilobyte)  = 1.024 bytes                            │
    // │   1 MB (Megabyte)  = 1.024 KB = 1.048.576 bytes            │
    // │   localStorage     = ~5 MB = ~5.242.880 bytes máximo        │
    // └──────────────────────────────────────────────────────────────┘
    let tamano;
    if (bytes < 1024) {
        tamano = `${bytes} bytes`;
    } else {
        // .toFixed(2) redondea a 2 decimales: 1.5678 → "1.57"
        tamano = `${(bytes / 1024).toFixed(2)} KB`;
    }
    
    tamanoStorage.textContent = tamano;
}

// -------------------------------------------------------------------------
// 12. FUNCIÓN: Mostrar indicador de guardado
// -------------------------------------------------------------------------
// ¿QUÉ hace?   Muestra una animación visual breve para confirmar que
//              los datos se han guardado correctamente.
// ¿POR QUÉ?    Feedback visual: el usuario necesita saber que su acción
//              tuvo efecto. Sin feedback, el usuario no confía en la app.

function mostrarIndicadorGuardado() {
    // Añadimos la clase CSS 'guardando' que activa una animación.
    indicadorGuardado.classList.add('guardando');
    
    // Mostramos la hora actual del último guardado.
    // toLocaleTimeString formatea solo la hora (no la fecha).
    ultimoGuardado.textContent = new Date().toLocaleTimeString('es-ES');
    
    // setTimeout ejecuta una función UNA SOLA VEZ después de X milisegundos.
    // Aquí: después de 500ms (medio segundo), quitamos la clase 'guardando'
    // para que la animación termine.
    //
    // ┌──────────────────────────────────────────────────────────────┐
    // │   setTimeout  vs  setInterval                                │
    // ├───────────────┬──────────────────────────────────────────────┤
    // │   setTimeout  │   Se ejecuta UNA VEZ después de X ms        │
    // │               │   Como una alarma: suena una vez y para     │
    // ├───────────────┼──────────────────────────────────────────────┤
    // │   setInterval │   Se ejecuta CADA X ms (sin parar)          │
    // │               │   Como un reloj: suena cada hora sin parar  │
    // └───────────────┴──────────────────────────────────────────────┘
    setTimeout(() => {
        indicadorGuardado.classList.remove('guardando');
    }, 500);
}

// -------------------------------------------------------------------------
// 13. setInterval() - AUTO-GUARDADO PERIÓDICO
// -------------------------------------------------------------------------
// setInterval() ejecuta una función CADA X milisegundos, de forma repetitiva.
// Es diferente a setTimeout() que solo se ejecuta UNA VEZ.
//
// Estructura: setInterval(funcion, milisegundos)
// Para detenerlo: clearInterval(id)
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │   COMPARACIÓN: setTimeout vs setInterval                             │
// ├────────────────┬──────────────────────┬─────────────────────────────┤
// │                │   setTimeout         │   setInterval               │
// ├────────────────┼──────────────────────┼─────────────────────────────┤
// │   Ejecuciones  │   1 sola vez         │   Infinitas (hasta parar)   │
// │   Analogía     │   Alarma del móvil   │   Latido del corazón        │
// │   Para parar   │   clearTimeout(id)   │   clearInterval(id)         │
// │   Uso típico   │   Animaciones,       │   Auto-guardado,            │
// │                │   retrasos           │   relojes, polling          │
// └────────────────┴──────────────────────┴─────────────────────────────┘
//
// ¿Qué pasaría si NO comprobáramos hayCambiosSinGuardar?
// → Guardaríamos cada 5 segundos aunque no haya cambios.
//   Esto desperdicia recursos y podría ralentizar el navegador.
//
// ¿Qué pasaría si NO guardáramos el ID en una variable?
// → No podríamos detener el intervalo nunca. Seguiría ejecutándose
//   para siempre, incluso si el usuario ya no está en la página.

let intervaloGuardado;  // Variable para guardar el ID del intervalo
                         // (lo necesitamos para poder detenerlo después)

function iniciarAutoGuardado() {
    // setInterval devuelve un ID numérico que identifica este intervalo.
    // Lo guardamos en 'intervaloGuardado' para poder usar clearInterval() después.
    intervaloGuardado = setInterval(() => {
        // Solo guardamos si hay cambios sin guardar (optimización).
        // Si el usuario no ha hecho nada, no tiene sentido guardar.
        if (hayCambiosSinGuardar) {
            console.log('⏰ Auto-guardado triggered');
            guardarTareas();
        }
    }, INTERVALO_GUARDADO);
    // INTERVALO_GUARDADO = 5000ms = 5 segundos.
    // La función de arriba se ejecutará cada 5 segundos.
    
    console.log(`⏰ Auto-guardado iniciado (cada ${INTERVALO_GUARDADO / 1000} segundos)`);
}

function detenerAutoGuardado() {
    // clearInterval(id) DETIENE el intervalo que creamos antes.
    // Sin esto, el intervalo seguiría ejecutándose para siempre.
    // Es como apagar la alarma del reloj.
    clearInterval(intervaloGuardado);
    console.log('⏰ Auto-guardado detenido');
}

// -------------------------------------------------------------------------
// 14. ACCIONES MASIVAS
// -------------------------------------------------------------------------
// Funciones que afectan a MUCHAS tareas a la vez (no solo una).

function completarTodas() {
    // forEach recorre CADA tarea del array y ejecuta la función.
    // Aquí: pone completada = true en TODAS las tareas.
    // Es como marcar todas las casillas de una lista de golpe.
    tareas.forEach(t => t.completada = true);
    hayCambiosSinGuardar = true;
    renderizarTareas();
    guardarTareas();
}

function eliminarCompletadas() {
    // Nos quedamos solo con las que NO están completadas.
    // Es decir: borramos las completadas.
    tareas = tareas.filter(t => !t.completada);
    hayCambiosSinGuardar = true;
    renderizarTareas();
    guardarTareas();
}

function eliminarTodas() {
    // confirm() muestra un cuadro de diálogo con "Aceptar" y "Cancelar".
    // Devuelve true si el usuario pulsa "Aceptar", false si pulsa "Cancelar".
    // Es una forma sencilla de pedir confirmación antes de una acción destructiva.
    // ¿Qué pasaría sin confirm? El usuario podría borrar todo por accidente.
    if (confirm('¿Estás seguro de que quieres eliminar TODAS las tareas?')) {
        tareas = [];
        hayCambiosSinGuardar = true;
        renderizarTareas();
        borrarStorage();
        actualizarInfoStorage();
    }
}

// -------------------------------------------------------------------------
// 15. EVENT LISTENERS
// -------------------------------------------------------------------------
// Los event listeners ("escuchadores de eventos") son funciones que se
// ejecutan cuando el usuario hace algo: clicar, teclear, etc.
//
// addEventListener('evento', funcion) → "Cuando pase X, haz Y"
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │   Evento          │   Cuándo se dispara                             │
// ├───────────────────┼─────────────────────────────────────────────────┤
// │   'click'         │   El usuario hace clic en un elemento           │
// │   'keypress'      │   El usuario pulsa una tecla                    │
// │   'change'        │   El valor de un input/select cambia            │
// │   'beforeunload'  │   Justo antes de cerrar/recargar la página      │
// └───────────────────┴─────────────────────────────────────────────────┘

// Agregar tarea al pulsar el botón "Agregar"
document.getElementById('btnAgregar').addEventListener('click', () => {
    // .trim() quita espacios al principio y final.
    // Así evitamos que el usuario añada tareas vacías o solo con espacios.
    const texto = inputTarea.value.trim();
    const prioridad = selectPrioridad.value;
    
    if (texto) {
        // Solo creamos la tarea si hay texto (no está vacío).
        crearTarea(texto, prioridad);
        // Limpiamos el campo de texto para que el usuario pueda escribir otra.
        inputTarea.value = '';
        // Ponemos el cursor (focus) de vuelta en el input para que
        // el usuario pueda seguir escribiendo sin tener que hacer clic.
        inputTarea.focus();
    }
});

// Enter para agregar (atajo de teclado).
// En vez de tener que hacer clic en el botón, el usuario puede pulsar Enter.
inputTarea.addEventListener('keypress', (e) => {
    // e.key contiene la tecla que se pulsó.
    if (e.key === 'Enter') {
        // Simulamos un clic en el botón "Agregar".
        // .click() ejecuta el event listener del botón como si lo hubiéramos clicado.
        document.getElementById('btnAgregar').click();
    }
});

// Filtros: cuando el usuario pulsa un botón de filtro.
document.querySelectorAll('.filtro-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitamos la clase 'activo' de TODOS los botones de filtro.
        document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
        // Añadimos la clase 'activo' SOLO al botón que se pulsó.
        btn.classList.add('activo');
        // Actualizamos la variable filtroActual con el valor del data-filtro del botón.
        // dataset.filtro lee el atributo HTML data-filtro del botón.
        filtroActual = btn.dataset.filtro;
        // Guardamos el filtro en sessionStorage para que persista al recargar.
        guardarFiltro(filtroActual);
        // Volvemos a renderizar la lista con el nuevo filtro aplicado.
        renderizarTareas();
    });
});

// Acciones masivas: conectamos los botones con sus funciones.
document.getElementById('btnCompletarTodas').addEventListener('click', completarTodas);
document.getElementById('btnEliminarCompletadas').addEventListener('click', eliminarCompletadas);
document.getElementById('btnEliminarTodas').addEventListener('click', eliminarTodas);
// Nota: NO ponemos completarTodas() con paréntesis, porque eso ejecutaría
// la función INMEDIATAMENTE. Sin paréntesis, pasamos la REFERENCIA a la función
// para que se ejecute cuando el usuario haga clic.
//
// ┌──────────────────────────────────────────────────────────────────┐
// │   completarTodas    → Referencia (se ejecuta al hacer clic) ✓   │
// │   completarTodas()  → Ejecución inmediata (se ejecuta YA)   ✗   │
// └──────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// 16. EVENTO: Guardar antes de cerrar la página
// -------------------------------------------------------------------------
// El evento 'beforeunload' se dispara justo antes de que el usuario
// abandone la página (cierre pestaña, recargue, navegue a otra URL).
// Es nuestra ÚLTIMA oportunidad para guardar datos.
//
// Analogía: Es como el "último aviso" del tren antes de que cierre las
// puertas. Si tienes algo que guardar, ¡HAZLO AHORA!

window.addEventListener('beforeunload', (e) => {
    // Si hay cambios sin guardar, guardamos antes de que sea demasiado tarde.
    if (hayCambiosSinGuardar) {
        guardarTareas();
    }
});

// -------------------------------------------------------------------------
// 17. INICIALIZACIÓN
// -------------------------------------------------------------------------
// Este bloque se ejecuta UNA SOLA VEZ cuando la página carga.
// El orden importa: primero cargamos datos, luego los mostramos.
//
// Flujo de inicio:
//   1. Cargar tareas guardadas → 2. Cargar filtro → 3. Pintar en pantalla
//   → 4. Mostrar info del storage → 5. Activar auto-guardado
//
// ¿Qué pasaría si cambiáramos el orden?
// Por ejemplo, si renderizamos ANTES de cargar:
//   → La pantalla mostraría un array vacío (tareas = [])
//   → Luego cargaríamos las tareas, pero la pantalla no se actualizaría
//     hasta que el usuario hiciera algo (crear, borrar, etc.)

// 1. Cargamos las tareas guardadas en localStorage (si las hay).
cargarTareas();

// 2. Cargamos el filtro guardado en sessionStorage (si lo hay).
cargarFiltro();

// 3. Renderizamos las tareas en la pantalla (pintamos el HTML).
renderizarTareas();

// 4. Actualizamos la info del storage (tamaño ocupado).
actualizarInfoStorage();

// 5. Iniciamos el auto-guardado cada 5 segundos.
iniciarAutoGuardado();

// =========================================================================
// RESUMEN DE CONCEPTOS APRENDIDOS
// =========================================================================
//
// ┌────┬──────────────────────────────────┬────────────────────────────────┐
// │ #  │   Concepto                       │   Para qué sirve               │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  1 │ localStorage.setItem(k, v)       │ Guarda un string en el        │
// │    │                                  │ navegador (persiste siempre)  │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  2 │ localStorage.getItem(k)          │ Lee un string guardado        │
// │    │                                  │ (devuelve null si no existe)  │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  3 │ localStorage.removeItem(k)       │ Borra UNA clave específica    │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  4 │ localStorage.clear()             │ Borra TODO el localStorage    │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  5 │ JSON.stringify(objeto)           │ Convierte objeto/array a      │
// │    │                                  │ string JSON (para guardar)    │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  6 │ JSON.parse(string)              │ Convierte string JSON a       │
// │    │                                  │ objeto/array (para leer)      │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  7 │ sessionStorage                   │ Igual que localStorage pero   │
// │    │                                  │ se borra al cerrar pestaña    │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  8 │ setInterval(fn, ms)              │ Ejecuta fn cada ms miliseg.   │
// │    │                                  │ (repetitivo, como un reloj)   │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  9 │ clearInterval(id)                │ Detiene un setInterval        │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 10 │ setTimeout(fn, ms)               │ Ejecuta fn UNA VEZ después    │
// │    │                                  │ de ms milisegundos            │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 11 │ beforeunload                     │ Evento justo antes de cerrar  │
// │    │                                  │ o recargar la página          │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 12 │ try/catch                        │ Manejo de errores: intenta    │
// │    │                                  │ algo, y si falla, captura     │
// │    │                                  │ el error sin romper la app    │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 13 │ const vs let                     │ const = no cambia,            │
// │    │                                  │ let = sí puede cambiar        │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 14 │ Array.filter(fn)                 │ Crea un nuevo array con solo  │
// │    │                                  │ los elementos que cumplan fn  │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 15 │ Array.map(fn)                    │ Crea un nuevo array           │
// │    │                                  │ transformando cada elemento   │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 16 │ Array.find(fn)                   │ Busca el PRIMER elemento que  │
// │    │                                  │ cumpla la condición           │
// └────┴──────────────────────────────────┴────────────────────────────────┘
//
// IDEAS CLAVE:
// 1. localStorage solo guarda STRINGS → usa JSON.stringify/parse
// 2. Siempre usa try/catch al leer/escribir en storage (puede fallar)
// 3. sessionStorage para datos temporales, localStorage para permanentes
// 4. setInterval para tareas repetitivas, setTimeout para tareas únicas
// 5. El evento beforeunload es tu red de seguridad para guardar cambios
// =========================================================================
