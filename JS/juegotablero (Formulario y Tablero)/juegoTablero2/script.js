    'use strict';
    // -------------------------------------------------------------------------
    // CONCEPTO: Modo Estricto ('use strict')
    // -------------------------------------------------------------------------
    // Es como activar el "MODO PROFESOR ESTRICTO" en clase:
    // - Si haces algo mal, te avisa INMEDIATAMENTE con un error claro.
    // - Sin modo estricto, JavaScript a veces "ignora" tus errores y sigue
    //   adelante, lo que puede causar bugs silenciosos y difíciles de encontrar.
    //
    // Ejemplos de lo que prohíbe:
    //   - Usar variables sin declararlas (x = 5; → ERROR, falta let/const).
    //   - Duplicar nombres de parámetros en funciones.
    //   - Usar palabras reservadas como nombres de variables.
    //
    // ¿Qué pasaría si NO lo ponemos?
    // → JavaScript sería más "permisivo" pero más peligroso: podrías crear
    //   variables globales por accidente sin darte cuenta.
    // -------------------------------------------------------------------------
    // 'use strict': activa el modo estricto de JS; lanza errores en código ambiguo o peligroso
    // y previene el uso accidental de variables no declaradas

    /* ═══════════════════════════════════════════════════════════════════════
       REFERENCIAS AL DOM
       ═══════════════════════════════════════════════════════════════════════
       
       CONCEPTO: ¿Por qué guardamos las referencias AL PRINCIPIO?
       
       Imagina que vas a cocinar y necesitas 10 ingredientes.
       ¿Qué es más eficiente?
       
         OPCIÓN A (mala): Ir a la despensa 10 veces, una por cada ingrediente.
         OPCIÓN B (buena): Ir a la despensa UNA vez y traer todo de golpe.
       
       getElementById es como ir a la despensa: busca en TODO el árbol DOM.
       Si lo llamamos muchas veces para el mismo elemento, perdemos tiempo.
       Guardar la referencia en una variable es la OPCIÓN B.
       
       ┌──────────────────────────────────────────────────────────────────┐
       │  MAL (lento)                    │  BIEN (rápido)                │
       ├──────────────────────────────────────────────────────────────────┤
       │  getElementById('x').value = 1  │  const x = getElementById('x')│
       │  getElementById('x').style...   │  x.value = 1                  │
       │  getElementById('x').class...   │  x.style...                   │
       │  → 3 búsquedas en el DOM        │  x.class...                   │
       │                                 │  → 1 sola búsqueda            │
       └──────────────────────────────────────────────────────────────────┘
       
       Usamos 'const' porque la referencia al elemento NUNCA cambia
       (siempre apunta al mismo nodo del DOM).
    ═══════════════════════════════════════════════════════════════════════ */

    // Inputs del formulario: cada uno captura un campo de entrada de datos.
    // El usuario escribe en estos campos y nosotros leemos su .value.
    const inpUsername  = document.getElementById('inp-username');
    const inpPassword  = document.getElementById('inp-password');
    const inpBirthdate = document.getElementById('inp-birthdate');
    const inpTerms     = document.getElementById('inp-terms');

    // Mensajes de error del formulario: elementos <span> o <div> que muestran
    // texto como "El nombre es obligatorio". Están ocultos por defecto.
    const errUsername  = document.getElementById('err-username');
    const errPassword  = document.getElementById('err-password');
    const errBirthdate = document.getElementById('err-birthdate');
    const errTerms     = document.getElementById('err-terms');

    // Iconos del botón de mostrar/ocultar contraseña.
    // Son dos imágenes (o SVGs): un ojo abierto y un ojo tachado.
    // Solo uno es visible a la vez (como un interruptor on/off).
    const iconEyeOpen  = document.getElementById('icon-eye-open');
    const iconEyeSlash = document.getElementById('icon-eye-slash');
    const btnTogglePwd = document.getElementById('btn-toggle-pwd');

    // Contenedores de página y tablero.
    // La app tiene 2 "páginas" (como 2 diapositivas):
    //   - pageForm:  la página del formulario de registro.
    //   - pageBoard: la página del tablero de colores (el juego).
    // Solo una está visible a la vez (la que tenga la clase .active).
    const pageForm  = document.getElementById('page-form');
    const pageBoard = document.getElementById('page-board');
    const grid      = document.getElementById('grid');

    // Instancia del Modal de Bootstrap.
    // Un "modal" es una VENTANA EMERGENTE que aparece encima de todo.
    //
    //   ANALOGÍA: Es como una ALARMA de reloj.
    //   - La creas una vez (new bootstrap.Modal).
    //   - La activas cuando quieras (.show()).
    //   - La cierras cuando quieras (.hide()).
    //
    // ¿Por qué la creamos aquí y no dentro de una función?
    // → Porque crearla es "costoso" (busca el elemento, prepara animaciones...).
    //   Si la creáramos cada vez que la usamos, sería ineficiente.
    //   bootstrap.Modal acepta el elemento DOM del modal y lo gestiona.
    const finModal = new bootstrap.Modal(document.getElementById('modal-fin'));


    /* ═══════════════════════════════════════════════════════════════════════
       GESTIÓN DE PÁGINAS
       ═══════════════════════════════════════════════════════════════════════
       
       CONCEPTO: Single Page Application (SPA) - "Aplicación de una sola página"
       
       En lugar de tener varias páginas HTML y navegar entre ellas,
       tenemos UNA sola página con varias "vistas" (secciones).
       Mostramos/ocultamos vistas añadiendo o quitando la clase .active.
       
       ┌──────────────────────────────────────────────────────────────────┐
       │  PÁGINA TRADICIONAL             │  SPA (lo que hacemos aquí)     │
       ├──────────────────────────────────────────────────────────────────┤
       │  Cada vista es un .html distinto│  Todo en un solo .html         │
       │  El navegador recarga           │  Sin recargas                  │
       │  Más lento                      │  Más rápido y fluido           │
       │  Ej: WordPress clásico          │  Ej: Gmail, Twitter            │
       └──────────────────────────────────────────────────────────────────┘
    ═══════════════════════════════════════════════════════════════════════ */

    /**
     * Cambia la página visible.
     * Quita .active de todas las páginas y la añade solo a la recibida.
     * @param {HTMLElement} page - El elemento de la página a mostrar
     */
    function showPage(page) {
      pageForm.classList.remove('active');   // Oculta la página del formulario
      pageBoard.classList.remove('active');  // Oculta la página del tablero
      page.classList.add('active');          // Muestra la página indicada
      //
      // ¿Qué pasaría si NO quitáramos .active de las demás?
      // → Se verían TODAS las páginas a la vez, una encima de otra.
    }


    /* ═══════════════════════════════════════════════════════════════════════
       TOGGLE DE VISIBILIDAD DE CONTRASEÑA
       ═══════════════════════════════════════════════════════════════════════
       
       CONCEPTO: Toggle (alternar entre dos estados)
       
       Es como un INTERRUPTOR de la luz:
       - Si está apagada → la enciendes.
       - Si está encendida → la apagas.
       
       Aquí alternamos el tipo del input entre "password" (oculto) y "text" (visible).
       
       ┌──────────────────────────────────────────────────────────────────┐
       │  type="password"          │  type="text"                        │
       ├──────────────────────────────────────────────────────────────────┤
       │  Se ven: ●●●●●●●●        │  Se ve: MiClave123                   │
       │  Icono: ojo abierto       │  Icono: ojo tachado                 │
       └──────────────────────────────────────────────────────────────────┘
    ═══════════════════════════════════════════════════════════════════════ */

    btnTogglePwd.addEventListener('click', () => {
    // Escucha el clic en el botón del ojo.
    //
    // NOTA: () => { ... } es una "arrow function" (función flecha).
    // Es una forma moderna y corta de escribir funciones anónimas.
    //
    //   ┌──────────────────────────────────────────────────────────────┐
    //   │  Forma clásica:     function() { ... }                       │
    //   │  Forma flecha:      () => { ... }                            │
    //   │                                                              │
    //   │  Ambas hacen lo mismo aquí, pero la flecha es más corta.     │
    //   └──────────────────────────────────────────────────────────────┘

      const isHidden = inpPassword.type === 'password';
      // Determina si la contraseña está actualmente oculta.
      // El operador === compara y devuelve true o false.
      //
      // ¿Por qué === y no ==?
      // ┌──────────────────────────────────────────────────────────────┐
      // │  ==  (comparación débil)   │  === (comparación estricta)    │
      // ├──────────────────────────────────────────────────────────────┤
      // │  5 == "5"  → true (!!!)   │  5 === "5"  → false (correcto)│
      // │  0 == ""   → true (!!!)   │  0 === ""   → false (correcto)│
      // │  Compara valor "más o menos"│  Compara valor Y tipo         │
      // └──────────────────────────────────────────────────────────────┘
      // SIEMPRE usa === en JavaScript. Es más seguro y predecible.

      inpPassword.type = isHidden ? 'text' : 'password';
      // El operador ternario (? :) es un IF/ELSE en una sola línea.
      //
      //   condición ? valorSiTrue : valorSiFalse
      //
      // Equivale a:
      //   if (isHidden) { inpPassword.type = 'text'; }
      //   else          { inpPassword.type = 'password'; }
      //
      // Si estaba oculta → la muestra (type="text").
      // Si estaba visible → la oculta (type="password").

      iconEyeOpen.style.display  = isHidden ? 'none' : '';
      // Controla la visibilidad del icono de "ojo abierto".
      // - display = 'none' → oculto.
      // - display = ''     → visible (cadena vacía = valor por defecto).
      //
      // Cuando la contraseña se muestra (isHidden=true antes del cambio),
      // el ojo abierto se oculta porque ahora debe verse el ojo tachado.

      iconEyeSlash.style.display = isHidden ? '' : 'none';
      // Lo contrario del anterior: cuando la contraseña es visible,
      // muestra el ojo tachado (para indicar "haz clic para ocultar").

      btnTogglePwd.setAttribute(
        'aria-label',
        isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña'
      );
      // ACCESIBILIDAD: aria-label es un texto que los LECTORES DE PANTALLA
      // (usados por personas ciegas) leen en voz alta.
      //
      //   ANALOGÍA: Es como poner una ETIQUETA BRAILLE en un botón físico.
      //
      // Actualizamos el texto para que anuncie la ACCIÓN SIGUIENTE
      // (no la que acaba de ocurrir). Si la contraseña ahora es visible,
      // el botón debe decir "Ocultar contraseña" (la próxima acción).
    });


    /* ═══════════════════════════════════════════════════════════════════════
       FUNCIONES DE VALIDACIÓN
       ═══════════════════════════════════════════════════════════════════════
       
       CONCEPTO: Validación
       
       Validar es COMPROBAR que los datos del usuario son correctos
       antes de aceptarlos. Es como el portero de una discoteca:
       revisa tu edad antes de dejarte entrar.
       
       ┌──────────────────────────────────────────────────────────────────┐
       │  VALIDACIÓN              │  EJEMPLO                              │
       ├──────────────────────────────────────────────────────────────────┤
       │  ¿Campo no vacío?        │  El nombre de usuario no puede estar  │
       │                          │  en blanco.                           │
       ├──────────────────────────────────────────────────────────────────┤
       │  ¿Contraseña fuerte?     │  Debe tener mayúsculas, minúsculas,   │
       │                          │  números y símbolos.                   │
       ├──────────────────────────────────────────────────────────────────┤
       │  ¿Mayor de edad?         │  La fecha de nacimiento debe indicar  │
       │                          │  que tiene al menos 18 años.           │
       ├──────────────────────────────────────────────────────────────────┤
       │  ¿Términos aceptados?    │  El checkbox debe estar marcado.      │
       └──────────────────────────────────────────────────────────────────┘
    ═══════════════════════════════════════════════════════════════════════ */

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
      // CONCEPTO: Expresiones Regulares (RegExp)
      //
      // Una expresión regular es un PATRÓN de búsqueda dentro de un texto.
      // Se escribe entre barras: /patron/
      // El método .test(texto) devuelve true si el texto coincide con el patrón.
      //
      //   ┌──────────────────────────────────────────────────────────────────┐
      //   │  PATRÓN     │  SIGNIFICADO               │  EJEMPLO QUE CUMPLE  │
      //   ├──────────────────────────────────────────────────────────────────┤
      //   │  /[A-Z]/    │  Al menos una mayúscula     │  "Hola" → true      │
      //   │  /[a-z]/    │  Al menos una minúscula     │  "hola" → true      │
      //   │  /\d/       │  Al menos un dígito [0-9]   │  "abc3" → true      │
      //   │  /[^A-Za-z0-9]/ │ Un carácter que NO sea  │  "a@b"  → true      │
      //   │             │  letra ni número            │  "abc"  → false     │
      //   └──────────────────────────────────────────────────────────────────┘
      //
      // El operador && (AND lógico) exige que TODAS las condiciones sean true.
      // Si UNA SOLA falla, toda la expresión es false.
      //
      //   ┌────────────────────────────────────────────────────────────────┐
      //   │  OPERADOR  │  NOMBRE  │  RESULTADO                            │
      //   ├────────────────────────────────────────────────────────────────┤
      //   │  &&        │  AND     │  true solo si AMBAS son true           │
      //   │  ||        │  OR      │  true si AL MENOS UNA es true          │
      //   │  !         │  NOT     │  Invierte: true→false, false→true      │
      //   └────────────────────────────────────────────────────────────────┘
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
      // CONCEPTO: Objeto Date
      //
      // new Date() crea un objeto con la fecha y hora actuales.
      // new Date("2005-03-15") crea un objeto con esa fecha específica.
      //
      //   ANALOGÍA: Es como mirar el CALENDARIO de la pared.
      //   - today = "¿Qué día es hoy?"
      //   - birth = "¿Qué día nació esta persona?"
      const today = new Date();           // Fecha y hora actuales
      const birth = new Date(dateString); // Convierte el string a objeto Date

      let age = today.getFullYear() - birth.getFullYear();
      // Diferencia bruta de años.
      //
      // OJO: Esto NO siempre da la edad correcta.
      // Ejemplo: Si hoy es enero de 2026 y nació en diciembre de 2005:
      //   2026 - 2005 = 21, ¡pero solo tiene 20 años!
      //   (su cumpleaños de diciembre aún no ha llegado este año)
      //
      // Por eso necesitamos el ajuste de abajo.

      const monthDiff = today.getMonth() - birth.getMonth();
      // Diferencia de meses.
      // getMonth() devuelve 0 (enero) a 11 (diciembre).
      //
      // Si monthDiff es NEGATIVO → el mes de nacimiento aún no ha llegado.
      // Si monthDiff es CERO     → estamos en el mismo mes, hay que mirar el día.
      // Si monthDiff es POSITIVO → el cumpleaños ya pasó este año.

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        // Si el mes de nacimiento aún no ha llegado este año (monthDiff < 0),
        // o si es el mismo mes pero el día aún no ha llegado (monthDiff === 0 && día < día nacimiento),
        // entonces el cumpleaños de este año todavía no ha ocurrido: restamos 1 año.
        //
        //   EJEMPLO VISUAL:
        //   ┌────────────────────────────────────────────────────────────┐
        //   │  Hoy: 15 Enero 2026     Nacimiento: 20 Marzo 2005         │
        //   │  Diferencia bruta: 2026 - 2005 = 21                       │
        //   │  monthDiff = 0 (enero) - 2 (marzo) = -2 → negativo        │
        //   │  → El cumpleaños NO ha llegado → age = 21 - 1 = 20       │
        //   └────────────────────────────────────────────────────────────┘
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
      // CONCEPTO: classList.toggle(clase, condicion)
      //
      // toggle con 2 argumentos es como un INTERRUPTOR CONDICIONAL:
      // - Si condicion es true  → AÑADE la clase.
      // - Si condicion es false → QUITA la clase.
      //
      //   ┌──────────────────────────────────────────────────────────────┐
      //   │  hasError = true              │  hasError = false            │
      //   ├──────────────────────────────────────────────────────────────┤
      //   │  Añade 'is-invalid' al input  │  Quita 'is-invalid' del input│
      //   │  → Borde rojo visible         │  → Borde normal              │
      //   │  Añade 'show' al mensaje      │  Quita 'show' del mensaje    │
      //   │  → Mensaje de error visible   │  → Mensaje oculto            │
      //   └──────────────────────────────────────────────────────────────┘
      //
      // ¿Por qué usar una función centralizada en vez de repetir código?
      // → Principio DRY (Don't Repeat Yourself = No te repitas).
      //   Si mañana cambias el nombre de la clase CSS, solo lo cambias
      //   en UN sitio, no en cuatro.
      inputEl.classList.toggle('is-invalid', hasError);
      // Añade 'is-invalid' al input si hasError=true (borde rojo), la quita si hasError=false

      errorEl.classList.toggle('show', hasError);
      // Añade 'show' al mensaje de error si hasError=true (lo hace visible), la quita si hasError=false
    }


    /* ═══════════════════════════════════════════════════════════════════════
       ENVÍO Y VALIDACIÓN DEL FORMULARIO
       ═══════════════════════════════════════════════════════════════════════
       
       FLUJO COMPLETO cuando el usuario hace clic en "Dar de alta":
       
       ┌──────────────────────────────────────────────────────────────────┐
       │  1. Usuario hace clic en "Dar de alta"                          │
       │                          ↓                                       │
       │  2. Evaluamos TODOS los campos (username, password, fecha, etc) │
       │                          ↓                                       │
       │  3. Mostramos errores en los campos que estén mal               │
       │                          ↓                                       │
       │  4. ¿Todos correctos?                                           │
       │     ├─ SÍ → Preparamos el tablero y cambiamos a la página juego │
       │     └─ NO → Nos quedamos en el formulario para que corrija      │
       └──────────────────────────────────────────────────────────────────┘
    ═══════════════════════════════════════════════════════════════════════ */

    document.getElementById('btn-submit').addEventListener('click', () => {
    // Escucha el clic en el botón "Dar de alta".
    // NOTA: Aquí usamos 'click' en vez de 'submit' porque el botón no es
    // type="submit" sino type="button" (o simplemente un <button> sin type).

      /* ── 1. Evaluamos TODOS los campos y guardamos el resultado ── */
      //
      // CONCEPTO: .trim()
      // Elimina los ESPACIOS en BLANCO al inicio y al final de un texto.
      //
      //   "   hola   ".trim()  →  "hola"
      //   "   ".trim()         →  ""  (cadena vacía)
      //
      // ¿Por qué hacemos trim? Porque si el usuario escribe solo espacios,
      // queremos detectarlo como "campo vacío". Sin trim, "   " tendría
      // longitud 3 y parecería un nombre válido.

      const usernameOk  = inpUsername.value.trim().length > 0;
      // El nombre de usuario es válido si, después de eliminar espacios,
      // tiene al menos 1 carácter (no está vacío).
      //
      // .value → obtiene el texto que el usuario escribió en el input.
      // .trim() → quita espacios sobrantes.
      // .length → cuenta cuántos caracteres quedan.
      // > 0     → ¿hay al menos uno?

      const passwordOk  = isStrongPassword(inpPassword.value);
      // La contraseña es válida si cumple todos los requisitos de "fuerte"
      // (no le aplicamos .trim() para no alterar el valor: los espacios también son caracteres).

      const birthdateOk = inpBirthdate.value !== '' && getAge(inpBirthdate.value) >= 18;
      // La fecha es válida si:
      //   1. El campo no está vacío (el usuario eligió una fecha).
      //   2. La edad calculada es mayor o igual a 18 años.
      //
      // El operador && evalúa de izquierda a derecha y tiene "cortocircuito":
      // si la primera condición es false, NO evalúa la segunda.
      //
      //   ┌──────────────────────────────────────────────────────────────┐
      //   │  CORTOCIRCUITO (short-circuit evaluation)                    │
      //   ├──────────────────────────────────────────────────────────────┤
      //   │  false && loQueSea  →  false (nunca evalúa loQueSea)        │
      //   │  true  && loQueSea  →  depende de loQueSea                  │
      //   │                                                              │
      //   │  ¿Por qué importa? Porque si el campo está vacío,            │
      //   │  getAge('') daría resultados sin sentido. El cortocircuito   │
      //   │  nos protege de ese caso.                                    │
      //   └──────────────────────────────────────────────────────────────┘

      const termsOk     = inpTerms.checked;
      // Los términos son válidos si el checkbox está marcado.
      // .checked es una propiedad booleana: true si está marcado, false si no.
      //
      //   ┌──────────────────────────────────────────────────────────────┐
      //   │  TIPO DE INPUT   │  PROPIEDAD PARA LEER                     │
      //   ├──────────────────────────────────────────────────────────────┤
      //   │  type="text"     │  .value  (el texto escrito)              │
      //   │  type="password" │  .value  (el texto escrito, oculto)      │
      //   │  type="date"     │  .value  (fecha en formato "YYYY-MM-DD") │
      //   │  type="checkbox" │  .checked (true/false)                   │
      //   │  type="radio"    │  .checked (true/false)                   │
      //   └──────────────────────────────────────────────────────────────┘

      /* ── 2. Aplicamos el estado de error a cada campo de forma consistente ── */
      // Usamos siempre setFieldError() para todos los campos
      // para garantizar coherencia: mismo comportamiento visual en todos ellos.
      //
      // El operador ! (NOT) invierte el booleano:
      //   !true  → false
      //   !false → true
      //
      // Si usernameOk es true (campo correcto), !usernameOk es false (sin error).
      // Si usernameOk es false (campo incorrecto), !usernameOk es true (mostrar error).

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
      // allValid es true SOLO si los cuatro campos superan su validación.
      // Basta con que UNO falle para que allValid sea false.

      if (allValid) {
        initBoard();     // Prepara el tablero de juego antes de mostrarlo
        showPage(pageBoard); // Cambia a la página del tablero
      }
      // Si allValid es false, permanecemos en la página del formulario
      // con los errores visibles para que el usuario los corrija.
      //
      // ¿Qué pasaría si NO validáramos antes de cambiar de página?
      // → El usuario podría acceder al juego sin registrarse,
      //   con datos vacíos o incorrectos.
    });


    /* ═══════════════════════════════════════════════════════════════════════
       TABLERO DE COLORES
       ═══════════════════════════════════════════════════════════════════════
       
       CONCEPTO: Array (Arreglo / Lista)
       
       Un array es una COLECCIÓN ORDENADA de elementos.
       Es como una ESTANTERÍA con casillas numeradas desde 0.
       
       ┌──────────────────────────────────────────────────────────────────┐
       │  Posición (índice):  0       1       2       3       4          │
       │                     ┌───────┬───────┬───────┬───────┬───────┐   │
       │  Valor:             │ Rojo  │Naranja│Amarillo│ Verde │ Azul  │   │
       │                     └───────┴───────┴───────┴───────┴───────┘   │
       │                                                                  │
       │  IMPORTANTE: Los arrays en JavaScript empiezan en el índice 0.  │
       │  El primer elemento es CELL_COLORS[0], no CELL_COLORS[1].      │
       └──────────────────────────────────────────────────────────────────┘
       
       El tablero es una cuadrícula de 3x3 (9 celdas) con colores.
       El usuario hace clic en cada celda y esta se vuelve negra.
       Cuando las 9 son negras, aparece un modal de "fin de juego".
    ═══════════════════════════════════════════════════════════════════════ */

    // Array con los 9 colores del tablero en el orden: fila 1, fila 2, fila 3
    // (de izquierda a derecha, de arriba a abajo, igual que en la imagen)
    //
    // Usamos 'const' porque el array NUNCA cambia (siempre los mismos 9 colores).
    // Los colores están en formato hexadecimal (#RRGGBB).
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
    // Contador de celdas que ya se han vuelto negras.
    // Usamos 'let' porque este valor SÍ cambia (se incrementa con cada clic).
    // Cuando llega a CELL_COLORS.length (9) se dispara el modal de fin de juego.

    /**
     * Inicializa (o reinicia) el tablero de colores.
     * Limpia el grid del DOM, resetea el contador y crea las 9 celdas nuevas.
     */
    function initBoard() {
      grid.innerHTML = '';
      // CONCEPTO: innerHTML
      //
      // innerHTML es el CONTENIDO HTML que hay DENTRO de un elemento.
      // Ponerlo a '' (cadena vacía) es como VACIAR una caja:
      // elimina todos los hijos (celdas) que tenía dentro.
      //
      //   ANALOGÍA: Es como borrar toda la pizarra antes de dibujar de nuevo.
      //
      // ¿Por qué lo vaciamos? Porque si el usuario juega de nuevo,
      // necesitamos eliminar las 9 celdas viejas antes de crear las nuevas.
      // Si no lo hiciéramos, tendríamos 18 celdas, luego 27, etc.

      blackCount = 0;
      // Resetea el contador de celdas negras a cero (nueva partida).

      CELL_COLORS.forEach((color) => {
      // CONCEPTO: forEach (recorrer un array)
      //
      // forEach ejecuta una función POR CADA elemento del array.
      // La variable 'color' toma el valor de cada elemento, uno por uno:
      //
      //   Iteración 1: color = '#e63946' (rojo)
      //   Iteración 2: color = '#f4842b' (naranja)
      //   ...
      //   Iteración 9: color = '#8b5e3c' (marrón)
      //
      //   ┌──────────────────────────────────────────────────────────────┐
      //   │  MÉTODO DE ARRAY   │  ¿QUÉ HACE?                            │
      //   ├──────────────────────────────────────────────────────────────┤
      //   │  forEach           │  Ejecuta una acción por cada elemento  │
      //   │  map               │  Transforma cada elemento en otro      │
      //   │  filter            │  Selecciona los que cumplan condición  │
      //   │  find              │  Encuentra el primero que cumpla       │
      //   └──────────────────────────────────────────────────────────────┘

        const cell = document.createElement('div');
        // CONCEPTO: createElement
        //
        // Crea un elemento HTML NUEVO "en memoria" (aún no está en la página).
        // Es como fabricar una pieza de LEGO antes de colocarla en la construcción.
        //
        // ¿Qué pasaría si no usamos createElement?
        // → No tendríamos elemento que añadir al DOM. Es OBLIGATORIO
        //   crear el elemento antes de poder insertarlo.

        cell.className = 'app-grid__cell';
        // Le asigna la clase CSS con los estilos de la celda.
        //
        // NOTA: Se usa .className en vez de .class porque 'class' es
        // una palabra reservada en JavaScript (para crear clases POO).
        //
        //   ┌──────────────────────────────────────────────────────────────┐
        //   │  EN HTML se escribe:  <div class="app-grid__cell">           │
        //   │  EN JS se escribe:    cell.className = "app-grid__cell"      │
        //   └──────────────────────────────────────────────────────────────┘

        cell.style.backgroundColor = color;
        // Aplica el color de fondo mediante inline style.
        // Usamos inline style porque el color es DINÁMICO:
        // cada celda tiene un color diferente del array.
        // No podríamos definirlo en CSS porque CSS no sabe de arrays.

        cell.setAttribute('role', 'gridcell');
        // ACCESIBILIDAD: role="gridcell" indica a los lectores de pantalla
        // que este elemento es una CELDA dentro de una cuadrícula.
        // Sin esto, un usuario ciego no sabría que es una celda interactiva.

        cell.setAttribute('tabindex', '0');
        // ACCESIBILIDAD: tabindex="0" hace que la celda sea ENFOCABLE con teclado.
        //
        //   ┌──────────────────────────────────────────────────────────────┐
        //   │  tabindex  │  COMPORTAMIENTO                                │
        //   ├──────────────────────────────────────────────────────────────┤
        //   │  "0"       │  El elemento es enfocable con Tab (normal)     │
        //   │  "-1"      │  El elemento NO es enfocable con Tab           │
        //   │  "1","2".. │  Orden personalizado de tabulación (evitar)    │
        //   └──────────────────────────────────────────────────────────────┘
        //
        // Sin tabindex, un <div> NO recibe foco de teclado.
        // Solo elementos como <button>, <a>, <input> son enfocables por defecto.

        /**
         * Convierte la celda a negro cuando el usuario interactúa con ella.
         * Comparte la lógica entre el evento de clic y el evento de teclado.
         */
        function turnBlack() {
          if (cell.classList.contains('app-grid__cell--black')) return;
          // CONCEPTO: Guard Clause (Cláusula de guardia / Salida temprana)
          //
          // Si la celda YA es negra, salimos inmediatamente de la función.
          // Esto evita que se ejecute el resto del código innecesariamente.
          //
          //   ANALOGÍA: Si la luz ya está encendida, no necesitas encenderla otra vez.
          //
          // ¿Qué pasaría si NO tuviéramos esta línea?
          // → El contador blackCount se incrementaría cada vez que el usuario
          //   hiciera clic en una celda YA negra, y el modal aparecería
          //   antes de tiempo (o nunca, si el contador se pasa de 9).

          cell.style.backgroundColor = '#111';
          // Cambia el color de fondo a negro casi puro.
          // La transición CSS (definida en styles.css) lo anima suavemente.

          cell.classList.add('app-grid__cell--black');
          // Añade la clase que deshabilita el hover y fija el color negro.
          // Esta clase tiene !important en CSS para "ganar" al inline style.

          cell.setAttribute('tabindex', '-1');
          // Saca la celda del orden de tabulación.
          // Ya no tiene sentido que sea enfocable porque ya está "usada".
          // Es como quitarle las pilas a un mando que ya no vas a usar.

          blackCount++;
          // Incrementa el contador de celdas negras.
          // ++ es una abreviatura de: blackCount = blackCount + 1;
          //
          //   ┌──────────────────────────────────────────────────────────────┐
          //   │  ABREVIATURA  │  EQUIVALENTE                               │
          //   ├──────────────────────────────────────────────────────────────┤
          //   │  x++          │  x = x + 1   (incrementar en 1)            │
          //   │  x--          │  x = x - 1   (decrementar en 1)            │
          //   │  x += 5       │  x = x + 5   (sumar 5)                     │
          //   │  x -= 3       │  x = x - 3   (restar 3)                    │
          //   │  x *= 2       │  x = x * 2   (multiplicar por 2)           │
          //   └──────────────────────────────────────────────────────────────┘

          if (blackCount === CELL_COLORS.length) {
          // Comprueba si TODAS las celdas se han vuelto negras.
          // CELL_COLORS.length = 9 (el número de elementos del array).
          //
          // ¿Por qué usamos .length en vez de escribir 9 directamente?
          // → Si mañana añadimos o quitamos colores del array, este código
          //   sigue funcionando sin cambios. Es más FLEXIBLE y MANTENIBLE.

            setTimeout(() => finModal.show(), 300);
            // CONCEPTO: setTimeout
            //
            // setTimeout ejecuta una función DESPUÉS de X milisegundos.
            // 300ms = 0.3 segundos.
            //
            //   ┌──────────────────────────────────────────────────────────────┐
            //   │  TIEMPO     │  MILISEGUNDOS                                │
            //   ├──────────────────────────────────────────────────────────────┤
            //   │  0.1 seg    │  100 ms                                      │
            //   │  0.3 seg    │  300 ms                                      │
            //   │  0.5 seg    │  500 ms                                      │
            //   │  1 seg      │  1000 ms                                     │
            //   │  2 seg      │  2000 ms                                     │
            //   └──────────────────────────────────────────────────────────────┘
            //
            // ¿Por qué esperamos 300ms?
            // → Para que la ANIMACIÓN de la última celda termine ANTES de
            //   que aparezca el modal. Si no esperáramos, el modal taparía
            //   la animación y el usuario no la vería. Mala experiencia.
            //
            // finModal.show() usa el método de Bootstrap para mostrar el modal
            // con su animación y backdrop (fondo oscuro) incluidos.
          }
        }

        cell.addEventListener('click', turnBlack);
        // El clic del ratón convierte la celda a negro.
        // turnBlack es la función que se ejecutará (sin paréntesis,
        // porque NO queremos ejecutarla AHORA, sino cuando ocurra el clic).
        //
        //   ┌──────────────────────────────────────────────────────────────┐
        //   │  CORRECTO                    │  INCORRECTO                  │
        //   ├──────────────────────────────────────────────────────────────┤
        //   │  addEventListener('click',   │  addEventListener('click',   │
        //   │    turnBlack)                │    turnBlack())              │
        //   │  → Se ejecuta al hacer clic  │  → Se ejecuta INMEDIATAMENTE │
        //   │    (cuando el usuario quiera)│    (¡antes del clic!)        │
        //   └──────────────────────────────────────────────────────────────┘

        cell.addEventListener('keydown', (e) => {
        // ACCESIBILIDAD: También gestionamos la interacción por teclado.
        // keydown se dispara cuando se PRESIONA una tecla estando la celda enfocada.
        // El parámetro 'e' (evento) contiene información sobre qué tecla se presionó.

          if (e.key === 'Enter' || e.key === ' ') {
          // Responde a Enter (activación estándar) y Espacio (convención de botones).
          // e.key contiene el nombre de la tecla presionada.
          //
          //   ┌──────────────────────────────────────────────────────────────┐
          //   │  TECLA PRESIONADA  │  e.key                                 │
          //   ├──────────────────────────────────────────────────────────────┤
          //   │  Enter             │  "Enter"                               │
          //   │  Espacio           │  " " (un espacio)                      │
          //   │  Escape            │  "Escape"                              │
          //   │  Flecha arriba     │  "ArrowUp"                             │
          //   └──────────────────────────────────────────────────────────────┘

            e.preventDefault();
            // Previene el comportamiento por defecto del teclado.
            // Ej: la barra espaciadora normalmente hace scroll hacia abajo.
            // No queremos que la página haga scroll al activar una celda.

            turnBlack();
            // Ejecuta la misma acción que el clic del ratón.
            // Reutilizamos la función turnBlack para NO duplicar código.
          }
        });

        grid.appendChild(cell);
        // CONCEPTO: appendChild
        //
        // Añade la celda recién creada como HIJO del contenedor grid.
        // Es como COLOCAR la pieza de LEGO en la construcción.
        //
        // Sin esta línea, la celda existiría en memoria pero NO se vería
        // en la página. createElement crea, appendChild coloca.
        //
        //   ┌──────────────────────────────────────────────────────────────┐
        //   │  PASO 1: createElement → Fabrica la pieza (en memoria)      │
        //   │  PASO 2: Configurar     → Ponle color, clase, eventos...    │
        //   │  PASO 3: appendChild    → Colócala en la página (en el DOM) │
        //   └──────────────────────────────────────────────────────────────┘

      }); // fin forEach
    } // fin initBoard


    /* ═══════════════════════════════════════════════════════════════════════
       BOTÓN "JUGAR DE NUEVO" DEL MODAL
       ═══════════════════════════════════════════════════════════════════════
       
       Cuando el usuario termina el juego, aparece un modal con el botón
       "Jugar de nuevo". Al hacer clic:
       1. Se cierra el modal.
       2. Se reinicia el tablero (nuevas celdas, contador a 0).
       3. El usuario sigue en la página del tablero (no vuelve al formulario).
    ═══════════════════════════════════════════════════════════════════════ */

    document.getElementById('btn-replay').addEventListener('click', () => {
    // Escucha el clic en el botón de reinicio dentro del modal.

      finModal.hide();
      // Cierra el modal usando el método de Bootstrap.
      // .hide() gestiona automáticamente la animación de cierre y el backdrop.

      initBoard();
      // Recrea el tablero: limpia el grid, resetea el contador y genera las 9 celdas nuevas.
      //
      // ¿Por qué NO volvemos al formulario?
      // → El usuario ya se registró (sus datos eran válidos).
      //   No tiene sentido pedirle los datos otra vez.
      //   Simplemente reiniciamos el juego.
      //
      // FLUJO COMPLETO DE LA APLICACIÓN:
      // ┌──────────────────────────────────────────────────────────────────┐
      // │  INICIO → Formulario → Validar → Tablero → Jugar → Modal        │
      // │                                       ↑          │              │
      // │                                       └──────────┘              │
      // │                                     "Jugar de nuevo"            │
      // └──────────────────────────────────────────────────────────────────┘
    });

   

// =========================================================================
// RESUMEN: Conceptos clave aprendidos en esta lección
// =========================================================================
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  CONCEPTO                  │  EJEMPLO                          │  USO  │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  'use strict'              │  'use strict';                    │       │
// │                            │  → Activa modo estricto de JS    │  1    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  const (referencias DOM)   │  const inp = getElementById(...)  │       │
// │                            │  → Guardar elementos sin cambiar │  2    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Arrow function            │  () => { ... }                    │       │
// │                            │  → Función anónima moderna       │  3    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Operador ternario         │  condicion ? valorA : valorB      │       │
// │                            │  → If/else en una línea          │  4    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  === vs ==                 │  x === 5 (estricto, recomendado)  │       │
// │                            │  → Comparar valor Y tipo         │  5    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Expresiones regulares     │  /[A-Z]/.test(pwd)                │       │
// │                            │  → Buscar patrones en texto      │  6    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  classList.toggle          │  .toggle('clase', condicion)      │       │
// │                            │  → Añadir/quitar clase según     │  7    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  createElement + appendChild│ document.createElement('div')    │       │
// │                            │  → Crear e insertar elementos    │  8    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  forEach                   │  array.forEach((item) => { })     │       │
// │                            │  → Recorrer un array             │  9    │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  setTimeout                │  setTimeout(fn, 300)              │       │
// │                            │  → Ejecutar después de X ms      │  10   │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  innerHTML = ''            │  grid.innerHTML = ''              │       │
// │                            │  → Vaciar un contenedor          │  11   │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Guard clause              │  if (yaHecho) return;             │       │
// │                            │  → Salida temprana de función    │  12   │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Cortocircuito &&          │  a && b (si a es false, no eval b)│       │
// │                            │  → Evaluación eficiente          │  13   │
// ├─────────────────────────────────────────────────────────────────────────┤
// │  Accesibilidad (a11y)      │  role, tabindex, aria-label       │       │
// │                            │  → Hacer la web usable para todos│  14   │
// └─────────────────────────────────────────────────────────────────────────┘
//
// RECUERDA:
// - Siempre 'use strict' al inicio de tus scripts.
// - Usa const para referencias DOM que no cambian, let para contadores.
// - classList.toggle es tu amigo para alternar estados visuales.
// - createElement + appendChild para crear elementos dinámicamente.
// - La accesibilidad NO es opcional: usa role, tabindex y aria-label.
// - Principio DRY: si repites código, extráelo a una función.
// =========================================================================
