/* ==========================================================================
   1. EL ESTADO DEL JUEGO (Objeto Literal)
   ==========================================================================
   
   Un OBJETO LITERAL en JavaScript es una estructura de datos que agrupa
   propiedades relacionadas bajo un mismo identificador. Se define con llaves {}
   y contiene pares "clave: valor" separados por comas.

   Usamos 'const' para declarar este objeto porque queremos que la REFERENCIA
   (el enlace entre el nombre 'estadoJuego' y el objeto en memoria) sea
   permanente. Importante: 'const' NO congela el contenido del objeto;
   sus propiedades internas SÍ pueden modificarse. Lo que no podremos hacer
   nunca es escribir: estadoJuego = otraCosa; porque eso rompe la referencia.

   Este objeto actúa como la "fuente de verdad" de la partida: cualquier parte
   del código que necesite saber el marcador o si hay una animación en curso
   debe consultar este objeto, no variables sueltas.
   ========================================================================== */
const estadoJuego = {
    puntosJugador: 0,  // Tipo number. Almacena la puntuación acumulada del jugador. Empieza en 0.
    puntosMaquina: 0,  // Tipo number. Puntuación acumulada de la máquina. Empieza en 0.
    rondasJugadas: 0,  // Tipo number. Contador de rondas completadas. Se incrementa al resolver cada ronda.
    maxRondas: 5,      // Tipo number. Constante lógica: cuántas rondas tiene la partida. Modifica este valor para cambiar la duración del juego.
    enMovimiento: false // Tipo boolean. Actúa como un "semáforo": cuando es true, el juego ignora nuevas pulsaciones. Previene que el usuario pulse "Girar" mientras la animación está activa.
};

/* ==========================================================================
   2. EL DICCIONARIO DE REGLAS (Objeto como "Lookup Table")
   ==========================================================================

   Una LOOKUP TABLE (tabla de búsqueda) es un patrón de diseño que sustituye
   lógica condicional compleja (muchos if/else) por acceso directo a datos.
   En lugar de preguntar "¿es jugador === 0 y maquina === 2? entonces gana
   el jugador", simplemente preguntamos: ¿qué dice la entrada [jugador] del
   diccionario? Esto escala mejor y es mucho más legible.

   Las CLAVES de este objeto son números (0, 1, 2) que representan cada jugada.
   Cada valor es a su vez un OBJETO ANIDADO con dos propiedades:
     - nombre:  string legible para mostrar en pantalla.
     - ganaA:   número de la jugada a la que esta opción derrota.

   Ejemplo de lectura: Reglas[0].ganaA === 2 significa "Piedra derrota a Tijeras".
   Este diseño hace que añadir una nueva jugada (por ejemplo, "Lagarto") solo
   requiera añadir una entrada aquí, sin tocar la lógica de comparación.
   ========================================================================== */
const Reglas = {
    0: { nombre: 'Piedra',   ganaA: 2 }, // Índice 0 → Piedra. Gana a: 2 (Tijeras).
    1: { nombre: 'Papel',    ganaA: 0 }, // Índice 1 → Papel.  Gana a: 0 (Piedra).
    2: { nombre: 'Tijeras',  ganaA: 1 }  // Índice 2 → Tijeras. Gana a: 1 (Papel).
};

// 'const' porque este valor nunca cambia durante la ejecución.
// Se define aquí, a nivel de módulo, para que sea fácil de localizar y modificar
// si en el futuro queremos ajustar la velocidad de la animación.
// El valor es en SEGUNDOS; se convierte a milisegundos más adelante multiplicando por 1000.
const duracionAnimacion = 3;

/* ==========================================================================
   3. CAPTURAS DEL DOM (Referencias a elementos HTML)
   ==========================================================================

   El DOM (Document Object Model) es la representación en memoria de la página
   HTML. El navegador lo construye al cargar el HTML y lo expone a JavaScript
   a través del objeto global 'document'.

   Capturar referencias al inicio del script y guardarlas en variables tiene
   una ventaja de rendimiento: cada llamada a getElementById o querySelector
   hace que el navegador recorra el árbol del DOM buscando el elemento.
   Al guardar el resultado en una variable, esa búsqueda solo se hace UNA VEZ,
   y después accedemos al elemento directamente desde la variable en memoria.

   Métodos usados:
     - document.getElementById('id')     → Busca por atributo id. Es el más rápido.
     - document.querySelector('selector') → Busca por cualquier selector CSS.
                                            Más flexible pero ligeramente más lento.
   ========================================================================== */

// Referencia al elemento <form>. Lo necesitamos para leer sus datos y escuchar el evento 'submit'.
const formulario = document.getElementById('FormularioJuego');

// Referencia al <div class="opciones-selector"> que envuelve los radio buttons y labels.
// Se usa para aplicar la clase 'deshabilitado' al terminar la partida,
// bloqueando visualmente las opciones con CSS.
const contenedorOpciones = document.querySelector('.opciones-selector');

// Referencias a los <span> del marcador en el <header>.
// Solo necesitamos estos spans, no el <p> entero, porque solo modificaremos su texto.
const txtJugador = document.getElementById('RondaJugador'); // Muestra la puntuación del jugador.
const txtMaquina  = document.getElementById('RondaMaquina'); // Muestra la puntuación de la máquina.

// Referencia al <h2> que muestra el mensaje de estado actual de la ronda.
// Se actualiza frecuentemente: instrucciones, resultado de ronda, resultado final...
const txtMensaje = document.getElementById('MensajeEstado');

// Referencias a los dos botones del juego. Aunque viven dentro del formulario,
// los capturamos por separado para poder gestionar su visibilidad y estado de forma independiente.
const botonGirar     = document.getElementById('BotonGirar');    // type="submit". Inicia la ronda.
const botonReiniciar = document.getElementById('BotonReiniciar'); // type="button". Reinicia la partida.

// Referencias a las listas <ul> que forman las "tiras" de emojis de cada ranura.
// Son los elementos que animaremos verticalmente para simular el efecto de slot machine.
const carruselJugador = document.getElementById('CarruselJugador');
const carruselMaquina  = document.getElementById('CarruselMaquina');

/* ==========================================================================
   4. FUNCIÓN: animarRuleta
   ==========================================================================

   Una FUNCIÓN FLECHA (arrow function) asignada a una constante. La diferencia
   con 'function animarRuleta()' es mínima en este contexto; la elegimos por
   su sintaxis más concisa y porque en arrow functions el valor de 'this'
   se hereda del contexto externo (aunque aquí no usamos 'this').

   PARÁMETROS:
     - elementoHtml:    El nodo del DOM (<ul>) que queremos animar.
     - desplazamientoPx: Cuántos píxeles queremos desplazar la lista hacia arriba.

   RETORNO:
     Devuelve una PROMESA (Promise). Una promesa es un objeto que representa
     el resultado futuro de una operación asíncrona. En este caso, la promesa
     se "resuelve" (pasa de pendiente a cumplida) cuando la animación termina.
     Esto permite al código externo saber cuándo puede continuar.
   ========================================================================== */
const animarRuleta = (elementoHtml, desplazamientoPx) => {

    // La Web Animations API es una interfaz nativa del navegador para crear animaciones
    // directamente desde JavaScript, sin necesidad de CSS keyframes ni librerías externas.
    //
    // El método .animate() recibe dos argumentos:
    //
    //   1. KEYFRAMES (Array): Lista de estados de estilo entre los que interpola la animación.
    //      Aquí definimos el punto de inicio y el punto final del movimiento.
    //      El navegador calcula todos los fotogramas intermedios automáticamente.
    //
    //   2. OPTIONS (Objeto): Configuración del comportamiento de la animación.
    const animacion = elementoHtml.animate(
        [
            // Keyframe 1: estado inicial. translateY(0px) = posición original, sin desplazamiento.
            { transform: 'translateY(0px)' },

            // Keyframe 2: estado final. Desplazamos el elemento hacia ARRIBA la cantidad calculada.
            // Usamos un TEMPLATE LITERAL (comillas invertidas ``) para construir el string
            // dinámicamente, inyectando el valor de la variable con la sintaxis ${...}.
            // El signo negativo es clave: translateY con valor negativo sube el elemento.
            { transform: `translateY(-${desplazamientoPx}px)` }
        ],
        {
            // 'duration' en MILISEGUNDOS. Multiplicamos por 1000 para convertir segundos a ms.
            // 3 segundos * 1000 = 3000 ms de duración total de la animación.
            duration: duracionAnimacion * 1000,

            // 'easing' define la curva de aceleración. 'cubic-bezier' es una función matemática
            // de cuatro puntos de control. Estos valores específicos crean un efecto donde
            // la animación arranca rápido y frena suavemente al final, como una ruleta real.
            easing: 'cubic-bezier(0.15, 0.85, 0.45, 1)',

            // 'fill: forwards' indica que al terminar la animación, el elemento MANTIENE
            // el estilo del último keyframe. Sin esto, el elemento saltaría de vuelta
            // a su posición original al terminar la animación.
            fill: 'forwards'
        }
    );

    // .animate() devuelve un objeto Animation. Ese objeto tiene la propiedad '.finished',
    // que ES una Promesa. Al retornarla, quien llame a animarRuleta() puede encadenar
    // un .then() para ejecutar código cuando la animación concluya.
    return animacion.finished;
};

/* ==========================================================================
   5. EVENT LISTENER: Escuchador del formulario (evento 'submit')
   ==========================================================================

   addEventListener(tipo, callback) registra una función para que se ejecute
   cada vez que ocurra un evento concreto en un elemento.

   Parámetros:
     - 'submit': el nombre del evento. 'submit' se dispara cuando el usuario
       pulsa un botón de tipo submit dentro del formulario, o presiona Enter.
     - function(e) {...}: la FUNCIÓN CALLBACK. Una callback es una función que
       pasamos como argumento para que otro código la invoque más tarde.
       JavaScript la ejecutará SOLO cuando el evento ocurra, no al definirla.
       El parámetro 'e' (convencionalmente llamado 'event' o 'e') es el objeto
       Event que el navegador crea automáticamente con información del suceso.
   ========================================================================== */
formulario.addEventListener('submit', function(e) {

    // e.preventDefault() cancela el comportamiento nativo del evento 'submit'.
    // Por defecto, al enviar un formulario el navegador recarga la página (o navega a action="...").
    // Esto destruiría el estado de nuestro juego, así que lo bloqueamos.
    e.preventDefault();

    // GUARDIA TEMPRANA (early return): si alguna de estas condiciones es true, salimos de la
    // función inmediatamente con 'return', sin ejecutar nada más.
    //   - estadoJuego.enMovimiento: hay una animación en curso → no procesamos clics duplicados.
    //   - estadoJuego.rondasJugadas >= estadoJuego.maxRondas: la partida ya terminó.
    // El operador '||' (OR lógico) hace que baste con que UNA condición sea verdadera.
    if (estadoJuego.enMovimiento || estadoJuego.rondasJugadas >= estadoJuego.maxRondas) return;

    // FormData es una clase del navegador que encapsula los datos de un formulario.
    // Al pasarle el elemento del formulario como argumento, captura automáticamente
    // todos sus campos con sus valores actuales.
    const data = new FormData(formulario);

    // data.get('opcionJugador') busca el campo con name="opcionJugador" y devuelve su valor.
    // Los valores de los inputs HTML son siempre strings, incluso si parecen números.
    // parseInt() convierte ese string a un número entero (base 10 por defecto).
    // Si el string no es convertible, devuelve el valor especial NaN (Not a Number).
    const eleccionJugador = parseInt(data.get('opcionJugador'));

    // isNaN() es una función global que devuelve true si el argumento es NaN.
    // Esto ocurrirá si el usuario no ha seleccionado ningún radio button (data.get devuelve null,
    // y parseInt(null) produce NaN).
    if (isNaN(eleccionJugador)) {
        // .style permite acceder y modificar cualquier propiedad CSS inline del elemento.
        // Modificamos el color directamente aquí para señalizar el error visualmente.
        txtMensaje.style.color = "#e94560";
        // .textContent reemplaza el contenido de texto del elemento. Es más seguro que
        // .innerHTML porque no interpreta etiquetas HTML, evitando inyecciones de código.
        txtMensaje.textContent = "⚠️ ¡Selecciona Piedra, Papel o Tijeras primero!";
        return; // Salimos sin continuar si no hay elección válida.
    }

    // Activamos el "semáforo" para bloquear interacciones mientras la animación corre.
    estadoJuego.enMovimiento = true;

    // Desactivamos el botón a nivel de HTML. El atributo 'disabled' impide clics y
    // aplica estilos visuales de desactivación definidos en CSS (regla button:disabled).
    botonGirar.disabled = true;

    // Actualizamos el mensaje de estado para dar retroalimentación inmediata al usuario.
    // Usamos la variable CSS '--color-exito' definida en :root del CSS.
    // 'var(--nombre)' es la sintaxis para leer variables CSS desde JavaScript.
    txtMensaje.style.color = "var(--color-exito)";
    txtMensaje.textContent = "¡Girando... 🎰!";

    // Math es un objeto global con funciones y constantes matemáticas.
    //   Math.random() → genera un número decimal pseudoaleatorio en el rango [0, 1).
    //                   Nunca llega exactamente a 1, pero sí puede ser 0.
    //   Multiplicarlo por 3 nos da un rango [0, 3).
    //   Math.floor()  → redondea hacia abajo al entero más cercano.
    //   Resultado: 0, 1 o 2, con igual probabilidad cada uno.
    const eleccionMaquina = Math.floor(Math.random() * 3);

    // Para calcular cuántos píxeles debe moverse el carrusel, necesitamos saber la
    // altura en píxeles de cada elemento <li> tal como está renderizado en pantalla.
    // getBoundingClientRect() devuelve un objeto DOMRect con las medidas y posición
    // exactas del elemento según el layout actual del navegador.
    // Usamos el PRIMER <li> porque todos tienen la misma altura (definida en CSS con --alto-item).
    const primerLi  = carruselJugador.querySelector('li');
    const altoItem  = primerLi.getBoundingClientRect().height;

    // Calculamos cuántos ítems debe "avanzar" cada carrusel:
    //   15: ítems de "relleno" para crear el efecto de desplazamiento largo y continuo.
    //    1: saltamos el primer <li> vacío (el estado inicial en blanco del HTML).
    //    + eleccionJugador/Maquina: llegamos al ítem correcto (0=Piedra, 1=Papel, 2=Tijeras).
    // El carrusel tiene grupos de 3 emojis repetidos (✊✋✌️ × 6),
    // así que 15 avances garantizan que siempre haya recorrido suficiente.
    const itemsAvanzarJugador = 15 + 1 + eleccionJugador;
    const itemsAvanzarMaquina = 15 + 1 + eleccionMaquina;

    // Convertimos ítems a píxeles: multiplicamos la cantidad de ítems por la altura de cada uno.
    const desplaceJugador = itemsAvanzarJugador * altoItem;
    const desplaceMaquina = itemsAvanzarMaquina * altoItem;

    // Promise.all(arrayDePromesas) toma un array de Promesas y devuelve UNA nueva Promesa
    // que solo se resuelve cuando TODAS las promesas del array se han resuelto.
    // Si alguna falla (reject), la promesa global también falla.
    //
    // Aquí lo usamos porque necesitamos que AMBAS animaciones terminen antes de
    // mostrar el resultado. Si usásemos .then() en cada animación por separado,
    // el resultado podría calcularse antes de que la segunda animación acabara.
    //
    // El .then(callback) encadena una función que se ejecutará cuando la Promesa se resuelva.
    // Usamos una arrow function (() => {...}) como argumento porque es la sintaxis
    // estándar para callbacks cortas en código moderno.
    Promise.all([
        animarRuleta(carruselJugador, desplaceJugador),
        animarRuleta(carruselMaquina, desplaceMaquina)
    ]).then(() => {
        // Ambas animaciones han terminado: podemos calcular y mostrar el resultado.
        calcularResultado(eleccionJugador, eleccionMaquina);
    });
});

/* ==========================================================================
   6. FUNCIÓN: calcularResultado — Lógica de negocio de cada ronda
   ==========================================================================

   Esta función usa la sintaxis clásica 'function nombre()' en lugar de arrow
   function. La diferencia técnica relevante aquí es que las funciones declaradas
   con 'function' son HOISTED: el motor de JavaScript las procesa antes de
   ejecutar cualquier línea, por lo que podrían llamarse antes de su definición
   en el código. Las arrow functions asignadas a const NO tienen hoisting.

   Parámetros:
     - jugador: número (0, 1 o 2) que representa la elección del jugador.
     - maquina:  número (0, 1 o 2) que representa la elección generada aleatoriamente.
   ========================================================================== */
function calcularResultado(jugador, maquina) {

    // El operador ++ es el INCREMENTO POSTFIJO. Equivale a escribir:
    // estadoJuego.rondasJugadas = estadoJuego.rondasJugadas + 1;
    // Lo hacemos al inicio de la función para que el conteo sea correcto
    // al evaluar si hemos llegado al máximo de rondas al final de esta misma función.
    estadoJuego.rondasJugadas++;

    // Acceso a propiedades de un objeto anidado mediante la NOTACIÓN DE CORCHETES [].
    // Reglas[jugador] equivale a Reglas[0], Reglas[1] o Reglas[2] según el valor de 'jugador'.
    // Esto se llama ACCESO DINÁMICO: usamos el valor de una variable como clave,
    // algo imposible con la notación de punto (Reglas.jugador buscaría literalmente "jugador").
    // Después accedemos a .nombre con notación de punto porque la clave es fija (siempre "nombre").
    const nombreJugador = Reglas[jugador].nombre;
    const nombreMaquina  = Reglas[maquina].nombre;

    // Estructura IF / ELSE IF / ELSE: evaluamos los tres posibles resultados de una ronda.
    // El operador '===' es la IGUALDAD ESTRICTA: compara valor Y tipo de dato.
    // Siempre preferimos '===' sobre '==' (igualdad débil), que hace coerciones de tipo
    // implícitas que pueden producir resultados inesperados (ej: 0 == "0" es true con ==).
    if (jugador === maquina) {
        // EMPATE: ambos eligieron lo mismo.
        // En este juego, un empate suma punto a ambos (diseño de reglas del profesor).
        estadoJuego.puntosJugador++;
        estadoJuego.puntosMaquina++;
        // Los TEMPLATE LITERALS (` `) permiten interpolar expresiones ${} dentro de strings.
        // Son equivalentes a la concatenación con +, pero mucho más legibles:
        //   "¡Empate! 🤝 " + nombreJugador + " contra " + nombreMaquina + "."
        txtMensaje.textContent = `¡Empate! 🤝 ${nombreJugador} contra ${nombreMaquina}.`;
        txtMensaje.style.color = "var(--color-empate)";

    } else if (Reglas[jugador].ganaA === maquina) {
        // VICTORIA: consultamos en el diccionario Reglas si la jugada del jugador
        // "gana a" la jugada de la máquina. Si .ganaA coincide con el índice de la máquina,
        // el jugador gana.
        estadoJuego.puntosJugador++;
        txtMensaje.textContent = `¡Ganaste! 🎉 ${nombreJugador} gana a ${nombreMaquina}.`;
        txtMensaje.style.color = "var(--color-exito)";

    } else {
        // DERROTA: si no es empate y el jugador no gana, la máquina gana.
        // No necesitamos verificar explícitamente: es la única posibilidad restante.
        estadoJuego.puntosMaquina++;
        txtMensaje.textContent = `¡Perdiste! 🤖 ${nombreMaquina} gana a ${nombreJugador}.`;
        txtMensaje.style.color = "var(--color-acento)";
    }

    // Actualizamos el marcador visual en el DOM con los nuevos valores del estado.
    // Asignamos directamente a .textContent; el navegador re-renderiza esa parte del DOM.
    txtJugador.textContent = estadoJuego.puntosJugador;
    txtMaquina.textContent  = estadoJuego.puntosMaquina;

    // Comprobamos si ya se han jugado todas las rondas.
    if (estadoJuego.rondasJugadas >= estadoJuego.maxRondas) {
        // setTimeout(funcionCallback, retardoMs) programa la ejecución de una función
        // DESPUÉS de un retardo en milisegundos. Es asíncrono: JavaScript NO espera
        // los 1800ms bloqueado; sigue ejecutando otro código si lo hubiera.
        // Aquí lo usamos para que el jugador tenga tiempo de leer el resultado de la
        // última ronda antes de que aparezca el mensaje de fin de partida.
        // Nota: pasamos 'finalizarJuego' SIN paréntesis, porque queremos pasar la
        // REFERENCIA a la función, no ejecutarla ahora mismo.
        setTimeout(finalizarJuego, 1800);

    } else {
        // Quedan rondas: desactivamos el semáforo y re-habilitamos el botón
        // para que el jugador pueda iniciar la siguiente ronda.
        estadoJuego.enMovimiento = false;
        botonGirar.disabled = false;
    }
}

/* ==========================================================================
   7. FUNCIÓN: finalizarJuego — Cierre de partida y presentación del resultado final
   ========================================================================== */
function finalizarJuego() {

    // 'let' declara una variable cuyo valor SÍ puede reasignarse después.
    // Elegimos 'let' en lugar de 'const' precisamente porque sabemos que vamos
    // a asignarle diferentes strings según el resultado de la partida.
    // Inicializarla como string vacío "" es una práctica segura: si por algún error
    // no entrara en ningún bloque if, al menos el mensaje sería vacío y no 'undefined'.
    let mensajeFinal = "";

    // Comparamos los puntos totales para determinar el ganador de la partida completa.
    if (estadoJuego.puntosJugador > estadoJuego.puntosMaquina) {
        mensajeFinal = "🏆 ¡GANASTE LA PARTIDA! 🏆";
        txtMensaje.style.color = "var(--color-exito)";
        // Concatenación de string con el operador +. Aquí mezclamos el número del estado
        // con un string emoji. JavaScript convierte el número a string automáticamente
        // cuando uno de los operandos del + es ya un string. (Coerción de tipo implícita.)
        txtJugador.textContent = estadoJuego.puntosJugador + " 🎉";
        txtMaquina.textContent  = estadoJuego.puntosMaquina + " 👎";

    } else if (estadoJuego.puntosMaquina > estadoJuego.puntosJugador) {
        mensajeFinal = "❌ LA MÁQUINA TE DERROTÓ 🤖";
        txtMensaje.style.color = "var(--color-acento)";
        txtJugador.textContent = estadoJuego.puntosJugador + " 👎";
        txtMaquina.textContent  = estadoJuego.puntosMaquina + " 🎉";

    } else {
        // Si no hay ganador neto, los puntos son iguales: empate global.
        mensajeFinal = "⚖️ EMPATE ABSOLUTO ⚖️";
        txtMensaje.style.color = "var(--color-empate)";
        txtJugador.textContent = estadoJuego.puntosJugador + " 🤝";
        txtMaquina.textContent  = estadoJuego.puntosMaquina + " 🤝";
    }

    // Ahora que tenemos el mensaje, lo mostramos en el DOM.
    txtMensaje.textContent = mensajeFinal;

    // .classList es una propiedad de todos los elementos del DOM que expone una API
    // para manipular las clases CSS sin sobreescribir las existentes.
    // Métodos relevantes:
    //   .add('clase')    → añade la clase si no está presente.
    //   .remove('clase') → elimina la clase si está presente.
    //   .toggle('clase') → añade si no está, elimina si está.
    //   .contains('clase')→ devuelve boolean.
    // Aquí añadimos 'deshabilitado' para que el CSS aplique opacidad y cursor: not-allowed.
    contenedorOpciones.classList.add('deshabilitado');

    // document.querySelectorAll() devuelve una NodeList (parecida a un Array) con TODOS
    // los elementos del DOM que coincidan con el selector CSS indicado.
    // 'input[type="radio"]' selecciona todos los inputs cuyo atributo type sea "radio".
    const radios = document.querySelectorAll('input[type="radio"]');

    // .forEach() es un método de iteración que ejecuta una función una vez por cada elemento.
    // La arrow function recibe cada elemento como parámetro (aquí llamado 'radio').
    // Establecer .disabled = true en un input HTML activa el atributo 'disabled' nativamente,
    // impidiendo cualquier interacción del usuario con ese campo.
    radios.forEach(radio => radio.disabled = true);

    // Intercambiamos la visibilidad de los botones modificando sus clases CSS.
    // Las clases 'btn-visible' y 'btn-oculto' están definidas en styles.css con
    // transiciones de opacidad y visibility para un efecto de fundido suave.
    botonGirar.classList.remove('btn-visible');
    botonGirar.classList.add('btn-oculto');
    botonReiniciar.classList.remove('btn-oculto');
    botonReiniciar.classList.add('btn-visible');
}

/* ==========================================================================
   8. EVENT LISTENER: Botón Reiniciar (evento 'click')
   ==========================================================================

   Registramos el evento 'click' en el botón de reinicio. Usamos una arrow
   function directamente en lugar de definir una función con nombre separado,
   porque esta lógica es específica de este evento y no se reutiliza en ningún
   otro punto del código. Para lógica más extensa o reutilizable, es mejor
   práctica extraerla a una función con nombre para mayor legibilidad.
   ========================================================================== */
botonReiniciar.addEventListener('click', () => {

    // RESETEO DEL ESTADO: devolvemos todas las propiedades del objeto estadoJuego
    // a sus valores iniciales. Esto es análogo a reinicializar manualmente
    // el objeto, propiedad por propiedad. Otra técnica sería extraer los valores
    // iniciales a un objeto separado y Object.assign(estadoJuego, valoresIniciales).
    estadoJuego.puntosJugador = 0;
    estadoJuego.puntosMaquina = 0;
    estadoJuego.rondasJugadas = 0;
    estadoJuego.enMovimiento  = false;

    // Actualizamos el DOM para reflejar el estado reseteado visualmente.
    txtJugador.textContent = "0";
    txtMaquina.textContent  = "0";
    txtMensaje.style.color  = "var(--color-exito)";
    txtMensaje.textContent  = "Elige tu opción y gira";

    // La propiedad .style.transform aplica transformaciones CSS inline.
    // Reseteamos la posición de ambas listas al origen, ya que la animación
    // las había desplazado hacia arriba con translateY negativo.
    carruselJugador.style.transform = 'translateY(0px)';
    carruselMaquina.style.transform  = 'translateY(0px)';

    // getAnimations() es un método del DOM que devuelve un array con todas las
    // animaciones (objetos Animation) actualmente activas en ese elemento.
    // Cuando usamos fill: 'forwards', la animación permanece en su estado final
    // pero sigue "activa" en memoria. Si no la cancelamos explícitamente,
    // puede interferir con animaciones futuras.
    // .cancel() detiene la animación y elimina su efecto del elemento.
    carruselJugador.getAnimations().forEach(anim => anim.cancel());
    carruselMaquina.getAnimations().forEach(anim  => anim.cancel());

    // .reset() es un método nativo del elemento <form> que limpia todos sus campos:
    // desmarca checkboxes y radio buttons, vacía inputs de texto, etc.
    // Equivale a lo que haría un botón con type="reset", pero invocado desde JavaScript.
    formulario.reset();

    // Revertimos las modificaciones de accesibilidad hechas en finalizarJuego():
    // quitamos la clase 'deshabilitado' y activamos de nuevo los radio buttons.
    contenedorOpciones.classList.remove('deshabilitado');
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => radio.disabled = false);

    // Restauramos la visibilidad de los botones al estado inicial de la partida.
    // El botón Reiniciar vuelve a ocultarse; el botón Girar vuelve a mostrarse.
    botonReiniciar.classList.remove('btn-visible');
    botonReiniciar.classList.add('btn-oculto');

    // También reseteamos el atributo disabled del botón, que fue activado en el
    // event listener de 'submit' al inicio de cada ronda y puede haber quedado
    // activo si el juego terminó mientras estaba deshabilitado.
    botonGirar.disabled = false;
    botonGirar.classList.remove('btn-oculto');
    botonGirar.classList.add('btn-visible');
});