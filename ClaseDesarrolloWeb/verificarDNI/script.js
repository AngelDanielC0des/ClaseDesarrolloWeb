// Referencias DOM

let numeroDNI = document.getElementById('numeroDNI');

let letraDNI = document.getElementById('letraDNI');

let templateFallo =
    document.getElementById('templateFallo');

let templateAcierto =
    document.getElementById('templateAcierto');

let resultadoDNI =
    document.getElementById('resultadodni');


// Secuencia oficial de letras

const SECUENCIA_LETRAS =
    "TRWAGMYFPDXBNJZSQVHLCKE";


// Función principal

function verificarDNI() {

    resultadoDNI.replaceChildren();



    // Obtener valores del formulario

    let numero =
        numeroDNI.value
            .trim()
            .toUpperCase();

    let letra =
        letraDNI.value
            .trim()
            .toUpperCase();


    // Validación básica

    if (!numero || !letra) {

        alert("Rellena ambos campos");

        return;
    }


    /*
        SOPORTE NIE
        X → 0
        Y → 1
        Z → 2
    */

    if (numero.startsWith('X')) {

        numero =
            '0' + numero.slice(1);

    } else if (numero.startsWith('Y')) {

        numero =
            '1' + numero.slice(1);

    } else if (numero.startsWith('Z')) {

        numero =
            '2' + numero.slice(1);
    }


    // Convertir a número

    numero = Number(numero);


    // Verificar conversión válida

    if (isNaN(numero)) {

        alert("Documento inválido");

        return;
    }


    // Calcular letra correcta

    let resto =
        numero % SECUENCIA_LETRAS.length;

    let letraCorrecta =
        SECUENCIA_LETRAS[resto];


    // Comparación final

    if (letra === letraCorrecta) {

        let clon =
            templateAcierto.content.cloneNode(true);

        resultadoDNI.appendChild(clon);

    } else {

        let clon =
            templateFallo.content.cloneNode(true);

        resultadoDNI.appendChild(clon);
    }
}