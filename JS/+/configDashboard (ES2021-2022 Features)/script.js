// =========================================================================
// LECCIÓN: Features Modernas de JavaScript (ES2021-2022)
// =========================================================================
// Este ejercicio demuestra las características más recientes y útiles de
// JavaScript moderno que todo desarrollador debe conocer.
//
// CONCEPTOS QUE APRENDERÁS:
// 1. Logical Assignment Operators (||=, &&=, ??=) - ES2021
// 2. Array.at() - Acceso con índices negativos - ES2022
// 3. structuredClone() - Clonación profunda - ES2022
// 4. Object.entries(), Object.values(), Object.keys() - ES2017
//
// ¿Por qué son importantes?
// - Simplifican código que antes requería múltiples líneas
// - Son más legibles y menos propensos a errores
// - Se usan en frameworks modernos como React, Vue, Angular
// =========================================================================

// -------------------------------------------------------------------------
// 1. CONFIGURACIÓN INICIAL Y ESTADO
// -------------------------------------------------------------------------

// Configuración por defecto (valores iniciales)
const defaultConfig = {
    theme: 'light',
    language: 'es',
    notifications: true,
    fontSize: 16,
    autoSave: true,
    recentFiles: []
};

// Configuración actual del usuario (empieza vacía)
let userConfig = {};

// Historial de cambios (para demostrar structuredClone)
let configHistory = [];

// -------------------------------------------------------------------------
// 2. LOGICAL ASSIGNMENT OPERATORS (ES2021)
// -------------------------------------------------------------------------
// Estos operadores combinan operadores lógicos con asignación.
// Son "azúcar sintáctica" que hace el código más conciso.
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  OPERADOR  │  EQUIVALENTE        │  ¿CUÁNDO ASIGNA?                │
// ├─────────────────────────────────────────────────────────────────────┤
// │  ||=       │  x = x || y         │  Solo si x es FALSY             │
// │  &&=       │  x = x && y         │  Solo si x es TRUTHY            │
// │  ??=       │  x = x ?? y         │  Solo si x es NULL o UNDEFINED  │
// └─────────────────────────────────────────────────────────────────────┘
//
// ANALOGÍA DEL MUNDO REAL:
// Imagina que tienes una caja (variable) y quieres ponerle algo solo si
// está vacía (||=), solo si ya tiene algo (&&=), o solo si no existe (??=).
// -------------------------------------------------------------------------

function demonstrateLogicalAssignment() {
    console.clear();
    console.log('=== LOGICAL ASSIGNMENT OPERATORS ===\n');

    // -------------------------------------------------------------------------
    // OPERADOR ||= (OR lógico con asignación)
    // -------------------------------------------------------------------------
    // Asigna el valor de la derecha SOLO si el valor actual es FALSY.
    //
    // Valores FALSY en JavaScript:
    // ┌────────────────────────────────────────┐
    // │  false, 0, "", null, undefined, NaN    │
    // └────────────────────────────────────────┘
    //
    // ¿Cuándo usarlo?
    // - Para establecer valores por defecto
    // - Para inicializar variables que pueden estar vacías
    // -------------------------------------------------------------------------

    console.log('--- OPERADOR ||= (OR con asignación) ---');
    
    // Ejemplo 1: Configurar tema por defecto
    let theme = '';  // String vacío (falsy)
    console.log('Antes:', theme);  // ""
    
    theme ||= 'light';  // Como theme es falsy (""), asigna 'light'
    console.log('Después:', theme);  // "light"
    
    // Ejemplo 2: NO asigna si ya tiene valor truthy
    let language = 'es';  // String con contenido (truthy)
    console.log('\nAntes:', language);  // "es"
    
    language ||= 'en';  // Como language es truthy ("es"), NO asigna
    console.log('Después:', language);  // "es" (sin cambios)

    // -------------------------------------------------------------------------
    // OPERADOR &&= (AND lógico con asignación)
    // -------------------------------------------------------------------------
    // Asigna el valor de la derecha SOLO si el valor actual es TRUTHY.
    //
    // ¿Cuándo usarlo?
    // - Para actualizar valores solo si ya existen
    // - Para aplicar transformaciones condicionales
    // -------------------------------------------------------------------------

    console.log('\n--- OPERADOR &&= (AND con asignación) ---');
    
    // Ejemplo 1: Actualizar solo si existe
    let notifications = true;  // true (truthy)
    console.log('Antes:', notifications);  // true
    
    notifications &&= false;  // Como notifications es truthy, asigna false
    console.log('Después:', notifications);  // false
    
    // Ejemplo 2: NO asigna si es falsy
    let autoSave = false;  // false (falsy)
    console.log('\nAntes:', autoSave);  // false
    
    autoSave &&= true;  // Como autoSave es falsy, NO asigna
    console.log('Después:', autoSave);  // false (sin cambios)

    // -------------------------------------------------------------------------
    // OPERADOR ??= (Nullish Coalescing con asignación)
    // -------------------------------------------------------------------------
    // Asigna el valor de la derecha SOLO si el valor actual es NULL o UNDEFINED.
    //
    // DIFERENCIA CLAVE con ||=:
    // ┌──────────────────────────────────────────────────────────────┐
    // │  ||=  considera falsy: false, 0, "", null, undefined, NaN   │
    // │  ??=  considera "vacío": SOLO null y undefined              │
    // └──────────────────────────────────────────────────────────────┘
    //
    // ¿Cuándo usarlo?
    // - Cuando 0, false o "" son valores VÁLIDOS (no quieres sobreescribirlos)
    // - Para inicializar propiedades que pueden no existir
    // -------------------------------------------------------------------------

    console.log('\n--- OPERADOR ??= (Nullish Coalescing con asignación) ---');
    
    // Ejemplo 1: El problema con ||=
    let fontSize = 0;  // 0 es un valor VÁLIDO para tamaño de fuente
    console.log('Antes:', fontSize);  // 0
    
    fontSize ||= 16;  // ERROR: ||= ve 0 como falsy y lo sobreescribe
    console.log('Después de ||=:', fontSize);  // 16 (¡INCORRECTO! 0 era válido)
    
    // Ejemplo 2: La solución con ??=
    let volume = 0;  // 0 es un valor VÁLIDO para volumen
    console.log('\nAntes:', volume);  // 0
    
    volume ??= 50;  // CORRECTO: ??= solo asigna si es null/undefined
    console.log('Después de ??=:', volume);  // 0 (¡CORRECTO! Se mantiene)
    
    // Ejemplo 3: Asigna cuando es undefined
    let username;  // undefined
    console.log('\nAntes:', username);  // undefined
    
    username ??= 'Invitado';  // Como es undefined, asigna
    console.log('Después:', username);  // "Invitado"

    console.log('\n✅ Revisa los ejemplos en la consola');
}

// -------------------------------------------------------------------------
// 3. ARRAY.AT() - ÍNDICES NEGATIVOS (ES2022)
// -------------------------------------------------------------------------
// El método .at() permite acceder a elementos de un array usando índices
// negativos para contar desde el final.
//
// ┌─────────────────────────────────────────────────────────────┐
// │  MÉTODO      │  EJEMPLO              │  RESULTADO          │
// ├─────────────────────────────────────────────────────────────┤
// │  array[0]    │  Primer elemento      │  No soporta negativos│
// │  array.at(0) │  Primer elemento      │  Soporta negativos  │
// │  array.at(-1)│  Último elemento      │  ¡NUEVO!            │
// │  array.at(-2)│  Penúltimo elemento   │  ¡NUEVO!            │
// └─────────────────────────────────────────────────────────────┘
//
// ANALOGÍA DEL MUNDO REAL:
// Imagina una fila de personas. Con [0] cuentas desde el principio.
// Con .at(-1) cuentas desde el final (como decir "el último").
//
// ¿Por qué es útil?
// - Antes: array[array.length - 1] (verboso y propenso a errores)
// - Ahora: array.at(-1) (limpio y legible)
// -------------------------------------------------------------------------

function demonstrateArrayAt() {
    console.clear();
    console.log('=== ARRAY.AT() - ÍNDICES NEGATIVOS ===\n');

    const frutas = ['manzana', 'banana', 'cereza', 'durazno', 'uva'];
    
    console.log('Array:', frutas);
    console.log('Longitud:', frutas.length);  // 5

    // -------------------------------------------------------------------------
    // ACCESO TRADICIONAL (antes de ES2022)
    // -------------------------------------------------------------------------
    console.log('\n--- ACCESO TRADICIONAL ---');
    
    // Primer elemento
    console.log('Primer elemento [0]:', frutas[0]);  // "manzana"
    
    // Último elemento (forma verbosa)
    console.log('Último elemento [length-1]:', frutas[frutas.length - 1]);  // "uva"
    
    // Penúltimo elemento (aún más verboso)
    console.log('Penúltimo [length-2]:', frutas[frutas.length - 2]);  // "durazno"

    // -------------------------------------------------------------------------
    // ACCESO MODERNO CON .AT() (ES2022)
    // -------------------------------------------------------------------------
    console.log('\n--- ACCESO MODERNO CON .AT() ---');
    
    // Primer elemento (índice positivo)
    console.log('Primer elemento .at(0):', frutas.at(0));  // "manzana"
    
    // Último elemento (índice negativo)
    console.log('Último elemento .at(-1):', frutas.at(-1));  // "uva"
    
    // Penúltimo elemento
    console.log('Penúltimo .at(-2):', frutas.at(-2));  // "durazno"
    
    // Tercer elemento desde el final
    console.log('Tercero desde el final .at(-3):', frutas.at(-3));  // "cereza"

    // -------------------------------------------------------------------------
    // CASOS DE USO PRÁCTICOS
    // -------------------------------------------------------------------------
    console.log('\n--- CASOS DE USO PRÁCTICOS ---');
    
    // Caso 1: Obtener el último mensaje de un chat
    const mensajes = ['Hola', '¿Cómo estás?', 'Bien, gracias', '¡Genial!'];
    const ultimoMensaje = mensajes.at(-1);
    console.log('Último mensaje:', ultimoMensaje);  // "¡Genial!"
    
    // Caso 2: Obtener la última coordenada de una ruta
    const ruta = [
        { x: 0, y: 0 },
        { x: 10, y: 5 },
        { x: 20, y: 15 },
        { x: 30, y: 20 }
    ];
    const posicionActual = ruta.at(-1);
    console.log('Posición actual:', posicionActual);  // { x: 30, y: 20 }
    
    // Caso 3: Acceder al último carácter de un string
    const palabra = 'JavaScript';
    console.log('Última letra:', palabra.at(-1));  // "t"
    console.log('Penúltima letra:', palabra.at(-2));  // "p"

    // -------------------------------------------------------------------------
    // COMPARACIÓN: ¿Cuándo usar cada uno?
    // -------------------------------------------------------------------------
    console.log('\n--- ¿CUÁNDO USAR CADA UNO? ---');
    console.log('┌─────────────────────────────────────────────────────┐');
    console.log('│  Usa array[i] cuando:                               │');
    console.log('│  - Sabes el índice exacto (0, 1, 2...)              │');
    console.log('│  - No necesitas contar desde el final               │');
    console.log('│                                                     │');
    console.log('│  Usa array.at(i) cuando:                            │');
    console.log('│  - Necesitas el último elemento (-1)                │');
    console.log('│  - Necesitas el penúltimo (-2)                      │');
    console.log('│  - El índice puede ser negativo                     │');
    console.log('└─────────────────────────────────────────────────────┘');

    console.log('\n✅ Revisa los ejemplos en la consola');
}

// -------------------------------------------------------------------------
// 4. STRUCTUREDCLONE() - CLONACIÓN PROFUNDA (ES2022)
// -------------------------------------------------------------------------
// structuredClone() crea una COPIA PROFUNDA de un objeto o array.
//
// ¿Qué es una copia profunda?
// ┌─────────────────────────────────────────────────────────────────┐
// │  COPIA SUPERFICIAL (shallow)        │  COPIA PROFUNDA (deep)    │
// ├─────────────────────────────────────────────────────────────────┤
// │  Solo copia el primer nivel         │  Copia TODOS los niveles  │
// │  Los objetos anidados se comparten  │  Todo es independiente    │
// │  Cambiar uno afecta al otro         │  Cambiar uno NO afecta    │
// └─────────────────────────────────────────────────────────────────┘
//
// ANALOGÍA DEL MUNDO REAL:
// - Copia superficial: Fotocopias la portada de un libro, pero las páginas
//   internas siguen siendo del original (si las modificas, cambias el original).
// - Copia profunda: Reescribes el libro completo página por página
//   (ahora tienes un libro totalmente independiente).
//
// ¿Por qué es importante?
// - Evita bugs sutiles cuando modificas objetos anidados
// - Es nativo del navegador (antes necesitabas lodash.cloneDeep)
// -------------------------------------------------------------------------

function demonstrateStructuredClone() {
    console.clear();
    console.log('=== STRUCTUREDCLONE() - CLONACIÓN PROFUNDA ===\n');

    // -------------------------------------------------------------------------
    // EL PROBLEMA: Copia superficial con spread (...)
    // -------------------------------------------------------------------------
    console.log('--- EL PROBLEMA: Copia superficial ---');
    
    const usuario1 = {
        nombre: 'Ana',
        configuracion: {
            tema: 'oscuro',
            notificaciones: true
        }
    };
    
    // Copia superficial con spread
    const copiaSuperficial = { ...usuario1 };
    
    console.log('Original:', usuario1);
    console.log('Copia superficial:', copiaSuperficial);
    
    // Modificamos la configuración en la copia
    copiaSuperficial.configuracion.tema = 'claro';
    
    console.log('\nDespués de modificar la copia:');
    console.log('Original:', usuario1.configuracion.tema);  // "claro" ¡SE MODIFICÓ!
    console.log('Copia:', copiaSuperficial.configuracion.tema);  // "claro"
    
    console.log('⚠️  PROBLEMA: La copia superficial comparte objetos anidados');

    // -------------------------------------------------------------------------
    // LA SOLUCIÓN: Copia profunda con structuredClone()
    // -------------------------------------------------------------------------
    console.log('\n--- LA SOLUCIÓN: Copia profunda ---');
    
    const usuario2 = {
        nombre: 'Carlos',
        configuracion: {
            tema: 'oscuro',
            notificaciones: true
        },
        archivosRecientes: ['doc1.txt', 'doc2.txt']
    };
    
    // Copia profunda con structuredClone()
    const copiaProfunda = structuredClone(usuario2);
    
    console.log('Original:', usuario2);
    console.log('Copia profunda:', copiaProfunda);
    
    // Modificamos la configuración en la copia
    copiaProfunda.configuracion.tema = 'claro';
    copiaProfunda.archivosRecientes.push('doc3.txt');
    
    console.log('\nDespués de modificar la copia:');
    console.log('Original tema:', usuario2.configuracion.tema);  // "oscuro" ¡NO SE MODIFICÓ!
    console.log('Copia tema:', copiaProfunda.configuracion.tema);  // "claro"
    console.log('Original archivos:', usuario2.archivosRecientes);  // ['doc1.txt', 'doc2.txt']
    console.log('Copia archivos:', copiaProfunda.archivosRecientes);  // ['doc1.txt', 'doc2.txt', 'doc3.txt']
    
    console.log('✅ SOLUCIÓN: La copia profunda es totalmente independiente');

    // -------------------------------------------------------------------------
    // CASOS DE USO PRÁCTICOS
    // -------------------------------------------------------------------------
    console.log('\n--- CASOS DE USO PRÁCTICOS ---');
    
    // Caso 1: Guardar estado anterior para "deshacer"
    const estadoActual = {
        posicion: { x: 100, y: 200 },
        zoom: 1.5,
        filtros: ['brillo', 'contraste']
    };
    
    const estadoAnterior = structuredClone(estadoActual);
    console.log('Estado guardado para deshacer:', estadoAnterior);
    
    // Caso 2: Pasar datos entre componentes sin compartir referencias
    const datosUsuario = {
        perfil: { nombre: 'María', edad: 30 },
        preferencias: { idioma: 'es', moneda: 'EUR' }
    };
    
    const datosParaComponente = structuredClone(datosUsuario);
    console.log('Datos independientes para componente:', datosParaComponente);

    // -------------------------------------------------------------------------
    // COMPARACIÓN DE MÉTODOS DE CLONACIÓN
    // -------------------------------------------------------------------------
    console.log('\n--- COMPARACIÓN DE MÉTODOS ---');
    console.log('┌──────────────────────────────────────────────────────────────┐');
    console.log('│  MÉTODO              │  PROFUNDIDAD  │  RENDIMIENTO  │  USO  │');
    console.log('├──────────────────────────────────────────────────────────────┤');
    console.log('│  { ...obj }          │  Superficial  │  Muy rápido   │  Simple│');
    console.log('│  Object.assign()     │  Superficial  │  Rápido       │  Simple│');
    console.log('│  JSON.parse/stringify│  Profunda     │  Lento        │  Limitado│');
    console.log('│  structuredClone()   │  Profunda     │  Rápido       │  Moderno│');
    console.log('└──────────────────────────────────────────────────────────────┘');
    console.log('\n⚠️  JSON.parse/stringify NO soporta:');
    console.log('   - Funciones');
    console.log('   - undefined');
    console.log('   - Date (se convierte a string)');
    console.log('   - Map, Set, RegExp');
    console.log('\n✅ structuredClone() SÍ soporta todo eso');

    console.log('\n✅ Revisa los ejemplos en la consola');
}

// -------------------------------------------------------------------------
// 5. OBJECT.ENTRIES(), OBJECT.VALUES(), OBJECT.KEYS() (ES2017)
// -------------------------------------------------------------------------
// Estos métodos permiten convertir objetos en arrays para poder iterarlos.
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  MÉTODO              │  DEVUELVE                                │
// ├──────────────────────────────────────────────────────────────────┤
// │  Object.keys(obj)    │  Array con las CLAVES                   │
// │  Object.values(obj)  │  Array con los VALORES                  │
// │  Object.entries(obj) │  Array con pares [clave, valor]         │
// └──────────────────────────────────────────────────────────────────┘
//
// ANALOGÍA DEL MUNDO REAL:
// Imagina un diccionario:
// - keys() = Lista de todas las palabras (sin definiciones)
// - values() = Lista de todas las definiciones (sin palabras)
// - entries() = Lista de pares (palabra, definición)
//
// ¿Por qué son útiles?
// - Los objetos NO son iterables con for...of (los arrays sí)
// - Estos métodos convierten objetos en arrays iterables
// -------------------------------------------------------------------------

function demonstrateObjectMethods() {
    console.clear();
    console.log('=== OBJECT.ENTRIES/VALUES/KEYS ===\n');

    const producto = {
        nombre: 'Laptop',
        precio: 999,
        marca: 'Dell',
        stock: 15
    };
    
    console.log('Objeto original:', producto);

    // -------------------------------------------------------------------------
    // OBJECT.KEYS() - Obtener todas las claves
    // -------------------------------------------------------------------------
    console.log('\n--- OBJECT.KEYS() ---');
    
    const claves = Object.keys(producto);
    console.log('Claves:', claves);  // ['nombre', 'precio', 'marca', 'stock']
    console.log('Cantidad de propiedades:', claves.length);  // 4
    
    // Caso de uso: Validar que un objeto tenga todas las propiedades requeridas
    const propiedadesRequeridas = ['nombre', 'precio', 'marca'];
    const tieneTodas = propiedadesRequeridas.every(prop => claves.includes(prop));
    console.log('¿Tiene todas las propiedades requeridas?', tieneTodas);  // true

    // -------------------------------------------------------------------------
    // OBJECT.VALUES() - Obtener todos los valores
    // -------------------------------------------------------------------------
    console.log('\n--- OBJECT.VALUES() ---');
    
    const valores = Object.values(producto);
    console.log('Valores:', valores);  // ['Laptop', 999, 'Dell', 15]
    
    // Caso de uso: Calcular estadísticas de valores numéricos
    const valoresNumericos = Object.values(producto).filter(v => typeof v === 'number');
    console.log('Valores numéricos:', valoresNumericos);  // [999, 15]
    
    const suma = valoresNumericos.reduce((acc, val) => acc + val, 0);
    console.log('Suma de valores numéricos:', suma);  // 1014

    // -------------------------------------------------------------------------
    // OBJECT.ENTRIES() - Obtener pares [clave, valor]
    // -------------------------------------------------------------------------
    console.log('\n--- OBJECT.ENTRIES() ---');
    
    const entradas = Object.entries(producto);
    console.log('Entradas:', entradas);
    // [['nombre', 'Laptop'], ['precio', 999], ['marca', 'Dell'], ['stock', 15]]
    
    // Caso de uso 1: Iterar sobre un objeto con for...of
    console.log('\nIterando con for...of:');
    for (const [clave, valor] of Object.entries(producto)) {
        console.log(`  ${clave}: ${valor}`);
    }
    
    // Caso de uso 2: Transformar objeto en array de objetos
    const arrayDeObjetos = Object.entries(producto).map(([clave, valor]) => ({
        propiedad: clave,
        valor: valor
    }));
    console.log('\nArray de objetos:', arrayDeObjetos);
    
    // Caso de uso 3: Filtrar propiedades
    const propiedadesNumericas = Object.entries(producto)
        .filter(([clave, valor]) => typeof valor === 'number')
        .reduce((obj, [clave, valor]) => {
            obj[clave] = valor;
            return obj;
        }, {});
    console.log('\nSolo propiedades numéricas:', propiedadesNumericas);

    // -------------------------------------------------------------------------
    // COMPARACIÓN VISUAL
    // -------------------------------------------------------------------------
    console.log('\n--- COMPARACIÓN VISUAL ---');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│  Objeto: { nombre: "Laptop", precio: 999 }             │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│  keys():    ["nombre", "precio"]                       │');
    console.log('│  values():  ["Laptop", 999]                            │');
    console.log('│  entries(): [["nombre", "Laptop"], ["precio", 999]]   │');
    console.log('└─────────────────────────────────────────────────────────┘');

    console.log('\n✅ Revisa los ejemplos en la consola');
}

// -------------------------------------------------------------------------
// 6. APLICACIÓN PRÁCTICA: Dashboard de Configuración
// -------------------------------------------------------------------------
// Ahora usamos todas las features aprendidas en un caso real.
// -------------------------------------------------------------------------

function loadDefaultConfig() {
    // Usamos structuredClone para evitar modificar el objeto original
    userConfig = structuredClone(defaultConfig);
    addToHistory('Configuración por defecto cargada');
    renderConfig();
}

function applyPartialConfig() {
    // Configuración parcial (puede tener valores undefined)
    const partialConfig = {
        theme: 'dark',
        fontSize: 18,
        // language: undefined (no se especifica)
        // notifications: undefined (no se especifica)
    };
    
    // Usamos ??= para aplicar solo los valores que NO son undefined
    userConfig.theme ??= partialConfig.theme;
    userConfig.language ??= partialConfig.language || 'es';
    userConfig.fontSize ??= partialConfig.fontSize;
    userConfig.notifications ??= partialConfig.notifications ?? true;
    
    // Usamos &&= para actualizar solo si ya existe
    userConfig.autoSave &&= true;  // Mantiene autoSave si ya estaba configurado
    
    addToHistory('Configuración parcial aplicada');
    renderConfig();
}

function resetConfig() {
    userConfig = {};
    addToHistory('Configuración reseteada');
    renderConfig();
}

function addToHistory(action) {
    const entry = {
        action: action,
        timestamp: new Date().toLocaleTimeString('es-ES'),
        config: structuredClone(userConfig)  // Guardamos una copia profunda
    };
    
    configHistory.push(entry);
    renderHistory();
}

function renderConfig() {
    const display = document.getElementById('configDisplay');
    
    if (Object.keys(userConfig).length === 0) {
        display.innerHTML = '<p style="color: #999; font-style: italic;">No hay configuración cargada</p>';
        return;
    }
    
    // Usamos Object.entries para iterar sobre el objeto
    const html = Object.entries(userConfig).map(([key, value]) => {
        const displayValue = value === undefined || value === null 
            ? '<span class="undefined">No definido</span>'
            : JSON.stringify(value);
        
        return `
            <div class="config-item">
                <label>${key}</label>
                <div class="value">${displayValue}</div>
            </div>
        `;
    }).join('');
    
    display.innerHTML = html;
    renderStats();
}

function renderHistory() {
    const list = document.getElementById('historyList');
    
    // Usamos .at() para mostrar los últimos 5 cambios
    const ultimosCambios = configHistory.slice(-5);
    
    const html = ultimosCambios.map(entry => `
        <div class="history-item">
            <div>${entry.action}</div>
            <div class="timestamp">${entry.timestamp}</div>
        </div>
    `).join('');
    
    list.innerHTML = html || '<p style="color: #999;">No hay cambios registrados</p>';
}

function renderStats() {
    const display = document.getElementById('statsDisplay');
    
    const totalProps = Object.keys(userConfig).length;
    const definedProps = Object.values(userConfig).filter(v => v !== undefined && v !== null).length;
    const lastChange = configHistory.at(-1);  // Usamos .at(-1) para el último
    
    display.innerHTML = `
        <div class="stat-card">
            <div class="label">Propiedades totales</div>
            <div class="number">${totalProps}</div>
        </div>
        <div class="stat-card">
            <div class="label">Propiedades definidas</div>
            <div class="number">${definedProps}</div>
        </div>
        <div class="stat-card">
            <div class="label">Último cambio</div>
            <div class="number" style="font-size: 1.2rem;">${lastChange ? lastChange.timestamp : 'N/A'}</div>
        </div>
    `;
}

// -------------------------------------------------------------------------
// 7. EVENT LISTENERS
// -------------------------------------------------------------------------

document.getElementById('btnLoadDefaults').addEventListener('click', loadDefaultConfig);
document.getElementById('btnApplyPartial').addEventListener('click', applyPartialConfig);
document.getElementById('btnReset').addEventListener('click', resetConfig);

document.getElementById('btnLogicalExamples').addEventListener('click', demonstrateLogicalAssignment);
document.getElementById('btnAtExamples').addEventListener('click', demonstrateArrayAt);
document.getElementById('btnCloneExamples').addEventListener('click', demonstrateStructuredClone);
document.getElementById('btnObjectExamples').addEventListener('click', demonstrateObjectMethods);

// -------------------------------------------------------------------------
// 8. INICIALIZACIÓN
// -------------------------------------------------------------------------

console.log('🚀 Dashboard de Configuración cargado');
console.log('📚 Haz clic en los botones de ejemplos para ver las features modernas en acción');

renderConfig();
renderHistory();

// -------------------------------------------------------------------------
// RESUMEN DE CONCEPTOS APRENDIDOS
// -------------------------------------------------------------------------
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO                    │  AÑO  │  USO PRINCIPAL              │
// ├─────────────────────────────────────────────────────────────────────┤
// │  ||= (OR assignment)         │  2021 │  Asignar si es falsy        │
// │  &&= (AND assignment)        │  2021 │  Asignar si es truthy       │
// │  ??= (Nullish assignment)    │  2021 │  Asignar si es null/undef   │
// │  Array.at()                  │  2022 │  Índices negativos          │
// │  structuredClone()           │  2022 │  Clonación profunda         │
// │  Object.keys()               │  2017 │  Array de claves            │
// │  Object.values()             │  2017 │  Array de valores           │
// │  Object.entries()            │  2017 │  Array de pares [k,v]       │
// └─────────────────────────────────────────────────────────────────────┘
//
// CONSEJOS PRÁCTICOS:
// 1. Usa ??= en lugar de ||= cuando 0, false o "" sean valores válidos
// 2. Usa .at(-1) en lugar de array[array.length - 1] para el último elemento
// 3. Usa structuredClone() cuando necesites copias profundas de objetos
// 4. Usa Object.entries() para iterar sobre objetos con for...of
// 5. Combina estas features para escribir código más limpio y moderno
//
// PRÓXIMOS PASOS:
// - Practica con los botones de ejemplos interactivos
// - Abre la consola (F12) para ver las demostraciones detalladas
// - Intenta aplicar estas features en tus propios proyectos
// -------------------------------------------------------------------------
