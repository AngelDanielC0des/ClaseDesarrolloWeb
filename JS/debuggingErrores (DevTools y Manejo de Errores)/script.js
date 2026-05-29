// =========================================================================
// DEBUGGING Y MANEJO DE ERRORES - DevTools del Navegador
// =========================================================================
//
// ¿QUÉ ES EL DEBUGGING?
// Es el proceso de encontrar y corregir errores (bugs) en tu código.
// El nombre viene de Grace Hopper, quien en 1947 encontró una polilla
// (bug) atrapada en un relé de la computadora Harvard Mark II.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANALOGÍA DEL MUNDO REAL:                                       │
// │                                                                   │
// │  Depurar código es como ser DETECTIVE:                           │
// │  1. Hay un "crimen" (el bug: la app no funciona como debería)   │
// │  2. Tienes "pistas" (console.log, errores, comportamientos)     │
// │  3. Usas "herramientas forenses" (DevTools, breakpoints)        │
// │  4. Interrogas a "testigos" (variables, estado de la app)       │
// │  5. Resuelves el caso (encuentras y corriges el bug)            │
// │                                                                   │
// └─────────────────────────────────────────────────────────────────┘
//
// ESTADÍSTICA CLAVE:
// Los desarrolladores pasan entre el 30-50% de su tiempo depurando.
// Dominar estas herramientas te hará SIGNIFICATIVAMENTE más productivo.
//
// INSTRUCCIONES:
// 1. Abre las DevTools del navegador (F12 o Ctrl+Shift+I)
// 2. Ve a la pestaña "Console" para ver los outputs
// 3. Prueba cada botón y observa los diferentes resultados
// 4. Para la sección 6, ve a "Sources" y pon breakpoints
// =========================================================================

// =========================================================================
// SECCIÓN 0: CAPTURA GLOBAL DE ERRORES (La "red de seguridad")
// =========================================================================
//
// ¿QUÉ SON LOS HANDLERS GLOBALES?
// Son la ÚLTIMA línea de defensa contra errores que nadie capturó.
// Si un error escapa de todos los try/catch, estos handlers lo atrapan.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  JERARQUÍA DE CAPTURA DE ERRORES:                               │
// │                                                                   │
// │  1. try/catch local          → Primera línea de defensa         │
// │  2. .catch() en promesas     → Segunda línea                    │
// │  3. window.onerror           → Red de seguridad (este handler)  │
// │  4. window.onunhandledrejection → Red para promesas perdidas    │
// │                                                                   │
// │  ANALOGÍA:                                                       │
// │  try/catch = El portero de tu edificio (filtra lo normal)       │
// │  window.onerror = La policía (atiende lo que se escapó)        │
// └─────────────────────────────────────────────────────────────────┘
//
// EN PRODUCCIÓN:
// Estos handlers se conectan a servicios de monitoreo de errores:
// - Sentry (sentry.io) → El más popular, gratuito para proyectos pequeños
// - LogRocket → Graba la sesión del usuario para reproducir bugs
// - Bugsnag → Especializado en móviles y web
//
// Así cuando un usuario tiene un error, tú lo sabes ANTES de que
// te escriba para quejarse.
// =========================================================================

// window.onerror: Captura CUALQUIER error síncrono no manejado.
// Recibe 5 parámetros con toda la información del error:
// - mensaje: Texto descriptivo del error
// - archivo: URL del archivo donde ocurrió
// - linea: Número de línea exacta
// - columna: Número de columna
// - error: El objeto Error completo (con stack trace)
//
// Retornar true indica al navegador que YA manejamos el error
// (evita que aparezca el error por defecto en la consola).
window.onerror = function (mensaje, archivo, linea, columna, error) {
    mostrarEnUI('globalOutput', `Error global capturado: ${mensaje} (línea ${linea})`, 'error');
    console.error('Error global:', mensaje, 'en línea', linea);
    mostrarBannerError(`Error no capturado: ${mensaje}`);
    return true;
};

// window.onunhandledrejection: Captura promesas rechazadas SIN .catch()
// Esto es CRÍTICO porque las promesas sin catch fallan EN SILENCIO
// (no muestran error en consola sin este handler).
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  PROMESA SIN CATCH (peligroso):                                 │
// │                                                                   │
// │  fetch('/api/datos')                                             │
// │    .then(r => r.json())                                          │
// │    .then(data => procesar(data));                                │
// │    // ¿Qué pasa si fetch falla? → Silencio total sin handler    │
// │                                                                   │
// │  CON onunhandledrejection: al menos te enteras del error         │
// └─────────────────────────────────────────────────────────────────┘
window.onunhandledrejection = function (event) {
    mostrarEnUI('globalOutput', `Promesa rechazada sin .catch(): ${event.reason}`, 'error');
    console.error('Promesa sin catch:', event.reason);
    mostrarBannerError(`Promesa rechazada: ${event.reason}`);
};

// Función auxiliar que muestra un banner rojo en la parte inferior
// de la pantalla cuando ocurre un error global. Se auto-elimina
// después de 8 segundos para no molestar permanentemente.
function mostrarBannerError(mensaje) {
    const existente = document.querySelector('.global-error-banner');
    if (existente) existente.remove();

    const banner = document.createElement('div');
    banner.className = 'global-error-banner';
    banner.innerHTML = `
        <span>${mensaje}</span>
        <button onclick="this.parentElement.remove()">Cerrar</button>
    `;
    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 8000);
}

// =========================================================================
// SECCIÓN 1: CONSOLE MASTER - Métodos avanzados de console
// =========================================================================
//
// ¿SABÍAS QUE console.log() ES SOLO EL 10% DE LO QUE OFRECE CONSOLE?
// La mayoría de desarrolladores solo usa console.log(), pero el objeto
// console tiene más de 20 métodos que pueden ahorrarte HORAS de debugging.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  NIVEL PRINCIPIANTE:          NIVEL PROFESIONAL:                │
// │                                                                   │
// │  console.log("dato:", x)      console.table(arrayDeObjetos)     │
// │  console.log("error")         console.error("error con estilo") │
// │  console.log("inicio")        console.time("operación")         │
// │  console.log("fin")           console.timeEnd("operación")      │
// │  (todo con log)               console.group("contexto")         │
// │                               console.trace("¿cómo llegué?)     │
// └─────────────────────────────────────────────────────────────────┘
// =========================================================================

// --- console.log() básico ---
// Aunque es el más simple, tiene trucos que muchos desconocen:
// - %c: Aplica estilos CSS al texto de la consola
// - Múltiples argumentos: muestra objetos expandibles
// - Template literals: interpolación con ${}
function demoLog() {
    console.log('--- console.log() ---');
    console.log('Mensaje estándar');
    console.log('Con template literals:', `2 + 2 = ${2 + 2}`);
    console.log('Con múltiples argumentos:', { nombre: 'Ana', edad: 25 }, [1, 2, 3]);
    // %c permite aplicar estilos CSS al texto de la consola
    console.log('%c Texto con estilo ', 'background: #2c5364; color: white; font-size: 16px; padding: 5px;');
    mostrarEnUI('errorOutput', 'console.log() - Revisa la consola (F12)', 'info');
}

// --- console.table() - Muestra arrays/objetos como tabla ---
//
// ¿POR QUÉ USAR console.table() EN VEZ DE console.log()?
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  console.log(usuarios):          console.table(usuarios):       │
// │                                                                   │
// │  (3) [{...}, {...}, {...}]       ┌────┬────────┬───────┐        │
// │  ▶ 0: {id:1, nombre:"Ana"}      │ id │ nombre │ rol   │        │
// │  ▶ 1: {id:2, nombre:"Carlos"}   ├────┼────────┼───────┤        │
// │  ▶ 2: {id:3, nombre:"María"}    │ 1  │ Ana    │ admin │        │
// │                                  │ 2  │ Carlos │ editor│        │
// │  (hay que expandir cada uno)     │ 3  │ María  │ viewer│        │
// │                                  └────┴────────┴───────┘        │
// │                                  (todo visible de un vistazo)   │
// └─────────────────────────────────────────────────────────────────┘
//
// El segundo parámetro (opcional) filtra qué columnas mostrar:
// console.table(usuarios, ['nombre', 'rol']) → solo esas 2 columnas
function demoTable() {
    console.log('--- console.table() ---');

    const usuarios = [
        { id: 1, nombre: 'Ana García', rol: 'admin', activo: true },
        { id: 2, nombre: 'Carlos López', rol: 'editor', activo: false },
        { id: 3, nombre: 'María Rodríguez', rol: 'viewer', activo: true },
        { id: 4, nombre: 'Juan Martínez', rol: 'admin', activo: true }
    ];

    console.table(usuarios);
    console.table(usuarios, ['nombre', 'rol']);

    mostrarEnUI('errorOutput', 'console.table() - Tabla de usuarios mostrada en consola', 'info');
}

// --- console.group() - Agrupa mensajes relacionados ---
//
// ¿POR QUÉ USAR console.group()?
// Cuando tienes muchos logs, se hace difícil saber qué mensajes
// están relacionados. group() los organiza en bloques colapsables.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  SIN group (caos):              CON group (organizado):         │
// │                                                                   │
// │  Edad: 25                       ▼ Usuario: Ana García           │
// │  Rol: Admin                       Edad: 25                      │
// │  Último acceso: hoy               Rol: Admin                    │
// │  Crear: Sí                        ▼ Permisos                    │
// │  Editar: Sí                         Crear: Sí                   │
// │  Eliminar: Sí                       Editar: Sí                  │
// │  Edad: 30                           Eliminar: Sí                │
// │  Rol: Editor                      ▼ Usuario: Carlos López       │
// │                                     Edad: 30                    │
// │  (¿qué va con qué?)                 Rol: Editor                 │
// └─────────────────────────────────────────────────────────────────┘
//
// Los grupos se pueden ANIDAR (grupos dentro de grupos) para
// crear jerarquías de información.
function demoGroup() {
    console.log('--- console.group() ---');

    console.group('Usuario: Ana García');
    console.log('Edad: 25');
    console.log('Rol: Admin');
    console.log('Último acceso: hoy');
    console.group('Permisos');
    console.log('Crear: Sí');
    console.log('Editar: Sí');
    console.log('Eliminar: Sí');
    console.groupEnd();
    console.groupEnd();

    console.group('Usuario: Carlos López');
    console.log('Edad: 30');
    console.log('Rol: Editor');
    console.groupEnd();

    mostrarEnUI('errorOutput', 'console.group() - Grupos jerárquicos mostrados en consola', 'info');
}

// --- console.time() / console.timeEnd() - Cronometrar operaciones ---
//
// ¿POR QUÉ USAR console.time() EN VEZ DE Date.now()?
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  FORMA MANUAL (propenso a errores):                              │
// │  const inicio = Date.now();                                      │
// │  // ... código ...                                               │
// │  const fin = Date.now();                                         │
// │  console.log(`Tardó ${fin - inicio}ms`);                         │
// │                                                                   │
// │  FORMA CON console.time (limpio y preciso):                      │
// │  console.time('mi-operacion');                                   │
// │  // ... código ...                                               │
// │  console.timeEnd('mi-operacion');  // → "mi-operacion: 45.2ms"  │
// │                                                                   │
// │  VENTAJAS:                                                       │
// │  - No necesitas variables temporales                             │
// │  - Puedes tener múltiples cronómetros activos simultáneamente    │
// │  - El navegador muestra el resultado formateado automáticamente  │
// │  - Precisión de microsegundos (no solo milisegundos)             │
// └─────────────────────────────────────────────────────────────────┘
//
// Aquí comparamos 3 formas de sumar 1 millón de números para ver
// cuál es más rápida. ¡Los resultados pueden sorprenderte!
function demoTime() {
    console.log('--- console.time() ---');

    console.time('bucle-for');
    let suma = 0;
    for (let i = 0; i < 1000000; i++) {
        suma += i;
    }
    console.timeEnd('bucle-for');

    console.time('array-reduce');
    const numeros = Array.from({ length: 1000000 }, (_, i) => i);
    const sumaReduce = numeros.reduce((acc, n) => acc + n, 0);
    console.timeEnd('array-reduce');

    console.time('array-for-of');
    let sumaForOf = 0;
    for (const n of numeros) {
        sumaForOf += n;
    }
    console.timeEnd('array-for-of');

    mostrarEnUI('errorOutput', 'console.time() - Tiempos de 3 métodos de suma mostrados en consola', 'info');
}

// --- console.trace() - Muestra la pila de llamadas (call stack) ---
//
// ¿QUÉ ES LA PILA DE LLAMADAS (CALL STACK)?
// Es el "historial" de funciones que se llamaron unas a otras.
// Cuando una función A llama a B, y B llama a C, la pila es: A → B → C.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ¿CUÁNDO USAR console.trace()?                                  │
// │                                                                   │
// │  Imagina que una función se llama desde 5 sitios diferentes      │
// │  y no sabes cuál la invocó esta vez. console.trace() te muestra │
// │  el "camino" completo que siguió la ejecución para llegar ahí.  │
// │                                                                   │
// │  ANALOGÍA:                                                       │
// │  Es como mirar el historial de tu GPS: te muestra todas las     │
// │  calles (funciones) por las que pasaste para llegar a tu         │
// │  destino actual (la línea de código actual).                     │
// │                                                                   │
// │  SALIDA EN CONSOLA:                                              │
// │  funcionC                                                        │
// │    ← funcionB                                                    │
// │      ← funcionA                                                  │
// │        ← demoTrace                                               │
// │          ← (click event handler)                                 │
// └─────────────────────────────────────────────────────────────────┘
function demoTrace() {
    console.log('--- console.trace() ---');

    function funcionA() {
        funcionB();
    }

    function funcionB() {
        funcionC();
    }

    function funcionC() {
        console.trace('Trazando la pila de llamadas desde funcionC');
    }

    funcionA();
    mostrarEnUI('errorOutput', 'console.trace() - Pila de llamadas A → B → C mostrada en consola', 'info');
}

// --- console.count() - Cuenta cuántas veces se invoca ---
//
// ¿CUÁNDO USARLO?
// - Saber cuántas veces se pulsa un botón
// - Contar cuántas veces se ejecuta un bucle
// - Verificar si una función se llama más veces de las esperadas
//
// console.countReset('etiqueta') reinicia el contador a 0.
function demoCount() {
    console.log('--- console.count() ---');
    console.count('botón pulsado');
    console.count('botón pulsado');
    console.count('botón pulsado');
    console.count('otro evento');
    console.count('botón pulsado');
    console.countReset('botón pulsado');
    console.count('botón pulsado (tras reset)');
    mostrarEnUI('errorOutput', 'console.count() - Contador de invocaciones en consola', 'info');
}

// --- console.assert() - Aserciones (solo muestra si la condición es falsa) ---
//
// ¿QUÉ ES UNA ASERCIÓN?
// Es una "apuesta" de que algo es verdadero. Si tu apuesta es CORRECTA,
// no pasa nada (silencio). Si es INCORRECTA, se muestra un error.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  SINTAXIS: console.assert(condición, mensajeSiFalla)            │
// │                                                                   │
// │  console.assert(2 + 2 === 4, 'Math roto')  → Silencio (correcto)│
// │  console.assert(2 + 2 === 5, 'Math roto')  → Error: Math roto   │
// │                                                                   │
// │  ANALOGÍA:                                                       │
// │  Es como un detector de humo:                                    │
// │  - Si NO hay fuego → silencio total                              │
// │  - Si HAY fuego → suena la alarma                                │
// └─────────────────────────────────────────────────────────────────┘
//
// Es útil para verificar precondiciones y postcondiciones en funciones.
function demoAssert() {
    console.log('--- console.assert() ---');

    const edad = 15;
    console.assert(edad >= 18, `Edad ${edad} es menor de 18`);
    console.assert(edad > 0, 'La edad debe ser positiva');

    const usuarios = [{ nombre: 'Ana' }, { nombre: 'Carlos' }];
    console.assert(usuarios.length > 5, `Solo hay ${usuarios.length} usuarios, se esperaban más de 5`);

    mostrarEnUI('errorOutput', 'console.assert() - Aserciones fallidas mostradas en consola', 'warning');
}

// =========================================================================
// SECCIÓN 2: TRY/CATCH LAB - Captura de errores
// =========================================================================
//
// ¿QUÉ ES TRY/CATCH?
// Es el mecanismo fundamental de JavaScript para manejar errores.
// Envuelves código "peligroso" en try, y si algo falla, catch lo atrapa.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANALOGÍA DEL MUNDO REAL:                                       │
// │                                                                   │
// │  Imagina que eres un trapecista de circo:                        │
// │                                                                   │
// │  try    = Tu actuación en el trapecio (puedes caer)             │
// │  catch  = La red de seguridad (te atrapa si caes)               │
// │  finally = Saludar al público (lo haces caigas o no)            │
// │                                                                   │
// │  Sin try/catch = Actuar sin red → si caes, el show se acaba    │
// │  Con try/catch = Actuar con red → si caes, te levantas y sigues│
// └─────────────────────────────────────────────────────────────────┘
//
// ES FUNDAMENTAL PARA:
// - Parsear datos externos (JSON, respuestas de API)
// - Validar entradas de usuario
// - Operaciones de red (fetch, WebSocket)
// - Cualquier código donde algo pueda fallar impredeciblemente
//
// FLUJO DE EJECUCIÓN:
// ┌─────────────────────────────────────────────────────────────────┐
// │                                                                   │
// │  try {                    ¿Hay error?                            │
// │    código peligroso  ──→  NO ──→ continúa normalmente           │
// │         │                      │                                 │
// │         SÍ                     │                                 │
// │         ↓                      ↓                                 │
// │  catch(error) {         finally {                                │
// │    manejar error          limpieza (SIEMPRE)                     │
// │  }                        }                                     │
// │                                                                   │
// └─────────────────────────────────────────────────────────────────┘
// =========================================================================

// --- SyntaxError: JSON inválido ---
// Ocurre cuando el código tiene un error de sintaxis.
// El caso más común: parsear un JSON malformado de una API o archivo.
//
// CONSEJO: Siempre envuelve JSON.parse() en try/catch,
// NUNCA confíes en que los datos externos estén bien formados.
function demoSyntaxError() {
    try {
        const jsonInvalido = '{"nombre": "Ana", "edad":}';
        const datos = JSON.parse(jsonInvalido);
    } catch (error) {
        mostrarEnUI('errorOutput',
            `SyntaxError capturado:\n  Nombre: ${error.name}\n  Mensaje: ${error.message}`,
            'error'
        );
    }
}

// --- ReferenceError: Variable no existe ---
// Ocurre cuando intentas acceder a una variable que NO fue declarada.
// Es el error más común al escribir código (typos en nombres de variables).
function demoReferenceError() {
    try {
        console.log(variableQueNoExiste);
    } catch (error) {
        mostrarEnUI('errorOutput',
            `ReferenceError capturado:\n  Nombre: ${error.name}\n  Mensaje: ${error.message}`,
            'error'
        );
    }
}

// --- TypeError: Llamar método en null/undefined ---
// El error MÁS COMÚN en JavaScript. Ocurre cuando intentas acceder
// a una propiedad o método de null o undefined.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  CAUSAS COMUNES DE TypeError:                                   │
// │                                                                   │
// │  null.nombre           → Cannot read property 'nombre' of null  │
// │  undefined.toUpperCase → Cannot read property 'toUpperCase'     │
// │  "hola".noExiste()    → ...is not a function                    │
// │                                                                   │
// │  PREVENCIÓN:                                                     │
// │  - Optional chaining: usuario?.nombre?.toUpperCase()            │
// │  - Nullish coalescing: usuario?.nombre ?? 'Sin nombre'          │
// │  - Validación previa: if (usuario) { ... }                      │
// └─────────────────────────────────────────────────────────────────┘
function demoTypeError() {
    try {
        const usuario = null;
        console.log(usuario.nombre.toUpperCase());
    } catch (error) {
        mostrarEnUI('errorOutput',
            `TypeError capturado:\n  Nombre: ${error.name}\n  Mensaje: ${error.message}`,
            'error'
        );
    }
}

// --- RangeError: Crear array con tamaño inválido ---
// Ocurre cuando un valor está fuera del rango permitido.
// Ejemplos: new Array(-1), Number.toFixed(101), recursión infinita.
function demoRangeError() {
    try {
        const arr = new Array(-1);
    } catch (error) {
        mostrarEnUI('errorOutput',
            `RangeError capturado:\n  Nombre: ${error.name}\n  Mensaje: ${error.message}`,
            'error'
        );
    }
}

// --- finally: Se ejecuta SIEMPRE (con error o sin error) ---
//
// ¿PARA QUÉ SIRVE finally?
// Para código de LIMPIEZA que debe ejecutarse pase lo que pase:
// - Cerrar conexiones
// - Ocultar spinners de carga
// - Liberar recursos
// - Restaurar el estado de la UI
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  CASO DE USO TÍPICO:                                            │
// │                                                                   │
// │  try {                                                           │
// │    mostrarSpinner();                                             │
// │    const data = await fetch(url);                                │
// │  } catch (error) {                                               │
// │    mostrarError(error);                                          │
// │  } finally {                                                     │
// │    ocultarSpinner();  ← Se ejecuta SIEMPRE (éxito o error)     │
// │  }                                                               │
// └─────────────────────────────────────────────────────────────────┘
function demoFinally() {
    let resultado = '';

    try {
        resultado += '1. Entrando en try... ';
        throw new Error('Algo falló adrede');
        resultado += 'Esto NUNCA se ejecuta (el throw corta la ejecución)';
    } catch (error) {
        resultado += `2. Capturado en catch: "${error.message}"... `;
    } finally {
        resultado += '3. finally se ejecutó SIEMPRE (haya error o no)';
    }

    mostrarEnUI('errorOutput', resultado, 'info');
}

// =========================================================================
// SECCIÓN 3: ERROR FACTORY - Errores personalizados
// =========================================================================
//
// ¿POR QUÉ CREAR ERRORES PERSONALIZADOS?
// JavaScript tiene errores genéricos (Error, TypeError, etc.), pero en
// aplicaciones reales necesitas errores ESPECÍFICOS para saber exactamente
// QUÉ falló y manejar cada caso de forma diferente.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  SIN errores personalizados:        CON errores personalizados: │
// │                                                                   │
// │  catch (error) {                    catch (error) {              │
// │    // ¿Qué tipo de error es?         if (error instanceof        │
// │    // ¿Error de red? ¿Validación?       ValidationError) {      │
// │    // No hay forma de saberlo...       // Mostrar campos malos  │
// │    console.log(error.message);        } else if (error           │
// │  }                                       instanceof NetworkErr){ │
// │                                           // Reintentar fetch   │
// │                                         }                       │
// │                                       }                         │
// └─────────────────────────────────────────────────────────────────┘
//
// CÓMO CREAR UN ERROR PERSONALIZADO:
// 1. Crear una clase que extienda (extends) de Error
// 2. Llamar a super(mensaje) en el constructor
// 3. Asignar this.name = 'NombreDelError'
// 4. Añadir propiedades extra específicas del error
// =========================================================================

// ValidationError: Se lanza cuando un campo de formulario no es válido.
// Propiedad extra: campo → indica QUÉ campo falló (nombre, email, etc.)
class ValidationError extends Error {
    constructor(campo, mensaje) {
        super(mensaje);
        this.name = 'ValidationError';
        this.campo = campo;
    }
}

// NotFoundError: Se lanza cuando no se encuentra un recurso.
// Propiedad extra: recurso → indica QUÉ se estaba buscando.
class NotFoundError extends Error {
    constructor(recurso) {
        super(`No se encontró: ${recurso}`);
        this.name = 'NotFoundError';
        this.recurso = recurso;
    }
}

// NetworkError: Se lanza cuando una petición HTTP falla.
// Propiedades extra: url y statusCode → para saber QUÉ URL falló y CÓMO.
class NetworkError extends Error {
    constructor(url, statusCode) {
        super(`Error de red en ${url}: ${statusCode}`);
        this.name = 'NetworkError';
        this.url = url;
        this.statusCode = statusCode;
    }
}

// Función de validación que usa el patrón "Fail Fast":
// valida TODOS los campos y acumula los errores, lanzándolos
// todos juntos al final (patrón AggregateError).
function validarUsuario(nombre, email, edad) {
    const errores = [];

    if (!nombre || nombre.trim().length < 2) {
        errores.push(new ValidationError('nombre', 'El nombre debe tener al menos 2 caracteres'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errores.push(new ValidationError('email', 'El email no tiene un formato válido'));
    }

    const edadNum = Number(edad);
    if (isNaN(edadNum) || edadNum < 18 || edadNum > 120) {
        errores.push(new ValidationError('edad', 'La edad debe estar entre 18 y 120'));
    }

    if (errores.length > 0) {
        const error = new Error('Validación fallida');
        error.name = 'ValidationAggregateError';
        error.errores = errores;
        throw error;
    }

    return { nombre: nombre.trim(), email: email.trim(), edad: edadNum };
}

// Manejador del botón "Validar": recoge datos del formulario,
// intenta validar y muestra el resultado (éxito o errores).
function handleValidate() {
    const nombre = document.getElementById('inputNombre').value;
    const email = document.getElementById('inputEmail').value;
    const edad = document.getElementById('inputEdad').value;

    try {
        const usuario = validarUsuario(nombre, email, edad);
        mostrarEnUI('validationOutput', `Usuario válido: ${JSON.stringify(usuario)}`, 'success');
    } catch (error) {
        if (error.errores) {
            const mensajes = error.errores.map(e => `[${e.campo}] ${e.message}`).join('\n');
            mostrarEnUI('validationOutput', `${error.name}:\n${mensajes}`, 'error');
        } else {
            mostrarEnUI('validationOutput', `${error.name}: ${error.message}`, 'error');
        }
    }
}

// =========================================================================
// SECCIÓN 4: ASYNC ERROR HANDLER - Errores en código asíncrono
// =========================================================================
//
// ¿POR QUÉ LOS ERRORES ASÍNCRONOS SON MÁS DIFÍCILES?
// Porque ocurren "en el futuro", fuera del flujo normal de ejecución.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  CÓDIGO SÍNCRONO:                 CÓDIGO ASÍNCRONO:             │
// │                                                                   │
// │  try {                            try {                          │
// │    JSON.parse(badJson);             await fetch(url);            │
// │  } catch (e) {                    } catch (e) {                  │
// │    // ✅ Funciona perfecto          // ✅ Funciona con await     │
// │  }                                }                              │
// │                                                                   │
// │  try {                            fetch(url)                     │
// │    setTimeout(() => {               .then(r => r.json())         │
// │      throw new Error('boom');       .then(d => procesar(d))      │
// │    }, 100);                         // ❌ SIN .catch() → silencio│
// │  } catch (e) {                                                   │
// │    // ❌ NO captura el error       // CON .catch():              │
// │    // (el throw ocurre DESPUÉS     fetch(url)                    │
// │    //  de que el try terminó)       .then(...)                   │
// │  }                                   .catch(e => manejar(e))    │
// │                                       // ✅ Captura errores      │
// └─────────────────────────────────────────────────────────────────┘
//
// REGLA DE ORO:
// - Con async/await → try/catch funciona normalmente
// - Con .then() → SIEMPRE añade .catch() al final
// - Con callbacks → El error suele ser el primer parámetro
// =========================================================================

// Fetch exitoso: demuestra el flujo normal de async/await con try/catch.
// Verificamos response.ok porque fetch NO lanza error en 404 o 500
// (solo lanza error si no hay conexión a internet).
async function fetchExitoso() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/1');

        if (!response.ok) {
            throw new NetworkError(response.url, response.status);
        }

        const user = await response.json();
        mostrarEnUI('asyncOutput',
            `Fetch exitoso: ${user.name} (${user.email})`,
            'success'
        );
    } catch (error) {
        if (error instanceof NetworkError) {
            mostrarEnUI('asyncOutput', `NetworkError: ${error.message}`, 'error');
        } else {
            mostrarEnUI('asyncOutput', `Error inesperado: ${error.message}`, 'error');
        }
    }
}

// Fetch 404: demuestra cómo manejar un recurso que no existe.
// jsonplaceholder devuelve 404 para IDs que no existen (ej: /users/99999).
async function fetch404() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users/99999');

        if (!response.ok) {
            throw new NetworkError('/users/99999', response.status);
        }

        const user = await response.json();
        mostrarEnUI('asyncOutput', `Usuario: ${user.name}`, 'success');
    } catch (error) {
        if (error instanceof NetworkError) {
            mostrarEnUI('asyncOutput',
                `NetworkError capturado:\n  URL: ${error.url}\n  Status: ${error.statusCode}\n  Mensaje: ${error.message}`,
                'error'
            );
        } else {
            mostrarEnUI('asyncOutput', `Error: ${error.message}`, 'error');
        }
    }
}

// --- Fetch con timeout usando AbortController ---
//
// ¿QUÉ ES AbortController?
// Es una API nativa del navegador que permite CANCELAR peticiones fetch.
// Es esencial para implementar timeouts (cancelar si tarda demasiado).
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  FLUJO DE AbortController:                                      │
// │                                                                   │
// │  1. Crear controller: const ctrl = new AbortController()        │
// │  2. Pasar signal a fetch: fetch(url, { signal: ctrl.signal })   │
// │  3. Programar cancelación: setTimeout(() => ctrl.abort(), 100)  │
// │  4. Si fetch tarda > 100ms → se cancela → lanza AbortError     │
// │                                                                   │
// │  ANALOGÍA:                                                       │
// │  Es como pedir un taxi con un temporizador:                      │
// │  - Si llega en 5 minutos → te subes (éxito)                     │
// │  - Si no llega en 5 minutos → cancelas y pides otro (abort)     │
// └─────────────────────────────────────────────────────────────────┘
async function fetchConTimeout() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100);

    try {
        const response = await fetch(
            'https://jsonplaceholder.typicode.com/users',
            { signal: controller.signal }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new NetworkError('/users', response.status);
        }

        const users = await response.json();
        mostrarEnUI('asyncOutput', `Cargados ${users.length} usuarios (timeout: 100ms)`, 'success');
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            mostrarEnUI('asyncOutput',
                'Timeout: La petición tardó más de 100ms y fue cancelada con AbortController',
                'warning'
            );
        } else {
            mostrarEnUI('asyncOutput', `Error: ${error.message}`, 'error');
        }
    }
}

// --- Patrón Retry: Reintentar operaciones que pueden fallar ---
//
// ¿QUÉ ES EL PATRÓN RETRY?
// Cuando una operación de red falla, en vez de rendirte inmediatamente,
// reintentas N veces con un delay creciente entre intentos.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  FLUJO DEL PATRÓN RETRY:                                        │
// │                                                                   │
// │  Intento 1 ──→ ¿Falla? ──→ Espera 1s ──→ Intento 2             │
// │                                                │                 │
// │                                    ¿Falla? ──→ Espera 2s        │
// │                                                │                 │
// │                                           Intento 3             │
// │                                                │                 │
// │                                    ¿Falla? ──→ Error definitivo │
// │                                    ¿Éxito? ──→ Retornar datos   │
// │                                                                   │
// │  ¿POR QUÉ DELAY CRECIENTE (1s, 2s, 3s)?                         │
// │  Se llama "exponential backoff" y evita saturar un servidor     │
// │  que ya está teniendo problemas. Si 1000 clientes reintentan    │
// │  al mismo tiempo, el delay escalonado los distribuye.            │
// │                                                                   │
// │  CASOS DE USO REALES:                                            │
// │  - Peticiones API que fallan por red inestable                  │
// │  - Conexiones a bases de datos temporariamente caídas           │
// │  - Subida de archivos con conexión intermitente                 │
// └─────────────────────────────────────────────────────────────────┘
async function fetchConRetry() {
    const maxIntentos = 3;
    const url = 'https://jsonplaceholder.typicode.com/posts/1';

    for (let intento = 1; intento <= maxIntentos; intento++) {
        try {
            mostrarEnUI('asyncOutput', `Intento ${intento}/${maxIntentos}...`, 'info');

            const response = await fetch(url);
            if (!response.ok) throw new NetworkError(url, response.status);

            const post = await response.json();
            mostrarEnUI('asyncOutput',
                `Éxito en intento ${intento}: "${post.title.substring(0, 50)}..."`,
                'success'
            );
            return post;
        } catch (error) {
            if (intento === maxIntentos) {
                mostrarEnUI('asyncOutput',
                    `Falló tras ${maxIntentos} intentos: ${error.message}`,
                    'error'
                );
                throw error;
            }
            const delay = intento * 1000;
            mostrarEnUI('asyncOutput',
                `Intento ${intento} falló. Reintentando en ${delay}ms...`,
                'warning'
            );
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// =========================================================================
// SECCIÓN 6: DEBUG CHALLENGE - Código con bugs para depurar
// =========================================================================
//
// ¿QUÉ ES UN BREAKPOINT?
// Es una "marca" que pones en una línea de código para que la ejecución
// se PAUSE ahí. Cuando está pausada, puedes:
// - Inspeccionar el valor de TODAS las variables
// - Avanzar línea por línea (F10 = siguiente, F11 = entrar en función)
// - Ver la pila de llamadas (quién llamó a quién)
// - Modificar variables en vivo para probar hipótesis
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  CÓMO DEPURAR PASO A PASO:                                     │
// │                                                                   │
// │  1. Abre DevTools (F12)                                          │
// │  2. Ve a la pestaña "Sources"                                    │
// │  3. Busca este archivo (script.js)                               │
// │  4. Haz clic en el NÚMERO de línea donde quieres pausar         │
// │     (aparecerá un marcador azul)                                 │
// │  5. Pulsa el botón que ejecuta la función                        │
// │  6. La ejecución se pausa en tu breakpoint                      │
// │  7. Usa los controles:                                           │
// │     F8  → Continuar hasta el siguiente breakpoint                │
// │     F10 → Siguiente línea (sin entrar en funciones)              │
// │     F11 → Entrar en la función actual                            │
// │     Shift+F11 → Salir de la función actual                       │
// │                                                                   │
// │  ALTERNATIVA: La sentencia "debugger"                            │
// │  Si escribes debugger; en tu código, la ejecución se pausa      │
// │  ahí automáticamente cuando DevTools está abierta.               │
// └─────────────────────────────────────────────────────────────────┘
//
// Estos ejercicios tienen bugs INTENCIONADOS. Tu trabajo es:
// 1. Abrir DevTools (F12)
// 2. Ir a la pestaña Sources
// 3. Buscar este archivo (script.js)
// 4. Poner breakpoints (clic en el número de línea)
// 5. Pulsar el botón y depurar paso a paso (F10 = siguiente, F11 = entrar)
// =========================================================================

function calcularDescuento(precio, porcentajeDescuento, cuponAdicional) {
    // BUG 1: porcentajeDescuento se pasa como string desde el input
    // y no se convierte a número antes de operar
    const descuento = precio * (porcentajeDescuento / 100);

    // BUG 2: cuponAdicional puede ser undefined si no se pasa
    // y al sumar undefined + número da NaN
    const descuentoTotal = descuento + cuponAdicional;

    // BUG 3: No se valida que el precio final no sea negativo
    const precioFinal = precio - descuentoTotal;

    mostrarEnUI('debugOutput',
        `Precio: ${precio}€\nDescuento: ${descuento}€\nCupón: ${cuponAdicional}€\nPrecio final: ${precioFinal}€\n\n¿Ves algo raro? Depura paso a paso para encontrar los 3 bugs.`,
        'warning'
    );
}

function filtrarUsuarios() {
    const usuarios = [
        { nombre: 'Ana', edad: 25, activo: true },
        { nombre: 'Carlos', edad: 17, activo: true },
        { nombre: 'María', edad: 30, activo: false },
        { nombre: 'Juan', edad: 22, activo: true },
        { nombre: 'Laura', edad: 15, activo: true }
    ];

    // BUG 1: filter devuelve los que NO cumplen la condición (lógica invertida)
    const adultos = usuarios.filter(u => u.edad < 18);

    // BUG 2: Se usa = (asignación) en vez de === (comparación)
    const activos = usuarios.filter(u => u.activo = true);

    // BUG 3: Se accede a .nombre en un array vacío si no hay resultados
    const primerAdulto = adultos[0].nombre;

    mostrarEnUI('debugOutput',
        `Adultos encontrados: ${adultos.length}\nActivos: ${activos.length}\nPrimer adulto: ${primerAdulto}\n\n¿Los resultados son correctos? Depura para encontrar los 3 bugs.`,
        'warning'
    );
}

// =========================================================================
// FUNCIÓN AUXILIAR: Mostrar resultados en la UI
// =========================================================================
// Centraliza la lógica de renderizado de mensajes para evitar
// duplicar código en cada sección. Cada mensaje se añade al INICIO
// del contenedor (prepend) y se limita a 10 mensajes máximo para
// no saturar la interfaz.
// =========================================================================
function mostrarEnUI(containerId, mensaje, tipo) {
    const container = document.getElementById(containerId);
    const entry = document.createElement('div');
    entry.className = `error-entry ${tipo}`;
    entry.textContent = mensaje;
    entry.style.whiteSpace = 'pre-wrap';
    container.prepend(entry);

    while (container.children.length > 10) {
        container.lastChild.remove();
    }
}

// =========================================================================
// EVENT LISTENERS - Conectar botones del HTML con funciones
// =========================================================================

document.getElementById('btnLog').addEventListener('click', demoLog);
document.getElementById('btnTable').addEventListener('click', demoTable);
document.getElementById('btnGroup').addEventListener('click', demoGroup);
document.getElementById('btnTime').addEventListener('click', demoTime);
document.getElementById('btnTrace').addEventListener('click', demoTrace);
document.getElementById('btnCount').addEventListener('click', demoCount);
document.getElementById('btnAssert').addEventListener('click', demoAssert);

document.getElementById('btnSyntaxError').addEventListener('click', demoSyntaxError);
document.getElementById('btnReferenceError').addEventListener('click', demoReferenceError);
document.getElementById('btnTypeError').addEventListener('click', demoTypeError);
document.getElementById('btnRangeError').addEventListener('click', demoRangeError);
document.getElementById('btnFinally').addEventListener('click', demoFinally);

document.getElementById('btnValidate').addEventListener('click', handleValidate);

document.getElementById('btnFetchOk').addEventListener('click', fetchExitoso);
document.getElementById('btnFetch404').addEventListener('click', fetch404);
document.getElementById('btnFetchTimeout').addEventListener('click', fetchConTimeout);
document.getElementById('btnRetry').addEventListener('click', fetchConRetry);

document.getElementById('btnUncaughtError').addEventListener('click', () => {
    throw new Error('Este error NO tiene try/catch - lo captura window.onerror');
});

document.getElementById('btnUnhandledPromise').addEventListener('click', () => {
    new Promise((_, reject) => {
        reject('Esta promesa no tiene .catch() - lo captura onunhandledrejection');
    });
});

document.getElementById('btnDebugCalc').addEventListener('click', () => {
    calcularDescuento(100, '20', undefined);
});

document.getElementById('btnDebugFilter').addEventListener('click', filtrarUsuarios);

// =========================================================================
// RESUMEN DE CONCEPTOS APRENDIDOS
// =========================================================================
//
// MÉTODOS DE CONSOLE:
// ┌──────────────────┬──────────────────────────────────────────────────┐
// │ console.log()    │ Mensaje estándar (el más básico)                 │
// │ console.warn()   │ Advertencia con icono amarillo                   │
// │ console.error()  │ Error con icono rojo y stack trace               │
// │ console.table()  │ Tabla formateada de arrays/objetos               │
// │ console.group()  │ Agrupa mensajes en bloques colapsables           │
// │ console.time()   │ Inicia cronómetro de alta precisión              │
// │ console.timeEnd()│ Muestra tiempo transcurrido (microsegundos)      │
// │ console.trace()  │ Muestra la pila de llamadas completa             │
// │ console.count()  │ Cuenta cuántas veces se invoca con esa etiqueta  │
// │ console.assert() │ Solo muestra mensaje si la condición es falsa    │
// └──────────────────┴──────────────────────────────────────────────────┘
//
// MANEJO DE ERRORES:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ try { ... } catch(e) { ... } finally { ... }                       │
// │                                                                     │
// │ - try: código que puede fallar (zona de riesgo)                    │
// │ - catch: se ejecuta si hay error (recibe el objeto Error)          │
// │ - finally: se ejecuta SIEMPRE (limpieza, cierre, etc.)             │
// │                                                                     │
// │ PROPIEDADES DEL OBJETO ERROR:                                      │
// │ - error.name    → Tipo de error ("TypeError", "SyntaxError"...)    │
// │ - error.message → Descripción legible del error                    │
// │ - error.stack   → Pila de llamadas completa (para debugging)       │
// └─────────────────────────────────────────────────────────────────────┘
//
// TIPOS DE ERROR NATIVOS:
// ┌──────────────────┬──────────────────────────────────────────────────┐
// │ SyntaxError      │ Código mal escrito (JSON inválido, paréntesis)  │
// │ ReferenceError   │ Variable no existe (typo en nombre)             │
// │ TypeError        │ Operación en tipo incorrecto (null.nombre)      │
// │ RangeError       │ Valor fuera de rango válido (new Array(-1))     │
// │ URIError         │ URI mal formada (encodeURI con caracteres malos)│
// └──────────────────┴──────────────────────────────────────────────────┘
//
// PATRONES DE MANEJO DE ERRORES:
// ┌──────────────────┬──────────────────────────────────────────────────┐
// │ Fail Fast        │ Validar al inicio, lanzar error inmediatamente  │
// │ Graceful Degr.   │ Mostrar algo parcial si algo falla (no romper)  │
// │ Retry            │ Reintentar N veces con delay creciente          │
// │ Fallback         │ Plan B cuando la operación principal falla      │
// │ Global Handler   │ window.onerror como red de seguridad final      │
// └──────────────────┴──────────────────────────────────────────────────┘
//
// CONSEJOS PRÁCTICOS:
// ┌─────────────────────────────────────────────────────────────────────┐
// │ 1. SIEMPRE envuelve JSON.parse() en try/catch                      │
// │ 2. SIEMPRE añade .catch() a las promesas                           │
// │ 3. SIEMPRE verifica response.ok después de fetch()                 │
// │ 4. NUNCA dejes un catch vacío: catch(e) {} (engulle errores)      │
// │ 5. Usa instanceof para distinguir tipos de error en el catch       │
// │ 6. En producción, envía errores a Sentry/LogRocket                 │
// │ 7. Usa console.time() en vez de Date.now() para medir rendimiento │
// └─────────────────────────────────────────────────────────────────────┘
// =========================================================================
