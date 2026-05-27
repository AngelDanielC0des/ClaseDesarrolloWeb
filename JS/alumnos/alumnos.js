//corchetes [] -- varios -- Array, lista, colección
/*
TODO: añadir un botón a la página alumno.html
con el texto Añadir todos
Cuando demos a ese botón, se deben mostrar
en la tabla (inicialmente vacía) todos los alumnos
del array alumnos

Además, añadid, un atributo nuevo a cada alumno
que es el id. Empezando por el 1 y siguiendo
por el 2, 3, 4, etc.
*/
let alumnos = [
    {
        nombre: "Ana",
        edad: 22,
        curso: "Desarrollo Web",
        email: "ana@email.com",
        id:1
    },
    {
        nombre: "Luis",
        edad: 25,
        curso: "JavaScript",
        email: "luis@email.com",
        id:2
    },
    {
        nombre: "Marta",
        edad: 21,
        curso: "HTML y CSS",
        email: "marta@email.com",
        id:3
    },
    {
        nombre: "Carlos",
        edad: 28,
        curso: "React",
        email: "carlos@email.com",
        id:4
    }
]


function addAlumno() 
{
    let bodytabla = document.getElementById('bodytabla');
    //CREAR UNA FILA
    let filanueva = document.createElement('tr');
    //CREAR COLUMNAS (Añadida columna para el ID)
    let columnaId = document.createElement('td');
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');
    
    // CORRECCIÓN: Añadido el ID en la primera columna
    columnaId.textContent = alumnos[0].id;
    columnaNombre.textContent = alumnos[0].nombre;
    columnaEdad.textContent = alumnos[0].edad;
    columnaCurso.textContent = alumnos[0].curso;
    columnaEmail.textContent = alumnos[0].email;
    
    //A CADA COLUMNA LE TENGO QUE PONER LOS DATOS DEL ALUMNO
    filanueva.appendChild(columnaId);
    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    //AÑADIR LA FILA A LA TABLA
    bodytabla.appendChild(filanueva);
}

function addUnAlumno(alumno) 
{
    let bodytabla = document.getElementById('bodytabla');
    //CREAR UNA FILA
    let filanueva = document.createElement('tr');
    //CREAR COLUMNAS (Añadida columna para el ID)
    let columnaId = document.createElement('td');
    let columnaNombre = document.createElement('td');
    let columnaEdad = document.createElement('td');
    let columnaCurso = document.createElement('td');
    let columnaEmail = document.createElement('td');
    let columnaBorrar = document.createElement('td');
    
    // CORRECCIÓN: Se crea físicamente el botón con document.createElement
    let botonBorrar = document.createElement('button');
    botonBorrar.textContent = "borrar";
    
    // CORRECCIÓN: Añadido el ID en la primera columna
    columnaId.textContent = alumno.id;
    columnaNombre.textContent = alumno.nombre;
    columnaEdad.textContent = alumno.edad;
    columnaCurso.textContent = alumno.curso;
    columnaEmail.textContent = alumno.email;
    
    // CORRECCIÓN: Se introduce el botón de borrar dentro de su celda correspondiente
    columnaBorrar.appendChild(botonBorrar);
    
    // CORRECCIÓN: Asignamos el EventListener justo aquí para que sepa qué fila borrar
    botonBorrar.addEventListener('click', () => {
        filanueva.remove();
    });

    //A CADA COLUMNA LE TENGO QUE PONER LOS DATOS DEL ALUMNO
    filanueva.appendChild(columnaId);
    filanueva.appendChild(columnaNombre);
    filanueva.appendChild(columnaEdad);
    filanueva.appendChild(columnaCurso);
    filanueva.appendChild(columnaEmail);
    filanueva.appendChild(columnaBorrar);
    
    //AÑADIR LA FILA A LA TABLA
    bodytabla.appendChild(filanueva);
}

function addAlumnos ()
{
    /*FOR TRADICIONAL
    // for (let nalumno=0; nalumno < alumnos.length; nalumno++)
    // {
    //     addUnAlumno(alumnos[nalumno]);
    // }
    FOR EACH */
    alumnos.forEach(
        (alumno) => {
            addUnAlumno(alumno);
        }
    )
}
function calcularMediaEdad() {
    let sumaEdades = 0;

    // 1. Recorremos el array sumando la edad de cada alumno
    alumnos.forEach((alumno) => {
        sumaEdades += alumno.edad;
    });

    // 2. Dividimos el total entre la cantidad de alumnos
    let resultadoMedia = sumaEdades / alumnos.length;

    // 3. Opcional: Usamos Math.floor() para redondear hacia abajo el resultado final
    let mediaRedondeada = Math.floor(resultadoMedia);

    return mediaRedondeada;
}
function calcularMayorEdad() {
    let alumnoMayor = alumnos[0]; 

   
    for (let alumno of alumnos) {
        if (alumno.edad > alumnoMayor.edad) {
            alumnoMayor = alumno; 
        }
    }

    return `${alumnoMayor.nombre} (${alumnoMayor.edad} años)`;
}

// Función para encontrar al alumno con la edad más baja
function calcularMenorEdad() {
    let alumnoMenor = alumnos[0]; 

  
    for (let alumno of alumnos) {
        if (alumno.edad < alumnoMenor.edad) {
            alumnoMenor = alumno; 
        }
    }

    return `${alumnoMenor.nombre} (${alumnoMenor.edad} años)`;
}

function calcularEstadisticas() {

    let media = calcularMediaEdad(); 
    let parrafoMediaEstadisticas = document.createElement('p');
    parrafoMediaEstadisticas.textContent = "La media de edad es: " + media;
    document.body.appendChild(parrafoMediaEstadisticas);
      
    let mayorEdad = calcularMayorEdad();
    let parrafoMayorEdad = document.createElement('p');
    parrafoMayorEdad.textContent = "El alumno de mayor edad es: " + mayorEdad; // Añadido
    document.body.appendChild(parrafoMayorEdad);
    

    let menorEdad = calcularMenorEdad();
    let parrafoMenorEdad = document.createElement('p'); // Añadida la 'd' de document
    parrafoMenorEdad.textContent = "El alumno de menor edad es: " + menorEdad; // Añadido
    document.body.appendChild(parrafoMenorEdad);
}

