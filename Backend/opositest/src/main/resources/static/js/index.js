document.addEventListener("DOMContentLoaded", function() {
    
    const params = new URLSearchParams(window.location.search);
    const mensaje = params.get('mensaje');

    console.log("Mensaje detectado en URL ->", mensaje);

    if (mensaje) {
        let cajaSaludo = document.getElementById('saludo-personalizado-box');

        if (!cajaSaludo) {
            console.log("Creando elemento de saludo dinámicamente...");
            
            cajaSaludo = document.createElement('div');
            cajaSaludo.style.background = '#f4f4f4';
            cajaSaludo.style.padding = '15px';
            cajaSaludo.style.borderLeft = '5px solid #e76f51';
            cajaSaludo.style.margin = '20px';
            
            cajaSaludo.innerHTML = `<p id="saludo-personalizado-box">${mensaje}</p>`;
            
            document.body.insertBefore(cajaSaludo, document.body.firstChild);
        } else {
            cajaSaludo.innerText = mensaje;
            cajaSaludo.style.display = 'block';
        }
    }
});
