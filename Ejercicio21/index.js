
function buscarLetra() {
    let contador = 0
    let palabra = document.getElementById("palabra").value; 
    let letra = document.getElementById("letra").value;

    
    for (i = 0; i < palabra.lenght; i++) {
        if (letra == palabra[i]) {
            contador = contador + 1
        }
    }
    console.log(`La letra aparece ${contador} veces`)

}