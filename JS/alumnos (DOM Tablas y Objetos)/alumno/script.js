// =========================================================================
// LECCIÓN: Gestión de Alumnos con DOM dinámico (Versión Alumno)
// =========================================================================
//
// ¿QUÉ HACE ESTE SCRIPT?
// ──────────────────────
// Es una versión MEJORADA del archivo profe/alumnos.js. Permite:
//   1. Añadir UN alumno o TODOS a una tabla HTML
//   2. Borrar alumnos INDIVIDUALMENTE o TODOS de golpe
//   3. Calcular ESTADÍSTICAS en tiempo real (media, mayor, menor)
//   4. Las estadísticas se RECALCULAN automáticamente al borrar
//
// DIFERENCIAS CON LA VERSIÓN DEL PROFE:
// ┌──────────────────────────────────────────────────────────────────────┐
// │  VERSIÓN PROFE              │  VERSIÓN ALUMNO (esta)                 │
// ├─────────────────────────────┼────────────────────────────────────────┤
// │  Usa let para variables     │  Usa const (más seguro)                │
// │  appendChild() uno a uno    │  append() varios a la vez              │
// │  Estadísticas en body       │  Estadísticas en contenedor propio     │
// │  No limpia antes de añadir  │  Limpia tabla antes de addAlumnos()    │
// │  No recalcula al borrar     │  Recalcula estadísticas al borrar      │
// │  innerHTML para limpiar     │  removeChild (más seguro)              │
// └──────────────────────────────────────────────────────────────────────┘

// -------------------------------------------------------------------------
// 1. BASE DE DATOS LOCAL (Array de Objetos)
// -------------------------------------------------------------------------
//
// Usamos 'const' porque NO vamos a reasignar la variable.
// OJO: const NO significa que el array sea inmutable.
// Podemos hacer alumnos.push() o alumnos.splice() sin error.
// Lo que NO podemos hacer es: alumnos = [] (eso daría error).
//
// ┌──────────────────────────────────────────────────────────────────┐
// │  const vs let para arrays:                                       │
// │                                                                  │
// │  const arr = [1,2,3];   arr.push(4);    ✓ permitido             │
// │  const arr = [1,2,3];   arr = [5,6];    ✗ ERROR (reasignar)     │
// │  let   arr = [1,2,3];   arr = [5,6];    ✓ permitido             │
// └──────────────────────────────────────────────────────────────────┘
//
// Array de Objetos - Base de datos de alumnos
const alumnos = [
    { nombre: "Ana", edad: 22, curso: "Desarrollo Web", email: "ana@email.com", id: 1 },
    { nombre: "Luis", edad: 25, curso: "JavaScript", email: "luis@email.com", id: 2 },
    { nombre: "Marta", edad: 21, curso: "HTML y CSS", email: "marta@email.com", id: 3 },
    { nombre: "Carlos", edad: 28, curso: "React", email: "carlos@email.com", id: 4 }
];

// -------------------------------------------------------------------------
// 2. CACHÉ DE ELEMENTOS DEL DOM
// -------------------------------------------------------------------------
//
// CONCEPTO: Cachear elementos del DOM
// ────────────────────────────────────
// En vez de buscar los elementos HTML cada vez que los necesitamos
// (lo cual es LENTO), los buscamos UNA VEZ al inicio y los guardamos
// en variables. Es como guardar un número de teléfono en contactos
// en vez de buscarlo cada vez que quieres llamar.
//
//   MALO:  document.getElementById('x').textContent = "hola";  (busca cada vez)
//   BUENO: const x = document.getElementById('x');             (busca 1 vez)
//          x.textContent = "hola";                              (usa la caché)
//
// Variables globales - Caché de elementos del DOM
const bodyTabla = document.getElementById('bodytabla');
const contenedorEstadisticas = document.getElementById('contenedor-estadisticas');

// -------------------------------------------------------------------------
// 3. VINCULAR EVENTOS (Event Listeners)
// -------------------------------------------------------------------------
//
// En vez de poner onclick="funcion()" en el HTML (mala práctica),
// vinculamos los eventos desde JavaScript. Esto se llama
// "separación de responsabilidades":
//   - HTML → estructura
//   - CSS → estilos
//   - JS → comportamiento
//
// addEventListener('click', funcion) significa:
//   "Cuando alguien haga CLIC en este botón, ejecuta esta función"
//
// Vinculación limpia del evento en JavaScript
document.getElementById('btn-estadisticas').addEventListener('click', calcularEstadisticas);

// -------------------------------------------------------------------------
// 4. FUNCIONES
// -------------------------------------------------------------------------

//Funciones

// FUNCIÓN: Añadir solo el primer alumno (atajo rápido)
// Simplemente llama a addUnAlumno con el primer elemento del array.
function addAlumno() {
    addUnAlumno(alumnos[0]);
}

// FUNCIÓN PRINCIPAL: Añadir un alumno cualquiera a la tabla
// ─────────────────────────────────────────────────────────
// Recibe un objeto "alumno" y crea una fila completa con:
//   - 5 columnas de datos (id, nombre, edad, curso, email)
//   - 1 columna con botón "Borrar"
//
// PROCESO VISUAL:
//   ┌───────────────────────────────────────────────────────────────┐
//   │  1. Crear <tr> (fila vacía en memoria)                       │
//   │  2. Crear 6 <td> (celdas vacías en memoria)                  │
//   │  3. Rellenar cada <td> con datos del objeto alumno           │
//   │  4. Crear botón "Borrar" con su event listener               │
//   │  5. Meter todo dentro de la fila con append()                │
//   │  6. Meter la fila en la tabla con appendChild()              │
//   └───────────────────────────────────────────────────────────────┘
function addUnAlumno(alumno) {
    // 1. Creamos la fila principal
    // createElement fabrica una etiqueta HTML "en el aire" (no se ve aún)
    const filaNueva = document.createElement('tr');
    
    // 2. Creamos cada una de las celdas de datos
    // Cada <td> es una columna de la tabla
    const columnaId = document.createElement('td');
    columnaId.textContent = alumno.id;

    const columnaNombre = document.createElement('td');
    columnaNombre.textContent = alumno.nombre;

    const columnaEdad = document.createElement('td');
    columnaEdad.textContent = alumno.edad;

    const columnaCurso = document.createElement('td');
    columnaCurso.textContent = alumno.curso;

    const columnaEmail = document.createElement('td');
    columnaEmail.textContent = alumno.email;

    // 3. Creamos la celda de acciones y su botón de borrar de forma segura
    const columnaBorrar = document.createElement('td');
    const botonBorrar = document.createElement('button');
    botonBorrar.textContent = "Borrar";
    
    // .classList.add() añade una CLASE CSS al elemento.
    // Es como ponerle una "etiqueta" para que CSS pueda darle estilos.
    //
    // ANTES:  <button>Borrar</button>
    // DESPUÉS: <button class="btn-borrar">Borrar</button>
    //
    // ¿POR QUÉ classList.add Y NO className?
    // ┌──────────────────────────────────────────────────────────────┐
    // │  className = "btn-borrar"    │  SOBRESCRIBE todas las clases│
    // │  classList.add("btn-borrar") │  AÑADE sin borrar existentes │
    // └──────────────────────────────────────────────────────────────┘
    // Añadimos estilos mediante clases CSS ya existentes. El CSS aplica estilos a 'td button', pero podemos añadir más estilos con la nueva clase btn-borrar.
    botonBorrar.classList.add('btn-borrar'); 

    // EVENT LISTENER DEL BOTÓN BORRAR
    // ────────────────────────────────
    // Cuando se haga clic en este botón:
    //   1. Se elimina la fila de la tabla (.remove())
    //   2. Se recalculan las estadísticas (calcularEstadisticas())
    //
    // Gracias al CLOSURE, la función "recuerda" qué es filaNueva
    // aunque addUnAlumno ya haya terminado de ejecutarse.
    // Cada botón sabe EXACTAMENTE qué fila debe borrar.
    //
    // Asignamos el evento de escucha directamente al nodo del botón
    botonBorrar.addEventListener('click', () => {
        filaNueva.remove(); 
        // Vaciamos el contenedor de estadísticas de forma limpia eliminando sus nodos hijos
       calcularEstadisticas();
    });
    columnaBorrar.appendChild(botonBorrar);

    // 4. Agregamos todas las columnas a la fila de una sola vez usando append()
    //
    // COMPARACIÓN: appendChild vs append
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  appendChild()              │  append()                          │
    // ├─────────────────────────────┼────────────────────────────────────┤
    // │  Solo acepta 1 elemento     │  Acepta VARIOS elementos           │
    // │  fila.appendChild(col1);    │  fila.append(col1, col2, col3);    │
    // │  fila.appendChild(col2);    │  (todo en una línea)               │
    // │  fila.appendChild(col3);    │                                    │
    // │  Más antiguo                │  Más moderno (ES6+)                │
    // └──────────────────────────────────────────────────────────────────┘
    filaNueva.append(columnaId, columnaNombre, columnaEdad, columnaCurso, columnaEmail, columnaBorrar);
    
    // 5. Insertamos la fila en nuestra tabla
    // AHORA SÍ la fila se hace visible en la página
    bodyTabla.appendChild(filaNueva);
}

// FUNCIÓN: Añadir TODOS los alumnos a la tabla
// ─────────────────────────────────────────────
// Primero VACÍA la tabla (para no duplicar) y luego añade todos.
function addAlumnos() {
    // LIMPIAR LA TABLA: Patrón while + removeChild
    // ──────────────────────────────────────────
    // ¿Cómo vaciamos un contenedor HTML? Hay varias formas:
    //
    // ┌──────────────────────────────────────────────────────────────────┐
    // │  MÉTODO                        │  SEGURO?  │  RÁPIDO?           │
    // ├────────────────────────────────┼───────────┼────────────────────┤
    // │  innerHTML = ""                │  NO ✗     │  SÍ (pero peligroso│
    // │  while + removeChild           │  SÍ ✓     │  SÍ                │
    // │  replaceChildren()             │  SÍ ✓     │  SÍ (más moderno)  │
    // └──────────────────────────────────────────────────────────────────┘
    //
    // ¿POR QUÉ NO innerHTML = ""?
    // Porque innerHTML puede causar problemas de seguridad (XSS)
    // y además no limpia bien los event listeners de los elementos.
    //
    // El while funciona así:
    //   "Mientras la tabla tenga un primer hijo, quítalo."
    //   Vuelta 1: tiene hijo → lo quita
    //   Vuelta 2: tiene otro hijo → lo quita
    //   Vuelta N: ya no tiene hijos → el while se acaba
    //
    // Para vaciar la tabla de forma eficiente y limpia que innerHTML si bodyTabla no es null entramos en el bucle, si es null no hacemos nada y pasamos a añadir los alumnos.
    while (bodyTabla.firstChild) {
        bodyTabla.removeChild(bodyTabla.firstChild);
    }
    // Añadimos cada alumno del array a la tabla utilizando la función addUnAlumno ( programación recursiva )
    alumnos.forEach(alumno => addUnAlumno(alumno));
}

// FUNCIÓN: Obtener datos ACTUALES de la tabla
// ─────────────────────────────────────────────
// Esta función LEE la tabla HTML y extrae los datos de vuelta a JavaScript.
// ¿Por qué? Porque el usuario puede haber BORRADO alumnos, así que
// la tabla puede tener MENOS alumnos que el array original.
//
// PROCESO:
//   Tabla HTML  →  querySelectorAll('tr')  →  Array de filas
//   Cada fila   →  querySelectorAll('td')  →  Array de celdas
//   Celdas      →  textContent             →  Datos de texto
//
// ┌──────────────────────────────────────────────────────────────┐
// │  FILA HTML:                                                  │
// │  <tr>                                                        │
// │    <td>1</td>        ← celdas[0] → id (no lo usamos)        │
// │    <td>Ana</td>      ← celdas[1] → nombre                   │
// │    <td>22</td>       ← celdas[2] → edad (parseInt)          │
// │    <td>Des.Web</td>  ← celdas[3] → curso (no lo usamos)     │
// │    <td>ana@...</td>  ← celdas[4] → email (no lo usamos)     │
// │    <td><button></td> ← celdas[5] → botón (no lo usamos)     │
// │  </tr>                                                       │
// └──────────────────────────────────────────────────────────────┘
function obtenerDatosDeLaTabla() {
    // querySelectorAll devuelve una NodeList (parecido a un array, pero no exacto)
    const filas = bodyTabla.querySelectorAll('tr');
    
    // Array.from() convierte la NodeList en un Array real de JavaScript
    // .map() transforma cada fila en un objeto con {nombre, edad}
    //
    // parseInt(texto, 10):
    //   Convierte un TEXTO ("22") en un NÚMERO (22).
    //   El 10 indica base decimal (por si acaso).
    //   Sin parseInt, "22" + "25" daría "2225" (concatenación, no suma).
    //
    //   ┌────────────────────────────────────────────┐
    //   │  SIN parseInt:  "22" + "25" = "2225"  ✗   │
    //   │  CON parseInt:  22 + 25 = 47           ✓   │
    //   └────────────────────────────────────────────┘
    return Array.from(filas).map(fila => {
        const celdas = fila.querySelectorAll('td');
        return {
            nombre: celdas[1].textContent,
            edad: parseInt(celdas[2].textContent, 10)
        };
    });
}

// FUNCIÓN: Calcular y mostrar estadísticas
// ─────────────────────────────────────────
// Esta función:
//   1. Lee los datos ACTUALES de la tabla (no del array original)
//   2. Limpia las estadísticas anteriores
//   3. Calcula media, mayor y menor
//   4. Crea párrafos <p> y los inyecta en el contenedor
function calcularEstadisticas() {
    // Obtenemos los alumnos que ACTUALMENTE están en la tabla
    const alumnosEnPantalla = obtenerDatosDeLaTabla();

    // Limpiamos el contenedor eliminando sus nodos anteriores antes de calcular.
    // Usamos el mismo patrón while + removeChild que en addAlumnos().
    // Si no limpiamos, las estadísticas se ACUMULARÍAN (se verían duplicadas).
    while (contenedorEstadisticas.firstChild) {
        contenedorEstadisticas.removeChild(contenedorEstadisticas.firstChild);
    }
    
    // CASO ESPECIAL: Si no hay alumnos en la tabla, mostramos un mensaje de error
    // y salimos de la función con return (no calculamos nada).
    //
    // ¿POR QUÉ COMPROBAMOS ESTO?
    // Porque si la tabla está vacía:
    //   - La media sería 0/0 = NaN (Not a Number, error)
    //   - No habría mayor ni menor que calcular
    if (alumnosEnPantalla.length === 0) {
        const parrafoError = document.createElement('p');
        parrafoError.textContent = "No hay alumnos en la tabla para calcular estadísticas.";
        parrafoError.style.color = "#e74c3c"; // Aplicamos el estilo directamente al elemento
        contenedorEstadisticas.appendChild(parrafoError);
        return;
    }

    // Inicializamos las variables para los cálculos.
    // Empezamos asumiendo que el primero es el mayor Y el menor.
    let sumaEdades = 0;
    let alumnoMayor = alumnosEnPantalla[0];
    let alumnoMenor = alumnosEnPantalla[0];

    // Recorremos TODOS los alumnos en pantalla con forEach.
    // En cada vuelta:
    //   - Sumamos la edad al acumulador
    //   - Comparamos si es mayor que el "rey" actual
    //   - Comparamos si es menor que el "rey" actual
    alumnosEnPantalla.forEach(alumno => {
        sumaEdades += alumno.edad;
        if (alumno.edad > alumnoMayor.edad) alumnoMayor = alumno;
        if (alumno.edad < alumnoMenor.edad) alumnoMenor = alumno;
    });

    // Math.floor redondea hacia abajo: 24.7 → 24
    const mediaRedondeada = Math.floor(sumaEdades / alumnosEnPantalla.length);

    // Creamos los elementos de las estadísticas uno a uno de forma segura.
    // Usamos template literals (``) para insertar variables en el texto.
    const pMedia = document.createElement('p');
    pMedia.textContent = `La media de edad es: ${mediaRedondeada} años`;

    const pMayor = document.createElement('p');
    pMayor.textContent = `El alumno de mayor edad es: ${alumnoMayor.nombre} (${alumnoMayor.edad} años)`;

    const pMenor = document.createElement('p');
    pMenor.textContent = `El alumno de menor edad es: ${alumnoMenor.nombre} (${alumnoMenor.edad} años)`;

    // .style.margin añade margen vertical a los párrafos.
    // "8px 0" significa: 8px arriba y abajo, 0px izquierda y derecha.
    // Es CSS abreviado (shorthand):
    //   ┌────────────────────────────────────────────┐
    //   │  "8px 0"  →  top:8px right:0 bottom:8px    │
    //   │              left:0                         │
    //   │                                             │
    //   │  "8px"    →  todos los lados: 8px           │
    //   │  "8px 4px 2px 1px" → top right bottom left │
    //   └────────────────────────────────────────────┘
    // Añadimos estilos de estructura si fuera necesario (opcional)
    pMedia.style.margin = "8px 0";
    pMayor.style.margin = "8px 0";
    pMenor.style.margin = "8px 0";

    // Insertamos todos los párrafos de golpe usando append() (acepta varios)
    contenedorEstadisticas.append(pMedia, pMayor, pMenor);
}

// FUNCIÓN: Borrar TODOS los alumnos de la tabla
// ──────────────────────────────────────────────
// Usa el mismo patrón while + removeChild para vaciar la tabla.
// Después recalcula las estadísticas (que mostrarán el mensaje "No hay alumnos").
function borrarTodos(){
    while (bodyTabla.firstChild) {
        bodyTabla.removeChild(bodyTabla.firstChild);
        calcularEstadisticas();
    }}
// Vinculamos el botón "Borrar Todos" con la función borrarTodos
document.getElementById('btn-borrarTodo').addEventListener('click', borrarTodos)


// ======================================================================
// RESUMEN: CONCEPTOS CLAVE APRENDIDOS EN ESTA LECCIÓN
// ======================================================================
//
// ┌────┬──────────────────────────┬──────────────────────────────────────────┐
// │ #  │ CONCEPTO                 │ ¿PARA QUÉ SIRVE?                        │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 1  │ const vs let             │ const = no reasignar. let = sí reasignar│
// │    │                          │ Para arrays, const permite push/splice  │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 2  │ Cachear elementos DOM    │ Buscar 1 vez y reutilizar. Más rápido   │
// │    │                          │ que getElementById en cada uso          │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 3  │ addEventListener         │ Vincular eventos desde JS (no desde HTML│
// │    │                          │ Separa estructura de comportamiento     │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 4  │ createElement + append   │ Crear HTML dinámico de forma segura     │
// │    │                          │ (sin innerHTML, sin riesgos XSS)        │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 5  │ classList.add()          │ Añadir clases CSS sin borrar las        │
// │    │                          │ existentes (mejor que className =)      │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 6  │ while + removeChild      │ Vaciar contenedores HTML de forma       │
// │    │                          │ segura (mejor que innerHTML = "")       │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 7  │ querySelectorAll         │ Buscar TODOS los elementos que coincidan│
// │    │                          │ con un selector CSS                     │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 8  │ Array.from()             │ Convertir NodeList en Array real para   │
// │    │                          │ poder usar .map(), .filter(), etc.      │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 9  │ parseInt(texto, 10)      │ Convertir texto a número. IMPRESCINDIBLE│
// │    │                          │ para hacer sumas (si no, concatena)     │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 10 │ .map()                   │ Transformar cada elemento de un array   │
// │    │                          │ en otra cosa (fila → objeto {nombre})   │
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 11 │ Closure (cierre)         │ Cada botón "recuerda" su fila gracias   │
// │    │                          │ a que la función flecha captura el scope│
// ├────┼──────────────────────────┼──────────────────────────────────────────┤
// │ 12 │ Recalcular al borrar     │ Las estadísticas se actualizan solas    │
// │    │                          │ cuando el usuario borra un alumno       │
// └────┴──────────────────────────┴──────────────────────────────────────────┘
//
// IDEA PRINCIPAL:
// Esta versión demuestra BUENAS PRÁCTICAS de programación:
//   - Separación de responsabilidades (HTML/CSS/JS separados)
//   - Código reutilizable (funciones que sirven para cualquier dato)
//   - Seguridad (createElement en vez de innerHTML)
//   - Reactividad (las estadísticas se recalculan solas)
// Estos son los mismos principios que usan frameworks como React o Vue.
