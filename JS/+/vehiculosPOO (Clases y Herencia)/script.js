// =========================================================================
// LECCIÓN: Clases ES6, Herencia y Programación Orientada a Objetos (POO)
// =========================================================================
// Este ejercicio enseña cómo crear y usar clases en JavaScript moderno,
// incluyendo herencia, métodos estáticos, y el operador instanceof.
// Crearemos un catálogo de vehículos (coches, motos, camiones) usando POO.
//
// Analogía general:
// Imagina una FÁBRICA de vehículos. La fábrica tiene:
//   - Un PLANO GENERAL (la clase Vehiculo) con las características básicas
//     que TODOS los vehículos tienen: marca, modelo, precio...
//   - PLANOS ESPECÍFICOS (Coche, Moto, Camion) que añaden detalles
//     propios de cada tipo: puertas, cilindrada, carga máxima...
//
// ¿Qué es la POO (Programación Orientada a Objetos)?
// Es una FORMA DE ORGANIZAR el código. En vez de tener funciones sueltas,
// agrupamos datos y funciones dentro de "objetos" que representan cosas
// del mundo real. Es como tener fichas organizadas en vez de papeles sueltos.
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │   SIN POO (código desorganizado)    │   CON POO (código organizado) │
// ├─────────────────────────────────────┼───────────────────────────────┤
// │   let marca1 = "Toyota"             │   const coche = new Coche(    │
// │   let modelo1 = "Corolla"           │     "Toyota", "Corolla", ...) │
// │   let precio1 = 25000               │                               │
// │   function calcAutonomia1() {...}   │   coche.calcularAutonomia()   │
// │                                     │   coche.toString()            │
// └─────────────────────────────────────┴───────────────────────────────┘

// -------------------------------------------------------------------------
// 1. CONCEPTO: ¿Qué es una Clase?
// -------------------------------------------------------------------------
// Una clase es una "plantilla" o "molde" para crear objetos.
// Define QUÉ datos tiene (propiedades) y QUÉ puede hacer (métodos).
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │   CONCEPTO              │   Analogía del mundo real                  │
// ├─────────────────────────┼────────────────────────────────────────────┤
// │   Clase                 │   Un MOLDE de galletas                     │
// │   Objeto (instancia)    │   Una GALLETA hecha con ese molde          │
// │   Propiedad             │   Un DATO de la galleta (sabor, tamaño)    │
// │   Método                │   Una ACCIÓN (ser comida, desmenuzarse)    │
// │   Constructor           │   El momento en que CORTAS la masa         │
// │   new                   │   La acción de USAR el molde               │
// └─────────────────────────┴────────────────────────────────────────────┘
//
// Con UN molde (clase), puedes hacer INFINITAS galletas (objetos).
// Cada galleta es independiente: si muerdes una, las demás no cambian.
//
// En JavaScript, las clases se introdujeron en ES6 (2015) como "azúcar
// sintáctico" sobre el sistema de prototipos existente.
// "Azúcar sintáctico" = una forma más bonita de escribir algo que ya existía.

// -------------------------------------------------------------------------
// 2. CLASE BASE: Vehiculo (Clase Padre)
// -------------------------------------------------------------------------
// Esta es la clase "padre" de la que heredarán Coche, Moto y Camion.
// Contiene las propiedades y métodos COMUNES a todos los vehículos.
//
// ¿Por qué tener una clase padre?
// Porque Coche, Moto y Camion COMPARTEN muchas cosas:
// todos tienen marca, modelo, precio, consumo...
// En vez de repetir ese código 3 veces, lo ponemos UNA vez aquí.
//
// Analogía: Es como un FORMULARIO base que todos los vehículos rellenan.
// Luego cada tipo de vehículo añade sus campos extra.
//
// ┌─────────────────────────────────────────────────────────────────┐
// │                    class Vehiculo                                │
// │                                                                  │
// │   PROPIEDADES (datos):                                           │
// │     • marca        → "Toyota", "BMW", "Yamaha"...               │
// │     • modelo       → "Corolla", "Serie 3", "MT-07"...           │
// │     • anio         → 2023, 2024                                  │
// │     • precio       → 25000, 45000                                │
// │     • combustible  → 50 (litros en el depósito)                 │
// │     • consumo      → 5.5 (litros por cada 100 km)               │
// │     • fechaRegistro → fecha de creación                          │
// │                                                                  │
// │   MÉTODOS (funciones):                                           │
// │     • calcularAutonomia()     → km que puede recorrer            │
// │     • calcularCostePorKm()    → euros por kilómetro              │
// │     • toString()              → texto descriptivo                │
// │     • static compararPrecios()→ comparar 2 vehículos             │
// │     • static masBarato()      → el más barato de un array        │
// └─────────────────────────────────────────────────────────────────┘

class Vehiculo {
    // CONSTRUCTOR: Se ejecuta automáticamente al crear una nueva instancia
    // con 'new Vehiculo(...)'. Recibe los parámetros y asigna las propiedades.
    //
    // Analogía: Es como el momento en que RELLENAS el formulario.
    // Los parámetros son los datos que te dan, y this.xxx = xxx
    // es cuando los escribes en cada casilla del formulario.
    //
    // ¿Qué pasaría si NO hubiera constructor?
    // → Los objetos se crearían vacíos, sin datos. Serían inútiles.
    constructor(marca, modelo, anio, precio, combustible, consumo) {
        // 'this' se refiere a la INSTANCIA que se está creando.
        // Cada objeto creado tendrá sus propias copias de estas propiedades.
        // Es como decir: "ESTA galleta tiene ESTE sabor".
        // Otra galleta tendrá otro sabor diferente.
        this.marca = marca;
        this.modelo = modelo;
        this.anio = anio;
        this.precio = precio;
        this.combustible = combustible;  // Litros en el depósito
        this.consumo = consumo;          // Litros por cada 100 km
        this.fechaRegistro = new Date();
        // new Date() crea un objeto con la fecha y hora ACTUALES.
        // Así sabemos cuándo se "registró" cada vehículo en el catálogo.
    }

    // MÉTODO DE INSTANCIA: Calcular autonomía en kilómetros.
    // Cada instancia (objeto) puede llamar a este método.
    //
    // ¿Qué es un método? Es una FUNCIÓN que vive dentro de una clase.
    // Se diferencia de una función normal en que puede usar 'this'
    // para acceder a las propiedades del objeto.
    //
    // ¿Qué pasaría si fuera una función normal fuera de la clase?
    // → Tendríamos que pasarle todos los datos como parámetros:
    //   function calcularAutonomia(combustible, consumo) {...}
    //   Con el método, el objeto YA tiene esos datos (en this).
    calcularAutonomia() {
        // Fórmula: (litros / consumo) * 100 = km que puede recorrer
        // Ejemplo: 50 litros / 5.5 L/100km * 100 = 909 km
        return (this.combustible / this.consumo) * 100;
    }

    // MÉTODO DE INSTANCIA: Calcular coste por kilómetro.
    // Los parámetros con valor por defecto (= 1.65) se usan si el
    // usuario no pasa ningún valor al llamar la función.
    calcularCostePorKm(precioLitro = 1.65) {
        // precioLitro tiene un valor por defecto de 1.65€/L
        // (precio medio aproximado de la gasolina en España).
        // Si llamas: coche.calcularCostePorKm() → usa 1.65
        // Si llamas: coche.calcularCostePorKm(1.80) → usa 1.80
        //
        // Fórmula: (consumo / 100) * precioLitro
        // Ejemplo: (5.5 / 100) * 1.65 = 0.09075 €/km
        return (this.consumo / 100) * precioLitro;
    }

    // MÉTODO DE INSTANCIA: Representación en texto del vehículo.
    // Este método será SOBRESCRITO (override) por las clases hijas.
    //
    // ¿Qué es toString()? Es un método "convencional" que existe en
    // muchos lenguajes. Sirve para convertir un objeto en texto.
    // Cuando haces console.log(objeto), JavaScript llama a toString()
    // internamente para mostrar algo legible.
    //
    // ¿Qué pasaría si NO definiéramos toString()?
    // → JavaScript usaría el toString() por defecto, que devuelve
    //   "[object Object]" (texto inútil).
    toString() {
        return `${this.marca} ${this.modelo} (${this.anio})`;
    }

    // -------------------------------------------------------------------------
    // MÉTODO ESTÁTICO: No pertenece a las instancias, sino a la CLASE.
    // -------------------------------------------------------------------------
    // Se llama como Vehiculo.compararPrecios(v1, v2), NO como v1.compararPrecios()
    //
    // ┌──────────────────────────────────────────────────────────────────────┐
    // │   MÉTODO DE INSTANCIA            │   MÉTODO ESTÁTICO                │
    // ├──────────────────────────────────┼──────────────────────────────────┤
    // │   Se llama sobre el OBJETO:      │   Se llama sobre la CLASE:       │
    // │   coche.calcularAutonomia()      │   Vehiculo.compararPrecios(a,b)  │
    // ├──────────────────────────────────┼──────────────────────────────────┤
    // │   Puede usar 'this'              │   NO tiene 'this'                │
    // │   (accede a sus datos)           │   (no pertenece a ningún objeto) │
    // ├──────────────────────────────────┼──────────────────────────────────┤
    // │   Analogía: Lo que una persona   │   Analogía: Lo que hace el       │
    // │   puede hacer (correr, hablar)   │   "concepto" de persona          │
    // │                                  │   (contar cuántas personas hay)  │
    // ├──────────────────────────────────┼──────────────────────────────────┤
    // │   Ejemplo:                       │   Ejemplo:                       │
    // │   coche.toString()               │   Math.max(3, 5)                 │
    // │   array.push("x")               │   Array.isArray(x)               │
    // └──────────────────────────────────┴──────────────────────────────────┘
    //
    // ¿Qué pasaría si intentáramos llamarlo sobre una instancia?
    //   const coche = new Coche(...);
    //   coche.compararPrecios(otro); → ERROR: coche.compararPrecios is not a function

    static compararPrecios(vehiculo1, vehiculo2) {
        if (vehiculo1.precio > vehiculo2.precio) {
            return `${vehiculo1.toString()} es más caro`;
        } else if (vehiculo1.precio < vehiculo2.precio) {
            return `${vehiculo2.toString()} es más caro`;
        }
        return 'Ambos tienen el mismo precio';
    }

    // MÉTODO ESTÁTICO: Encontrar el vehículo más barato de un array.
    // Usa reduce(), que "reduce" un array a un solo valor.
    //
    // ¿Cómo funciona reduce()?
    // Empieza con el primer elemento como "acumulador" (barato).
    // Recorre cada elemento (actual) y compara:
    //   - Si actual es más barato → actual se convierte en el nuevo "barato"
    //   - Si no → "barato" se queda como estaba
    // Al final, queda solo el más barato.
    //
    // Analogía: Es como un torneo. Empiezan todos, y en cada ronda
    // se enfrentan 2 y gana el más barato. Al final queda solo uno.
    static masBarato(vehiculos) {
        return vehiculos.reduce((barato, actual) => 
            actual.precio < barato.precio ? actual : barato
        );
    }
}

// -------------------------------------------------------------------------
// 3. CLASE HIJA: Coche (hereda de Vehiculo)
// -------------------------------------------------------------------------
// 'extends' indica que Coche HEREDA de Vehiculo.
// Coche tendrá todas las propiedades y métodos de Vehiculo,
// más las suyas propias.
//
// Herencia = "Copiar y ampliar"
// Coche copia todo lo de Vehiculo y le añade cosas propias.
//
// Analogía de la herencia (árbol genealógico):
// ┌──────────────────────────────────────────────────────────────────────┐
// │                                                                      │
// │              Vehiculo (abuelo)                                       │
// │              marca, modelo, precio, consumo...                       │
// │                    │                                                 │
// │            ┌───────┼──────────┐                                      │
// │            ▼       ▼          ▼                                      │
// │         Coche    Moto      Camion                                    │
// │         +puertas +cilindrada +cargaMaxima                            │
// │         +aire    +tipoMoto   +ejes                                   │
// │                                                                      │
// │   Coche "hereda" marca, modelo, precio... de Vehiculo               │
// │   y AÑADE puertas y aireAcondicionado (que Vehiculo no tiene)       │
// └──────────────────────────────────────────────────────────────────────┘
//
// ¿Qué pasaría si NO usáramos herencia?
// → Tendríamos que repetir marca, modelo, precio... en Coche, Moto y Camion.
//   Sería mucho código duplicado y difícil de mantener.

class Coche extends Vehiculo {
    constructor(marca, modelo, anio, precio, combustible, consumo, puertas, aireAcondicionado) {
        // SUPER: Llama al constructor de la clase PADRE (Vehiculo).
        // ES OBLIGATORIO llamar a super() antes de usar 'this' en una clase hija.
        // Le pasamos los parámetros que necesita el constructor padre.
        //
        // Analogía: Antes de decorar tu casa (propiedades de Coche),
        // primero tienes que CONSTRUIR la casa (propiedades de Vehiculo).
        // super() es "construir la casa base".
        //
        // ¿Qué pasaría si olvidamos super()?
        // → JavaScript da un ERROR: "Must call super constructor in derived
        //   class before accessing 'this'"
        super(marca, modelo, anio, precio, combustible, consumo);
        
        // Propiedades ESPECÍFICAS de Coche (no existen en Vehiculo).
        // Solo los coches tienen puertas y aire acondicionado.
        // Una moto no tiene puertas (normalmente) ni un camión tiene
        // las mismas características que un coche.
        this.puertas = puertas;
        this.aireAcondicionado = aireAcondicionado;
        this.tipo = 'coche';
        // 'tipo' es una etiqueta de texto para identificar rápidamente
        // qué tipo de vehículo es. Útil para CSS y filtros.
    }

    // SOBRESCRITURA (Override): Reemplazamos el método toString() del padre
    // con una versión más específica para Coche.
    //
    // ¿Qué es Override? Es cuando una clase hija DEFINE un método que ya
    // existe en la clase padre. El método de la hija "gana" (se usa el suyo).
    //
    // ¿Qué pasaría si NO sobrescribiéramos toString()?
    // → Se usaría el del padre: "Toyota Corolla (2023)"
    // → Perderíamos la info de las puertas.
    toString() {
        // Podemos llamar al método del padre con super.toString().
        // super.toString() → "Toyota Corolla (2023)"
        // Y le añadimos info extra: → "🚗 Toyota Corolla (2023) - 5 puertas"
        return `🚗 ${super.toString()} - ${this.puertas} puertas`;
    }

    // Método específico de Coche: ¿es un coche familiar?
    // Un coche familiar tiene 5 o más puertas (monovolumen, familiar...).
    esFamiliar() {
        return this.puertas >= 5;
        // Devuelve true si tiene 5+ puertas, false si tiene menos.
        // No necesitamos if/else: la comparación ya devuelve un booleano.
    }
}

// -------------------------------------------------------------------------
// 4. CLASE HIJA: Moto (hereda de Vehiculo)
// -------------------------------------------------------------------------
// Misma lógica que Coche: hereda de Vehiculo y añade propiedades propias.
// Las motos tienen cilindrada (en cc) y un tipo específico.

class Moto extends Vehiculo {
    constructor(marca, modelo, anio, precio, combustible, consumo, cilindrada, tipoMoto) {
        // Llamamos al constructor del padre con los datos comunes.
        super(marca, modelo, anio, precio, combustible, consumo);
        
        this.cilindrada = cilindrada;  // en cc (centímetros cúbicos)
                                        // Ejemplo: 689cc, 1103cc
        this.tipoMoto = tipoMoto;      // "deportiva", "naked", "trail", etc.
        this.tipo = 'moto';
    }

    // Override: versión específica de toString() para motos.
    toString() {
        return `🏍️ ${super.toString()} - ${this.cilindrada}cc ${this.tipoMoto}`;
    }

    // ¿Es una moto deportiva?
    // .toLowerCase() convierte a minúsculas para que la comparación
    // no distinga entre mayúsculas/minúsculas:
    //   "Deportiva" → "deportiva" → coincide con "deportiva" ✓
    //   "DEPORTIVA" → "deportiva" → coincide con "deportiva" ✓
    esDeportiva() {
        return this.tipoMoto.toLowerCase() === 'deportiva';
    }
}

// -------------------------------------------------------------------------
// 5. CLASE HIJA: Camion (hereda de Vehiculo)
// -------------------------------------------------------------------------
// Los camiones tienen carga máxima (en toneladas) y número de ejes.

class Camion extends Vehiculo {
    constructor(marca, modelo, anio, precio, combustible, consumo, cargaMaxima, ejes) {
        super(marca, modelo, anio, precio, combustible, consumo);
        
        this.cargaMaxima = cargaMaxima;  // en toneladas
        this.ejes = ejes;
        this.tipo = 'camion';
    }

    toString() {
        return `🚛 ${super.toString()} - ${this.cargaMaxima}T carga`;
    }

    // ¿Es un camión "pesado"? (más de 10 toneladas de carga máxima)
    esPesado() {
        return this.cargaMaxima > 10;
    }
}

// -------------------------------------------------------------------------
// 6. CATÁLOGO DE VEHÍCULOS (Array de instancias)
// -------------------------------------------------------------------------
// Un array que contendrá todas las instancias de vehículos.
// Puede contener MEZCLADOS objetos de diferentes clases (Coche, Moto, Camion)
// porque TODOS heredan de Vehiculo.
//
// Esto se llama POLIMORFISMO: tratar objetos de diferentes clases
// como si fueran del mismo tipo (Vehiculo).
//
// Analogía: Es como un GARAJE donde puedes meter coches, motos y camiones.
// Todos son "vehículos" aunque sean de tipos diferentes.
let catalogo = [];

// -------------------------------------------------------------------------
// 7. DATOS DE EJEMPLO (Instancias de las clases)
// -------------------------------------------------------------------------
// Creamos vehículos de ejemplo para que el catálogo no esté vacío
// al abrir la página por primera vez.

function cargarDatosEjemplo() {
    // Creamos instancias con 'new NombreClase(parametros)'.
    // 'new' es la palabra clave que le dice a JavaScript:
    // "Crea un nuevo objeto usando esta clase como plantilla".
    //
    // El orden de los parámetros DEBE coincidir con el del constructor.
    // Si te equivocas de orden, los datos se asignan mal:
    //   new Coche("Toyota", "Corolla", 2023, ...) ← orden correcto
    //   new Coche(2023, "Toyota", "Corolla", ...) ← ¡año sería la marca!
    const vehiculosEjemplo = [
        new Coche("Toyota", "Corolla", 2023, 25000, 50, 5.5, 5, true),
        new Coche("BMW", "Serie 3", 2024, 45000, 60, 6.2, 4, true),
        new Moto("Yamaha", "MT-07", 2023, 8500, 14, 3.8, 689, "naked"),
        new Moto("Ducati", "Panigale V4", 2024, 28000, 16, 6.5, 1103, "deportiva"),
        new Camion("Volvo", "FH16", 2023, 120000, 500, 28, 25, 3),
        new Camion("Mercedes", "Actros", 2024, 95000, 400, 25, 18, 2)
    ];
    
    catalogo = vehiculosEjemplo;
}

// -------------------------------------------------------------------------
// 8. OPERADOR instanceof
// -------------------------------------------------------------------------
// instanceof comprueba si un objeto es instancia de una clase específica.
// Devuelve true o false.
//
// ┌──────────────────────────────────────────────────────────────────────┐
// │   EJEMPLOS DE instanceof                                            │
// ├─────────────────────────────────┬────────────────────────────────────┤
// │   Expresión                     │   Resultado                       │
// ├─────────────────────────────────┼────────────────────────────────────┤
// │   coche instanceof Coche        │   true  (es un Coche)             │
// │   coche instanceof Vehiculo     │   true  (hereda de Vehiculo)      │
// │   coche instanceof Moto         │   false (no es una Moto)          │
// │   moto instanceof Vehiculo      │   true  (hereda de Vehiculo)      │
// │   moto instanceof Coche         │   false (no es un Coche)          │
// └─────────────────────────────────┴────────────────────────────────────┘
//
// ¡OJO! Un Coche es instancia de Coche Y de Vehiculo (por la herencia).
// Es como decir: "Un perro es un perro" (true) Y "Un perro es un animal" (true).
//
// ¿Para qué sirve?
// Para saber qué TIPO de vehículo tenemos y actuar en consecuencia.
// Por ejemplo, mostrar datos diferentes según sea coche, moto o camión.
//
// ¿Qué pasaría si NO usáramos instanceof?
// → No podríamos distinguir tipos de vehículos en un array mezclado.
//   Tendríamos que usar trucos como vehiculo.tipo === 'coche' (menos fiable).

function obtenerTipoVehiculo(vehiculo) {
    // Comprobamos de más específico a más general.
    // El orden importa: si un objeto es Coche, también es Vehiculo.
    // Por eso comprobamos Coche ANTES que Vehiculo.
    if (vehiculo instanceof Coche) return 'coche';
    if (vehiculo instanceof Moto) return 'moto';
    if (vehiculo instanceof Camion) return 'camion';
    return 'desconocido';
    // Si no es ninguno de los anteriores, devolvemos 'desconocido'.
    // Esto es una "defensa" por si alguien mete un objeto raro en el catálogo.
}

// -------------------------------------------------------------------------
// 9. FUNCIONES DE RENDERIZADO
// -------------------------------------------------------------------------
// "Renderizar" = convertir los datos (objetos JavaScript) en HTML visible.

function renderizarCatalogo(filtro = 'todos') {
    // Obtenemos la referencia al contenedor donde irán las tarjetas.
    const grid = document.getElementById('gridCatalogo');
    // Vaciamos el contenedor (borramos lo que había antes).
    grid.innerHTML = '';
    
    // Filtrar por tipo usando instanceof.
    // Si el filtro es 'todos', mostramos todo el catálogo.
    // Si no, solo mostramos los del tipo seleccionado.
    let vehiculosFiltrados;
    if (filtro === 'todos') {
        vehiculosFiltrados = catalogo;
    } else {
        // filter() crea un nuevo array con solo los vehículos del tipo elegido.
        vehiculosFiltrados = catalogo.filter(v => obtenerTipoVehiculo(v) === filtro);
    }
    
    // MAP para crear las tarjetas (una por cada vehículo).
    // map() transforma cada vehículo en un elemento HTML (tarjeta).
    const tarjetas = vehiculosFiltrados.map((vehiculo, indice) => {
        // Creamos un <div> que será la tarjeta del vehículo.
        const card = document.createElement('div');
        const tipo = obtenerTipoVehiculo(vehiculo);
        // Añadimos clases CSS según el tipo para dar estilos diferentes.
        card.className = `vehiculo-card tipo-${tipo}`;
        
        // Objeto "diccionario" para mapear tipo → emoji.
        // Es más limpio que usar if/else para cada tipo.
        const iconos = { coche: '🚗', moto: '🏍️', camion: '🚛' };
        
        // Propiedades específicas según tipo.
        // Usamos instanceof para saber qué datos extra mostrar.
        // Cada tipo de vehículo tiene propiedades únicas que el padre no tiene.
        let extrasHTML = '';
        if (vehiculo instanceof Coche) {
            // Solo los coches tienen .puertas y .aireAcondicionado
            extrasHTML = `
                <div class="dato-item">
                    <label>Puertas</label>
                    <span>${vehiculo.puertas}</span>
                </div>
                <div class="dato-item">
                    <label>A/C</label>
                    <span>${vehiculo.aireAcondicionado ? 'Sí' : 'No'}</span>
                </div>
            `;
        } else if (vehiculo instanceof Moto) {
            // Solo las motos tienen .cilindrada y .tipoMoto
            extrasHTML = `
                <div class="dato-item">
                    <label>Cilindrada</label>
                    <span>${vehiculo.cilindrada}cc</span>
                </div>
                <div class="dato-item">
                    <label>Tipo</label>
                    <span>${vehiculo.tipoMoto}</span>
                </div>
            `;
        } else if (vehiculo instanceof Camion) {
            // Solo los camiones tienen .cargaMaxima y .ejes
            extrasHTML = `
                <div class="dato-item">
                    <label>Carga máx.</label>
                    <span>${vehiculo.cargaMaxima}T</span>
                </div>
                <div class="dato-item">
                    <label>Ejes</label>
                    <span>${vehiculo.ejes}</span>
                </div>
            `;
        }
        
        // Llamamos a los métodos de la instancia.
        // Aquí es donde brilla la POO: cada vehículo CALCULA su propia
        // autonomía usando SUS datos (this.combustible, this.consumo).
        // No necesitamos pasarle nada, el objeto ya lo sabe todo.
        const autonomia = vehiculo.calcularAutonomia().toFixed(0);
        // .toFixed(0) redondea a 0 decimales: 909.09 → "909"
        const costeKm = vehiculo.calcularCostePorKm().toFixed(3);
        // .toFixed(3) redondea a 3 decimales: 0.09075 → "0.091"
        
        // Rellenamos la tarjeta con HTML.
        card.innerHTML = `
            <div class="icono">${iconos[tipo]}</div>
            <span class="tipo-badge">${tipo}</span>
            <h3>${vehiculo.marca} ${vehiculo.modelo}</h3>
            <p style="color:#666; font-size:0.9rem;">${vehiculo.anio}</p>
            
            <div class="vehiculo-datos">
                <div class="dato-item">
                    <label>Combustible</label>
                    <span>${vehiculo.combustible}L</span>
                </div>
                <div class="dato-item">
                    <label>Consumo</label>
                    <span>${vehiculo.consumo}L/100km</span>
                </div>
                ${extrasHTML}
            </div>
            
            <div class="vehiculo-precio">${vehiculo.precio.toLocaleString('es-ES')}€</div>
            <div class="vehiculo-autonomia">
                🛣️ Autonomía: ${autonomia} km | 💰 Coste: ${costeKm}€/km
            </div>
            <button class="btn-eliminar" onclick="eliminarVehiculo(${catalogo.indexOf(vehiculo)})">
                Eliminar
            </button>
        `;
        // toLocaleString('es-ES') formatea números al estilo español:
        //   25000 → "25.000"  (punto como separador de miles)
        //   120000 → "120.000"
        //
        // onclick="eliminarVehiculo(${catalogo.indexOf(vehiculo)})"
        // indexOf devuelve la POSICIÓN del vehículo en el array catálogo.
        // Lo usamos para saber cuál borrar cuando el usuario pulse "Eliminar".
        
        return card;
    });
    
    // Añadimos todas las tarjetas al contenedor.
    tarjetas.forEach(card => grid.appendChild(card));
    
    // Actualizamos las estadísticas del catálogo.
    renderizarEstadisticas();
}

function renderizarEstadisticas() {
    const stats = document.getElementById('statsContenido');
    
    // Si el catálogo está vacío, mostramos un mensaje y salimos.
    if (catalogo.length === 0) {
        stats.innerHTML = '<p style="color:#999;">No hay vehículos en el catálogo</p>';
        return;
        // return sin valor sale de la función inmediatamente.
        // Todo lo que haya después del return NO se ejecuta.
    }
    
    // Usamos el método ESTÁTICO de la clase Vehiculo.
    // Se llama sobre la CLASE, no sobre una instancia:
    //   Vehiculo.masBarato(catalogo)  ← CORRECTO
    //   catalogo[0].masBarato(...)    ← INCORRECTO (no existe en instancias)
    const masBarato = Vehiculo.masBarato(catalogo);
    
    // Contamos cuántos vehículos hay de cada tipo usando instanceof.
    // filter() + .length = contar cuántos cumplen la condición.
    const coches = catalogo.filter(v => v instanceof Coche).length;
    const motos = catalogo.filter(v => v instanceof Moto).length;
    const camiones = catalogo.filter(v => v instanceof Camion).length;
    
    // Calculamos el precio medio usando reduce().
    // reduce() "acumula" valores: empieza en 0 y va sumando cada precio.
    // Al final dividimos entre el total para obtener la media.
    //
    // Ejemplo con 3 vehículos de precios [25000, 45000, 8500]:
    //   suma = 0 + 25000 = 25000
    //   suma = 25000 + 45000 = 70000
    //   suma = 70000 + 8500 = 78500
    //   media = 78500 / 3 = 26166.67
    const precioMedio = catalogo.reduce((suma, v) => suma + v.precio, 0) / catalogo.length;
    
    // Calculamos la autonomía media de la misma forma.
    // Aquí llamamos al método calcularAutonomia() de cada vehículo.
    // Gracias al POLIMORFISMO, no importa si es Coche, Moto o Camion:
    // todos tienen el método calcularAutonomia() (heredado de Vehiculo).
    const autonomiaMedia = catalogo.reduce((suma, v) => suma + v.calcularAutonomia(), 0) / catalogo.length;
    
    // Pintamos las estadísticas en el HTML.
    stats.innerHTML = `
        <div class="stat-item">
            <label>Total vehículos</label>
            <span>${catalogo.length}</span>
        </div>
        <div class="stat-item">
            <label>Coches</label>
            <span>${coches}</span>
        </div>
        <div class="stat-item">
            <label>Motos</label>
            <span>${motos}</span>
        </div>
        <div class="stat-item">
            <label>Camiones</label>
            <span>${camiones}</span>
        </div>
        <div class="stat-item">
            <label>Precio medio</label>
            <span>${precioMedio.toLocaleString('es-ES', {maximumFractionDigits: 0})}€</span>
        </div>
        <div class="stat-item">
            <label>Autonomía media</label>
            <span>${autonomiaMedia.toFixed(0)} km</span>
        </div>
        <div class="stat-item">
            <label>Más barato</label>
            <span>${masBarato.marca} ${masBarato.modelo}</span>
        </div>
    `;
    // maximumFractionDigits: 0 → no muestra decimales en el precio medio.
}

// -------------------------------------------------------------------------
// 10. FUNCIONES DE GESTIÓN
// -------------------------------------------------------------------------
// Funciones para añadir y eliminar vehículos del catálogo.

function eliminarVehiculo(indice) {
    // splice(indice, 1) elimina 1 elemento en la posición 'indice'.
    // ┌──────────────────────────────────────────────────────────────┐
    // │   ANTES: catalogo = [A, B, C, D]                            │
    // │   splice(2, 1) → elimina el elemento en posición 2 (C)      │
    // │   DESPUÉS: catalogo = [A, B, D]                             │
    // └──────────────────────────────────────────────────────────────┘
    // ¿Por qué splice y no filter? Porque aquí ya sabemos el índice exacto.
    // filter es mejor cuando buscamos por condición (ej: "todos los coches").
    catalogo.splice(indice, 1);
    renderizarCatalogo(filtroActual);
}

function agregarVehiculo() {
    // Leemos los valores del formulario.
    // .value devuelve el texto que el usuario escribió en el input.
    // .trim() quita espacios al principio y final.
    const tipo = document.getElementById('tipoVehiculo').value;
    const marca = document.getElementById('marca').value.trim();
    const modelo = document.getElementById('modelo').value.trim();
    // Number() convierte el string del input a un número.
    // Los inputs siempre devuelven strings, incluso si son type="number".
    // Si no convertimos, "2024" sería un texto, no un número.
    const anio = Number(document.getElementById('anio').value);
    const precio = Number(document.getElementById('precio').value);
    const combustible = Number(document.getElementById('combustible').value);
    const consumo = Number(document.getElementById('consumo').value);
    
    // Validación: comprobamos que TODOS los campos obligatorios estén rellenos.
    // El operador ! (NOT) convierte a booleano: !0 = true, !"" = true, !"hola" = false
    // Si algún campo es 0, vacío o null, la condición se cumple y mostramos alerta.
    if (!marca || !modelo || !anio || !precio || !combustible || !consumo) {
        alert('Por favor, rellena todos los campos obligatorios');
        return;
        // return sale de la función. No se ejecuta nada más.
    }
    
    let vehiculo;
    
    // Creamos la instancia según el tipo (POLIMORFISMO).
    // Polimorfismo = "muchas formas". Según el tipo, creamos un objeto
    // de una clase u otra, pero todos se guardan en la misma variable.
    //
    // El operador ?. (optional chaining) evita errores si el elemento
    // no existe en el DOM. Si getElementById devuelve null, ?.value
    // no da error, sino que devuelve undefined.
    //
    // El operador ?? (nullish coalescing) devuelve el valor de la derecha
    // si el de la izquierda es null o undefined.
    //   undefined ?? 4  →  4
    //   "hola"  ?? 4   →  "hola"
    switch (tipo) {
        case 'coche':
            const puertas = Number(document.getElementById('puertas')?.value || 4);
            const aire = document.getElementById('aireAcondicionado')?.checked ?? true;
            vehiculo = new Coche(marca, modelo, anio, precio, combustible, consumo, puertas, aire);
            break;
        case 'moto':
            const cilindrada = Number(document.getElementById('cilindrada')?.value || 600);
            const tipoMoto = document.getElementById('tipoMoto')?.value || 'naked';
            vehiculo = new Moto(marca, modelo, anio, precio, combustible, consumo, cilindrada, tipoMoto);
            break;
        case 'camion':
            const cargaMaxima = Number(document.getElementById('cargaMaxima')?.value || 10);
            const ejes = Number(document.getElementById('ejes')?.value || 2);
            vehiculo = new Camion(marca, modelo, anio, precio, combustible, consumo, cargaMaxima, ejes);
            break;
    }
    
    // Añadimos el nuevo vehículo al final del catálogo.
    catalogo.push(vehiculo);
    // Volvemos a renderizar para que aparezca en pantalla.
    renderizarCatalogo(filtroActual);
    
    // Limpiar formulario: vaciamos todos los inputs para que el usuario
    // pueda añadir otro vehículo sin tener que borrar manualmente.
    document.querySelectorAll('.formulario input').forEach(input => {
        if (input.type !== 'button') input.value = '';
    });
}

// -------------------------------------------------------------------------
// 11. CAMPOS EXTRA DINÁMICOS (según tipo de vehículo)
// -------------------------------------------------------------------------
// Cuando el usuario cambia el tipo de vehículo en el <select>,
// mostramos campos diferentes: puertas para coche, cilindrada para moto, etc.
//
// Analogía: Es como un formulario en papel que tiene secciones que
// solo aparecen si marcas "Sí" en una casilla anterior.

function actualizarCamposExtra() {
    const tipo = document.getElementById('tipoVehiculo').value;
    const contenedor = document.getElementById('camposExtra');
    
    // Según el tipo, inyectamos unos campos u otros en el HTML.
    // innerHTML reemplaza TODO el contenido del contenedor.
    switch (tipo) {
        case 'coche':
            contenedor.innerHTML = `
                <input type="number" id="puertas" placeholder="Puertas" value="4" min="2" max="7">
                <label style="display:flex;align-items:center;gap:8px;padding:10px;">
                    <input type="checkbox" id="aireAcondicionado" checked>
                    Aire Acondicionado
                </label>
            `;
            break;
        case 'moto':
            contenedor.innerHTML = `
                <input type="number" id="cilindrada" placeholder="Cilindrada (cc)" value="600" min="50">
                <select id="tipoMoto">
                    <option value="naked">Naked</option>
                    <option value="deportiva">Deportiva</option>
                    <option value="trail">Trail</option>
                    <option value="custom">Custom</option>
                    <option value="scooter">Scooter</option>
                </select>
            `;
            break;
        case 'camion':
            contenedor.innerHTML = `
                <input type="number" id="cargaMaxima" placeholder="Carga máxima (T)" value="10" min="1">
                <input type="number" id="ejes" placeholder="Ejes" value="2" min="2" max="6">
            `;
            break;
    }
}

// -------------------------------------------------------------------------
// 12. EVENT LISTENERS
// -------------------------------------------------------------------------
// Conectamos los elementos HTML con las funciones JavaScript.
// "Cuando el usuario haga X, ejecuta la función Y."

let filtroActual = 'todos';
// Variable global para recordar qué filtro está activo.
// La necesitamos porque varias funciones la usan (renderizar, eliminar, etc.).

// Cuando se pulsa "Agregar", ejecutamos agregarVehiculo().
document.getElementById('btnAgregar').addEventListener('click', agregarVehiculo);

// Cuando cambia el <select> de tipo de vehículo, actualizamos los campos extra.
document.getElementById('tipoVehiculo').addEventListener('change', actualizarCamposExtra);

// Filtros por tipo: cuando se pulsa un botón de filtro.
document.querySelectorAll('.filtro-tipo').forEach(btn => {
    btn.addEventListener('click', () => {
        // Quitamos la clase 'activo' de TODOS los botones de filtro.
        document.querySelectorAll('.filtro-tipo').forEach(b => b.classList.remove('activo'));
        // Añadimos 'activo' solo al botón pulsado (para resaltar visualmente).
        btn.classList.add('activo');
        // Guardamos el filtro seleccionado leyendo el atributo data-tipo del botón.
        filtroActual = btn.dataset.tipo;
        // Re-renderizamos el catálogo con el nuevo filtro.
        renderizarCatalogo(filtroActual);
    });
});

// -------------------------------------------------------------------------
// 13. INICIALIZACIÓN
// -------------------------------------------------------------------------
// Este bloque se ejecuta UNA SOLA VEZ cuando la página carga.
// Prepara todo para que el usuario pueda empezar a usar la app.

// 1. Cargamos los vehículos de ejemplo en el catálogo.
cargarDatosEjemplo();

// 2. Mostramos los campos extra para el tipo por defecto (coche).
actualizarCamposExtra();

// 3. Renderizamos el catálogo en pantalla (pintamos las tarjetas HTML).
renderizarCatalogo();

// -------------------------------------------------------------------------
// DEMOSTRACIÓN EN CONSOLA (para que el alumno vea cómo funciona la POO)
// -------------------------------------------------------------------------
// Estos console.log muestran en la consola del navegador (F12) ejemplos
// de instanceof, métodos estáticos y polimorfismo en acción.

console.log('\n=== DEMOSTRACIÓN POO ===');
console.log('Catálogo:', catalogo);

console.log('\ninstanceof:');
// Recorremos cada vehículo y mostramos de qué clase es instancia.
// Fíjate: un Coche es instancia de Coche Y de Vehiculo (por la herencia).
catalogo.forEach(v => {
    console.log(`${v.toString()} → instanceof Coche: ${v instanceof Coche}, instanceof Vehiculo: ${v instanceof Vehiculo}`);
});

console.log('\nMétodo estático compararPrecios:');
// Llamamos al método estático sobre la CLASE, no sobre una instancia.
console.log(Vehiculo.compararPrecios(catalogo[0], catalogo[1]));

console.log('\nMétodo estático masBarato:');
console.log(Vehiculo.masBarato(catalogo).toString());

// =========================================================================
// RESUMEN DE CONCEPTOS APRENDIDOS
// =========================================================================
//
// ┌────┬──────────────────────────────────┬────────────────────────────────┐
// │ #  │   Concepto                       │   Para qué sirve               │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  1 │ class                            │ Define una plantilla (molde)   │
// │    │                                  │ para crear objetos             │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  2 │ constructor()                    │ Se ejecuta al crear una        │
// │    │                                  │ instancia con 'new'. Inicializa│
// │    │                                  │ las propiedades del objeto     │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  3 │ this                             │ Se refiere a la instancia      │
// │    │                                  │ actual (ESTE objeto concreto)  │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  4 │ new                              │ Crea un nuevo objeto a partir  │
// │    │                                  │ de una clase                   │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  5 │ extends                          │ Una clase HEREDA de otra:      │
// │    │                                  │ class Hija extends Padre       │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  6 │ super()                          │ Llama al constructor del padre │
// │    │                                  │ (OBLIGATORIO en clases hijas)  │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  7 │ super.metodo()                   │ Llama a un método del padre    │
// │    │                                  │ (útil en overrides)            │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  8 │ static                           │ Método de la CLASE, no de las  │
// │    │                                  │ instancias. Se llama como      │
// │    │                                  │ Clase.metodo()                 │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │  9 │ instanceof                       │ Comprueba si un objeto es      │
// │    │                                  │ instancia de una clase.        │
// │    │                                  │ Devuelve true/false            │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 10 │ Override (sobrescritura)         │ Las clases hijas pueden        │
// │    │                                  │ REEMPLAZAR métodos del padre   │
// │    │                                  │ con su propia versión          │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 11 │ Polimorfismo                     │ Tratar objetos de diferentes   │
// │    │                                  │ clases como si fueran del      │
// │    │                                  │ mismo tipo (todos son          │
// │    │                                  │ Vehiculo)                      │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 12 │ reduce()                         │ "Reduce" un array a un solo    │
// │    │                                  │ valor (suma, mínimo, máximo)   │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 13 │ ?. (optional chaining)           │ Accede a propiedades sin error │
// │    │                                  │ si el objeto es null/undefined │
// ├────┼──────────────────────────────────┼────────────────────────────────┤
// │ 14 │ ?? (nullish coalescing)          │ Devuelve un valor por defecto  │
// │    │                                  │ si el valor es null/undefined  │
// └────┴──────────────────────────────────┴────────────────────────────────┘
//
// IDEAS CLAVE:
// 1. Una CLASE es un molde, un OBJETO es la galleta hecha con ese molde
// 2. La HERENCIA evita repetir código: Coche hereda de Vehiculo
// 3. super() es OBLIGATORIO en el constructor de una clase hija
// 4. Los métodos ESTÁTICOS pertenecen a la clase, no a los objetos
// 5. instanceof te dice de qué clase es un objeto (incluyendo herencia)
// 6. El POLIMORFISMO permite tratar objetos diferentes de forma uniforme
// =========================================================================
