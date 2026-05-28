// Array de Objetos - Base de datos de alumnos
const alumnos = [
    { nombre: "Ana", edad: 22, curso: "Desarrollo Web", email: "ana@email.com", id: 1 },
    { nombre: "Luis", edad: 25, curso: "JavaScript", email: "luis@email.com", id: 2 },
    { nombre: "Marta", edad: 21, curso: "HTML y CSS", email: "marta@email.com", id: 3 },
    { nombre: "Carlos", edad: 28, curso: "React", email: "carlos@email.com", id: 4 }
];

// Variables globales - Caché de elementos del DOM
const bodyTabla = document.getElementById('bodytabla');
const contenedorEstadisticas = document.getElementById('contenedor-estadisticas');

function addAlumno() {
    addUnAlumno(alumnos[0]);
}

function addUnAlumno(alumno) {
    // 1. Creamos la fila principal
    const filaNueva = document.createElement('tr');
    
    // 2. Creamos cada una de las celdas de datos
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
    
    // Añadimos estilos mediante clases CSS ya existentes
    // El CSS aplica estilos a 'td button', pero podemos añadir más estilos con la nueva clase btn-borrar.
    botonBorrar.classList.add('btn-borrar'); 

    // Asignamos el evento de escucha directamente al nodo del botón
    botonBorrar.addEventListener('click', () => {
        filaNueva.remove(); 
        // Vaciamos el contenedor de estadísticas de forma limpia eliminando sus nodos hijos
        while (contenedorEstadisticas.firstChild) {
            contenedorEstadisticas.removeChild(contenedorEstadisticas.firstChild);
        }
    });
    columnaBorrar.appendChild(botonBorrar);

    // 4. Agregamos todas las columnas a la fila de una sola vez usando append()
    filaNueva.append(columnaId, columnaNombre, columnaEdad, columnaCurso, columnaEmail, columnaBorrar);
    
    // 5. Insertamos la fila en nuestra tabla
    bodyTabla.appendChild(filaNueva);
}

function addAlumnos() {
    // Para vaciar la tabla de forma eficiente y limpia que innerHTML si bodyTabla no es null entramos en el bucle, si es null no hacemos nada y pasamos a añadir los alumnos.
    while (bodyTabla.firstChild) {
        bodyTabla.removeChild(bodyTabla.firstChild);
    }
    // Añadimos cada alumno del array a la tabla utilizando la función addUnAlumno ( programación recursiva )
    alumnos.forEach(alumno => addUnAlumno(alumno));
}

function obtenerDatosDeLaTabla() {
    const filas = bodyTabla.querySelectorAll('tr');
    
    return Array.from(filas).map(fila => {
        const celdas = fila.querySelectorAll('td');
        return {
            nombre: celdas[1].textContent,
            edad: parseInt(celdas[2].textContent, 10)
        };
    });
}

function calcularEstadisticas() {
    const alumnosEnPantalla = obtenerDatosDeLaTabla();

    // Limpiamos el contenedor eliminando sus nodos anteriores antes de calcular
    while (contenedorEstadisticas.firstChild) {
        contenedorEstadisticas.removeChild(contenedorEstadisticas.firstChild);
    }

    if (alumnosEnPantalla.length === 0) {
        const parrafoError = document.createElement('p');
        parrafoError.textContent = "No hay alumnos en la tabla para calcular estadísticas.";
        parrafoError.style.color = "#e74c3c"; // Aplicamos el estilo directamente al elemento
        contenedorEstadisticas.appendChild(parrafoError);
        return;
    }

    let sumaEdades = 0;
    let alumnoMayor = alumnosEnPantalla[0];
    let alumnoMenor = alumnosEnPantalla[0];

    alumnosEnPantalla.forEach(alumno => {
        sumaEdades += alumno.edad;
        if (alumno.edad > alumnoMayor.edad) alumnoMayor = alumno;
        if (alumno.edad < alumnoMenor.edad) alumnoMenor = alumno;
    });

    const mediaRedondeada = Math.floor(sumaEdades / alumnosEnPantalla.length);

    // Creamos los elementos de las estadísticas uno a uno de forma segura
    const pMedia = document.createElement('p');
    pMedia.textContent = `La media de edad es: ${mediaRedondeada} años`;

    const pMayor = document.createElement('p');
    pMayor.textContent = `El alumno de mayor edad es: ${alumnoMayor.nombre} (${alumnoMayor.edad} años)`;

    const pMenor = document.createElement('p');
    pMenor.textContent = `El alumno de menor edad es: ${alumnoMenor.nombre} (${alumnoMenor.edad} años)`;

    // Añadimos estilos de estructura si fuera necesario (opcional)
    pMedia.style.margin = "8px 0";
    pMayor.style.margin = "8px 0";
    pMenor.style.margin = "8px 0";

    // Insertamos todos los párrafos de golpe
    contenedorEstadisticas.append(pMedia, pMayor, pMenor);
}

// Vinculación limpia del evento en JavaScript
document.getElementById('btn-estadisticas').addEventListener('click', calcularEstadisticas);