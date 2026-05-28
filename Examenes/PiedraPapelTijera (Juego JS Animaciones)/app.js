/* ==========================================================================
   1. VARIABLES DE ESTADO GLOBALES (El "Cerebro" o la "Fuente de la Verdad")
   ========================================================================== */
/* Buena práctica: Separar los "datos" de lo que se "ve". 
   Estas variables son la memoria pura del juego. Nunca leemos los puntos 
   mirando el HTML, siempre miramos estas variables y luego actualizamos el HTML. */

let puntosJugador = 0;
let puntosMaquina = 0;
let empates = 0;         // NUEVO: Nuestra caja de memoria para los empates.
let partidasJugadas = 0;

/* MÁQUINA DE ESTADOS: Esta bandera (booleano) nos dice en qué "fase" está el juego.
   false = Estamos en pleno torneo.
   true = El torneo acabó, toca mostrar resultados y esperar al reinicio.
   Usar banderas evita que eventos del usuario choquen entre sí. */
let juegoTerminado = false; 

const MaxPartidas = 5;

/* Promovemos la duración a una constante global. Si un día quieres que 
   la ruleta gire más rápido, solo cambias este '3' y se aplicará mágicamente 
   tanto a la física de CSS como a los cálculos matemáticos del JS. */
const duracionAnimacion = 3; 


/* ==========================================================================
   2. CAPTURAS DEL DOM (Creando los puentes entre HTML y JS)
   ========================================================================== */
/* 'document.getElementById' es la forma más rápida de encontrar elementos.
   Lo hacemos solo UNA VEZ al principio y los guardamos en constantes. 
   Buscar en el HTML constantemente dentro de la función de girar ralentizaría el juego. */

const formulario = document.getElementById('FormularioJuego');
const botonGirar = document.getElementById('BotonGirar');

const txtJugador = document.getElementById('RondaJugador');
const txtEmpates = document.getElementById('RondaEmpates'); // NUEVO: El puente al texto de empates
const txtMaquina = document.getElementById('RondaMaquina');
const txtMensaje = document.getElementById('MensajeEstado');

const carruselJugador = document.getElementById('CarruselJugador');
const carruselMaquina = document.getElementById('CarruselMaquina');


/* ==========================================================================
   3. EL CONTROLADOR PRINCIPAL (El director de orquesta)
   ========================================================================== */

/* Escuchamos el evento 'submit' del formulario en lugar del 'click' del botón. 
   Esto es mejor porque atrapa tanto si el usuario hace click con el ratón 
   como si pulsa la tecla ENTER en su teclado. */
formulario.addEventListener('submit', function(e) {
    /* Evita que el navegador intente enviar los datos a un servidor y recargue la página. */
    e.preventDefault();

    /* --- GESTIÓN DE ESTADO --- */
    /* Si el juego ya terminó, el botón no debe girar la ruleta, debe reiniciar la mesa. 
       Llamamos a la función de limpieza y usamos 'return' para abortar el resto de este código. */
    if (juegoTerminado) {
        resetearEstadoDelJuego();
        return; 
    }

    /* --- PROGRAMACIÓN DEFENSIVA (No confíes en el usuario) --- */
    /* FormData extrae mágicamente qué 'radio button' está marcado. */
    const data = new FormData(formulario);
    const eleccionJugador = parseInt(data.get('opcionJugador'));
    
    /* parseInt() convierte el texto a número. Pero si el usuario no seleccionó nada, 
       devuelve NaN (Not a Number). Si no paramos esto aquí, los cálculos matemáticos 
       de más abajo darían error y colgarían el juego. Le avisamos y cortamos (return). */
    if (isNaN(eleccionJugador)) {
        txtMensaje.style.color = "#e94560";
        txtMensaje.textContent = "⚠️ ¡Selecciona Piedra, Papel o Tijera primero!";
        return;
    }

    /* --- PREPARACIÓN DEL GIRO --- */
    botonGirar.disabled = true; // Bloqueamos el botón para evitar spam de clicks
    txtMensaje.style.color = "var(--color-exito)"; // Usamos la variable de CSS
    txtMensaje.textContent = "¡Girando... 🎰!";

    /* Math.random() da un número entre 0 y 0.99. Al multiplicar por 3 y usar floor (redondear abajo), 
       obtenemos siempre 0 (Piedra), 1 (Papel) o 2 (Tijera). */
    const eleccionMaquina = Math.floor(Math.random() * 3);
    const altoItem = 100; 
    
    /* El truco matemático: Cada opción mide 100px. Le sumamos 15 (un par de vueltas completas 
       a la lista de emojis) más la posición ganadora, y lo multiplicamos por 100px. 
       Esa es la distancia exacta que debe recorrer la tira hacia arriba. */
    const desplaceJugador = (15 + eleccionJugador) * altoItem;
    const desplaceMaquina = (15 + eleccionMaquina) * altoItem;

    /* --- REINICIO INVISIBLE DE LA RULETA --- */
    /* Apagamos el motor de animación ('none') y devolvemos la tira a la posición 0 
       instantáneamente. Como la animación está apagada, el usuario no ve este salto. */
    carruselJugador.style.transition = 'none';
    carruselMaquina.style.transition = 'none';
    carruselJugador.style.transform = 'translateY(0px)';
    carruselMaquina.style.transform = 'translateY(0px)';

    /* --- EL TRUCO DEL EVENT LOOP (Pintado del navegador) --- */
    /* requestAnimationFrame pide permiso al monitor para dibujar.
       Al anidar dos, le decimos al navegador:
       Frame 1: "Aplica el salto a 0px que acabo de pedirte arriba."
       Frame 2: "Ahora sí, enciende la animación y haz el desplazamiento real."
       Esto evita el famoso bug de CSS donde el navegador se confunde e ignora tu animación. */
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            /* Encendemos la física con nuestra constante de tiempo y curva de aceleración */
            carruselJugador.style.transition = `transform ${duracionAnimacion}s cubic-bezier(0.15, 0.85, 0.45, 1)`;
            carruselMaquina.style.transition = `transform ${duracionAnimacion}s cubic-bezier(0.15, 0.85, 0.45, 1)`;
            
            /* Damos la orden de mover hacia arriba (en negativo) */
            carruselJugador.style.transform = `translateY(-${desplaceJugador}px)`;
            carruselMaquina.style.transform = `translateY(-${desplaceMaquina}px)`;
        });
    });

    /* --- ESCUCHANDO AL CSS --- */
    /* No adivinamos cuándo acaba la animación, dejamos que CSS nos avise con 'transitionend'. 
       { once: true } es CRÍTICO: Asegura que el escuchador se destruya tras ejecutarse una vez, 
       evitando que la función calcularResultado se dispare varias veces en rondas futuras. */
    carruselJugador.addEventListener('transitionend', () => {
        calcularResultado(eleccionJugador, eleccionMaquina);
    }, { once: true });
});


/* ==========================================================================
   4. LÓGICA DE PUNTUACIÓN Y REGLAS
   ========================================================================== */

function calcularResultado(jugador, maquina) {
    partidasJugadas++;
    
    if (jugador === maquina) {
        /* NUEVO: Sumamos empate en memoria y actualizamos pantalla */
        empates++;
        txtEmpates.textContent = empates;
        txtMensaje.textContent = "¡Empate en esta ronda! 🤝";
        
    } else if (
        /* Lógica del Piedra(0), Papel(1), Tijera(2). 
           Piedra gana a Tijera || Papel gana a Piedra || Tijera gana a Papel */
        (jugador === 0 && maquina === 2) || 
        (jugador === 1 && maquina === 0) || 
        (jugador === 2 && maquina === 1)    
    ) {
        puntosJugador++;
        txtJugador.textContent = puntosJugador;
        txtMensaje.textContent = "¡Ganaste la ronda! 🎉";
    } else {
        puntosMaquina++;
        txtMaquina.textContent = puntosMaquina;
        txtMensaje.textContent = "La máquina gana la ronda 🤖";
    }

    /* Revisamos si llegamos al tope del torneo */
    if (partidasJugadas === MaxPartidas) {
        /* setTimeout está bien usado aquí. Solo queremos que el usuario procese el texto de 
           "Ganaste la ronda" durante 2 segundos antes de que le salte en la cara la pantalla de "FIN DEL TORNEO". */
        setTimeout(finalizarJuego, 2000);
    } else {
        /* Si el torneo sigue, reactivamos el botón para la siguiente ronda */
        botonGirar.disabled = false;
    }
}


/* ==========================================================================
   5. FIN DE JUEGO Y REINICIO LIMPIO (Paradigma SPA - Single Page App)
   ========================================================================== */

function finalizarJuego() {
    /* Cambiamos de estado: Entramos en "Modo fin de partida" */
    juegoTerminado = true; 
    
    let mensajeFinal = "";
    if (puntosJugador > puntosMaquina) {
        mensajeFinal = "🏆 ¡GANASTE EL TORNEO! 🏆";
    } else if (puntosMaquina > puntosJugador) {
        mensajeFinal = "❌ LA MÁQUINA TE DERROTÓ 🤖";
    } else {
        mensajeFinal = "⚖️ EMPATE ABSOLUTO ⚖️";
    }
    
    txtMensaje.style.color = "var(--color-empate)";
    txtMensaje.textContent = mensajeFinal;
    
    /* Transformamos el botón de Girar en un botón de Reiniciar */
    botonGirar.textContent = "Volver a jugar 🔄";
    botonGirar.disabled = false;
}

/* En la web moderna, NUNCA se usa location.reload(). 
   Recargar la página es costoso para el servidor y lento para el usuario.
   Un buen desarrollador devuelve las variables y el HTML a su estado original manualmente. */
function resetearEstadoDelJuego() {
    // 1. Limpiar memoria interna (Cerebro)
    puntosJugador = 0;
    puntosMaquina = 0;
    empates = 0; // NUEVO: Reseteo de empates
    partidasJugadas = 0;
    juegoTerminado = false; // ¡Volvemos a modo torneo!

    // 2. Limpiar Interfaz de Usuario (HTML)
    txtJugador.textContent = "0";
    txtMaquina.textContent = "0";
    txtEmpates.textContent = "0"; // NUEVO: Pantalla a cero
    txtMensaje.style.color = "var(--color-exito)";
    txtMensaje.textContent = "Selecciona tu jugada y gira";
    
    // 3. Devolver los carruseles a la posición de salida de forma invisible
    carruselJugador.style.transition = 'none';
    carruselMaquina.style.transition = 'none';
    carruselJugador.style.transform = 'translateY(0px)';
    carruselMaquina.style.transform = 'translateY(0px)';

    // 4. Restaurar el botón y limpiar la selección previa del usuario (los radio buttons)
    botonGirar.textContent = "¡GIRAR!";
    formulario.reset(); 
}