// =========================================================================
// LECCIÓN: Temporizadores en JavaScript (setTimeout)
// =========================================================================

// CONCEPTO CLAVE: Programación Asíncrona Básica
// setTimeout() es una función nativa del navegador que ejecuta un bloque de 
// código una sola vez, después de que haya transcurrido un tiempo específico.

// Estructura de setTimeout:
// 1er parámetro: La función que queremos ejecutar (aquí usamos una Arrow Function).
// 2do parámetro: El tiempo de espera en milisegundos (5000ms = 5 segundos).

setTimeout(() => {
    // Código que se ejecutará en el futuro
    alert('Hola');
}, 5000);

/*
// EXTRA: Función equivalente con sintaxis tradicional (para estudio)
setTimeout(function() {
    alert('Hola desde la función tradicional');
}, 5000);

// EXTRA: ¿Cómo detener un temporizador? (clearTimeout)
// Si necesitas cancelar el temporizador antes de que suene, 
// debes guardarlo en una variable:
// let miAlarma = setTimeout(() => alert('No sonará'), 5000);
// clearTimeout(miAlarma); // Esto cancela la bomba de tiempo
*/
