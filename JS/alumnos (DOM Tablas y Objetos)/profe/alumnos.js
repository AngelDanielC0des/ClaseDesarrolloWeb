// =========================================================================
// LECCIÓN: Array de Objetos, Creación de DOM dinámico y Borrado de Nodos
// =========================================================================

// -------------------------------------------------------------------------
// 1. BASE DE DATOS LOCAL (Array de Objetos JSON)
// -------------------------------------------------------------------------
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
function addAlumno() {
    let bodytabla = document.getElementById('bodytabla');
    
    // A) CREAR NODOS HTML EN MEMORIA
    let filanueva = document.createElement('tr'); // Fila
    
    let columnaId = document.createElement('td'); // Columnas
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');
    
    // B) ASIGNAR TEXTO A LAS COLUMNAS (Extrayendo el primer elemento array[0])
    columnaId.textContent = alumnos[0].id;
    columnaNombre.textContent = alumnos[0].nombre;
    columnaEdad.textContent = alumnos[0].edad;
    columnaCurso.textContent = alumnos[0].curso;
    columnaEmail.textContent = alumnos[0].email;
    
    // C) ENSAMBLAR EL ÁRBOL (Añadir las celdas <td> dentro de la fila <tr>)
    filanueva.appendChild(columnaId);
    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    
    // D) INYECTAR EN EL NAVEGADOR
    bodytabla.appendChild(filanueva);
}

// -------------------------------------------------------------------------
// 3. FUNCIÓN REUTILIZABLE: Añadir un Alumno Genérico y su botón "Borrar"
// -------------------------------------------------------------------------
// Esta función recibe un parámetro (alumno), por lo que sirve para inyectar
// CUALQUIER alumno, no solo el primero.
function addUnAlumno(alumno) {
    let bodytabla = document.getElementById('bodytabla');
    
    let filanueva = document.createElement('tr');
    
    let columnaId = document.createElement('td');
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');
    
    // Nueva celda para la acción de borrado
    let columnaBorrar = document.createElement('td');
    
    // Creación dinámica de un botón
    let botonBorrar = document.createElement('button');
    botonBorrar.textContent = "borrar";
    
    // Inyección de los datos del parámetro recibido
    columnaId.textContent = alumno.id;
    columnaNombre.textContent = alumno.nombre;
    columnaEdad.textContent = alumno.edad;
    columnaCurso.textContent = alumno.curso;
    columnaEmail.textContent = alumno.email;
    
    // Anidamos el botón dentro de su celda
    columnaBorrar.appendChild(botonBorrar);
    
    // CONCEPTO CLAVE: Event Listener asociado a un nodo en memoria
    // Le decimos a ESTE botón en concreto, que si le hacen click,
    // borre la fila que lo contiene.
    botonBorrar.addEventListener('click', () => {
        // .remove() destruye el nodo HTML completo del navegador
        filanueva.remove();
    });

    // Ensamblaje
    filanueva.appendChild(columnaId);
    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    filanueva.appendChild(columnaBorrar);
    
    // Inyección
    bodytabla.appendChild(filanueva);
}

// -------------------------------------------------------------------------
// 4. FUNCIÓN ITERADORA: Añadir todos los alumnos
// -------------------------------------------------------------------------
function addAlumnos () {
    // Array.forEach es más limpio y legible que el for(let i=0; i<x; i++) tradicional.
    // Por cada objeto "alumno" en el array "alumnos", ejecuta "addUnAlumno(alumno)".
    alumnos.forEach((alumno) => {
        addUnAlumno(alumno);
    });
}

// -------------------------------------------------------------------------
// 5. MÓDULO DE ESTADÍSTICAS (Mates con Arrays)
// -------------------------------------------------------------------------

function calcularMediaEdad() {
    let sumaEdades = 0;
    
    // Suma acumulativa
    alumnos.forEach((alumno) => {
        sumaEdades += alumno.edad;
    });

    let resultadoMedia = sumaEdades / alumnos.length;
    // Math.floor quita los decimales redondeando a la baja (Ej: 23.9 -> 23)
    return Math.floor(resultadoMedia);
}

function calcularMayorEdad() {
    // Partimos asumiendo que el primero es el mayor
    let alumnoMayor = alumnos[0]; 

    // Bucle for...of (Moderno)
    for (let alumno of alumnos) {
        // Si el alumno actual es MAYOR que el que teníamos guardado, le quita el trono
        if (alumno.edad > alumnoMayor.edad) {
            alumnoMayor = alumno; 
        }
    }
    return `${alumnoMayor.nombre} (${alumnoMayor.edad} años)`;
}

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

// Función maestra que orquesta los cálculos estadísticos
function calcularEstadisticas() {
    // Calculamos y creamos un párrafo P para la media
    let media = calcularMediaEdad(); 
    let parrafoMediaEstadisticas = document.createElement('p');
    parrafoMediaEstadisticas.textContent = "La media de edad es: " + media;
    // document.body.appendChild añade el párrafo al final de la página (fuera de la tabla)
    document.body.appendChild(parrafoMediaEstadisticas);
      
    // Calculamos y creamos P para el Mayor
    let mayorEdad = calcularMayorEdad();
    let parrafoMayorEdad = document.createElement('p');
    parrafoMayorEdad.textContent = "El alumno de mayor edad es: " + mayorEdad;
    document.body.appendChild(parrafoMayorEdad);
    
    // Calculamos y creamos P para el Menor
    let menorEdad = calcularMenorEdad();
    let parrafoMenorEdad = document.createElement('p'); 
    parrafoMenorEdad.textContent = "El alumno de menor edad es: " + menorEdad;
    document.body.appendChild(parrafoMenorEdad);
}
