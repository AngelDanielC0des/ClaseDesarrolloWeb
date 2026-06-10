/**
 * JUEGO DEL TABLERO DE COLORES — Lógica e interacción accesible.
 *
 * Arquitectura general:
 * - IIFE: todo el estado vive en un ámbito privado; no se contamina
 *   el objeto global window y no hay riesgo de colisión con otros scripts.
 * - Delegación de eventos: 2 listeners en el tablero gestionan los 9
 *   botones (en lugar de 18 listeners individuales). Menos memoria,
 *   y el código de creación de botones queda libre de lógica de eventos.
 * - Roving tabindex: el patrón ARIA que convierte 9 botones en UN solo
 *   tabstop, delegando el movimiento interno a las flechas del teclado.
 *
 * Mapa de navegación por teclado (patrón APG "grid"):
 *
 *   ┌─────────────┬──────────────────────────────────────────┐
 *   │ Tecla       │ Acción                                   │
 *   ├─────────────┼──────────────────────────────────────────┤
 *   │ Flechas     │ Mover foco una celda (sin salir del borde)│
 *   │ Home        │ Primera celda de la FILA actual          │
 *   │ End         │ Última celda de la FILA actual           │
 *   │ Ctrl+Home   │ Primera celda del tablero (cuadro 1)     │
 *   │ Ctrl+End    │ Última celda del tablero (cuadro 9)      │
 *   │ Enter/Space │ Activar (nativo de <button>, sin código) │
 *   └─────────────┴──────────────────────────────────────────┘
 */
(() => {

    // --- Constantes de configuración -------------------------------
    // Centralizar los "números mágicos" con nombre: la geometría del
    // tablero y los tiempos se ajustan aquí sin tocar la lógica.
    const TAMANO_FILA = 3;
    const TOTAL_CUADROS = TAMANO_FILA * TAMANO_FILA;
    const INTERVALO_COLOR_MS = 1500;
    const MAX_CICLOS_COLOR = 3;
    const RETARDO_ANUNCIO_MS = 75;

    // --- Estado privado del juego ----------------------------------
    let esTableroRosa = true;
    let contadorCambios = 0;
    let idAlarma = null;
    let idRetardoAnuncio = null;
    let listaCuadritos = [];

    /**
     * Punto de entrada: construye el tablero, aplica el color inicial
     * y arranca el ciclo automático SOLO si el usuario no ha pedido
     * movimiento reducido en su sistema operativo.
     */
    function iniciarJuego() {
        crearTablero();
        pintarCuadradosEnRosa();

        // prefers-reduced-motion no es solo cosa del CSS: cualquier
        // cambio visual automático y recurrente (como este ciclo de
        // colores cada 1.5 s) cuenta como movimiento. Personas con
        // trastornos vestibulares o sensibilidad a parpadeos activan
        // esta preferencia precisamente para evitar esto.
        const prefiereMovimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!prefiereMovimientoReducido) {
            idAlarma = setInterval(cambiarColor, INTERVALO_COLOR_MS);
        } else {
            anunciar('Animaciones automáticas desactivadas por configuración del sistema.');
        }
    }

    /**
     * Genera la jerarquía ARIA completa: grid > row > gridcell > button.
     *
     * ¿Por qué <button> y no <div clicable>? El botón nativo trae gratis:
     * foco por teclado, activación con Enter Y Espacio (que el navegador
     * traduce a un evento click, por eso no necesitamos código para
     * ello), rol "button" en el árbol de accesibilidad y compatibilidad
     * con tecnologías de asistencia. Replicar todo eso en un div exige
     * ~15 líneas de código frágil. Primera regla de ARIA: usa el
     * elemento HTML nativo si existe.
     */
    function crearTablero() {
        const tablero = document.getElementById('juego-tablero');
        if (!tablero) return;

        tablero.innerHTML = '';
        listaCuadritos = [];

        for (let fila = 0; fila < TAMANO_FILA; fila++) {
            const filaElemento = document.createElement('div');
            filaElemento.setAttribute('role', 'row');
            filaElemento.classList.add('juego__fila');

            for (let columna = 0; columna < TAMANO_FILA; columna++) {
                const indice = fila * TAMANO_FILA + columna;

                const celda = document.createElement('div');
                celda.setAttribute('role', 'gridcell');

                const btn = document.createElement('button');
                btn.id = `cuadro${indice + 1}`;
                btn.classList.add('juego__cuadrito');
                btn.textContent = indice + 1;

                // type="button" evita el comportamiento por defecto
                // "submit" que tendría dentro de un <form>: el botón
                // queda blindado ante futuros cambios de contexto.
                btn.type = 'button';

                // El índice viaja en el DOM (data-*) en lugar de
                // capturarse en un closure: así la delegación de
                // eventos puede recuperarlo desde cualquier listener
                // sin acoplar la creación del botón a su manejo.
                btn.dataset.indice = indice;

                // aria-label da el NOMBRE accesible ("Cuadro 5, color
                // rosa"); aria-describedby añade la DESCRIPCIÓN de uso,
                // compartida por los 9 botones desde un único nodo.
                btn.setAttribute('aria-label', `Cuadro ${indice + 1}`);
                btn.setAttribute('aria-describedby', 'juego-info-boton');

                // ROVING TABINDEX: solo el primer cuadro es alcanzable
                // con Tab (tabindex="0"); el resto queda en tabindex="-1"
                // (enfocable por script, invisible para Tab). Sin este
                // patrón, salir del tablero costaría 9 pulsaciones de
                // Tab; con él, el tablero es UNA parada y dentro se
                // navega con flechas, como espera el rol "grid".
                btn.setAttribute('tabindex', indice === 0 ? '0' : '-1');

                celda.appendChild(btn);
                filaElemento.appendChild(celda);
                listaCuadritos.push(btn);
            }
            tablero.appendChild(filaElemento);
        }

        // DELEGACIÓN DE EVENTOS: los eventos de los botones burbujean
        // hasta el tablero, donde un único listener por tipo los
        // atiende. closest() filtra el origen real, de modo que clics
        // en huecos del grid (el gap entre celdas) se ignoran solos.
        tablero.addEventListener('click', (evento) => {
            const boton = evento.target.closest('.juego__cuadrito');
            if (boton) volverNegro(boton);
        });

        tablero.addEventListener('keydown', manejarTeclado);
    }

    /**
     * Pinta de negro un cuadro y lo marca como inactivo.
     *
     * ¿Por qué aria-disabled y no el atributo disabled? disabled
     * expulsa al botón del orden de tabulación y lo hace inenfocable:
     * los cuadros negros se volverían "agujeros" en la navegación con
     * flechas y el usuario de teclado no podría ni pasar por encima de
     * ellos. aria-disabled comunica "inactivo" al lector de pantalla
     * pero conserva la focabilidad; la inactividad real se aplica por
     * código (la guarda de abajo) y por CSS (cursor: not-allowed).
     */
    function volverNegro(boton) {
        if (!boton || boton.getAttribute('aria-disabled') === 'true') return;

        boton.setAttribute('aria-disabled', 'true');

        // La descripción "presiona para volverlo negro" ya no aplica a
        // un cuadro que no puede presionarse: se retira para que el
        // lector de pantalla no dé una instrucción imposible.
        boton.removeAttribute('aria-describedby');

        // No usamos aria-pressed: ese atributo describe un interruptor
        // reversible (toggle on/off), y este estado es definitivo. El
        // estado completo viaja en aria-disabled + el nuevo aria-label.
        resetearClasesColor(boton);
        boton.setAttribute('aria-label', `Cuadro ${boton.textContent}, negro e inactivo`);

        anunciar(`Cuadro ${boton.textContent} cambiado a negro.`);

        if (estanTodosEnNegro()) {
            finDelJuego();
        }
    }

    /**
     * Cierre de la partida: detiene el ciclo de colores, muestra el
     * mensaje de victoria visible y lo anuncia en la región viva.
     *
     * Dos canales deliberadamente redundantes: el párrafo visible
     * informa a los usuarios videntes (quitar "hidden" a un nodo
     * normal NO genera anuncio automático en lectores de pantalla),
     * y anunciar() cubre el canal auditivo. Mismo mensaje, dos
     * sentidos: principio de redundancia sensorial.
     */
    function finDelJuego() {
        clearInterval(idAlarma);

        const resultado = document.getElementById('juego-resultado');
        if (resultado) resultado.hidden = false;

        anunciar('Fin del juego. Todos los cuadros están en negro.');
    }

    function estanTodosEnNegro() {
        return listaCuadritos.every(
            (cuadro) => cuadro.getAttribute('aria-disabled') === 'true'
        );
    }

    /**
     * Única fuente de verdad para retirar clases de color: cualquier
     * transición de estado (rosa→azul, azul→rosa, color→negro) pasa
     * por aquí. Añadir un cuarto color exigirá tocar UNA línea.
     */
    function resetearClasesColor(cuadro) {
        cuadro.classList.remove(
            'juego__cuadrito--rosa',
            'juego__cuadrito--blanco',
            'juego__cuadrito--azul'
        );
    }

    /**
     * Aplica el patrón de color y sincroniza el aria-label de cada
     * cuadro activo. El color es información: un usuario ciego debe
     * poder conocer el estado del tablero igual que uno vidente
     * (WCAG 1.4.1: el color nunca puede ser el único canal).
     */
    function pintarCuadradosEnRosa() {
        listaCuadritos.forEach((cuadro, n) => {
            if (cuadro.getAttribute('aria-disabled') === 'true') return;

            const esRosa = n % 2 === 0;
            resetearClasesColor(cuadro);
            cuadro.classList.add(esRosa ? 'juego__cuadrito--rosa' : 'juego__cuadrito--blanco');
            cuadro.setAttribute('aria-label', `Cuadro ${n + 1}, color ${esRosa ? 'rosa' : 'blanco'}`);
        });
    }

    function pintarCuadradosEnAzul() {
        listaCuadritos.forEach((cuadro, n) => {
            if (cuadro.getAttribute('aria-disabled') === 'true') return;

            const esAzul = n % 2 !== 0;
            resetearClasesColor(cuadro);
            cuadro.classList.add(esAzul ? 'juego__cuadrito--azul' : 'juego__cuadrito--blanco');
            cuadro.setAttribute('aria-label', `Cuadro ${n + 1}, color ${esAzul ? 'azul' : 'blanco'}`);
        });
    }

    /**
     * Alterna la paleta del tablero. El ciclo se autodetiene tras
     * MAX_CICLOS_COLOR alternancias completas: una animación infinita
     * sin botón de pausa incumpliría WCAG 2.2.2 (Pausar, detener,
     * ocultar), que exige control sobre todo movimiento automático
     * que dure más de 5 segundos.
     */
    function cambiarColor() {
        if (esTableroRosa) {
            pintarCuadradosEnAzul();
            contadorCambios++;
        } else {
            pintarCuadradosEnRosa();
        }
        esTableroRosa = !esTableroRosa;

        if (contadorCambios === MAX_CICLOS_COLOR) {
            clearInterval(idAlarma);
            anunciar('El tablero ha dejado de cambiar de colores.');
        }
    }

    /**
     * Navegación interna del grid (patrón APG):
     * - Las flechas mueven el foco celda a celda; en los bordes no hay
     *   "wrap": la condición de frontera deja el índice intacto, y el
     *   foco simplemente se queda donde está.
     * - Home/End operan sobre la FILA actual; con Ctrl, sobre el
     *   tablero completo. Es la semántica que el rol "grid" promete a
     *   los usuarios de lector de pantalla.
     * - Enter y Espacio NO se gestionan aquí: <button> los convierte
     *   en click de forma nativa.
     */
    function manejarTeclado(evento) {
        const boton = evento.target.closest('.juego__cuadrito');
        if (!boton) return;

        const indiceActual = Number(boton.dataset.indice);
        const columna = indiceActual % TAMANO_FILA;
        const inicioDeFila = indiceActual - columna;
        let nuevoIndice = indiceActual;

        switch (evento.key) {
            case 'ArrowRight':
                if (columna < TAMANO_FILA - 1) nuevoIndice = indiceActual + 1;
                break;
            case 'ArrowLeft':
                if (columna > 0) nuevoIndice = indiceActual - 1;
                break;
            case 'ArrowDown':
                if (indiceActual < TOTAL_CUADROS - TAMANO_FILA) nuevoIndice = indiceActual + TAMANO_FILA;
                break;
            case 'ArrowUp':
                if (indiceActual >= TAMANO_FILA) nuevoIndice = indiceActual - TAMANO_FILA;
                break;
            case 'Home':
                nuevoIndice = evento.ctrlKey ? 0 : inicioDeFila;
                break;
            case 'End':
                nuevoIndice = evento.ctrlKey ? TOTAL_CUADROS - 1 : inicioDeFila + TAMANO_FILA - 1;
                break;
            default:
                // Tecla ajena al grid: se devuelve SIN preventDefault
                // para no secuestrar atajos del navegador o del lector
                // de pantalla (Tab, F5, atajos de NVDA/JAWS...).
                return;
        }

        // preventDefault SIEMPRE que la tecla sea nuestra, incluso si
        // el foco no se mueve (flecha contra un borde): sin esto, las
        // flechas y Home/End harían scroll de la página mientras el
        // usuario intenta navegar por el tablero.
        evento.preventDefault();

        if (nuevoIndice === indiceActual) return;

        // El testigo del roving tabindex pasa de un cuadro a otro:
        // en todo momento hay exactamente UN tabindex="0" en el grid,
        // que actúa como "memoria" de la posición si el usuario sale
        // con Tab y vuelve después.
        listaCuadritos[indiceActual].setAttribute('tabindex', '-1');
        listaCuadritos[nuevoIndice].setAttribute('tabindex', '0');
        listaCuadritos[nuevoIndice].focus();
    }

    /**
     * Publica un mensaje en la región viva (aria-live).
     *
     * El vaciado y el rellenado se separan en DOS tareas distintas
     * (mediante setTimeout): si ambos ocurrieran en la misma ejecución
     * síncrona, el navegador colapsaría las mutaciones en una sola y
     * un mensaje idéntico al anterior ("Cuadro 5 cambiado a negro"
     * dos veces seguidas) no volvería a anunciarse. El retardo de
     * ~75 ms es imperceptible para el oído pero suficiente para que
     * el árbol de accesibilidad registre el cambio.
     *
     * clearTimeout previene la condición de carrera entre dos anuncios
     * casi simultáneos: gana el más reciente, que es el relevante.
     */
    function anunciar(mensaje) {
        const anunciador = document.getElementById('juego-anunciador');
        if (!anunciador) return;

        clearTimeout(idRetardoAnuncio);
        anunciador.textContent = '';
        idRetardoAnuncio = setTimeout(() => {
            anunciador.textContent = mensaje;
        }, RETARDO_ANUNCIO_MS);
    }

    // Arranque del juego. Gracias a <script defer> en el HTML, este
    // código se ejecuta cuando el DOM ya está completamente parseado:
    // no hace falta envolver nada en DOMContentLoaded.
    iniciarJuego();

})();
