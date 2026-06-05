// =========================================================================
// WEB APIs MODERNAS - APIs del Navegador
// =========================================================================
//
// ¿QUÉ SON LAS Web APIs?
// Son funcionalidades que el navegador EXPONE a JavaScript para que
// puedas interactuar con el sistema operativo y el hardware del usuario.
// NO son parte de JavaScript en sí (no existen en Node.js), sino que
// el navegador las proporciona como "superpoderes" extra.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANALOGÍA DEL MUNDO REAL:                                       │
// │                                                                   │
// │  JavaScript = Un trabajador en una oficina                       │
// │  Web APIs   = Las herramientas de la oficina:                    │
// │               - Teléfono (Notifications)                         │
// │               - Portapapeles (Clipboard)                         │
// │               - Proyector (Fullscreen)                           │
// │               - Sensor de presencia (Page Visibility)            │
// │               - Cámara de seguridad (IntersectionObserver)       │
// │                                                                   │
// │  El trabajador (JS) no puede hacer llamadas sin el teléfono      │
// │  (Notifications API). Las APIs son las "herramientas" que el     │
// │  navegador le presta para hacer su trabajo.                      │
// └─────────────────────────────────────────────────────────────────┘
//
// Este ejercicio demuestra 5 APIs modernas del navegador que todo
// desarrollador web debería conocer:
//
// 1. Page Visibility API  → Detectar si la pestaña está activa
// 2. Clipboard API        → Copiar/pegar del portapapeles
// 3. Notifications API    → Notificaciones del sistema
// 4. Fullscreen API       → Pantalla completa
// 5. IntersectionObserver → Detectar visibilidad de elementos
//
// Todas estas APIs son nativas del navegador, no requieren librerías.
// =========================================================================

// =========================================================================
// 1. PAGE VISIBILITY API
// =========================================================================
//
// ¿QUÉ HACE?
// Permite detectar cuándo el usuario cambia de pestaña, minimiza
// el navegador o bloquea la pantalla.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ¿POR QUÉ ES IMPORTANTE?                                        │
// │                                                                   │
// │  Sin Page Visibility:                                            │
// │  - Tu vídeo sigue consumiendo datos aunque nadie lo vea         │
// │  - Tu setInterval sigue haciendo peticiones al servidor         │
// │  - Tu animación sigue consumiendo GPU y batería                 │
// │  - No sabes cuánto tiempo REAL pasó el usuario en tu web        │
// │                                                                   │
// │  Con Page Visibility:                                            │
// │  - Pausas el vídeo cuando el usuario cambia de pestaña          │
// │  - Detienes las peticiones innecesarias (ahorra datos)          │
// │  - Registras el tiempo REAL de atención del usuario             │
// │  - Reanudas animaciones cuando el usuario vuelve                │
// │                                                                   │
// │  ANALOGÍA:                                                       │
// │  Es como un sensor de presencia en una tienda:                   │
// │  - Cliente entra → enciendes luces y música                     │
// │  - Cliente sale → apagas todo para ahorrar energía              │
// └─────────────────────────────────────────────────────────────────┘
//
// PROPIEDADES CLAVE:
// - document.hidden          → true si la pestaña NO está visible
// - document.visibilityState → "visible" | "hidden" | "prerender"
//
// EVENTO:
// - "visibilitychange"       → Se dispara al cambiar de pestaña
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  CASOS DE USO REALES:                                           │
// │                                                                   │
// │  Netflix: Pausa el vídeo cuando cambias de pestaña              │
// │  YouTube: Detiene la precarga si no estás viendo                │
// │  Slack: Muestra "(ausente)" cuando no estás en la pestaña      │
// │  Google Docs: Auto-guarda cuando detecta que vas a salir       │
// └─────────────────────────────────────────────────────────────────┘
// =========================================================================

// Variables para rastrear el tiempo real de uso.
// tiempoInicio: marca cuándo fue la última vez que la pestaña se hizo visible.
// tiempoTotalVisible: acumula todos los periodos en que la pestaña estuvo activa.
let tiempoInicio = Date.now();
let tiempoTotalVisible = 0;

document.addEventListener('visibilitychange', () => {
    const statusEl = document.getElementById('visibilityStatus');
    const indicator = statusEl.querySelector('.status-indicator');
    const texto = statusEl.querySelector('span');
    const logContainer = document.getElementById('visibilityLog');

    const ahora = new Date().toLocaleTimeString();

    if (document.hidden) {
        // La pestaña se ocultó (usuario cambió a otra pestaña o minimizó)
        // Aquí es donde pausarías vídeos, detendrías peticiones, etc.
        indicator.className = 'status-indicator hidden';
        texto.textContent = 'Pestaña OCULTA (usuario en otra pestaña)';

        // Acumulamos el tiempo que la pestaña estuvo visible
        tiempoTotalVisible += Date.now() - tiempoInicio;

        const entry = document.createElement('div');
        entry.className = 'log-entry hide';
        entry.textContent = `[${ahora}] Pestaña ocultada. Tiempo visible acumulado: ${(tiempoTotalVisible / 1000).toFixed(1)}s`;
        logContainer.prepend(entry);

        console.log('Pestaña ocultada - el usuario no está viendo la página');
    } else {
        // La pestaña volvió a ser visible (el usuario regresó)
        // Aquí es donde reanudarías vídeos, refrescarías datos, etc.
        indicator.className = 'status-indicator visible';
        texto.textContent = 'Pestaña VISIBLE (usuario activo)';
        // Reiniciamos el contador de tiempo para este nuevo periodo visible
        tiempoInicio = Date.now();

        const entry = document.createElement('div');
        entry.className = 'log-entry show';
        entry.textContent = `[${ahora}] Pestaña visible de nuevo. ¡Bienvenido de vuelta!`;
        logContainer.prepend(entry);

        console.log('Pestaña visible - el usuario ha vuelto');
    }

    // Limitamos el log a 15 entradas para no saturar la UI
    while (logContainer.children.length > 15) {
        logContainer.lastChild.remove();
    }
});

// =========================================================================
// 2. CLIPBOARD API
// =========================================================================
//
// ¿QUÉ HACE?
// Permite leer y escribir en el portapapeles del sistema operativo
// de forma asíncrona y segura.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANTES (método antiguo, pre-2018):                              │
// │                                                                   │
// │  // Crear textarea temporal, copiar texto, seleccionar y        │
// │  // ejecutar el comando "copy" del navegador                     │
// │  const temp = document.createElement('textarea');                │
// │  temp.value = 'texto a copiar';                                 │
// │  document.body.appendChild(temp);                                │
// │  temp.select();                                                  │
// │  document.execCommand('copy');  // ← API obsoleta               │
// │  document.body.removeChild(temp);                                │
// │                                                                   │
// │  Problemas:                                                      │
// │  - 6 líneas de código para algo simple                          │
// │  - Modifica el DOM (crea/elimina elementos)                     │
// │  - execCommand() está deprecado (obsoleto)                      │
// │  - Síncrono (bloquea la UI mientras se ejecuta)                 │
// │                                                                   │
// │  AHORA (Clipboard API moderna):                                  │
// │                                                                   │
// │  await navigator.clipboard.writeText('texto a copiar');         │
// │                                                                   │
// │  Ventajas:                                                       │
// │  - 1 línea de código                                            │
// │  - No modifica el DOM                                           │
// │  - Asíncrono (no bloquea la UI)                                 │
// │  - API estándar y moderna                                       │
// └─────────────────────────────────────────────────────────────────┘
//
// MÉTODOS:
// - navigator.clipboard.writeText(texto)  → Copiar texto al portapapeles
// - navigator.clipboard.readText()        → Leer texto del portapapeles
//
// RESTRICCIONES DE SEGURIDAD:
// - writeText() solo funciona tras una acción del usuario (clic, tecla)
// - readText() requiere permiso explícito del usuario (popup del navegador)
// - Solo funciona en HTTPS o localhost (nunca en http:// plano)
// =========================================================================

async function copiarAlPortapapeles() {
    const input = document.getElementById('clipboardInput');
    const statusEl = document.getElementById('clipboardStatus');

    try {
        await navigator.clipboard.writeText(input.value);
        statusEl.className = 'status-message success';
        statusEl.textContent = `Copiado: "${input.value}"`;
        console.log('Texto copiado al portapapeles:', input.value);
    } catch (error) {
        statusEl.className = 'status-message error';
        statusEl.textContent = `Error al copiar: ${error.message}`;
        console.error('Error al copiar:', error);
    }
}

async function pegarDelPortapapeles() {
    const output = document.getElementById('clipboardOutput');
    const statusEl = document.getElementById('clipboardStatus');

    try {
        const texto = await navigator.clipboard.readText();
        output.value = texto;
        statusEl.className = 'status-message success';
        statusEl.textContent = `Pegado del portapapeles: "${texto}"`;
        console.log('Texto pegado del portapapeles:', texto);
    } catch (error) {
        statusEl.className = 'status-message error';
        statusEl.textContent = `Error al pegar: ${error.message} (el navegador puede bloquear la lectura)`;
        console.error('Error al pegar:', error);
    }
}

document.getElementById('btnCopy').addEventListener('click', copiarAlPortapapeles);
document.getElementById('btnPaste').addEventListener('click', pegarDelPortapapeles);

// =========================================================================
// 3. WEB NOTIFICATIONS API
// =========================================================================
//
// ¿QUÉ HACE?
// Permite mostrar notificaciones nativas del sistema operativo,
// incluso cuando el navegador está en segundo plano o minimizado.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANALOGÍA DEL MUNDO REAL:                                       │
// │                                                                   │
// │  Es como tener un MEGÁFONO que llega al escritorio del usuario  │
// │  aunque no esté mirando tu web. Úsalo con responsabilidad:      │
// │  demasiadas notificaciones = usuario molesto = permiso revocado.│
// │                                                                   │
// │  CASOS DE USO LEGÍTIMOS:                                         │
// │  - Gmail: "Tienes un nuevo correo"                               │
// │  - WhatsApp Web: "Nuevo mensaje de Juan"                        │
// │  - GitHub: "Tu build falló" o "PR aprobado"                     │
// │  - Calendario: "Reunión en 5 minutos"                           │
// │                                                                   │
// │  CASOS DE USO ABUSIVOS (NO HACER):                               │
// │  - "¡Vuelve a nuestra web!" (spam)                              │
// │  - Notificaciones cada 5 minutos                                 │
// │  - Pedir permiso nada más entrar (sin contexto)                 │
// └─────────────────────────────────────────────────────────────────┘
//
// FLUJO COMPLETO:
// 1. Verificar soporte: 'Notification' in window
// 2. Pedir permiso al usuario (solo la primera vez)
// 3. Verificar que el permiso fue "granted"
// 4. Crear la notificación con título, cuerpo e icono
//
// ESTADOS DEL PERMISO:
// - "granted"  → El usuario permitió notificaciones
// - "denied"   → El usuario las bloqueó (no volver a preguntar)
// - "default"  → El usuario cerró el diálogo sin decidir
// =========================================================================

async function solicitarPermiso() {
    const statusEl = document.getElementById('notificationStatus');

    // Verificar que el navegador soporta notificaciones
    // (algunos navegadores antiguos o móviles no las soportan)
    if (!('Notification' in window)) {
        statusEl.className = 'status-message error';
        statusEl.textContent = 'Tu navegador no soporta notificaciones';
        return;
    }

    // Pedir permiso: muestra un popup nativo del navegador
    // Solo se muestra la PRIMERA vez; si ya decidió, retorna el valor guardado
    const permiso = await Notification.requestPermission();

    const mensajes = {
        granted: 'Permiso concedido. Puedes enviar notificaciones.',
        denied: 'Permiso denegado. El usuario bloqueó las notificaciones.',
        default: 'El usuario cerró el diálogo sin decidir.'
    };

    statusEl.className = `status-message ${permiso === 'granted' ? 'success' : 'error'}`;
    statusEl.textContent = `Permiso: "${permiso}" - ${mensajes[permiso]}`;
    console.log('Permiso de notificaciones:', permiso);
}

function enviarNotificacion() {
    const statusEl = document.getElementById('notificationStatus');

    // Verificar permiso antes de enviar (patrón defensivo)
    if (Notification.permission !== 'granted') {
        statusEl.className = 'status-message error';
        statusEl.textContent = 'Primero solicita permiso con el botón "Solicitar Permiso"';
        return;
    }

    // Crear la notificación con opciones
    const notif = new Notification('Web APIs Modernas', {
        body: 'Esta notificación viene desde JavaScript en el navegador',
        // Icono como SVG inline (data URI) para no depender de archivos externos
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌐</text></svg>',
        // tag: identificador único. Si ya hay una notificación con el mismo tag,
        // se reemplaza en vez de crear una nueva (evita spam de notificaciones)
        tag: 'demo-notification',
        // requireInteraction: si true, la noti NO se cierra sola
        requireInteraction: false
    });

    // Evento onclick: se dispara cuando el usuario hace clic en la notificación
    // window.focus() trae la pestaña del navegador al frente
    notif.onclick = () => {
        window.focus();
        statusEl.className = 'status-message info';
        statusEl.textContent = 'El usuario hizo clic en la notificación';
        notif.close();
    };

    statusEl.className = 'status-message success';
    statusEl.textContent = 'Notificación enviada. Mira la esquina de tu pantalla.';
    console.log('Notificación enviada');
}

// Notificación temporizada: demuestra que las notificaciones funcionan
// incluso cuando el usuario ha cambiado de pestaña (segundo plano).
// Úsalo así: pulsa el botón, cambia a otra pestaña, espera 5 segundos.
function enviarNotificacionTemporizada() {
    const statusEl = document.getElementById('notificationStatus');

    if (Notification.permission !== 'granted') {
        statusEl.className = 'status-message error';
        statusEl.textContent = 'Primero solicita permiso con el botón "Solicitar Permiso"';
        return;
    }

    statusEl.className = 'status-message info';
    statusEl.textContent = 'Notificación programada para dentro de 5 segundos. Cambia de pestaña para verla.';

    setTimeout(() => {
        new Notification('Recordatorio', {
            body: 'Han pasado 5 segundos. Esto funciona incluso en segundo plano.',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">⏰</text></svg>',
            tag: 'timed-notification'
        });
    }, 5000);
}

document.getElementById('btnRequestPermission').addEventListener('click', solicitarPermiso);
document.getElementById('btnSendNotification').addEventListener('click', enviarNotificacion);
document.getElementById('btnTimedNotification').addEventListener('click', enviarNotificacionTemporizada);

// =========================================================================
// 4. FULLSCREEN API
// =========================================================================
//
// ¿QUÉ HACE?
// Permite poner un elemento ESPECÍFICO (no solo toda la página) en
// modo pantalla completa, ocupando todo el monitor del usuario.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANTES (trucos CSS):              AHORA (Fullscreen API):       │
// │                                                                   │
// │  position: fixed;                 await elem.requestFullscreen() │
// │  top: 0; left: 0;                                                │
// │  width: 100vw;                    Una sola línea.                │
// │  height: 100vh;                   El navegador gestiona:         │
// │  z-index: 9999;                   - Barra de herramientas        │
// │                                   - Tecla Escape para salir      │
// │  Problemas:                       - Evento de cambio             │
// │  - No oculta barra del navegador  - Selector CSS :fullscreen     │
// │  - Sin evento de salida                                          │
// │  - Sin selector CSS específico                                   │
// └─────────────────────────────────────────────────────────────────┘
//
// MÉTODOS:
// - elemento.requestFullscreen()   → Entrar en pantalla completa
// - document.exitFullscreen()      → Salir de pantalla completa
// - document.fullscreenElement     → Elemento actualmente en FS (o null)
//
// EVENTO:
// - "fullscreenchange"             → Se dispara al entrar o salir
//
// SELECTOR CSS:
// - :fullscreen                    → Estiliza el elemento cuando está en FS
//
// CASOS DE USO REALES:
// - Reproductores de vídeo (YouTube, Netflix)
// - Presentaciones tipo PowerPoint
// - Juegos en el navegador
// - Visualizaciones de datos inmersivas
// - Mapas a pantalla completa
// =========================================================================

async function entrarFullscreen() {
    const target = document.getElementById('fullscreenTarget');

    try {
        await target.requestFullscreen();
        console.log('Entrando en pantalla completa');
    } catch (error) {
        console.error('Error al entrar en fullscreen:', error.message);
    }
}

async function salirFullscreen() {
    try {
        // Verificar que hay un elemento en fullscreen antes de intentar salir
        if (document.fullscreenElement) {
            await document.exitFullscreen();
            console.log('Saliendo de pantalla completa');
        }
    } catch (error) {
        console.error('Error al salir de fullscreen:', error.message);
    }
}

// Listener para detectar cambios de estado fullscreen.
// Útil para ajustar la UI cuando se entra/sale de pantalla completa.
document.addEventListener('fullscreenchange', () => {
    const esFullscreen = document.fullscreenElement !== null;
    console.log('Estado fullscreen:', esFullscreen ? 'ACTIVO' : 'INACTIVO');
});

document.getElementById('btnFullscreen').addEventListener('click', entrarFullscreen);
document.getElementById('btnExitFullscreen').addEventListener('click', salirFullscreen);

// =========================================================================
// 5. INTERSECTION OBSERVER
// =========================================================================
//
// ¿QUÉ HACE?
// Permite OBSERVAR elementos del DOM y ejecutar código cuando entran
// o salen del viewport (la parte visible de la pantalla).
//
// ┌─────────────────────────────────────────────────────────────────┐
// │  ANTES (sin IntersectionObserver):                              │
// │                                                                   │
// │  window.addEventListener('scroll', () => {                       │
// │    const rect = elemento.getBoundingClientRect();                │
// │    if (rect.top < window.innerHeight) {                          │
// │      // El elemento es visible                                   │
// │    }                                                             │
// │  });                                                             │
// │                                                                   │
// │  Problemas:                                                      │
// │  - El evento scroll se dispara CIENTOS de veces por segundo     │
// │  - getBoundingClientRect() fuerza un "reflow" (recálculo caro)  │
// │  - Rendimiento PÉSIMO en páginas largas                          │
// │  - Código complejo y propenso a errores                          │
// │                                                                   │
// │  AHORA (con IntersectionObserver):                               │
// │                                                                   │
// │  const observer = new IntersectionObserver(callback, options);   │
// │  observer.observe(elemento);                                     │
// │                                                                   │
// │  Ventajas:                                                       │
// │  - El navegador optimiza internamente (no usa scroll events)    │
// │  - Asíncrono (no bloquea el hilo principal)                     │
// │  - API limpia y declarativa                                     │
// │  - Mucho mejor rendimiento                                      │
// │                                                                   │
// │  ANALOGÍA:                                                       │
// │  Antes = Mirar por la ventana cada 5ms para ver si alguien      │
// │          llega a tu puerta (agotador e ineficiente)              │
// │  Ahora = Instalar un timbre que suena cuando alguien llega      │
// │          (eficiente y automático)                                │
// └─────────────────────────────────────────────────────────────────┘
//
// CONCEPTOS CLAVE:
//
// ┌─────────────────────────────────────────────────────────────┐
// │                    VIEWPORT (lo que ves)                     │
// │                                                              │
// │   ┌─────────────────────────────────────┐                   │
// │   │  rootMargin (margen extra)          │                   │
// │   │  ┌───────────────────────────────┐  │                   │
// │   │  │  Elemento entra aquí          │  │                   │
// │   │  │  → se dispara el callback     │  │                   │
// │   │  │                               │  │                   │
// │   │  └───────────────────────────────┘  │                   │
// │   └─────────────────────────────────────┘                   │
// │                                                              │
// └─────────────────────────────────────────────────────────────┘
//
// OPCIONES DEL OBSERVER:
// ┌──────────────────┬──────────────────────────────────────────────┐
// │ root             │ Elemento contenedor (null = viewport global) │
// │ rootMargin       │ Margen extra: "50px" = 50px en cada lado    │
// │ threshold        │ 0 = apenas toca el borde                    │
// │                  │ 0.5 = 50% visible                           │
// │                  │ 1 = 100% visible (totalmente dentro)        │
// └──────────────────┴──────────────────────────────────────────────┘
//
// PROPIEDADES DEL ENTRY (cada elemento observado):
// ┌──────────────────────┬──────────────────────────────────────────┐
// │ isIntersecting       │ true si el elemento es visible ahora     │
// │ intersectionRatio    │ Porcentaje visible (0 a 1)               │
// │ target               │ Referencia al elemento DOM observado     │
// │ boundingClientRect   │ Posición y tamaño del elemento           │
// │ time                 │ Timestamp de cuándo ocurrió el cambio    │
// └──────────────────────┴──────────────────────────────────────────┘
//
// CASOS DE USO REALES:
// 1. Lazy loading de imágenes (cargar solo las visibles)
// 2. Infinite scroll (cargar más al llegar al final)
// 3. Animaciones al scroll (fade-in, slide-in)
// 4. Tracking de visibilidad de anuncios
// 5. Auto-pause de vídeos fuera del viewport
// =========================================================================

// Contadores para la demostración en tiempo real
let totalEntradas = 0;
// Set (no array) porque garantiza que cada elemento se cuenta solo una vez
let elementosVisibles = new Set();

// Callback que se ejecuta cada vez que un elemento observado
// entra o sale del viewport. Recibe un array de "entries"
// (una por cada elemento que cambió de estado).
const observerCallback = (entries) => {
    entries.forEach(entry => {
        totalEntradas++;

        if (entry.isIntersecting) {
            // El elemento ENTRÓ en el viewport
            // Usamos el atributo data-delay para crear un efecto "cascada"
            // donde las tarjetas aparecen una tras otra, no todas a la vez
            const delay = entry.target.dataset.delay || 0;

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, Number(delay));

            // Añadimos al Set de visibles (Set ignora duplicados automáticamente)
            elementosVisibles.add(entry.target);

            console.log(
                `Elemento visible: "${entry.target.querySelector('h3')?.textContent || 'sin título'}"`,
                `| Ratio: ${(entry.intersectionRatio * 100).toFixed(0)}%`
            );
        } else {
            // El elemento SALIÓ del viewport
            // Lo eliminamos del Set de visibles
            elementosVisibles.delete(entry.target);
        }
    });

    actualizarContadores();
};

// Configuración del observer:
// - root: null → usa el viewport del navegador como referencia
// - rootMargin: '0px' → sin margen extra (se dispara justo en el borde)
// - threshold: 0.1 → se activa cuando al menos el 10% del elemento es visible
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

// Crear la instancia del observer con el callback y las opciones
const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observar cada tarjeta: el observer "vigila" cada elemento y
// disparará el callback cuando entre/salga del viewport
const tarjetas = document.querySelectorAll('.scroll-card');
tarjetas.forEach(tarjeta => observer.observe(tarjeta));

// Mostrar cuántos elementos estamos observando
document.getElementById('observedCount').textContent = tarjetas.length;

// Actualiza los contadores en la UI cada vez que cambia la visibilidad
function actualizarContadores() {
    document.getElementById('visibleCount').textContent = elementosVisibles.size;
    document.getElementById('totalEntries').textContent = totalEntradas;
}

// =========================================================================
// RESUMEN DE APIs APRENDIDAS
// =========================================================================
//
// ┌──────────────────────┬──────────────────────────────────────────────┐
// │ API                  │  USO PRINCIPAL                               │
// ├──────────────────────┼──────────────────────────────────────────────┤
// │ Page Visibility      │  Detectar si la pestaña está activa          │
// │                      │  → Pausar/reanudar contenido                 │
// │ Clipboard            │  Copiar/pegar del portapapeles               │
// │                      │  → Botones "Copiar enlace" o "Compartir"     │
// │ Notifications        │  Notificaciones del sistema operativo        │
// │                      │  → Alertar al usuario de eventos importantes │
// │ Fullscreen           │  Pantalla completa para elementos            │
// │                      │  → Reproductores de vídeo, presentaciones    │
// │ IntersectionObserver │  Detectar visibilidad de elementos           │
// │                      │  → Lazy loading, infinite scroll, animaciones│
// └──────────────────────┴──────────────────────────────────────────────┘
//
// PATRÓN COMÚN: PERMISOS
// ┌─────────────────────────────────────────────────────────────────────┐
// │ Muchas APIs modernas requieren permiso del usuario:                 │
// │                                                                     │
// │ 1. Verificar soporte: 'Notification' in window                     │
// │    (no todos los navegadores soportan todas las APIs)               │
// │                                                                     │
// │ 2. Pedir permiso: await Notification.requestPermission()            │
// │    (solo la primera vez; después retorna el valor guardado)         │
// │                                                                     │
// │ 3. Verificar estado: if (permission === 'granted') { ... }         │
// │    (siempre comprobar antes de usar la API)                         │
// │                                                                     │
// │ 4. Manejar denegación: mostrar alternativa o mensaje amigable      │
// │    (nunca culpar al usuario por denegar permisos)                   │
// │                                                                     │
// │ APIs que requieren permiso:                                         │
// │ - Notifications (siempre)                                           │
// │ - Clipboard.readText() (siempre)                                    │
// │ - Geolocation (siempre)                                             │
// │ - Camera/Microphone (siempre)                                       │
// └─────────────────────────────────────────────────────────────────────┘
//
// PATRÓN COMÚN: ASINCRONÍA
// ┌─────────────────────────────────────────────────────────────────────┐
// │ Todas estas APIs son asíncronas (devuelven Promesas):               │
// │                                                                     │
// │ - clipboard.writeText() → devuelve Promesa (se resuelve al copiar) │
// │ - clipboard.readText()  → devuelve Promesa (se resuelve con texto) │
// │ - requestFullscreen()   → devuelve Promesa (se resuelve al entrar) │
// │ - requestPermission()   → devuelve Promesa (se resuelve con estado)│
// │                                                                     │
// │ Usa async/await para un código más limpio y legible:                │
// │                                                                     │
// │   // BIEN (async/await):                                            │
// │   const texto = await navigator.clipboard.readText();               │
// │   console.log(texto);                                               │
// │                                                                     │
// │   // MENOS LIMPIO (.then):                                          │
// │   navigator.clipboard.readText().then(texto => console.log(texto)); │
// └─────────────────────────────────────────────────────────────────────┘
//
// PRÓXIMOS PASOS:
// 1. Implementa lazy loading real de imágenes con IntersectionObserver
// 2. Crea un botón "Compartir URL" que copie la URL actual al portapapeles
// 3. Añade un contador de tiempo que SOLO cuente cuando la pestaña está activa
// 4. Crea un modo "presentación" que ponga un elemento en pantalla completa
// =========================================================================
