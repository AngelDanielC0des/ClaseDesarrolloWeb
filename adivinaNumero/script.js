let fraseContainer = document.getElementById("frase");
let numeroMaquina = Math.floor(Math.random() * 100) + 1;
console.log("Numero maquina = " + numeroMaquina);

let numeroDeIntentos = 0;
let maximoDeIntentos = 5;
let boton = document.getElementById("boton");
let intentosRestantes = document.getElementById("intentosRestantes");
let div = document.getElementById("div");

boton.addEventListener("click", calcularResultado);

function calcularResultado() {
    let numeroInput = Number(document.getElementById("numero").value);
    let imagenAnterior = div.querySelector('img');
    if (imagenAnterior) {
        imagenAnterior.remove();
    }

    if (numeroMaquina < numeroInput) {
        fraseContainer.textContent = "El número de la Máquina es menor que el escogido";
        let nuevaImagen = document.createElement('img');
        nuevaImagen.src = 'perdiste.jpg';
        div.appendChild(nuevaImagen); 

    } else if (numeroMaquina > numeroInput) {
        fraseContainer.textContent = "El número de la Máquina es mayor que el escogido";
        let nuevaImagen = document.createElement('img');
        nuevaImagen.src = 'perdiste.jpg';
        div.appendChild(nuevaImagen); 
    } 
    else {
        fraseContainer.textContent = "¡Ganaste!";
        boton.style.display = "none";
        let nuevaImagen = document.createElement('img');
        nuevaImagen.src = 'ganaste.png';
        div.appendChild(nuevaImagen);
        return; 
    }

    numeroDeIntentos++;
    intentosRestantes.textContent = `${maximoDeIntentos - numeroDeIntentos} intentos restantes`;
    finalizarJuego();
}

function finalizarJuego() {
    if (numeroDeIntentos >= maximoDeIntentos) {
        fraseContainer.textContent = "¡Perdiste el juego! Se acabaron los intentos. El número era: " + numeroMaquina;
        numeroMaquina = Math.floor(Math.random() * 100) + 1; 
        boton.style.display = "none";
    }
}