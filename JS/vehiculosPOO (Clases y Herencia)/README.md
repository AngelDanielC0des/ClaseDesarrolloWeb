# 🚗 Catálogo de Vehículos - Clases y Herencia (POO)

## 📚 Conceptos que aprenderás

Este ejercicio cubre la **Programación Orientada a Objetos** en JavaScript moderno (ES6+):

### 1. ¿Qué es una Clase?
Una clase es una **plantilla** para crear objetos. Define propiedades (datos) y métodos (funciones).

```javascript
class Persona {
    constructor(nombre, edad) {
        this.nombre = nombre;
        this.edad = edad;
    }
    
    saludar() {
        return `Hola, soy ${this.nombre}`;
    }
}

// Crear una instancia
const ana = new Persona("Ana", 25);
console.log(ana.saludar()); // "Hola, soy Ana"
```

### 2. `class` y `constructor`
- `class` define la plantilla
- `constructor()` se ejecuta automáticamente al usar `new`
- `this` se refiere a la instancia que se está creando

```javascript
class Vehiculo {
    constructor(marca, modelo) {
        this.marca = marca;    // Propiedad de la instancia
        this.modelo = modelo;
    }
}

const coche = new Vehiculo("Toyota", "Corolla");
```

### 3. `extends` - Herencia
Una clase puede **heredar** propiedades y métodos de otra clase padre.

```javascript
class Coche extends Vehiculo {
    constructor(marca, modelo, puertas) {
        super(marca, modelo);  // Llama al constructor del padre
        this.puertas = puertas; // Propiedad específica de Coche
    }
}
```

### 4. `super()` - Llamar al padre
- `super()` en el constructor: llama al constructor del padre (**obligatorio** antes de usar `this`)
- `super.metodo()`: llama a un método del padre

```javascript
class Coche extends Vehiculo {
    constructor(marca, modelo, puertas) {
        super(marca, modelo);  // OBLIGATORIO antes de usar 'this'
        this.puertas = puertas;
    }
    
    toString() {
        return `🚗 ${super.toString()} - ${this.puertas} puertas`;
        //              ↑ Llama al toString() del padre
    }
}
```

### 5. `this` - Referencia a la instancia
`this` se refiere al **objeto actual** (la instancia). Cada objeto tiene su propio `this`.

```javascript
class Contador {
    constructor() {
        this.valor = 0;  // Cada instancia tiene su propio 'valor'
    }
    
    incrementar() {
        this.valor++;    // Modifica el valor de ESTA instancia
        return this.valor;
    }
}

const c1 = new Contador();
const c2 = new Contador();
c1.incrementar(); // 1
c2.incrementar(); // 1 (independiente de c1)
```

### 6. `static` - Métodos de clase
Los métodos estáticos pertenecen a la **clase**, no a las instancias.

```javascript
class MathUtils {
    static sumar(a, b) {
        return a + b;
    }
}

// Se llama en la CLASE, no en la instancia
MathUtils.sumar(2, 3); // 5

// const m = new MathUtils();
// m.sumar(2, 3); // ERROR: m.sumar is not a function
```

### 7. `instanceof` - Comprobar tipo
Comprueba si un objeto es instancia de una clase.

```javascript
const coche = new Coche("Toyota", "Corolla", 4);

coche instanceof Coche;     // true
coche instanceof Vehiculo;  // true (hereda de Vehiculo)
coche instanceof Moto;      // false
```

### 8. Override (Sobrescritura)
Las clases hijas pueden **reemplazar** métodos del padre.

```javascript
class Vehiculo {
    toString() {
        return `${this.marca} ${this.modelo}`;
    }
}

class Coche extends Vehiculo {
    toString() {
        // Sobrescribe el método del padre
        return `🚗 ${super.toString()} - ${this.puertas} puertas`;
    }
}
```

## 🎯 Jerarquía de clases del ejercicio

```
                    ┌─────────────────────┐
                    │   class Vehiculo    │
                    │  (Clase base/padre) │
                    │                     │
                    │ • marca, modelo     │
                    │ • precio, consumo   │
                    │ • calcularAutonomia()│
                    │ • static masBarato()│
                    └─────────┬───────────┘
                              │ extends
            ┌─────────────────┼─────────────────┐
            ▼                 ▼                 ▼
   ┌────────────────┐ ┌──────────────┐ ┌────────────────┐
   │  class Coche   │ │  class Moto  │ │ class Camion   │
   │  + puertas     │ │  + cilindrada│ │  + cargaMaxima │
   │  + aireAcond.  │ │  + tipoMoto  │ │  + ejes        │
   │  + esFamiliar()│ │  + esDeporti.│ │  + esPesado()  │
   └────────────────┘ └──────────────┘ └────────────────┘
```

## 🚀 Cómo ejecutar

1. Abre `index.html` en tu navegador
2. Explora los vehículos de ejemplo ya cargados
3. Añade nuevos vehículos con el formulario
4. Filtra por tipo (coches, motos, camiones)
5. Abre la consola (F12) para ver las demostraciones de POO

## 💡 Comparación: POO vs Funcional

### Enfoque funcional (sin clases)
```javascript
function crearCoche(marca, modelo, puertas) {
    return { marca, modelo, puertas };
}

function calcularAutonomia(coche) {
    return (coche.combustible / coche.consumo) * 100;
}
```

### Enfoque POO (con clases)
```javascript
class Coche extends Vehiculo {
    constructor(marca, modelo, puertas) {
        super(marca, modelo);
        this.puertas = puertas;
    }
    
    calcularAutonomia() {
        return (this.combustible / this.consumo) * 100;
    }
}

const coche = new Coche("Toyota", "Corolla", 4);
coche.calcularAutonomia(); // Método de la instancia
```

## 📝 Ejercicios propuestos

1. Añade una clase `Bicicleta` que herede de `Vehiculo`
2. Implementa un método `comparar(otroVehiculo)` que compare dos vehículos
3. Añade un sistema de "favoritos" con un método `marcarFavorito()`
4. Crea una clase `Garaje` que gestione una colección de vehículos
5. Implementa getters y setters para las propiedades
