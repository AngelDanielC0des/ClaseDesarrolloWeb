// =========================================================================
// MÓDULO: utils.js - Funciones utilitarias del proyecto
// =========================================================================
//
// ¿QUÉ ES UN MÓDULO DE UTILIDADES?
// Es un archivo que contiene funciones "herramienta" reutilizables.
// Piensa en él como una CAJA DE HERRAMIENTAS: cada función es una
// herramienta específica (martillo, destornillador, llave inglesa)
// que otros archivos pueden tomar prestada mediante import.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANALOGÍA DEL MUNDO REAL:                                       │
// │                                                                   │
// │  Imagina una cocina profesional:                                 │
// │  - utils.js = Los utensilios (cuchillos, sartenes, batidora)    │
// │  - main.js = El chef que decide cuándo usar cada utensilio      │
// │                                                                   │
// │  El chef NO fabrica sus propios cuchillos (los compra/importa).  │
// │  main.js NO contiene la lógica de formateo (la importa).        │
// └─────────────────────────────────────────────────────────────────┘
//
// ¿POR QUÉ SEPARAR EN MÓDULOS?
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  SIN MÓDULOS (todo en un archivo):   CON MÓDULOS (separado):    │
// │                                                                   │
// │  app.js (500 líneas)                 utils.js (lógica pura)     │
// │  - Lógica + DOM + eventos + CSS      main.js (orquestador)      │
// │  - Imposible de testear              - Cada uno < 100 líneas    │
// │  - Difícil de mantener               - Testeable por separado   │
// │  - No reutilizable                   - Reutilizable en otros    │
// │                                        proyectos                 │
// └─────────────────────────────────────────────────────────────────┘
//
// HMR (HOT MODULE REPLACEMENT) EN ESTE ARCHIVO:
// Si modificas CUALQUIER función de este archivo mientras "npm run dev"
// está activo, Vite actualizará SOLO este módulo sin recargar la página.
// PRUEBA: Cambia el texto de generarDatosHMR() y observa el efecto.
// =========================================================================

// -------------------------------------------------------------------------
// IMPORTACIÓN DE PAQUETES DE NPM: dayjs
// -------------------------------------------------------------------------
//
// ¿CÓMO LLEGA DAYJS A MI CÓDIGO?
// 1. Ejecutaste "npm install dayjs" (se descargó a node_modules/dayjs/)
// 2. Vite resuelve import dayjs from 'dayjs' buscando en node_modules/
// 3. En producción, Vite hace "bundle" (empaqueta) dayjs dentro de tu JS
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  FLUJO DE UN PAQUETE NPM:                                       │
// │                                                                   │
// │  npm install dayjs                                               │
// │       ↓                                                          │
// │  node_modules/dayjs/  ← Se descarga aquí                        │
// │       ↓                                                          │
// │  import dayjs from 'dayjs'  ← Vite lo busca en node_modules/   │
// │       ↓                                                          │
// │  npm run build  ← Vite lo empaqueta y minifica en dist/         │
// └─────────────────────────────────────────────────────────────────┘
//
// ¿POR QUÉ TRES IMPORTS DE DAYJS?
// dayjs usa un sistema de plugins para mantener el core ligero (2KB).
// Cada funcionalidad extra (idiomas, tiempo relativo, etc.) es un plugin
// que se importa y activa por separado:
//
// - 'dayjs'              → Core básico (formateo, parsing)
// - 'dayjs/locale/es'    → Traducción al español
// - 'dayjs/plugin/...'   → Plugin de tiempo relativo ("hace 5 minutos")
// -------------------------------------------------------------------------
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

// Activar el locale español (todos los textos en español)
dayjs.locale('es');
// Extender dayjs con el plugin de tiempo relativo
dayjs.extend(relativeTime);

// -------------------------------------------------------------------------
// FUNCIÓN: formatearFecha
// -------------------------------------------------------------------------
//
// ¿QUÉ HACE?
// Convierte un objeto Date de JavaScript en un string legible en español.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ENTRADA:                          SALIDA:                      │
// │  new Date(2024, 0, 15)  ──→  "lunes, 15 de enero de 2024      │
// │                                  - 14:30:00"                    │
// └─────────────────────────────────────────────────────────────────┘
//
// SINTAXIS DEL FORMATO DE DAYJS:
// - dddd  → Nombre completo del día (lunes, martes...)
// - D     → Día del mes sin cero (1, 2... 31)
// - MMMM  → Nombre completo del mes (enero, febrero...)
// - YYYY  → Año con 4 dígitos
// - HH    → Hora en formato 24h con cero (00-23)
// - mm    → Minutos con cero (00-59)
// - ss    → Segundos con cero (00-59)
// - [de]  → Texto literal (los corchetes escapan el texto)
//
// PARÁMETRO POR DEFECTO:
// fecha = new Date() → Si no se pasa argumento, usa la fecha actual.
// Esto es un "default parameter" de ES6.
// -------------------------------------------------------------------------
export function formatearFecha(fecha = new Date()) {
    return dayjs(fecha).format('dddd, D [de] MMMM [de] YYYY - HH:mm:ss');
}

// -------------------------------------------------------------------------
// FUNCIÓN: tiempoRelativo
// -------------------------------------------------------------------------
//
// ¿QUÉ HACE?
// Calcula la diferencia entre una fecha pasada y ahora, devolviendo
// un string humano como "hace 5 minutos" o "hace 2 horas".
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ENTRADA:                          SALIDA:                      │
// │  hace 30 segundos       ──→  "hace unos segundos"              │
// │  hace 5 minutos         ──→  "hace 5 minutos"                  │
// │  hace 2 horas           ──→  "hace 2 horas"                    │
// │  hace 1 día             ──→  "hace un día"                     │
// └─────────────────────────────────────────────────────────────────┘
//
// ¿POR QUÉ ES ÚTIL?
// Los humanos entendemos mejor "hace 5 minutos" que "2024-01-15T14:25:00".
// Se usa en redes sociales (Twitter: "hace 3h"), chats, feeds de noticias...
//
// REQUISITO: Necesita el plugin relativeTime (importado arriba).
// -------------------------------------------------------------------------
export function tiempoRelativo(fecha) {
    return dayjs(fecha).fromNow();
}

// -------------------------------------------------------------------------
// CONSTANTE EXPORTADA: fechaInicio
// -------------------------------------------------------------------------
//
// ¿QUÉ ES?
// Captura la fecha/hora EXACTA en que se cargó el módulo (es decir,
// cuando se abrió la página). Se usa como referencia para calcular
// cuánto tiempo lleva el usuario en la página.
//
// ¿POR QUÉ export const Y NO export function?
// Porque es un VALOR FIJO que no cambia (la página se cargó una sola vez).
// Las constantes exportadas son útiles para configuración y valores fijos.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  LÍNEA DE TIEMPO:                                               │
// │                                                                   │
// │  [fechaInicio]────────────────────────[ahora]                    │
// │  (se cargó la página)                (tiempoRelativo calcula     │
// │                                        la diferencia)            │
// │  ←────────── X segundos ──────────→                              │
// └─────────────────────────────────────────────────────────────────┘
// -------------------------------------------------------------------------
export const fechaInicio = new Date();

// -------------------------------------------------------------------------
// FUNCIÓN: crearTarjetaPost
// -------------------------------------------------------------------------
//
// ¿QUÉ HACE?
// Recibe un objeto "post" (con id, title, body) y devuelve un string
// de HTML que representa una "tarjeta" visual de ese post.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ENTRADA (objeto):              SALIDA (string HTML):           │
// │  {                              <div class="post-card">         │
// │    id: 1,                         <div>Post #1</div>            │
// │    title: "Hola mundo",           <h3>Hola mundo</h3>           │
// │    body: "Este es el cuerpo"      <p>Este es el cuerpo</p>      │
// │  }                              </div>                          │
// └─────────────────────────────────────────────────────────────────┘
//
// PATRÓN: Template Literals para HTML
// Usamos backticks (``) con ${} para inyectar datos dentro del HTML.
// Es más legible que concatenar strings con + y permite multi-línea.
//
// ¿POR QUÉ RETORNAR HTML EN VEZ DE CREAR ELEMENTOS CON createElement?
// - Más rápido de escribir para UIs simples
// - Más legible (ves la estructura HTML directamente)
// - Para UIs complejas, es mejor usar createElement o un framework
// -------------------------------------------------------------------------
export function crearTarjetaPost(post) {
    return `
        <div class="post-card">
            <div class="post-id">Post #${post.id}</div>
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        </div>
    `;
}

// -------------------------------------------------------------------------
// FUNCIÓN: obtenerInfoEntorno
// -------------------------------------------------------------------------
//
// ¿QUÉ HACE?
// Centraliza el acceso a las variables de entorno en una sola función.
// Retorna un objeto con todas las variables de entorno relevantes.
//
// ¿POR QUÉ CENTRALIZAR EL ACCESO A VARIABLES DE ENTORNO?
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  MAL (disperso por todo el código):                              │
// │  const url1 = import.meta.env.VITE_API_URL;   // en archivo A   │
// │  const url2 = import.meta.env.VITE_API_URL;   // en archivo B   │
// │  Si cambia la variable, hay que buscar en todos los archivos    │
// │                                                                   │
// │  BIEN (centralizado en utils.js):                                │
// │  const env = obtenerInfoEntorno();                                │
// │  const url = env.apiUrl;   // Un solo punto de acceso           │
// │  Si cambia la variable, solo modificas esta función              │
// └─────────────────────────────────────────────────────────────────┘
//
// VARIABLES QUE RETORNA:
// - modo:         "development" o "production"
// - esDesarrollo: true si estamos en modo desarrollo
// - esProduccion: true si estamos en modo producción
// - apiUrl:       URL base de la API (definida en .env)
// - appName:      Nombre de la aplicación (definido en .env)
// -------------------------------------------------------------------------
export function obtenerInfoEntorno() {
    return {
        modo: import.meta.env.MODE,
        esDesarrollo: import.meta.env.DEV,
        esProduccion: import.meta.env.PROD,
        apiUrl: import.meta.env.VITE_API_URL,
        appName: import.meta.env.VITE_APP_NAME
    };
}

// -------------------------------------------------------------------------
// FUNCIÓN: generarDatosHMR
// -------------------------------------------------------------------------
//
// ¿QUÉ HACE?
// Genera un array de objetos que se muestran en la sección HMR de la UI.
//
// ¿POR QUÉ EXISTE ESTA FUNCIÓN?
// Es una función INTENCIONADAMENTE simple para que puedas experimentar
// con HMR (Hot Module Replacement) de Vite:
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  EXPERIMENTO HMR (HAZLO AHORA):                                 │
// │                                                                   │
// │  1. Asegúrate de que "npm run dev" está corriendo                │
// │  2. Abre este archivo (src/utils.js) en tu editor                │
// │  3. Cambia "Vite" por "Vite ⚡" en la línea de abajo            │
// │  4. Guarda el archivo (Ctrl+S)                                   │
// │  5. ¡Mira el navegador! El texto cambió SIN recargar la página  │
// │                                                                   │
// │  ¿QUÉ PASÓ POR DETRÁS?                                           │
// │  - Vite detectó que utils.js cambió (file watcher)               │
// │  - Re-compiló SOLO utils.js (no toda la app)                    │
// │  - Envió el nuevo módulo al navegador vía WebSocket              │
// │  - El navegador reemplazó el módulo viejo y re-renderizó         │
// │  - Tiempo total: ~50ms (vs 1-5 segundos de una recarga)         │
// └─────────────────────────────────────────────────────────────────┘
// -------------------------------------------------------------------------
export function generarDatosHMR() {
    return [
        { label: 'Versión', value: '1.0.0' },
        { label: 'Bundler', value: 'Vite' },
        { label: 'Runtime', value: 'Node.js' },
        { label: 'Módulos', value: 'ES6+' }
    ];
}

// =========================================================================
// RESUMEN: QUÉ EXPORTA ESTE MÓDULO
// =========================================================================
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  EXPORTACIÓN          │  TIPO      │  PARA QUÉ SIRVE               │
// ├─────────────────────────────────────────────────────────────────────┤
// │  formatearFecha()     │  Función   │  Date → string en español     │
// │  tiempoRelativo()     │  Función   │  Date → "hace X minutos"      │
// │  fechaInicio          │  Constante │  Momento en que se cargó      │
// │  crearTarjetaPost()   │  Función   │  Objeto → HTML de tarjeta     │
// │  obtenerInfoEntorno() │  Función   │  Variables de entorno (.env)  │
// │  generarDatosHMR()    │  Función   │  Datos demo para probar HMR   │
// └─────────────────────────────────────────────────────────────────────┘
//
// PRINCIPIO DE DISEÑO: RESPONSABILIDAD ÚNICA
// Este módulo SOLO se encarga de:
// - Formateo de datos (fechas, HTML)
// - Acceso a configuración (variables de entorno)
// NO se encarga de:
// - Manipular el DOM (eso lo hace main.js)
// - Manejar eventos (eso lo hace main.js)
// - Estilos (eso lo hace style.css)
// =========================================================================
