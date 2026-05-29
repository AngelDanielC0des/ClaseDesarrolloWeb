// =========================================================================
// PUNTO DE ENTRADA: main.js - El "cerebro" de la aplicación Vite
// =========================================================================
//
// ¿QUÉ ES ESTE ARCHIVO?
// Es el archivo principal que Vite ejecuta al cargar la aplicación.
// Piensa en él como el "director de orquesta": no toca ningún instrumento
// (no contiene lógica compleja), pero coordina a todos los músicos
// (importa módulos, conecta eventos, inicializa la UI).
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANALOGÍA DEL MUNDO REAL:                                       │
// │                                                                   │
// │  Imagina que main.js es el RECEPCIONISTA de un hotel:            │
// │  - Recibe a los huéspedes (carga la página)                      │
// │  - Les asigna habitación (renderiza secciones de la UI)          │
// │  - Conecta servicios (event listeners → funciones)               │
// │  - Pero NO limpia las habitaciones ni cocina (eso lo hacen       │
// │    los módulos especializados: utils.js, style.css, etc.)        │
// │                                                                   │
// └─────────────────────────────────────────────────────────────────┘
//
// CONCEPTOS CLAVE QUE VEREMOS:
// 1. Vite usa <script type="module"> automáticamente (no hay que ponerlo)
// 2. Los imports de npm (sin ./) se resuelven desde node_modules/
// 3. Los imports locales (con ./) son módulos propios del proyecto
// 4. Los CSS se importan directamente en JS (Vite los inyecta en <head>)
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANTES (sin bundler):                AHORA (con Vite):           │
// │                                                                   │
// │  <script src="utils.js"></script>    import './style.css';       │
// │  <script src="style.css"></script>   import { fn } from './u.js' │
// │  <script src="app.js"></script>      // ¡Todo en un solo entry!  │
// │                                                                   │
// │  Problema: orden de carga,         Ventaja: orden explícito,     │
// │  scope global contaminado,          scope aislado por módulo,    │
// │  sin minificación automática        minificación + HMR gratis    │
// └─────────────────────────────────────────────────────────────────┘
// =========================================================================

// -------------------------------------------------------------------------
// IMPORTACIÓN DE ESTILOS GLOBALES
// -------------------------------------------------------------------------
// En Vite, los CSS se importan como si fueran módulos JavaScript.
// Vite los procesa, los minifica en producción y los inyecta en el <head>
// del HTML automáticamente. Esto se llama "CSS-in-JS" a nivel de bundler.
//
// ¿POR QUÉ importar CSS en JS?
// - Garantiza que los estilos se cargan cuando se necesita el módulo
// - Permite que Vite aplique HMR (cambios de estilo sin recargar)
// - En producción, Vite extrae el CSS a un archivo .css separado y optimizado
// -------------------------------------------------------------------------
import './style.css';

// -------------------------------------------------------------------------
// IMPORTACIÓN DE MÓDULOS LOCALES (desde ./utils.js)
// -------------------------------------------------------------------------
// Usamos "named imports" (import { nombre }) para traer SOLO las funciones
// que necesitamos del módulo utils.js. Esto permite a Vite hacer
// "tree-shaking": eliminar automáticamente el código que no se usa.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  TIPOS DE IMPORT:                                                │
// │                                                                   │
// │  import { fn } from './utils.js'    → Named import (específico)  │
// │  import utils from './utils.js'     → Default import (todo)      │
// │  import * as utils from './utils.js'→ Namespace import (todo     │
// │                                       como objeto)               │
// │                                                                   │
// │  REGLA: La extensión .js es OBLIGATORIA en imports locales       │
// │  cuando usas módulos ES6 nativos en el navegador.                │
// └─────────────────────────────────────────────────────────────────┘
// -------------------------------------------------------------------------
import {
    formatearFecha,
    tiempoRelativo,
    fechaInicio,
    crearTarjetaPost,
    obtenerInfoEntorno,
    generarDatosHMR
} from './utils.js';

// -------------------------------------------------------------------------
// 1. MOSTRAR INFORMACIÓN DEL ENTORNO (Variables de entorno con Vite)
// -------------------------------------------------------------------------
//
// ¿QUÉ SON LAS VARIABLES DE ENTORNO?
// Son valores de configuración que cambian según dónde se ejecuta la app:
// - En desarrollo: la API está en localhost:3000
// - En producción: la API está en api.miempresa.com
//
// ¿CÓMO FUNCIONAN EN VITE?
// 1. Creas un archivo .env en la raíz del proyecto
// 2. Defines variables con el prefijo VITE_ (obligatorio por seguridad)
// 3. Las lees en tu código con import.meta.env.VITE_NOMBRE
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  FLUJO DE VARIABLES DE ENTORNO:                                  │
// │                                                                   │
// │  .env                    Vite                   Tu código        │
// │  ┌──────────────┐   ┌──────────────┐   ┌────────────────────┐   │
// │  │VITE_API_URL= │──→│ Inyecta en   │──→│ import.meta.env    │   │
// │  │ http://api.. │   │ compile time │   │  .VITE_API_URL     │   │
// │  └──────────────┘   └──────────────┘   └────────────────────┘   │
// │                                                                   │
// │  SEGURIDAD: Solo las variables con prefijo VITE_ se exponen      │
// │  al navegador. Las demás (ej: DB_PASSWORD) quedan solo en        │
// │  el servidor de build, evitando filtrar secretos al cliente.     │
// └─────────────────────────────────────────────────────────────────┘
//
// VARIABLES AUTOMÁTICAS DE VITE (no necesitan .env):
// - import.meta.env.MODE  → "development" o "production"
// - import.meta.env.DEV   → true si estás en desarrollo
// - import.meta.env.PROD  → true si estás en producción
// -------------------------------------------------------------------------
function renderizarEntorno() {
    const env = obtenerInfoEntorno();
    const container = document.getElementById('envInfo');

    const items = [
        { key: 'import.meta.env.MODE', value: env.modo },
        { key: 'import.meta.env.DEV', value: String(env.esDesarrollo) },
        { key: 'import.meta.env.PROD', value: String(env.esProduccion) },
        { key: 'import.meta.env.VITE_API_URL', value: env.apiUrl },
        { key: 'import.meta.env.VITE_APP_NAME', value: env.appName }
    ];

    container.innerHTML = items.map(item => `
        <div class="env-item">
            <span class="env-key">${item.key}</span>
            <span class="env-value">${item.value}</span>
        </div>
    `).join('');
}

// -------------------------------------------------------------------------
// 2. RELOJ EN TIEMPO REAL CON DAYJS (paquete instalado desde npm)
// -------------------------------------------------------------------------
//
// ¿QUÉ ES DAYJS Y POR QUÉ LO USAMOS?
// dayjs es una librería de fechas que se instaló con "npm install dayjs".
// Es un reemplazo ultraligero de Moment.js:
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  COMPARACIÓN DE LIBRERÍAS DE FECHAS:                             │
// │                                                                   │
// │  Librería     │  Tamaño  │  Módulos  │  Estado                  │
// │  ─────────────┼──────────┼───────────┼──────────────────────     │
// │  Moment.js    │  300 KB  │  No       │  En mantenimiento (legacy)│
// │  dayjs        │  2 KB    │  Sí       │  Activo y recomendado     │
// │  date-fns     │  Modular │  Sí       │  Activo                   │
// │  Intl (nativo)│  0 KB    │  N/A      │  Limitado                 │
// │                                                                   │
// │  ANALOGÍA: Moment.js es como llevar una maleta de 30kg para      │
// │  un viaje de fin de semana. dayjs es llevar solo lo necesario    │
// │  en una mochila de 2kg. ¡Mismo resultado, mucho menos peso!      │
// └─────────────────────────────────────────────────────────────────┘
//
// ¿CÓMO SE IMPORTA UN PAQUETE DE NPM?
// A diferencia de los módulos locales (./utils.js), los paquetes de npm
// se importan SIN ruta relativa y SIN extensión:
//   import dayjs from 'dayjs';  ← Vite busca en node_modules/dayjs/
//
// setInterval() ejecuta la función cada 1000ms (1 segundo) para
// actualizar el reloj. Es un "timer" que corre indefinidamente.
// -------------------------------------------------------------------------
function iniciarReloj() {
    const clockEl = document.getElementById('clockDisplay');
    const relativeEl = document.getElementById('relativeTime');

    function actualizar() {
        clockEl.textContent = formatearFecha();
        relativeEl.textContent = `Tiempo en la página: ${tiempoRelativo(fechaInicio)}`;
    }

    actualizar();
    setInterval(actualizar, 1000);
}

// -------------------------------------------------------------------------
// 3. CARGAR POSTS DESDE API (usando URL configurable desde .env)
// -------------------------------------------------------------------------
//
// ¿POR QUÉ USAR VARIABLES DE ENTORNO PARA LA URL DE LA API?
// Porque la URL de la API cambia según el entorno:
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  Entorno        │  URL de la API                                │
// │  ───────────────┼──────────────────────────────────────────     │
// │  Desarrollo     │  http://localhost:3000 (tu máquina)           │
// │  Staging        │  https://staging-api.empresa.com              │
// │  Producción     │  https://api.empresa.com                      │
// │                                                                   │
// │  Sin .env: tendrías que cambiar la URL en el código cada vez     │
// │  Con .env: solo cambias el archivo .env y rebuild                │
// └─────────────────────────────────────────────────────────────────┘
//
// FLUJO DE LA FUNCIÓN:
// 1. Mostrar "Cargando..." (feedback visual al usuario)
// 2. fetch() a la API usando la URL de .env
// 3. Verificar response.ok (status 200-299)
// 4. Parsear JSON y renderizar tarjetas
// 5. Si falla, mostrar mensaje de error (graceful degradation)
//
// NOTA: El parámetro ?_limit=12 en la URL limita la respuesta a 12 posts.
// jsonplaceholder lo soporta como forma de paginación simple.
// -------------------------------------------------------------------------
async function cargarPosts() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = '<p class="loading">Cargando posts...</p>';

    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/posts?_limit=12`);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const posts = await response.json();

        container.innerHTML = posts
            .map(post => crearTarjetaPost(post))
            .join('');

    } catch (error) {
        container.innerHTML = `<p class="loading">Error: ${error.message}</p>`;
    }
}

function limpiarPosts() {
    document.getElementById('postsContainer').innerHTML = '';
}

// -------------------------------------------------------------------------
// 4. DEMOSTRACIÓN DE HMR (Hot Module Replacement)
// -------------------------------------------------------------------------
//
// ¿QUÉ ES HMR Y POR QUÉ ES REVOLUCIONARIO?
// HMR (Hot Module Replacement) es la capacidad de Vite de actualizar
// SOLO el módulo que cambiaste, sin recargar toda la página.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  SIN HMR (recarga completa):         CON HMR (Vite):            │
// │                                                                   │
// │  Editas CSS ──→ Recarga página ──→   Editas CSS ──→ Cambio      │
// │  Pierdes scroll, estado del          instantáneo                 │
// │  formulario, datos cargados...       ¡Se preserva todo!          │
// │                                                                   │
// │  Tiempo: 1-5 segundos                Tiempo: ~50 milisegundos    │
// │                                                                   │
// │  ANALOGÍA:                                                    │
// │  Sin HMR = Apagar y encender el coche para cambiar la radio    │
// │  Con HMR = Cambiar la emisora con el coche en marcha           │
// └─────────────────────────────────────────────────────────────────┘
//
// PRUEBA ESTO AHORA:
// 1. Asegúrate de que "npm run dev" está activo
// 2. Abre src/utils.js en tu editor
// 3. Cambia el valor de "Bundler" de "Vite" a "Vite ⚡"
// 4. Guarda el archivo
// 5. ¡Observa cómo la UI se actualiza AL INSTANTE sin recargar!
//
// Los datos se importan desde generarDatosHMR() en utils.js.
// Cuando Vite detecta que utils.js cambió, re-ejecuta SOLO ese módulo
// y actualiza las dependencias (esta función que lo usa).
// -------------------------------------------------------------------------
function renderizarHMR() {
    const container = document.getElementById('hmrDemo');
    const datos = generarDatosHMR();

    container.innerHTML = datos.map(dato => `
        <div class="hmr-item">
            <div class="label">${dato.label}</div>
            <div class="value">${dato.value}</div>
        </div>
    `).join('');
}

// -------------------------------------------------------------------------
// 5. EVENT LISTENERS - Conectar la UI con la lógica
// -------------------------------------------------------------------------
//
// PATRÓN: Separación de responsabilidades
// Los event listeners están aquí (en el orquestador), no en utils.js.
// utils.js solo contiene lógica pura (funciones que reciben datos y
// devuelven datos). main.js se encarga de "conectar" los botones del
// HTML con las funciones de utils.js.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ¿POR QUÉ SEPARAR EVENT LISTENERS DE LA LÓGICA?                 │
// │                                                                   │
// │  utils.js (lógica pura):           main.js (orquestador):        │
// │  - Se puede testear sin DOM        - Conecta botones → funciones │
// │  - Se puede reutilizar en Node.js  - Maneja el ciclo de vida     │
// │  - No depende del navegador        - Depende del DOM             │
// └─────────────────────────────────────────────────────────────────┘
// -------------------------------------------------------------------------
document.getElementById('btnLoadPosts').addEventListener('click', cargarPosts);
document.getElementById('btnClearPosts').addEventListener('click', limpiarPosts);

// -------------------------------------------------------------------------
// 6. INICIALIZACIÓN - Arrancar la aplicación
// -------------------------------------------------------------------------
//
// ORDEN DE INICIALIZACIÓN:
// 1. renderizarEntorno() → Muestra las variables de entorno (síncrono)
// 2. iniciarReloj()      → Arranca el timer del reloj (asíncrono vía setInterval)
// 3. renderizarHMR()     → Pinta los datos de demostración HMR (síncrono)
//
// ¿POR QUÉ ESTE ORDEN?
// Las operaciones síncronas van primero porque son instantáneas.
// El reloj se inicia después porque usa setInterval (corre en background).
// Los posts NO se cargan automáticamente: el usuario decide cuándo pulsar
// el botón (carga bajo demanda = mejor rendimiento inicial).
// -------------------------------------------------------------------------
renderizarEntorno();
iniciarReloj();
renderizarHMR();

console.log(`App "${obtenerInfoEntorno().appName}" iniciada en modo: ${import.meta.env.MODE}`);
console.log('Prueba a modificar src/utils.js o src/style.css y observa el HMR en acción');

// =========================================================================
// RESUMEN DE CONCEPTOS APRENDIDOS EN ESTE ARCHIVO
// =========================================================================
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO              │  QUÉ HACE              │  EJEMPLO          │
// ├─────────────────────────────────────────────────────────────────────┤
// │  import './style.css'  │  Inyecta CSS en la    │  Vite lo procesa  │
// │                        │  página vía Vite       │  y minifica       │
// │  import {fn} from './' │  Trae funciones de    │  Named import     │
// │                        │  un módulo local       │  (tree-shakeable) │
// │  import.meta.env       │  Lee variables de     │  .env → código    │
// │                        │  entorno de Vite       │  en compile time  │
// │  HMR                   │  Actualiza módulos    │  Editas → ves     │
// │                        │  sin recargar          │  cambio al instante│
// │  Orquestador           │  main.js conecta todo │  Events → funcs   │
// │                        │  sin tener lógica     │  UI → datos       │
// └─────────────────────────────────────────────────────────────────────┘
//
// PRÓXIMOS PASOS:
// 1. Ejecuta "npm run dev" y observa el HMR modificando utils.js
// 2. Ejecuta "npm run build" y examina la carpeta dist/
// 3. Añade una nueva variable VITE_ en .env y muéstrala en la UI
// 4. Crea un nuevo módulo src/api.js y conéctalo desde main.js
// =========================================================================
