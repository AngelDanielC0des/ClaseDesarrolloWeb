    'use strict';
    // 'use strict': activa el modo estricto de JS; lanza errores en código ambiguo o peligroso
    // y previene el uso accidental de variables no declaradas

    /* ══════════════════════════════════════════
       REFERENCIAS AL DOM
       Guardamos todas las referencias al inicio
       para no repetir getElementById en cada función
       (cada llamada a getElementById fuerza una
       búsqueda en el árbol DOM; guardarlas en variables
       es más eficiente y el código más legible)
    ══════════════════════════════════════════ */

    // Inputs del formulario
    const inpUsername  = document.getElementById('inp-username');
    const inpPassword  = document.getElementById('inp-password');
    const inpBirthdate = document.getElementById('inp-birthdate');
    const inpTerms     = document.getElementById('inp-terms');

    // Mensajes de error del formulario
    const errUsername  = document.getElementById('err-username');
    const errPassword  = document.getElementById('err-password');
    const errBirthdate = document.getElementById('err-birthdate');
    const errTerms     = document.getElementById('err-terms');

    // Iconos del botón de mostrar/ocultar contraseña
    const iconEyeOpen  = document.getElementById('icon-eye-open');
    const iconEyeSlash = document.getElementById('icon-eye-slash');
    const btnTogglePwd = document.getElementById('btn-toggle-pwd');

    // Contenedores de página y tablero
    const pageForm  = document.getElementById('page-form');
    const pageBoard = document.getElementById('page-board');
    const grid      = document.getElementById('grid');

    // Instancia del Modal de Bootstrap: lo creamos una sola vez y lo reutilizamos
    // bootstrap.Modal acepta el elemento DOM del modal y lo gestiona
    const finModal = new bootstrap.Modal(document.getElementById('modal-fin'));


    /* ══════════════════════════════════════════
       GESTIÓN DE PÁGINAS
    ══════════════════════════════════════════ */

    /**
     * Cambia la página visible.
     * Quita .active de todas las páginas y la añade solo a la recibida.
     * @param {HTMLElement} page - El elemento de la página a mostrar
     */
    function showPage(page) {
      pageForm.classList.remove('active');   // Oculta la página del formulario
      pageBoard.classList.remove('active');  // Oculta la página del tablero
      page.classList.add('active');          // Muestra la página indicada
    }


    /* ══════════════════════════════════════════
       TOGGLE DE VISIBILIDAD DE CONTRASEÑA
    ══════════════════════════════════════════ */

    btnTogglePwd.addEventListener('click', () => {
    // Escucha el clic en el botón del ojo (es un <button>, accessible por teclado sin JS extra)

      const isHidden = inpPassword.type === 'password';
      // Determina si la contraseña está actualmente oculta (type="password")

      inpPassword.type = isHidden ? 'text' : 'password';
      // Si estaba oculta la muestra (type="text"), si estaba visible la oculta (type="password")

      iconEyeOpen.style.display  = isHidden ? 'none' : '';
      // Oculta el ojo abierto cuando la contraseña ya es visible (porque ahora debería verse el tachado)
      // Muestra el ojo abierto cuando la contraseña vuelve a estar oculta

      iconEyeSlash.style.display = isHidden ? '' : 'none';
      // Muestra el ojo tachado cuando la contraseña es visible
      // Oculta el ojo tachado cuando la contraseña está oculta

      btnTogglePwd.setAttribute(
        'aria-label',
        isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña'
      );
      // Actualiza el aria-label del botón para que el lector de pantalla anuncie
      // la acción que realizará el siguiente clic (no la que acaba de hacer)
    });


    /* ══════════════════════════════════════════
       FUNCIONES DE VALIDACIÓN
    ══════════════════════════════════════════ */

    /**
     * Comprueba si una contraseña cumple los requisitos de "fuerte":
     * - Más de 6 caracteres
     * - Al menos una mayúscula [A-Z]
     * - Al menos una minúscula [a-z]
     * - Al menos un dígito [0-9]
     * - Al menos un carácter especial (cualquier no alfanumérico)
     * @param {string} pwd - La contraseña a evaluar
     * @returns {boolean} true si es fuerte, false si no
     */
    function isStrongPassword(pwd) {
      return (
        pwd.length > 6          &&   // Más de 6 caracteres
        /[A-Z]/.test(pwd)       &&   // Tiene al menos una mayúscula
        /[a-z]/.test(pwd)       &&   // Tiene al menos una minúscula
        /\d/.test(pwd)          &&   // Tiene al menos un dígito (\d es equivalente a [0-9])
        /[^A-Za-z0-9]/.test(pwd)     // Tiene al menos un carácter que NO sea letra ni número
      );
    }

    /**
     * Calcula la edad en años completos a partir de una fecha de nacimiento.
     * Tiene en cuenta si el cumpleaños de este año ya ha pasado o no.
     * @param {string} dateString - Fecha en formato "YYYY-MM-DD" (el que devuelve input[type="date"])
     * @returns {number} Edad en años completos
     */
    function getAge(dateString) {
      const today = new Date();           // Fecha y hora actuales
      const birth = new Date(dateString); // Convierte el string a objeto Date

      let age = today.getFullYear() - birth.getFullYear();
      // Diferencia bruta de años (puede estar adelantada si el cumpleaños no ha pasado aún)

      const monthDiff = today.getMonth() - birth.getMonth();
      // Diferencia de meses (puede ser negativa si el mes de nacimiento es posterior al actual)

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        // Si el mes de nacimiento aún no ha llegado este año (monthDiff < 0),
        // o si es el mismo mes pero el día aún no ha llegado (monthDiff === 0 && día < día nacimiento),
        // entonces el cumpleaños de este año todavía no ha ocurrido: restamos 1 año
        age--;
      }

      return age; // Devuelve la edad real en años completos
    }

    /**
     * Aplica o elimina el estado de error en un campo del formulario.
     * Gestiona tanto la clase visual del input como la visibilidad del mensaje de error.
     * Centralizar esto en una función garantiza consistencia en TODOS los campos.
     * @param {HTMLElement} inputEl  - El elemento input a marcar (o desmarcar)
     * @param {HTMLElement} errorEl  - El elemento del mensaje de error a mostrar (o esconder)
     * @param {boolean}     hasError - true = mostrar error, false = quitar error
     */
    function setFieldError(inputEl, errorEl, hasError) {
      inputEl.classList.toggle('is-invalid', hasError);
      // Añade 'is-invalid' al input si hasError=true (borde rojo), la quita si hasError=false

      errorEl.classList.toggle('show', hasError);
      // Añade 'show' al mensaje de error si hasError=true (lo hace visible), la quita si hasError=false
    }


    /* ══════════════════════════════════════════
       ENVÍO Y VALIDACIÓN DEL FORMULARIO
    ══════════════════════════════════════════ */

    document.getElementById('btn-submit').addEventListener('click', () => {
    // Escucha el clic en el botón "Dar de alta"

      /* ── 1. Evaluamos TODOS los campos y guardamos el resultado ── */

      const usernameOk  = inpUsername.value.trim().length > 0;
      // El nombre de usuario es válido si, después de eliminar espacios al inicio y al final,
      // tiene al menos 1 carácter (no está vacío)

      const passwordOk  = isStrongPassword(inpPassword.value);
      // La contraseña es válida si cumple todos los requisitos de "fuerte"
      // (no le aplicamos .trim() para no alterar el valor: los espacios también son caracteres)

      const birthdateOk = inpBirthdate.value !== '' && getAge(inpBirthdate.value) >= 18;
      // La fecha es válida si: el campo no está vacío Y la edad calculada es >= 18 años

      const termsOk     = inpTerms.checked;
      // Los términos son válidos si el checkbox está marcado (.checked === true)

      /* ── 2. Aplicamos el estado de error a cada campo de forma consistente ── */
      // Usamos siempre setFieldError() para todos los campos (incluido el checkbox)
      // para garantizar coherencia: mismo comportamiento visual en todos ellos

      setFieldError(inpUsername,  errUsername,  !usernameOk);
      // Muestra error en nombre de usuario si usernameOk es false

      setFieldError(inpPassword,  errPassword,  !passwordOk);
      // Muestra error en contraseña si passwordOk es false

      setFieldError(inpBirthdate, errBirthdate, !birthdateOk);
      // Muestra error en fecha de nacimiento si birthdateOk es false

      setFieldError(inpTerms,     errTerms,     !termsOk);
      // Muestra error en términos si termsOk es false

      /* ── 3. Solo navegamos si TODOS los campos son válidos ── */

      const allValid = usernameOk && passwordOk && birthdateOk && termsOk;
      // allValid es true solo si los cuatro campos superan su validación

      if (allValid) {
        initBoard();     // Prepara el tablero de juego antes de mostrarlo
        showPage(pageBoard); // Cambia a la página del tablero
      }
      // Si allValid es false, permanecemos en la página del formulario
      // con los errores visibles para que el usuario los corrija
    });


    /* ══════════════════════════════════════════
       TABLERO DE COLORES
    ══════════════════════════════════════════ */

    // Array con los 9 colores del tablero en el orden: fila 1, fila 2, fila 3
    // (de izquierda a derecha, de arriba a abajo, igual que en la imagen)
    const CELL_COLORS = [
      '#e63946',  // Rojo      (posición 1 - fila 1, col 1)
      '#f4842b',  // Naranja   (posición 2 - fila 1, col 2)
      '#f4c430',  // Amarillo  (posición 3 - fila 1, col 3)
      '#2da84f',  // Verde     (posición 4 - fila 2, col 1)
      '#2563eb',  // Azul      (posición 5 - fila 2, col 2)
      '#8b2fc9',  // Morado    (posición 6 - fila 2, col 3)
      '#1abc9c',  // Turquesa  (posición 7 - fila 3, col 1)
      '#ff6eb4',  // Rosa      (posición 8 - fila 3, col 2)
      '#8b5e3c',  // Marrón    (posición 9 - fila 3, col 3)
    ];

    let blackCount = 0;
    // Contador de celdas que ya se han vuelto negras
    // Cuando llega a CELL_COLORS.length (9) se dispara el modal de fin de juego

    /**
     * Inicializa (o reinicia) el tablero de colores.
     * Limpia el grid del DOM, resetea el contador y crea las 9 celdas nuevas.
     */
    function initBoard() {
      grid.innerHTML = '';
      // Elimina todas las celdas existentes del DOM (necesario para el botón "Jugar de nuevo")

      blackCount = 0;
      // Resetea el contador de celdas negras a cero

      CELL_COLORS.forEach((color) => {
      // Itera sobre cada color del array para crear su celda correspondiente

        const cell = document.createElement('div');
        // Crea un nuevo elemento <div> para la celda

        cell.className = 'app-grid__cell';
        // Le asigna la clase CSS con los estilos de la celda (aspect-ratio, cursor, transición…)

        cell.style.backgroundColor = color;
        // Aplica el color de fondo mediante inline style
        // (usamos inline style porque el color es dinámico, no conocido en tiempo de diseño)

        cell.setAttribute('role', 'gridcell');
        // Semántica accesible: indica que es una celda dentro de un grid

        cell.setAttribute('tabindex', '0');
        // Hace la celda enfocable con teclado (Tab), sin tabindex no sería alcanzable

        /**
         * Convierte la celda a negro cuando el usuario interactúa con ella.
         * Comparte la lógica entre el evento de clic y el evento de teclado.
         */
        function turnBlack() {
          if (cell.classList.contains('app-grid__cell--black')) return;
          // Si la celda ya es negra, no hacemos nada (guard clause: salida temprana)

          cell.style.backgroundColor = '#111';
          // Cambia el color de fondo a negro (la transición CSS lo anima suavemente)

          cell.classList.add('app-grid__cell--black');
          // Añade la clase que deshabilita el hover y fija el color negro con !important

          cell.setAttribute('tabindex', '-1');
          // Saca la celda del orden de tabulación: ya no tiene sentido que sea enfocable

          blackCount++;
          // Incrementa el contador de celdas negras

          if (blackCount === CELL_COLORS.length) {
          // Comprueba si TODAS las celdas se han vuelto negras

            setTimeout(() => finModal.show(), 300);
            // Espera 300ms antes de mostrar el modal para que la animación de la última celda
            // termine antes de que aparezca el modal (mejor experiencia de usuario)
            // finModal.show() usa el método de Bootstrap para mostrar el modal con su animación
          }
        }

        cell.addEventListener('click', turnBlack);
        // El clic del ratón convierte la celda a negro

        cell.addEventListener('keydown', (e) => {
        // También gestionamos la interacción por teclado para accesibilidad

          if (e.key === 'Enter' || e.key === ' ') {
          // Responde a Enter (activación estándar) y Espacio (convención de botones)

            e.preventDefault();
            // Previene el comportamiento por defecto del teclado (ej: scroll con Space)

            turnBlack();
            // Ejecuta la misma acción que el clic del ratón
          }
        });

        grid.appendChild(cell);
        // Añade la celda recién creada al contenedor del grid en el DOM

      }); // fin forEach
    } // fin initBoard


    /* ══════════════════════════════════════════
       BOTÓN "JUGAR DE NUEVO" DEL MODAL
    ══════════════════════════════════════════ */

    document.getElementById('btn-replay').addEventListener('click', () => {
    // Escucha el clic en el botón de reinicio dentro del modal

      finModal.hide();
      // Cierra el modal usando el método de Bootstrap (gestiona el backdrop y la animación)

      initBoard();
      // Recrea el tablero: limpia el grid, resetea el contador y genera las 9 celdas nuevas
      // (no volvemos al formulario: el usuario ya está autenticado, simplemente juega de nuevo)
    });

  