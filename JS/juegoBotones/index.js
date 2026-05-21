//VARIABLES PREDEFINIDAS
//window
//console
//document DOM

//variables PROPIAS
//número de goles a favor
//número de goles en contra
//trabajdor

//FUNCIONES
//alert
//log

console.log("HOLA desde fuera");
//vamos a obtener, a través del document, el botón
//de saludar


function saludar() {
    console.log("Hola desde adentro");
    //llamada a la función
    //TODO: Haced un botón nuevo, llamado Mostrar Info
    //para que se ejecute la función mostrarInfoPantalla
    let botonsaludo = document.getElementById("btnsaluda");
    console.log(botonsaludo.id);
    botonsaludo.style.backgroundColor = "red";

}

//nomenclatura camelCase en el nombre de funciones
function mostrarInfoPantalla() {
    //declaro una variable, que se llama ubicación
    //y cuyo valor es window.location.href
    let ubicacion = window.location.href;
    console.log(window.location.href);
    console.log(ubicacion);
    let ancho = window.innerWidth;
    console.log(window.innerWidth);
    let alto = window.innerHeight;
    console.log(window.innerHeight);
    let botonInfoPantalla = document.getElementById("btninfo");
    console.log(botonInfoPantalla.id);
    botonInfoPantalla.style.backgroundColor = "green";
    botonInfoPantalla.style.color = "white"
}
function ocultar() {
    let botonsaludo = document.getElementById("btnsaluda");
    let botonInfoPantalla = document.getElementById("btninfo");
    let ocultarBoton = document.getElementById("btnocultar");
    botonInfoPantalla.style.display = "none"
    botonsaludo.style.display = "none"
}

