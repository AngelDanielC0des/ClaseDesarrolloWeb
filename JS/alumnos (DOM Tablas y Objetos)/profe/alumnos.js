// =========================================================================
// LECCIÓN: Array de Objetos, Creación de DOM dinámico y Borrado de Nodos
// =========================================================================
//
// ¿QUÉ HACE ESTE SCRIPT?
// ──────────────────────
// Imagina que eres el secretario de un instituto. Tienes una LISTA de
// alumnos (el array) y necesitas:
//   1. Apuntarlos en una TABLA (crear filas HTML dinámicamente)
//   2. Darlos de BAJA cuando se den de baja (borrar filas del DOM)
//   3. Calcular ESTADÍSTICAS (edad media, mayor, menor)
//
// FLUJO DE DATOS:
//
//   ┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
//   │   ARRAY      │ ───> │  FUNCIONES   │ ───> │  TABLA HTML      │
//   │  (alumnos)   │      │  (este file) │      │  (lo que se ve)  │
//   │  4 objetos   │      │  crear/borrar│      │  filas dinámicas │
//   └──────────────┘      └──────────────┘      └──────────────────┘

// -------------------------------------------------------------------------
// 1. BASE DE DATOS LOCAL (Array de Objetos JSON)
// -------------------------------------------------------------------------
//
// CONCEPTO: ¿Qué es un Array de Objetos?
// ──────────────────────────────────────
// Un ARRAY es como una LISTA ordenada (como la lista de clase).
// Cada elemento de la lista es un OBJETO con las mismas propiedades.
//
// Analogía del mundo real: Una hoja de cálculo (Excel)
// ┌──────────────────────────────────────────────────────────────────┐
// │  id │ nombre  │ edad │ curso          │ email           │       │
// ├─────┼─────────┼──────┼────────────────┼─────────────────┤       │
// │  1  │ Ana     │  22  │ Desarr. Web    │ ana@email.com   │ ← [0] │
// │  2  │ Luis    │  25  │ JavaScript     │ luis@email.com  │ ← [1] │
// │  3  │ Marta   │  21  │ HTML y CSS     │ marta@email.com │ ← [2] │
// │  4  │ Carlos  │  28  │ React          │ carlos@email.com│ ← [3] │
// └──────────────────────────────────────────────────────────────────┘
//
// ACCESO A DATOS:
// ┌──────────────────────────────────────────────────────────────┐
// │  CÓDIGO                    │  RESULTADO                     │
// ├────────────────────────────┼────────────────────────────────┤
// │  alumnos[0]                │  {nombre:"Ana", edad:22, ...}  │
// │  alumnos[0].nombre         │  "Ana"                         │
// │  alumnos[2].curso          │  "HTML y CSS"                  │
// │  alumnos.length            │  4                             │
// │  alumnos[alumnos.length-1] │  {nombre:"Carlos", ...} (últ.) │
// └──────────────────────────────────────────────────────────────┘
//
// ¿POR QUÉ USAMOS 'let' Y NO 'const'?
// Porque más adelante podríamos querer AÑADIR o QUITAR alumnos
// del array (reasignar la variable). Con 'const' no podríamos
// hacer alumnos = [] (reasignación), aunque sí podríamos hacer
// alumnos.push(nuevoAlumno) (mutación).
//
// Cada alumno es un objeto encapsulado dentro de un array maestro.
let alumnos = [
    { nombre: "Ana",    edad: 22, curso: "Desarrollo Web", email: "ana@email.com",    id: 1 },
    { nombre: "Luis",   edad: 25, curso: "JavaScript",     email: "luis@email.com",   id: 2 },
    { nombre: "Marta",  edad: 21, curso: "HTML y CSS",     email: "marta@email.com",  id: 3 },
    { nombre: "Carlos", edad: 28, curso: "React",          email: "carlos@email.com", id: 4 }
];

// -------------------------------------------------------------------------
// 2. FUNCIÓN: Añadir un solo alumno estático (Primer alumno)
// -------------------------------------------------------------------------
//
// Esta función es la versión "básica": SIEMPRE añade al primer alumno
// del array (alumnos[0]). Es como una máquina que solo sabe poner
// la primera ficha, sin importar cuántas veces la uses.
//
// PROCESO DE CREACIÓN DE DOM EN 4 PASOS:
//
//   PASO A: Crear     PASO B: Rellenar   PASO C: Ensamblar   PASO D: Inyectar
//   ┌──────┐          ┌──────────┐       ┌──────────┐        ┌──────────┐
//   │ <tr> │          │ <td>Ana</td>     │ <tr>     │        │ TABLA    │
//   │ <td> │  ──────> │ <td>22</td> ───> │   <td>.. │ ──────>│   <tr>.. │
//   │ <td> │          │ <td>...</td>     │   <td>.. │        │          │
//   └──────┘          └──────────┘       └──────────┘        └──────────┘
//   (en memoria,      (ponemos datos     (metemos las        (lo ponemos
//    no se ve aún)     del JSON)          celdas en fila)     en la página)
//
function addAlumno() {
    // Primero, localizamos el <tbody> de la tabla donde meteremos las filas.
    // El tbody es el "cuerpo" de la tabla, donde van las filas de datos.
    let bodytabla = document.getElementById('bodytabla');
    
    // A) CREAR NODOS HTML EN MEMORIA
    // ──────────────────────────────
    // document.createElement crea una etiqueta HTML "en el aire",
    // NO se ve en la página todavía. Es como fabricar una pieza
    // de LEGO antes de montarla.
    let filanueva = document.createElement('tr'); // Creamos una fila <tr>
    
    let columnaId = document.createElement('td'); // Creamos 5 celdas <td>
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');
    
    // B) ASIGNAR TEXTO A LAS COLUMNAS (Extrayendo el primer elemento array[0])
    // ─────────────────────────────────────────────────────────────────────────
    // .textContent pone texto DENTRO de la etiqueta HTML.
    // Siempre usamos alumnos[0] → el primer alumno (Ana).
    columnaId.textContent = alumnos[0].id;
    columnaNombre.textContent = alumnos[0].nombre;
    columnaEdad.textContent = alumnos[0].edad;
    columnaCurso.textContent = alumnos[0].curso;
    columnaEmail.textContent = alumnos[0].email;
    
    // C) ENSAMBLAR EL ÁRBOL (Añadir las celdas <td> dentro de la fila <tr>)
    // ─────────────────────────────────────────────────────────────────────
    // .appendChild() mete un elemento DENTRO de otro.
    // Es como meter las piezas de LEGO unas dentro de otras.
    //
    //   ANTES:  <tr></tr>  y  <td>1</td>  <td>Ana</td> ...  (sueltos)
    //   DESPUÉS: <tr>
    //              <td>1</td>
    //              <td>Ana</td>
    //              <td>22</td>
    //              <td>Desarrollo Web</td>
    //              <td>ana@email.com</td>
    //            </tr>
    filanueva.appendChild(columnaId);
    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    
    // D) INYECTAR EN EL NAVEGADOR
    // ───────────────────────────
    // AHORA SÍ la fila se hace visible en la página.
    // La metemos dentro del <tbody> con appendChild.
    bodytabla.appendChild(filanueva);
}

// -------------------------------------------------------------------------
// 3. FUNCIÓN REUTILIZABLE: Añadir un Alumno Genérico y su botón "Borrar"
// -------------------------------------------------------------------------
//
// ¿CUÁL ES LA DIFERENCIA CON addAlumno()?
// ┌──────────────────────────────────────────────────────────────────────┐
// │  addAlumno()                  │  addUnAlumno(alumno)                 │
// ├───────────────────────────────┼──────────────────────────────────────┤
// │  Siempre añade a alumnos[0]   │  Añade CUALQUIER alumno que le pases│
// │  No tiene botón de borrar     │  Tiene botón de borrar              │
// │  Poco útil (siempre lo mismo) │  Reutilizable (sirve para todos)    │
// └──────────────────────────────────────────────────────────────────────┘
//
// Esta función recibe un parámetro (alumno), por lo que sirve para inyectar
// CUALQUIER alumno, no solo el primero.
//
// Analogía: Es como una MÁQUINA de hacer fichas.
//   - Le metes un alumno (cualquiera)
//   - Te fabrica una fila completa con botón de borrar
//
function addUnAlumno(alumno) {
    let bodytabla = document.getElementById('bodytabla');
    
    // Creamos la fila y las 5 columnas de datos (igual que antes)
    let filanueva = document.createElement('tr');
    
    let columnaId = document.createElement('td');
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');
    
    // NUEVO: Creamos una 6ª columna para el botón "Borrar"
    // Cada alumno tendrá su propio botón para eliminarse de la tabla.
    let columnaBorrar = document.createElement('td');
    
    // Creamos el botón y le ponemos el texto "borrar"
    let botonBorrar = document.createElement('button');
    botonBorrar.textContent = "borrar";
    
    // Ahora usamos el PARÁMETRO "alumno" en vez de alumnos[0].
    // Así la función sirve para CUALQUIER alumno que le pasemos.
    columnaId.textContent = alumno.id;
    columnaNombre.textContent = alumno.nombre;
    columnaEdad.textContent = alumno.edad;
    columnaCurso.textContent = alumno.curso;
    columnaEmail.textContent = alumno.email;
    
    // Metemos el botón dentro de su celda
    columnaBorrar.appendChild(botonBorrar);
    
    // CONCEPTO CLAVE: Event Listener (Escuchador de Eventos)
    // ──────────────────────────────────────────────────────
    //
    // ¿Qué es un Event Listener?
    // Es como poner un "vigilante" en un elemento HTML.
    // El vigilante ESPERA a que el usuario haga algo (clic, teclear...)
    // y cuando eso pasa, ejecuta un código.
    //
    //   ┌────────────┐         ┌──────────────────┐
    //   │  USUARIO   │ ──────> │  EVENT LISTENER  │ ──> Ejecuta código
    //   │  hace clic │  click  │  (el vigilante)  │     (borra la fila)
    //   └────────────┘         └──────────────────┘
    //
    // Le decimos a ESTE botón en concreto, que si le hacen click,
    // borre la fila que lo contiene.
    //
    // ¿POR QUÉ FUNCIONA ESTO? (Concepto de CLOSURE / Cierre)
    // ────────────────────────────────────────────────────────
    // La función flecha () => { filanueva.remove(); } "recuerda"
    // la variable filanueva aunque la función addUnAlumno ya haya
    // terminado de ejecutarse. Esto se llama CLOSURE (cierre).
    //
    // Es como si el botón tuviera MEMORIA de qué fila le pertenece.
    // Cada botón sabe exactamente QUÉ fila debe brar.
    botonBorrar.addEventListener('click', () => {
        // .remove() destruye el nodo HTML completo del navegador.
        // La fila desaparece de la pantalla Y de la memoria.
        filanueva.remove();
    });

    // Ensamblamos: metemos todas las celdas dentro de la fila
    filanueva.appendChild(columnaId);
    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    filanueva.appendChild(columnaBorrar);
    
    // Inyectamos la fila completa en la tabla
    bodytabla.appendChild(filanueva);
}

// -------------------------------------------------------------------------
// 4. FUNCIÓN ITERADORA: Añadir todos los alumnos
// -------------------------------------------------------------------------
//
// CONCEPTO: ¿Qué es iterar?
// ─────────────────────────
// Iterar = Recorrer una lista elemento por elemento.
//
// Analogía: Es como pasar lista en clase.
// El profesor dice el nombre de CADA alumno, uno por uno.
//
// COMPARACIÓN DE FORMAS DE ITERAR:
// ┌──────────────────────────────────────────────────────────────────────┐
// │  MÉTODO              │  SINTAXIS                   │  ¿CUÁNDO?      │
// ├──────────────────────┼─────────────────────────────┼────────────────┤
// │  for clásico         │  for(let i=0; i<n; i++)     │  Control total │
// │  for...of            │  for(let item of array)     │  Simple y claro│
// │  forEach             │  array.forEach(item => {})  │  Más moderno   │
// └──────────────────────────────────────────────────────────────────────┘
//
// Array.forEach es más limpio y legible que el for(let i=0; i<x; i++) tradicional.
// Por cada objeto "alumno" en el array "alumnos", ejecuta "addUnAlumno(alumno)".
function addAlumnos () {
    alumnos.forEach((alumno) => {
        addUnAlumno(alumno);
    });
}

// -------------------------------------------------------------------------
// 5. MÓDULO DE ESTADÍSTICAS (Mates con Arrays)
// -------------------------------------------------------------------------
//
// Aquí calculamos 3 estadísticas sobre los alumnos:
//   1. MEDIA de edad (promedio)
//   2. MAYOR edad (el más mayor)
//   3. MENOR edad (el más joven)
//
// ALGORITMO DE LA MEDIA:
//   suma de todas las edades / cantidad de alumnos
//
//   Ejemplo: (22 + 25 + 21 + 28) / 4 = 96 / 4 = 24

function calcularMediaEdad() {
    let sumaEdades = 0;
    
    // Suma acumulativa: vamos sumando cada edad al total.
    // Es como ir metiendo monedas en una hucha, una a una.
    //
    //   Vuelta 1: sumaEdades = 0 + 22 = 22
    //   Vuelta 2: sumaEdades = 22 + 25 = 47
    //   Vuelta 3: sumaEdades = 47 + 21 = 68
    //   Vuelta 4: sumaEdades = 68 + 28 = 96
    alumnos.forEach((alumno) => {
        sumaEdades += alumno.edad;
    });

    // Dividimos la total entre el número de alumnos para obtener la media
    let resultadoMedia = sumaEdades / alumnos.length;
    // Math.floor quita los decimales redondeando a la baja (Ej: 23.9 -> 23)
    //
    // COMPARACIÓN DE REDONDEO:
    // ┌────────────────────┬──────────┬──────────┐
    // │  Valor original    │  Math.floor │ Math.round │
    // ├────────────────────┼──────────┼──────────┤
    // │  23.1              │  23        │  23        │
    // │  23.5              │  23        │  24        │
    // │  23.9              │  23        │  24        │
    // └────────────────────┴──────────┴──────────┘
    return Math.floor(resultadoMedia);
}

// ALGORITMO DEL MÁXIMO:
// ─────────────────────
// Imagina un torneo de "rey de la colina":
//   1. El primero sube a la colina (es el "rey" provisional)
//   2. Cada nuevo alumno le reta: ¿eres mayor que yo?
//   3. Si el retador es MAYOR, le quita el trono
//   4. Al final, el que queda en la colina es el mayor de todos
//
//   Vuelta 1: rey = Ana (22)
//   Vuelta 2: Luis (25) > Ana (22)?  SÍ → rey = Luis (25)
//   Vuelta 3: Marta (21) > Luis (25)? NO → rey sigue siendo Luis
//   Vuelta 4: Carlos (28) > Luis (25)? SÍ → rey = Carlos (28)
//   RESULTADO: Carlos (28 años)
function calcularMayorEdad() {
    // Partimos asumiendo que el primero es el mayor
    let alumnoMayor = alumnos[0]; 

    // Bucle for...of (Moderno): recorre el array sin necesitar un índice.
    // Es más legible que el for clásico cuando no necesitas la posición.
    for (let alumno of alumnos) {
        // Si el alumno actual es MAYOR que el que teníamos guardado, le quita el trono
        if (alumno.edad > alumnoMayor.edad) {
            alumnoMayor = alumno; 
        }
    }
    // Template literal: creamos un texto con variables incrustadas
    return `${alumnoMayor.nombre} (${alumnoMayor.edad} años)`;
}

// ALGORITMO DEL MÍNIMO: Exactamente igual que el máximo, pero al revés.
// En vez de buscar el MAYOR, buscamos el MENOR.
function calcularMenorEdad() {
    let alumnoMenor = alumnos[0]; 

    for (let alumno of alumnos) {
        // Si el alumno actual es MENOR que el que teníamos guardado, le quita el trono
        if (alumno.edad < alumnoMenor.edad) {
            alumnoMenor = alumno; 
        }
    }
    return `${alumnoMenor.nombre} (${alumnoMenor.edad} años)`;
}

// Función maestra que orquesta los cálculos estadísticos.
// "Orquestar" = coordinar varias funciones para que trabajen juntas.
// Es como un director de orquesta: no toca ningún instrumento,
// pero dice cuándo toca cada uno.
function calcularEstadisticas() {
    // 1) Calculamos la media y creamos un párrafo <p> para mostrarla
    let media = calcularMediaEdad(); 
    let parrafoMediaEstadisticas = document.createElement('p');
    parrafoMediaEstadisticas.textContent = "La media de edad es: " + media;
    // document.body.appendChild añade el párrafo al final de la página (fuera de la tabla)
    document.body.appendChild(parrafoMediaEstadisticas);
      
    // 2) Calculamos el mayor y creamos otro párrafo <p>
    let mayorEdad = calcularMayorEdad();
    let parrafoMayorEdad = document.createElement('p');
    parrafoMayorEdad.textContent = "El alumno de mayor edad es: " + mayorEdad;
    document.body.appendChild(parrafoMayorEdad);
    
    // 3) Calculamos el menor y creamos el último párrafo <p>
    let menorEdad = calcularMenorEdad();
    let parrafoMenorEdad = document.createElement('p'); 
    parrafoMenorEdad.textContent = "El alumno de menor edad es: " + menorEdad;
    document.body.appendChild(parrafoMenorEdad);
}


// ======================================================================
// RESUMEN: CONCEPTOS CLAVE APRENDIDOS EN ESTA LECCIÓN
// ======================================================================
//
// ┌────┬─────────────────────────┬──────────────────────────────────────────┐
// │ #  │ CONCEPTO                │ ¿PARA QUÉ SIRVE?                        │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 1  │ Array de Objetos        │ Guardar una lista de datos estructurados│
// │    │                         │ (como una tabla de Excel en memoria)    │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 2  │ createElement()         │ Fabricar etiquetas HTML "en el aire"    │
// │    │                         │ antes de ponerlas en la página          │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 3  │ appendChild()           │ Meter un elemento DENTRO de otro        │
// │    │                         │ (como meter una celda dentro de una fila│
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 4  │ .textContent            │ Poner texto dentro de una etiqueta HTML │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 5  │ .remove()               │ Eliminar un elemento HTML de la página  │
// │    │                         │ y de la memoria del navegador           │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 6  │ addEventListener()      │ Poner un "vigilante" en un elemento     │
// │    │                         │ que ejecuta código cuando pasa algo     │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 7  │ forEach()               │ Recorrer un array elemento por elemento │
// │    │                         │ ejecutando una función en cada uno      │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 8  │ for...of                │ Otra forma de recorrer arrays, más      │
// │    │                         │ moderna que el for clásico              │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 9  │ Math.floor()            │ Redondear un número hacia abajo         │
// │    │                         │ (quitar decimales)                      │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 10 │ Template literals (``)  │ Crear textos con variables incrustadas  │
// │    │  ${variable}            │ usando comillas invertidas y ${}        │
// ├────┼─────────────────────────┼──────────────────────────────────────────┤
// │ 11 │ Closure (cierre)        │ Una función "recuerda" las variables    │
// │    │                         │ del entorno donde fue creada            │
// └────┴─────────────────────────┴──────────────────────────────────────────┘
//
// IDEA PRINCIPAL:
// JavaScript puede CREAR, MODIFICAR y DESTRUIR elementos HTML en tiempo real.
// Esto es la base de todas las aplicaciones web modernas (React, Vue, Angular).
// En vez de escribir HTML a mano, dejamos que JavaScript lo genere dinámicamente
// a partir de datos. Así, si los datos cambian, la página se actualiza sola.
