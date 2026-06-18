const tablero = document.getElementById("tablero");
const contador = document.getElementById("contador");


tablero.className = 'tablero';


for (let i = 1; i <= 9; i++) {
    const boton = document.createElement('button');
    const idCuadro = `cuadro${i}`;

    boton.type = 'button';
    boton.id = idCuadro;
    boton.className = 'cuadrito';
    boton.textContent = i;


    boton.setAttribute('aria-pressed', 'false');
    boton.setAttribute('aria-label', `Cuadro ${i}`);
   

    if (i % 2 !== 0) {
        boton.style.backgroundColor = 'white';
        boton.setAttribute('aria-description', 'cuadrado actualmente blanco');
    } else {
        boton.style.backgroundColor = 'blue';
        boton.setAttribute('aria-description', 'cuadrado actualmente azul');
    }

    boton.addEventListener('click', () => volverNegro(idCuadro));
 
    tablero.appendChild(boton);
}


function volverNegro(idDelCuadro) {
    const elCuadro = document.getElementById(idDelCuadro);
    
   
    if (elCuadro.style.backgroundColor === "black") return;


    elCuadro.style.backgroundColor = "black";
    
    elCuadro.setAttribute('aria-pressed', 'true');
    elCuadro.setAttribute('aria-description', 'cuadrado actualmente negro');

  
    actualizarContador();
}


function actualizarContador() {
    const cuadritos = document.querySelectorAll('.cuadrito');
    let totalNegros = 0;

    cuadritos.forEach(cuadro => {
        if (cuadro.style.backgroundColor === 'black') {
            totalNegros++;
        }
    });

    contador.textContent = totalNegros;
}