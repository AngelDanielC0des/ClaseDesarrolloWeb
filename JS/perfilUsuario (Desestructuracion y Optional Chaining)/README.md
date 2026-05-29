# 👤 Perfil de Usuario - Desestructuración y Optional Chaining

## 📚 Conceptos que aprenderás

Este ejercicio cubre las herramientas esenciales de ES6+ para trabajar con objetos y acceder a datos de forma segura:

### 1. Object Destructuring (Desestructuración de Objetos)
Extrae propiedades de objetos en variables independientes.

```javascript
const persona = { nombre: "Ana", edad: 25, ciudad: "Madrid" };

// SIN destructuring (verboso)
const nombre = persona.nombre;
const edad = persona.edad;

// CON destructuring (limpio)
const { nombre, edad, ciudad } = persona;
```

### 2. Destructuring con valores por defecto
Si la propiedad no existe, se usa el valor por defecto.

```javascript
const { nombre, edad = 18, rol = "usuario" } = persona;
// Si persona no tiene 'edad', será 18
// Si persona no tiene 'rol', será "usuario"
```

### 3. Destructuring con renombre
Extraer una propiedad con un nombre de variable diferente.

```javascript
const { nombre: nombreCompleto, id: userId } = persona;
// La variable se llama 'nombreCompleto' pero extrae 'nombre'
```

### 4. Destructuring anidado
Extraer propiedades de objetos dentro de objetos.

```javascript
const usuario = {
    perfil: {
        bio: "Desarrolladora",
        redes: { twitter: "@ana" }
    }
};

const { perfil: { bio, redes: { twitter } = {} } = {} } = usuario;
// Los = {} son valores por defecto si el objeto padre no existe
```

### 5. Array Destructuring (Desestructuración de Arrays)
Extrae elementos por posición.

```javascript
const colores = ["rojo", "verde", "azul"];

const [primero, segundo, tercero] = colores;
// primero = "rojo", segundo = "verde", tercero = "azul"

// Saltar elementos
const [, , tercero] = colores; // tercero = "azul"

// Rest operator para capturar el resto
const [primero, ...resto] = colores;
// primero = "rojo", resto = ["verde", "azul"]
```

### 6. Optional Chaining `?.` (Encadenamiento opcional)
Accede a propiedades anidadas sin riesgo de error si algo es `null` o `undefined`.

```javascript
const usuario = { perfil: { bio: "Hola" } };

// SIN optional chaining (peligroso)
const twitter = usuario.perfil.redes.twitter; // Error: redes es undefined

// CON optional chaining (seguro)
const twitter = usuario?.perfil?.redes?.twitter; // undefined (sin error)

// Funciona con métodos
const longitud = usuario?.perfil?.bio?.length;

// Y con arrays
const primero = usuario?.habilidades?.[0];
```

### 7. Nullish Coalescing `??` (Fusión nullish)
Devuelve el valor de la derecha **solo** si el de la izquierda es `null` o `undefined`.

```javascript
// Diferencia clave con ||
const edad = 0;

const conOR = edad || 18;        // 18 (incorrecto: 0 es falsy)
const conNullish = edad ?? 18;   // 0 (correcto: 0 no es null/undefined)

// Uso común
const bio = usuario?.perfil?.bio ?? "Sin biografía";
```

## 🎯 Funcionalidades del ejercicio

- **4 usuarios de prueba**: Completo, incompleto, mínimo y nulo
- **Renderizado seguro**: Nunca falla aunque falten datos
- **Log visual**: Muestra qué datos se extrajeron correctamente
- **Consola didáctica**: Explicaciones detalladas de cada concepto

## 🚀 Cómo ejecutar

1. Abre `index.html` en tu navegador
2. Haz clic en cada botón para cargar diferentes usuarios
3. Observa cómo la tarjeta se adapta a los datos disponibles
4. Abre la consola (F12) para ver las explicaciones detalladas

## 💡 Casos de uso reales

### Consumo de APIs
Las APIs raramente devuelven todos los campos. Con optional chaining y destructuring puedes manejar datos incompletos sin errores:

```javascript
async function cargarUsuario(id) {
    const response = await fetch(`/api/users/${id}`);
    const usuario = await response.json();
    
    // Seguro aunque falten campos
    const { nombre, email, perfil: { avatar } = {} } = usuario;
    const twitter = usuario?.redes?.twitter ?? "No disponible";
}
```

### Formularios con datos opcionales
```javascript
const formData = {
    nombre: "Ana",
    // telefono no se rellenó
};

const { nombre, telefono = "No proporcionado" } = formData;
```

## 📝 Ejercicios propuestos

1. Añade un campo "experiencia" (array de objetos) y desestructúralo
2. Implementa una función que combine datos de dos usuarios diferentes
3. Crea un formulario que use destructuring para extraer todos los campos
4. Añade validaciones usando optional chaining para campos anidados profundos
