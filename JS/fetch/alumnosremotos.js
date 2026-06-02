
const URL_RUTA = "https://my-json-server.typicode.com/valexx55/angularesjson/alumno"

console.log("ANTES DEL FETCH");
fetch(URL_RUTA) //si no indico nada, se usa GET por defecto, haz una petición HTTP GET a esta ruta
  .then(response => response.json())//cuando haya una repsuesta completa, se ejcuta esta función. Con la función .json paso el texto del cuerpo a variable 
  .then(arrayAlumnos => mostrarAlumnos(arrayAlumnos));//cuando ya se haya pasado a variable, ya tengo el array, lo recorro y muestro los alumnos
console.log("DESPUÉS DEL FETCH");

function mostrarAlumnos (arrayAlumnos)
{
    arrayAlumnos.forEach(alumno => 
        {
        console.log(`Id = ${alumno.id} Nombre = ${alumno.nombre} Edad = ${alumno.edad}`);
        const div = document.createElement("div");
        div.innerHTML += `
          <div>
            <p>${alumno.id}</p>
            <p>${alumno.nombre}</p>
            <p>${alumno.edad}</p>
          </div>
        `;
        document.body.appendChild(div);
    });
}

//TODO: la lista de alumnos obtenida de internet (arrayAlumnos)
//tenemos que mostrarla en el HTML


/*
{
        "id": 12,
        "nombre": "Vinicius Pele",
        "apellido": "Jr O Rei",
        "email": "vini@correo.es",
        "edad": 20,
        "creadoEn": "2022-02-15T20:46:45.928+00:00",
        "fotoHashCode": null
    },
    */

// fetch(URL_RUTA).then(haIdoBien, haIdoMal);

// function haIdoBien(respuesta)
// {
//     console.log('La comunicación ha sido un éxito');
//     console.log(respuesta);
//     //pasamos de texto a variable -- DESERIALIZAR
//     if (respuesta.ok)
//     {
//         return respuesta.json()
//     }
//     //return respuesta.json()
// }

// function haIdoMal()
// {
//     console.log('La comunicación ha ido mal');
// }