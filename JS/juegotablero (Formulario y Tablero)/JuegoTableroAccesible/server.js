const express = require('express');
const app = express();
const PORT = 3000;

// Esto permite a tu servidor entender texto en formato JSON enviado por Postman
app.use(express.json());

// 1. Ruta para LEER datos con Postman (Petición GET)
app.get('/api/tablero', (req, res) => {
    res.json({
        mensaje: "¡Conexión exitosa con el tablero!",
        estado: "Listo para jugar",
        casillas: 24
    });
});

// 2. Ruta para RECIBIR datos del formulario con Postman (Petición POST)
app.post('/api/formulario', (req, res) => {
    const datosRecibidos = req.body;
    
    console.log("Datos que han llegado desde Postman:", datosRecibidos);

    // Respondemos a Postman confirmando que llegó bien
    res.json({
        estatus: "correcto",
        mensaje: "Datos del usuario guardados con éxito",
        datos: datosRecibidos
    });
});

// Arrancar el servidor
app.listen(PORT, () => {
    console.log(`Servidor de la API corriendo en http://localhost:${PORT}`);
});
