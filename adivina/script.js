var bd = true;
var palabraOriginal = document.getElementById("palabra").value;
  
function esPalindromo(palabraOriginal) {
    let palabraReves = "";

        for (let i = palabraOrignal.length-1; i>=0; i--)
        {
            console.log(palabraOrignal[i]);
            let letraActual = palabraOrignal[i]
            palabraReves = palabraReves + letraActual;

        }

    if (palabraReves == palabraOriginal)  {
        console.log( `${palabraOriginal} es un palíndromo`)}
    else { console.log( `${palabraOriginal} no es un palíndromo`)}

    }


   console.log ("bd = " + bd);
            return bd;
        