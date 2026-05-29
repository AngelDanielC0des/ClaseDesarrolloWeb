// =========================================================================
// LECCIÓN: Métodos Inmutables de Arrays (ES2023-2024)
// =========================================================================
// Este ejercicio demuestra los métodos más recientes de JavaScript para
// trabajar con arrays SIN MUTAR el original. Esto es fundamental en
// programación funcional y en frameworks como React.
//
// CONCEPTOS QUE APRENDERÁS:
// 1. toSorted() - Ordenar sin mutar (ES2023)
// 2. toReversed() - Invertir sin mutar (ES2023)
// 3. toSpliced() - Insertar/eliminar sin mutar (ES2023)
// 4. with() - Reemplazar elemento sin mutar (ES2023)
// 5. findLast() y findLastIndex() - Buscar desde el final (ES2023)
// 6. Object.groupBy() - Agrupar elementos (ES2024)
//
// ¿Por qué son importantes?
// - Preservan el array original (inmutabilidad)
// - Evitan bugs sutiles por mutación accidental
// - Esenciales para React, Redux y programación funcional
// - Hacen el código más predecible y testeable
// =========================================================================

// -------------------------------------------------------------------------
// 1. DATOS INICIALES: Ranking de jugadores
// -------------------------------------------------------------------------

// Array original de jugadores (NUNCA lo mutaremos)
const rankingOriginal = [
    { id: 1, nombre: 'Ana García', puntuacion: 2450, categoria: 'oro', equipo: 'Rojo' },
    { id: 2, nombre: 'Carlos López', puntuacion: 2100, categoria: 'plata', equipo: 'Azul' },
    { id: 3, nombre: 'María Rodríguez', puntuacion: 2680, categoria: 'oro', equipo: 'Rojo' },
    { id: 4, nombre: 'Juan Martínez', puntuacion: 1850, categoria: 'bronce', equipo: 'Verde' },
    { id: 5, nombre: 'Laura Sánchez', puntuacion: 2300, categoria: 'plata', equipo: 'Azul' },
    { id: 6, nombre: 'Pedro Fernández', puntuacion: 1950, categoria: 'bronce', equipo: 'Verde' },
    { id: 7, nombre: 'Sofía Díaz', puntuacion: 2550, categoria: 'oro', equipo: 'Rojo' }
];

// Estado actual del ranking (empezamos con una copia)
let rankingActual = [...rankingOriginal];

// -------------------------------------------------------------------------
// 2. toSorted() - ORDENAR SIN MUTAR (ES2023)
// -------------------------------------------------------------------------
// Crea un NUEVO array ordenado, dejando el original intacto.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  MÉTODO      │  MUTA EL ORIGINAL  │  DEVUELVE                  │
// ├─────────────────────────────────────────────────────────────────┤
// │  sort()      │  ✅ SÍ (mutable)   │  El mismo array ordenado   │
// │  toSorted()  │  ❌ NO (inmutable) │  Un NUEVO array ordenado   │
// └─────────────────────────────────────────────────────────────────┘
//
// ANALOGÍA DEL MUNDO REAL:
// - sort() = Reordenar los libros en tu estantería (cambias el original)
// - toSorted() = Hacer una fotocopia de la lista y ordenar la copia
//   (tu estantería sigue igual)
//
// ¿Por qué es importante?
// - En React, mutar el estado directamente no dispara re-renders
// - En programación funcional, las funciones puras no tienen efectos secundarios
// -------------------------------------------------------------------------

function sortByScore() {
    // toSorted() acepta una función de comparación igual que sort()
    // (a, b) => numero:
    //   - Negativo: a va antes que b
    //   - Positivo: b va antes que a
    //   - Cero: mantienen orden relativo
    
    const ordenado = rankingActual.toSorted((a, b) => b.puntuacion - a.puntuacion);
    // Orden descendente: mayor puntuación primero
    
    showResult(
        'toSorted() - Ordenado por puntuación (descendente)',
        'const ordenado = ranking.toSorted((a, b) => b.puntuacion - a.puntuacion);',
        ordenado
    );
    
    // Verificamos que el original NO cambió
    console.log('Original (sin cambios):', rankingActual);
    console.log('Nuevo array ordenado:', ordenado);
}

function sortByName() {
    // Ordenar alfabéticamente por nombre
    const ordenado = rankingActual.toSorted((a, b) => 
        a.nombre.localeCompare(b.nombre)
    );
    // localeCompare() compara strings respetando acentos y mayúsculas
    
    showResult(
        'toSorted() - Ordenado alfabéticamente por nombre',
        'const ordenado = ranking.toSorted((a, b) => a.nombre.localeCompare(b.nombre));',
        ordenado
    );
}

// -------------------------------------------------------------------------
// 3. toReversed() - INVERTIR SIN MUTAR (ES2023)
// -------------------------------------------------------------------------
// Crea un NUEVO array con los elementos en orden inverso.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  MÉTODO       │  MUTA EL ORIGINAL  │  DEVUELVE                 │
// ├─────────────────────────────────────────────────────────────────┤
// │  reverse()    │  ✅ SÍ (mutable)   │  El mismo array invertido │
// │  toReversed() │  ❌ NO (inmutable) │  Un NUEVO array invertido │
// └─────────────────────────────────────────────────────────────────┘
//
// ¿Cuándo usarlo?
// - Mostrar mensajes de chat (más reciente primero)
// - Invertir el orden de una lista sin perder el original
// -------------------------------------------------------------------------

function reverseRanking() {
    const invertido = rankingActual.toReversed();
    
    showResult(
        'toReversed() - Ranking invertido',
        'const invertido = ranking.toReversed();',
        invertido
    );
    
    console.log('Original (sin cambios):', rankingActual);
    console.log('Nuevo array invertido:', invertido);
}

// -------------------------------------------------------------------------
// 4. with() - REEMPLAZAR ELEMENTO SIN MUTAR (ES2023)
// -------------------------------------------------------------------------
// Crea un NUEVO array con UN elemento reemplazado en la posición indicada.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  MÉTODO              │  MUTA EL ORIGINAL  │  DEVUELVE           │
// ├─────────────────────────────────────────────────────────────────┤
// │  array[i] = valor    │  ✅ SÍ (mutable)   │  Nada (asignación) │
// │  array.with(i, val)  │  ❌ NO (inmutable) │  Un NUEVO array    │
// └─────────────────────────────────────────────────────────────────┘
//
// SINTAXIS: array.with(indice, nuevoValor)
// - indice: Posición del elemento a reemplazar (soporta negativos con .at())
// - nuevoValor: El valor que reemplazará al actual
//
// ANALOGÍA DEL MUNDO REAL:
// - array[i] = valor = Cambiar una página de un libro (modificas el original)
// - array.with(i, valor) = Fotocopiar el libro y cambiar una página en la copia
// -------------------------------------------------------------------------

function updateFirstPlayer() {
    // Reemplazamos el primer jugador (índice 0)
    const nuevoJugador = {
        id: 99,
        nombre: 'Jugador Actualizado',
        puntuacion: 3000,
        categoria: 'oro',
        equipo: 'Especial'
    };
    
    const actualizado = rankingActual.with(0, nuevoJugador);
    
    showResult(
        'with() - Primer jugador actualizado',
        'const actualizado = ranking.with(0, nuevoJugador);',
        actualizado
    );
    
    console.log('Original (sin cambios):', rankingActual[0]);
    console.log('Nuevo primer jugador:', actualizado[0]);
    
    // También soporta índices negativos
    const ultimoActualizado = rankingActual.with(-1, nuevoJugador);
    console.log('Último jugador actualizado:', ultimoActualizado.at(-1));
}

// -------------------------------------------------------------------------
// 5. toSpliced() - INSERTAR/ELIMINAR SIN MUTAR (ES2023)
// -------------------------------------------------------------------------
// Crea un NUEVO array insertando y/o eliminando elementos.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  MÉTODO        │  MUTA EL ORIGINAL  │  DEVUELVE                │
// ├─────────────────────────────────────────────────────────────────┤
// │  splice()      │  ✅ SÍ (mutable)   │  Elementos eliminados    │
// │  toSpliced()   │  ❌ NO (inmutable) │  Un NUEVO array          │
// └─────────────────────────────────────────────────────────────────┘
//
// SINTAXIS: array.toSpliced(indiceInicio, cantidadEliminar, ...elementosInsertar)
// - indiceInicio: Posición donde empezar
// - cantidadEliminar: Cuántos elementos eliminar (0 = ninguno)
// - ...elementosInsertar: Elementos a insertar (opcional)
//
// CASOS DE USO:
// - Eliminar elementos: toSpliced(2, 1) - Elimina 1 elemento en posición 2
// - Insertar elementos: toSpliced(2, 0, nuevoElemento) - Inserta sin eliminar
// - Reemplazar elementos: toSpliced(2, 1, nuevoElemento) - Elimina 1 e inserta 1
// -------------------------------------------------------------------------

function removeLastPlayer() {
    // Eliminamos el último elemento
    // toSpliced(indice, cantidad) - cantidad = 1 para eliminar 1 elemento
    const sinUltimo = rankingActual.toSpliced(-1, 1);
    // Índice -1 = último elemento, eliminar 1
    
    showResult(
        'toSpliced() - Último jugador eliminado',
        'const sinUltimo = ranking.toSpliced(-1, 1);',
        sinUltimo
    );
    
    console.log('Original (sin cambios, longitud:', rankingActual.length, ')');
    console.log('Nuevo array (longitud:', sinUltimo.length, ')');
}

function addNewPlayer() {
    // Insertamos un nuevo jugador al final
    const nuevoJugador = {
        id: Date.now(),
        nombre: 'Nuevo Jugador',
        puntuacion: 2200,
        categoria: 'plata',
        equipo: 'Amarillo'
    };
    
    // toSpliced(indice, 0, elemento) - Inserta sin eliminar
    // Usamos rankingActual.length para insertar al final
    const conNuevo = rankingActual.toSpliced(rankingActual.length, 0, nuevoJugador);
    
    showResult(
        'toSpliced() - Nuevo jugador añadido al final',
        'const conNuevo = ranking.toSpliced(ranking.length, 0, nuevoJugador);',
        conNuevo
    );
    
    console.log('Original (sin cambios, longitud:', rankingActual.length, ')');
    console.log('Nuevo array (longitud:', conNuevo.length, ')');
}

// -------------------------------------------------------------------------
// 6. findLast() y findLastIndex() - BUSCAR DESDE EL FINAL (ES2023)
// -------------------------------------------------------------------------
// Buscan el ÚLTIMO elemento que cumpla una condición (en vez del primero).
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  MÉTODO           │  BUSCA DESDE  │  DEVUELVE                  │
// ├─────────────────────────────────────────────────────────────────┤
// │  find()           │  El principio │  El PRIMER elemento        │
// │  findLast()       │  El final     │  El ÚLTIMO elemento        │
// │  findIndex()      │  El principio │  Índice del PRIMERO        │
// │  findLastIndex()  │  El final     │  Índice del ÚLTIMO         │
// └─────────────────────────────────────────────────────────────────┘
//
// ¿Cuándo usarlos?
// - Buscar el último mensaje de un usuario en un chat
// - Encontrar la última acción de un tipo específico
// - Obtener el último elemento que cumpla un criterio
// -------------------------------------------------------------------------

function findLastGold() {
    // Buscamos el último jugador con categoría "oro"
    const ultimoOro = rankingActual.findLast(j => j.categoria === 'oro');
    
    // También podemos obtener el índice
    const indiceUltimoOro = rankingActual.findLastIndex(j => j.categoria === 'oro');
    
    showResult(
        'findLast() - Último jugador con medalla de oro',
        'const ultimoOro = ranking.findLast(j => j.categoria === "oro");',
        ultimoOro ? [ultimoOro] : []
    );
    
    console.log('Último jugador oro:', ultimoOro);
    console.log('Índice del último oro:', indiceUltimoOro);
    
    // Comparación con find() (busca desde el principio)
    const primerOro = rankingActual.find(j => j.categoria === 'oro');
    console.log('Primer jugador oro (find):', primerOro);
    console.log('Último jugador oro (findLast):', ultimoOro);
}

// -------------------------------------------------------------------------
// 7. Object.groupBy() - AGRUPAR ELEMENTOS (ES2024)
// -------------------------------------------------------------------------
// Agrupa elementos de un array en un objeto según una función de agrupación.
//
// SINTAXIS: Object.groupBy(array, funcionAgrupacion)
// - array: El array a agrupar
// - funcionAgrupacion: Función que devuelve la clave de grupo para cada elemento
//
// DEVUELVE: Un objeto donde las claves son los grupos y los valores son arrays
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANTES (sin groupBy)              │  AHORA (con groupBy)        │
// ├─────────────────────────────────────────────────────────────────┤
// │  const grupos = {};               │  const grupos =             │
// │  array.forEach(item => {          │    Object.groupBy(array,    │
// │    const key = item.categoria;    │      item => item.categoria │
// │    if (!grupos[key]) {            │    );                       │
// │      grupos[key] = [];            │                             │
// │    }                              │  // ¡Una sola línea!        │
// │    grupos[key].push(item);        │                             │
// │  });                              │                             │
// └─────────────────────────────────────────────────────────────────┘
//
// ANALOGÍA DEL MUNDO REAL:
// Imagina que tienes una caja de lápices de colores mezclados.
// groupBy() los separa en botes: un bote para rojos, otro para azules, etc.
// -------------------------------------------------------------------------

function groupByCategory() {
    // Agrupamos jugadores por categoría (oro, plata, bronce)
    const grupos = Object.groupBy(rankingActual, jugador => jugador.categoria);
    
    // Mostramos los grupos en la UI
    renderGroups(grupos);
    
    showResult(
        'Object.groupBy() - Jugadores agrupados por categoría',
        'const grupos = Object.groupBy(ranking, j => j.categoria);',
        rankingActual
    );
    
    console.log('Grupos por categoría:', grupos);
    console.log('Jugadores oro:', grupos.oro);
    console.log('Jugadores plata:', grupos.plata);
    console.log('Jugadores bronce:', grupos.bronce);
    
    // También podemos agrupar por otras propiedades
    const gruposPorEquipo = Object.groupBy(rankingActual, j => j.equipo);
    console.log('Grupos por equipo:', gruposPorEquipo);
}

// -------------------------------------------------------------------------
// 8. FUNCIONES AUXILIARES DE RENDERIZADO
// -------------------------------------------------------------------------

function renderRanking(ranking, containerId) {
    const container = document.getElementById(containerId);
    
    const html = ranking.map((jugador, index) => {
        const badgeClass = `badge-${jugador.categoria}`;
        
        return `
            <div class="player-card">
                <div class="position">#${index + 1}</div>
                <div class="info">
                    <div class="name">${jugador.nombre}</div>
                    <div class="details">
                        ${jugador.equipo} • 
                        <span class="badge ${badgeClass}">${jugador.categoria}</span>
                    </div>
                </div>
                <div class="score">${jugador.puntuacion}</div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

function renderGroups(grupos) {
    const container = document.getElementById('groupsDisplay');
    
    const html = Object.entries(grupos).map(([categoria, jugadores]) => {
        const jugadoresHtml = jugadores.map(j => `
            <div class="player-card">
                <div class="info">
                    <div class="name">${j.nombre}</div>
                    <div class="details">${j.equipo} • ${j.puntuacion} pts</div>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="group-card">
                <h3>${categoria.toUpperCase()}</h3>
                <div class="count">${jugadores.length} jugador${jugadores.length !== 1 ? 'es' : ''}</div>
                ${jugadoresHtml}
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

function showResult(title, code, resultRanking) {
    document.getElementById('actionDescription').innerHTML = `
        <strong>${title}</strong><br>
        <code>${code}</code>
    `;
    
    renderRanking(resultRanking, 'resultRanking');
}

// -------------------------------------------------------------------------
// 9. EVENT LISTENERS
// -------------------------------------------------------------------------

document.getElementById('btnSortByScore').addEventListener('click', sortByScore);
document.getElementById('btnSortByName').addEventListener('click', sortByName);
document.getElementById('btnReverse').addEventListener('click', reverseRanking);
document.getElementById('btnUpdateFirst').addEventListener('click', updateFirstPlayer);
document.getElementById('btnRemoveLast').addEventListener('click', removeLastPlayer);
document.getElementById('btnAddNew').addEventListener('click', addNewPlayer);
document.getElementById('btnFindLast').addEventListener('click', findLastGold);
document.getElementById('btnGroupByCategory').addEventListener('click', groupByCategory);

// -------------------------------------------------------------------------
// 10. INICIALIZACIÓN
// -------------------------------------------------------------------------

console.log('🏆 Ranking de Jugadores cargado');
console.log('📚 Haz clic en los botones para ver los métodos inmutables en acción');
console.log('🔍 Abre la consola para ver las comparaciones entre original y nuevo');

renderRanking(rankingActual, 'originalRanking');
renderRanking(rankingActual, 'resultRanking');

// -------------------------------------------------------------------------
// RESUMEN DE CONCEPTOS APRENDIDOS
// -------------------------------------------------------------------------
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  MÉTODO           │  AÑO  │  REEMPLAZA A  │  USO PRINCIPAL         │
// ├─────────────────────────────────────────────────────────────────────┤
// │  toSorted()       │  2023 │  sort()       │  Ordenar sin mutar     │
// │  toReversed()     │  2023 │  reverse()    │  Invertir sin mutar    │
// │  toSpliced()      │  2023 │  splice()     │  Insertar/eliminar     │
// │  with()           │  2023 │  array[i]=val │  Reemplazar elemento   │
// │  findLast()       │  2023 │  -            │  Buscar último         │
// │  findLastIndex()  │  2023 │  -            │  Índice del último     │
// │  Object.groupBy() │  2024 │  -            │  Agrupar elementos     │
// └─────────────────────────────────────────────────────────────────────┘
//
// PRINCIPIO DE INMUTABILIDAD:
// ┌─────────────────────────────────────────────────────────────────────┐
// │  ❌ MAL (mutable):                                                  │
// │  const arr = [3, 1, 2];                                             │
// │  arr.sort();           // arr ahora es [1, 2, 3]                    │
// │  arr.reverse();        // arr ahora es [3, 2, 1]                    │
// │  arr.splice(1, 1);     // arr ahora es [3, 1]                       │
// │                                                                     │
// │  ✅ BIEN (inmutable):                                               │
// │  const arr = [3, 1, 2];                                             │
// │  const sorted = arr.toSorted();      // arr sigue [3, 1, 2]         │
// │  const reversed = arr.toReversed();  // arr sigue [3, 1, 2]         │
// │  const spliced = arr.toSpliced(1,1); // arr sigue [3, 1, 2]         │
// └─────────────────────────────────────────────────────────────────────┘
//
// ¿POR QUÉ ES IMPORTANTE LA INMUTABILIDAD?
// 1. React: Mutar el estado directamente no dispara re-renders
// 2. Redux: Requiere inmutabilidad para detectar cambios
// 3. Testing: Las funciones puras son más fáciles de testear
// 4. Debugging: Es más fácil rastrear cambios cuando no hay mutación
// 5. Time-travel: Puedes "volver atrás" si guardas estados anteriores
//
// CONSEJOS PRÁCTICOS:
// 1. Usa toSorted() en lugar de sort() cuando necesites preservar el original
// 2. Usa with() en lugar de array[i] = valor para mantener inmutabilidad
// 3. Usa findLast() cuando necesites el último elemento que cumpla una condición
// 4. Usa Object.groupBy() para agrupar datos de forma concisa
// 5. En React, SIEMPRE usa métodos inmutables para actualizar el estado
//
// PRÓXIMOS PASOS:
// - Practica con los botones interactivos
// - Abre la consola para ver las comparaciones
// - Intenta aplicar estos métodos en tus propios proyectos
// -------------------------------------------------------------------------
