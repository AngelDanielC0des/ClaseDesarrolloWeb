// =========================================================================
// FUNCIÓN ACTIVA (La más eficiente en memoria) Bucle for...of
// =========================================================================
// Lee el texto directamente carácter por carácter. 
// Es el rey de la memoria porque no duplica el texto ni crea arrays intermedios.
function buscarLetra() {
    const palabra = document.getElementById("palabra").value; 
    const letra = document.getElementById("letra").value;
    
    // Filtro de seguridad (Cláusula de Guarda): detiene la función si falta algún dato
    if (!palabra || !letra) return;

    let contador = 0;


    for (const caracter of palabra) {
        if (caracter === letra) {
            contador++;
        }
    }
    console.log(`La letra aparece ${contador} veces`);
}


// =========================================================================
// ESCUCHADOR DE EVENTOS (Quita la necesidad de usar 'onclick' en el HTML)
// =========================================================================
const boton = document.getElementById("btnBuscar");
boton.addEventListener("click", buscarLetra);



/* =========================================================================
   OPCIONES ADICIONALES COMENTADAS (Para estudio de rendimiento y memoria)
   =========================================================================

   -------------------------------------------------------------------------
   OPCIÓN: El truco del .split()
   -------------------------------------------------------------------------
   function buscarLetraSplit() {
       const palabra = document.getElementById("palabra").value; 
       const letra = document.getElementById("letra").value;
       if (!palabra || !letra) return;

       const contador = palabra.split(letra).length - 1;
       console.log(`[Split] Aparece ${contador} veces`);

       // DEFECTO EN MEMORIA: Es malo para textos grandes. Tiene que cortar el texto 
       // y CREAR UN ARRAY con todos los fragmentos. Si procesas un texto masivo, 
       // JavaScript duplicará casi todo ese contenido en la memoria RAM solo para medir su .length.
   }

   -------------------------------------------------------------------------
   OPCIÓN: Bucle while con .indexOf()
   -------------------------------------------------------------------------
   function buscarLetraIndexOf() {
       const palabra = document.getElementById("palabra").value; 
       const letra = document.getElementById("letra").value;
       if (!palabra || !letra) return;

       let contador = 0;
       let posicion = palabra.indexOf(letra);

       while (posicion !== -1) {
           contador++;
           posicion = palabra.indexOf(letra, posicion + 1);
       }
       console.log(`[IndexOf] Aparece ${contador} veces`);

       // VIRTUD: Al igual que el for...of, consume casi cero memoria extra (solo dos números).
       // Además, es aún más rápido que el for...of porque NO lee todas las letras una a una;
       // salta directamente a las posiciones donde sabe que está la letra buscada.
   }

   -------------------------------------------------------------------------
   OPCIÓN: Expresión Regular con .matchAll()
   -------------------------------------------------------------------------
   function buscarLetraRegExp() {
       const palabra = document.getElementById("palabra").value; 
       const letra = document.getElementById("letra").value;
       if (!palabra || !letra) return;

       // Escapamos caracteres especiales por seguridad (evita que rompa si buscan un punto o asterisco)
       const letraEscapada = letra.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
       const regex = new RegExp(letraEscapada, 'g');
       
       let contador = 0;

       for (const coincidencia of palabra.matchAll(regex)) {
           contador++;
       }
       console.log(`[RegExp] Aparece ${contador} veces`);

       // VIRTUD: .matchAll() devuelve un "Iterador", lo que significa que no genera todos los 
       // resultados en memoria de golpe (a diferencia del antiguo .match()), sino bajo demanda.
       // DEFECTO: Consume un poquito más de memoria que for...of porque tiene que compilar 
       // y guardar el objeto RegExp en el sistema.
   }
*/