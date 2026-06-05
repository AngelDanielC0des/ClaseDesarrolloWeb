// =========================================================================
// LECCIÓN: Desestructuración, Optional Chaining y Nullish Coalescing (ES6+)
// =========================================================================
// Este ejercicio enseña cómo extraer datos de objetos y arrays de forma limpia,
// y cómo acceder a propiedades anidadas de forma segura sin que la app falle
// cuando faltan datos (algo muy común al consumir APIs reales).
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: Los 3 conceptos clave de esta lección
// -------------------------------------------------------------------------
// ┌────────────────────────┬──────────────────────────────┬────────────────────────┐
// │  Concepto              │  ¿Qué hace?                  │  Analogía              │
// ├────────────────────────┼──────────────────────────────┼────────────────────────┤
// │  Desestructuración     │  Extrae propiedades de       │  Sacar objetos de una  │
// │  { prop } = obj        │  objetos en variables        │  mochila y ponerlos    │
// │                        │  independientes              │  sobre la mesa         │
// ├────────────────────────┼──────────────────────────────┼────────────────────────┤
// │  Optional Chaining     │  Accede a propiedades        │  Preguntar "¿existe?"  │
// │  obj?.prop?.sub        │  anidadas sin error si       │  antes de abrir cada   │
// │                        │  algo es null/undefined      │  puerta de una casa    │
// ├────────────────────────┼──────────────────────────────┼────────────────────────┤
// │  Nullish Coalescing    │  Da un valor por defecto     │  Tener un plan B solo  │
// │  valor ?? "default"    │  SOLO si es null/undefined   │  si el plan A no       │
// │                        │  (no con 0, "", false)       │  existe (no si es      │
// │                        │                              │  "malo")               │
// └────────────────────────┴──────────────────────────────┴────────────────────────┘
//
// ¿POR QUÉ SON IMPORTANTES ESTOS CONCEPTOS?
// En el mundo real, las APIs (servidores) casi NUNCA devuelven datos perfectos.
// A veces faltan campos, a veces un usuario no tiene avatar, a veces no tiene
// dirección... Si no manejas estos casos, tu aplicación se ROMPE (crashea).
// Estos operadores son tu "seguro de vida" contra datos incompletos.

// -------------------------------------------------------------------------
// 1. BASE DE DATOS SIMULADA (Diferentes niveles de completitud)
// -------------------------------------------------------------------------
// Simulamos respuestas de servidor con datos incompletos, algo muy habitual
// en aplicaciones reales.
//
// ¿POR QUÉ TENEMOS 4 TIPOS DE USUARIO?
// Porque en la vida real, los datos NUNCA son perfectos. Necesitamos probar
// que nuestro código funciona con:
//
// ┌──────────────┬──────────────────────────────────────────────────────┐
// │  Tipo        │  ¿Qué simula?                                        │
// ├──────────────┼──────────────────────────────────────────────────────┤
// │  completo    │  El caso ideal: todos los campos existen             │
// │  incompleto  │  Caso real: faltan algunos datos opcionales          │
// │  minimo      │  Caso extremo: solo los datos obligatorios           │
// │  nulo        │  Caso de error: el usuario no existe o la API falló  │
// └──────────────┴──────────────────────────────────────────────────────┘
//
// Analogía:
// Imagina que eres un cartero entregando paquetes:
// - completo = Paquete con dirección completa, nombre, teléfono, todo
// - incompleto = Paquete sin código postal (puedes entregarlo, pero cuesta más)
// - minimo = Paquete solo con el nombre del destinatario (tienes que buscarlo)
// - nulo = No hay paquete (el envío falló)
// Tu código debe manejar TODOS estos casos sin romperse.

const usuarios = {
    // Usuario con TODOS los campos completos
    completo: {
        id: 1,
        nombre: "Ana García López",
        email: "ana.garcia@empresa.com",
        edad: 28,
        perfil: {
            avatar: "👩‍💻",
            bio: "Desarrolladora Full Stack apasionada por el código limpio",
            redes: {
                twitter: "@anagarcia",
                github: "anagarcia-dev",
                linkedin: "anagarcialopez"
            }
        },
        habilidades: ["JavaScript", "React", "Node.js", "Python"],
        direccion: {
            calle: "Calle Mayor 123",
            ciudad: "Madrid",
            pais: "España"
        }
    },

    // Usuario con algunos campos faltantes (simula respuesta parcial de API)
    incompleto: {
        id: 2,
        nombre: "Carlos Ruiz",
        email: "carlos@email.com",
        // Falta: edad, perfil.redes, direccion
        perfil: {
            avatar: "👨‍🎨",
            bio: "Diseñador UX/UI"
            // redes no existe
        },
        habilidades: ["Figma", "CSS", "Illustrator"]
    },

    // Usuario con datos mínimos (solo lo obligatorio)
    minimo: {
        id: 3,
        nombre: "María Torres"
        // Todo lo demás es undefined
    },

    // Usuario nulo (simula error de API o usuario no encontrado)
    nulo: null
};

// -------------------------------------------------------------------------
// 2. DESESTRUCTURACIÓN DE OBJETOS (Object Destructuring)
// -------------------------------------------------------------------------
// La desestructuración permite extraer propiedades de objetos en variables
// independientes de forma concisa.
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: Sin destructuring vs Con destructuring
// -------------------------------------------------------------------------
// ┌──────────────────────────────────────┬──────────────────────────────────────┐
// │  SIN destructuring (forma antigua)   │  CON destructuring (forma moderna)   │
// ├──────────────────────────────────────┼──────────────────────────────────────┤
// │  const nombre = usuario.nombre;      │  const { nombre, email, edad }       │
// │  const email = usuario.email;        │      = usuario;                      │
// │  const edad = usuario.edad;          │                                      │
// │  // 3 líneas repetitivas             │  // 1 línea limpia                   │
// └──────────────────────────────────────┴──────────────────────────────────────┘
//
// Analogía:
// Imagina que recibes una caja con objetos dentro (el objeto):
// - SIN destructuring: sacas cada objeto diciendo "este es el nombre de la caja",
//   "este es el email de la caja"... (repetitivo)
// - CON destructuring: abres la caja y sacas todo de golpe, cada cosa en su sitio
//
// ¿QUÉ PASA SI LA PROPIEDAD NO EXISTE?
// La variable será undefined. No da error, simplemente no tiene valor.
// Ejemplo: si usuario no tiene 'edad', entonces edad = undefined.

function demostrarDestructuring(usuario) {
    console.log("\n=== DESESTRUCTURACIÓN DE OBJETOS ===");

    // SIN destructuring (forma antigua y verbosa):
    // const nombre = usuario.nombre;
    // const email = usuario.email;
    // const edad = usuario.edad;
    //
    // Problema: repetimos "usuario." en cada línea. Si el objeto se llamara
    // "datosDelUsuarioRegistradoEnElSistema", sería insoportable.

    // CON destructuring (forma moderna y limpia):
    // Extraemos las propiedades en variables del mismo nombre
    // Las llaves {} indican "quiero estas propiedades de este objeto"
    const { nombre, email, edad } = usuario;
    
    console.log(`Nombre: ${nombre}`);
    console.log(`Email: ${email}`);
    console.log(`Edad: ${edad}`); // undefined si no existe

    // DESESTRUCTURACIÓN CON RENOMBRADO:
    // Si queremos usar un nombre de variable diferente al de la propiedad
    // Sintaxis: { propiedadOriginal: nuevoNombreVariable }
    //
    // ¿CUÁNDO ES ÚTIL?
    // - Cuando el nombre de la propiedad es muy largo o poco claro
    // - Cuando ya tienes otra variable con el mismo nombre
    // - Cuando quieres dar un nombre más descriptivo en tu contexto
    const { nombre: nombreCompleto, id: userId } = usuario;
    console.log(`Nombre completo: ${nombreCompleto}, ID: ${userId}`);

    // DESESTRUCTURACIÓN CON VALORES POR DEFECTO:
    // Si la propiedad no existe, se usa el valor por defecto
    // Sintaxis: { propiedad = valorPorDefecto }
    //
    // ¿CUÁNDO SE USA EL VALOR POR DEFECTO?
    // SOLO cuando la propiedad es undefined (no existe).
    // Si la propiedad existe pero vale null, 0, "" o false, NO se usa el default.
    //
    // ┌────────────────────┬──────────────────────────┐
    // │  Valor en objeto   │  ¿Usa el default?        │
    // ├────────────────────┼──────────────────────────┤
    // │  undefined         │  SÍ (no existe)          │
    // │  null              │  NO (existe, vale null)   │
    // │  0                 │  NO (existe, vale 0)      │
    // │  ""                │  NO (existe, está vacío)  │
    // │  false             │  NO (existe, es false)    │
    // └────────────────────┴──────────────────────────┘
    const { edad: edadUsuario = 18, rol = "usuario" } = usuario;
    console.log(`Edad (con default): ${edadUsuario}, Rol (con default): ${rol}`);
}

// -------------------------------------------------------------------------
// 3. DESESTRUCTURACIÓN ANIDADA
// -------------------------------------------------------------------------
// Podemos desestructurar propiedades de objetos anidados en un solo paso.
//
// ¿QUÉ ES UN OBJETO ANIDADO?
// Es un objeto dentro de otro objeto, como muñecas rusas (matrioskas):
//
// usuario
//   └── perfil (objeto dentro de usuario)
//         └── redes (objeto dentro de perfil)
//               ├── twitter
//               ├── github
//               └── linkedin
//
// Sin destructuring anidado necesitarías:
//   const twitter = usuario.perfil.redes.twitter;
//   const github = usuario.perfil.redes.github;
//
// Con destructuring anidado, lo haces todo en una sola línea.
//
// ¡CUIDADO! Si algún nivel intermedio no existe, da error.
// Por eso usamos = {} como valor por defecto en cada nivel.

function demostrarDestructuringAnidado(usuario) {
    console.log("\n=== DESESTRUCTURACIÓN ANIDADA ===");

    // Extraemos propiedades de múltiples niveles de anidación
    //
    // LEYENDO ESTO DE IZQUIERDA A DERECHA:
    // 1. De 'usuario' extraigo 'nombre' directamente
    // 2. De 'usuario' extraigo 'perfil', y DENTRO de perfil extraigo 'avatar' y 'bio'
    // 3. DENTRO de perfil extraigo 'redes', y DENTRO de redes extraigo 'twitter' y 'github'
    //
    // LOS = {} SON CRUCIALES:
    // Si 'perfil' no existe en el usuario, sin = {} daría error al intentar
    // acceder a avatar dentro de undefined.
    // Con = {} le decimos: "si perfil no existe, usa un objeto vacío como fallback"
    //
    // ¿QUÉ PASARÍA SIN LOS = {}?
    // Con usuario "minimo" (que no tiene perfil):
    //   TypeError: Cannot destructure property 'avatar' of 'undefined'
    //   → La aplicación se ROMPE
    //
    // Con los = {}:
    //   avatar = undefined, bio = undefined, twitter = undefined, github = undefined
    //   → La aplicación SIGUE funcionando
    const { 
        nombre,
        perfil: { 
            avatar, 
            bio,
            redes: { twitter, github } = {} // Valor por defecto si 'redes' no existe
        } = {} // Valor por defecto si 'perfil' no existe
    } = usuario;

    console.log(`Nombre: ${nombre}`);
    console.log(`Avatar: ${avatar}`);
    console.log(`Bio: ${bio}`);
    console.log(`Twitter: ${twitter}`);
    console.log(`GitHub: ${github}`);
}

// -------------------------------------------------------------------------
// 4. DESESTRUCTURACIÓN DE ARRAYS (Array Destructuring)
// -------------------------------------------------------------------------
// Similar a objetos, pero usando corchetes [] y la posición importa.
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: Destructuring de Objetos vs Arrays
// -------------------------------------------------------------------------
// ┌───────────────────────┬──────────────────────────┬──────────────────────────┐
// │  Característica       │  Objetos {}              │  Arrays []               │
// ├───────────────────────┼──────────────────────────┼──────────────────────────┤
// │  ¿Qué importa?        │  El NOMBRE de la prop.   │  La POSICIÓN del elem.   │
// │  Sintaxis             │  const { a, b } = obj    │  const [a, b] = arr      │
// │  Orden                │  No importa              │  SÍ importa              │
// │  Saltar elementos     │  No hace falta           │  Con comas: [, , tercero]│
// │  Capturar el resto    │  No se puede             │  Con ...: [prim, ...rest]│
// └───────────────────────┴──────────────────────────┴──────────────────────────┘
//
// Analogía:
// - Objetos = Un archivador con carpetas etiquetadas: buscas por nombre
// - Arrays = Una fila de personas: identificas a cada una por su posición
//   (el primero, el segundo, el tercero...)

function demostrarArrayDestructuring(usuario) {
    console.log("\n=== DESESTRUCTURACIÓN DE ARRAYS ===");

    // Si usuario.habilidades no existe (undefined), usamos un array vacío []
    // Esto evita errores al intentar desestructurar undefined
    // El operador || significa "O": si lo de la izquierda es falsy, usa lo de la derecha
    const habilidades = usuario.habilidades || [];

    // Extraer por posición (el nombre de variable es libre)
    // A diferencia de los objetos, aquí los nombres NO tienen que coincidir
    // con nada: simplemente se asignan por orden (primero, segundo, tercero...)
    //
    // habilidades = ["JavaScript", "React", "Node.js", "Python"]
    //                  posición 0    posición 1   posición 2   posición 3
    const [primera, segunda, tercera] = habilidades;
    console.log(`Primera habilidad: ${primera}`);
    console.log(`Segunda habilidad: ${segunda}`);
    console.log(`Tercera habilidad: ${tercera}`);

    // Saltar elementos usando comas vacías
    // Cada coma vacía "salta" una posición
    // [, , terceraHabilidad] = saltamos el 1º y el 2º, cogemos el 3º
    const [, , terceraHabilidad] = habilidades;
    console.log(`Solo la tercera: ${terceraHabilidad}`);

    // Usar el operador rest (...) para capturar el resto
    // El operador rest (...) recoge TODOS los elementos restantes en un array
    //
    // habilidades = ["JavaScript", "React", "Node.js", "Python"]
    //                  ▲              └──────── restoHabilidades ────────┘
    //                  │                    ["React", "Node.js", "Python"]
    //          primeraHabilidad
    //
    // ¿CUÁNDO ES ÚTIL?
    // Cuando quieres separar el primer elemento del resto.
    // Ejemplo: en una lista de puntuaciones, quieres la más alta (primera)
    // y luego el resto para calcular la media.
    const [primeraHabilidad, ...restoHabilidades] = habilidades;
    console.log(`Primera: ${primeraHabilidad}`);
    console.log(`Resto: ${restoHabilidades}`);
}

// -------------------------------------------------------------------------
// 5. OPTIONAL CHAINING (?.) - Acceso seguro a propiedades
// -------------------------------------------------------------------------
// El operador ?. permite acceder a propiedades anidadas sin riesgo de error
// si alguna propiedad intermedia es null o undefined.
// Si la cadena se rompe, devuelve undefined en lugar de lanzar un error.
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: Sin ?. vs Con ?.
// -------------------------------------------------------------------------
// ┌──────────────────────────────────┬──────────────────────────────────────┐
// │  SIN Optional Chaining           │  CON Optional Chaining               │
// ├──────────────────────────────────┼──────────────────────────────────────┤
// │  usuario.perfil.redes.twitter    │  usuario?.perfil?.redes?.twitter     │
// │  Si 'redes' no existe:           │  Si 'redes' no existe:               │
// │  → TypeError: Cannot read        │  → Devuelve undefined                │
// │    property 'twitter' of         │  → La app SIGUE funcionando          │
// │    undefined                     │                                      │
// │  → La app se ROMPE               │                                      │
// └──────────────────────────────────┴──────────────────────────────────────┘
//
// -------------------------------------------------------------------------
// FLUJO VISUAL DE ?.:
// -------------------------------------------------------------------------
// usuario?.perfil?.redes?.twitter
//    │         │        │        │
//    │         │        │        └── Si llegamos aquí, devuelve twitter
//    │         │        └── ¿redes es null/undefined? → undefined (para)
//    │         └── ¿perfil es null/undefined? → undefined (para)
//    └── ¿usuario es null/undefined? → undefined (para)
//
// Analogía:
// Imagina que quieres abrir una caja fuerte dentro de un armario dentro de una habitación:
// - Sin ?.: Vas directo a la caja. Si la habitación no existe, te estrellas contra la pared
// - Con ?.: Primero miras si la habitación existe. Si no, te paras. Si sí, miras si el
//   armario existe. Si no, te paras. Y así sucesivamente.
//
// ¿DÓNDE SE PUEDE USAR ?.?
// ┌──────────────────────┬──────────────────────────────────────────────┐
// │  Contexto            │  Ejemplo                                     │
// ├──────────────────────┼──────────────────────────────────────────────┤
// │  Propiedades         │  usuario?.perfil?.bio                        │
// │  Métodos             │  usuario?.saludar?.()                        │
// │  Arrays              │  usuario?.habilidades?.[0]                   │
// └──────────────────────┴──────────────────────────────────────────────┘

function demostrarOptionalChaining(usuario) {
    console.log("\n=== OPTIONAL CHAINING (?.) ===");

    // SIN optional chaining (peligroso - lanza error si algo es null/undefined):
    // const twitter = usuario.perfil.redes.twitter; // Error si 'redes' no existe
    //
    // Si ejecutas la línea de arriba con el usuario "minimo" (que no tiene perfil),
    // JavaScript lanza: TypeError: Cannot read properties of undefined (reading 'redes')
    // Y tu aplicación se DETIENE completamente.

    // CON optional chaining (seguro - devuelve undefined si algo falla):
    // Cada ?. es un "punto de control": si lo de antes es null/undefined, para.
    const twitter = usuario?.perfil?.redes?.twitter;
    console.log(`Twitter (seguro): ${twitter}`);

    // Funciona también con métodos y propiedades de string:
    // .length es una propiedad de los strings que dice cuántos caracteres tienen
    // Si bio no existe, bio?.length será undefined (no da error)
    const longitudBio = usuario?.perfil?.bio?.length;
    console.log(`Longitud de bio: ${longitudBio}`);

    // Y con arrays:
    // ?.[] accede a un índice del array de forma segura
    // Si habilidades no existe, devuelve undefined en vez de dar error
    const primeraHabilidad = usuario?.habilidades?.[0];
    console.log(`Primera habilidad: ${primeraHabilidad}`);
}

// -------------------------------------------------------------------------
// 6. NULLISH COALESCING (??) - Valores por defecto seguros
// -------------------------------------------------------------------------
// El operador ?? devuelve el valor de la derecha SOLO si el de la izquierda
// es null o undefined (a diferencia de || que también actúa con 0, "", false).
//
// -------------------------------------------------------------------------
// TABLA COMPARATIVA: || vs ?? (¡MUY IMPORTANTE!)
// -------------------------------------------------------------------------
// ┌────────────────────┬───────────────────┬───────────────────┐
// │  Valor izquierdo   │  valor || "def"   │  valor ?? "def"   │
// ├────────────────────┼───────────────────┼───────────────────┤
// │  undefined         │  "def"            │  "def"            │
// │  null              │  "def"            │  "def"            │
// │  0                 │  "def" ← ¡MAL!    │  0 ← ¡BIEN!       │
// │  ""                │  "def" ← ¡MAL!    │  "" ← ¡BIEN!      │
// │  false             │  "def" ← ¡MAL!    │  false ← ¡BIEN!   │
// │  "hola"            │  "hola"           │  "hola"           │
// │  42                │  42               │  42               │
// └────────────────────┴───────────────────┴───────────────────┘
//
// Analogía:
// - || es como un padre sobreprotector: si sacas un 0 en un examen, te dice
//   "no pasa nada, te doy un 5" (cuando el 0 es un resultado válido)
// - ?? es como un padre razonable: solo te ayuda si NO tienes nota (null/undefined),
//   pero si tienes un 0, respeta tu 0
//
// ¿CUÁNDO USAR CADA UNO?
// - Usa || cuando CUALQUIER valor falsy deba ser reemplazado
// - Usa ?? cuando SOLO null/undefined deban ser reemplazados
// - En la mayoría de casos con datos de API, ?? es la opción correcta

function demostrarNullishCoalescing(usuario) {
    console.log("\n=== NULLISH COALESCING (??) ===");

    // Diferencia entre || y ??:
    // Si edad fuera 0 (un bebé recién nacido):
    // - || lo trataría como "falso" y pondría 18 (INCORRECTO)
    // - ?? lo respeta como valor válido y mantiene 0 (CORRECTO)
    const edadConOR = usuario.edad || 18; // Si edad es 0, usaría 18 (incorrecto)
    const edadConNullish = usuario.edad ?? 18; // Si edad es 0, mantiene 0 (correcto)
    
    console.log(`Edad con ||: ${edadConOR}`);
    console.log(`Edad con ??: ${edadConNullish}`);

    // Uso común: valores por defecto para mostrar en UI
    // Combinamos ?. (acceso seguro) con ?? (valor por defecto)
    // Esta combinación es MUY frecuente en aplicaciones reales:
    //
    // usuario?.perfil?.bio → intenta acceder a bio de forma segura
    // ?? "Sin biografía"  → si no existe, muestra texto alternativo
    //
    // Es como decir: "Intenta leer la bio. Si no puedes, muestra 'Sin biografía'"
    const bio = usuario?.perfil?.bio ?? "Sin biografía disponible";
    const ciudad = usuario?.direccion?.ciudad ?? "Ciudad no especificada";
    
    console.log(`Bio: ${bio}`);
    console.log(`Ciudad: ${ciudad}`);
}

// -------------------------------------------------------------------------
// 7. FUNCIÓN PRINCIPAL: Renderizar tarjeta de perfil
// -------------------------------------------------------------------------
// Esta función combina TODOS los conceptos aprendidos para renderizar
// una tarjeta de usuario de forma segura, sin importar qué datos falten.
//
// Es la función más importante del ejercicio porque demuestra cómo se usan
// juntos el destructuring, optional chaining y nullish coalescing en una
// situación real.
//
// FLUJO DE LA FUNCIÓN:
// 1. Comprueba si el usuario existe (guard clause)
// 2. Extrae datos con destructuring + valores por defecto
// 3. Usa optional chaining + nullish coalescing para datos específicos
// 4. Genera el HTML de la tarjeta
// 5. Llama a las funciones de demostración en consola

function renderizarPerfil(usuario) {
    const contenedor = document.getElementById('perfilContenido');
    const log = document.getElementById('logExtraccion');
    
    // Limpiamos el log
    log.innerHTML = '';

    // GUARD CLAUSE: Si el usuario es null/undefined, mostramos mensaje de error
    //
    // ¿QUÉ ES UN GUARD CLAUSE?
    // Es una comprobación al inicio de la función que detecta casos inválidos
    // y sale inmediatamente con return.
    //
    // ¿POR QUÉ ES IMPORTANTE?
    // Porque si intentamos desestructurar null, JavaScript lanza un error:
    //   TypeError: Cannot destructure property 'nombre' of 'null'
    // Con el guard clause, evitamos ese error antes de que ocurra.
    //
    // Analogía:
    // Es como mirar si hay agua en la piscina ANTES de tirarte de cabeza.
    // Si no hay agua (null), no saltas (return). Si hay agua, sigues adelante.
    if (!usuario) {
        contenedor.innerHTML = `
            <div class="perfil-card">
                <div class="perfil-avatar">❌</div>
                <div class="perfil-info">
                    <h3>Usuario no encontrado</h3>
                    <p class="email">Los datos del usuario no están disponibles</p>
                </div>
            </div>
        `;
        addLog("Error: usuario es null o undefined", "error");
        return;
    }

    // DESESTRUCTURACIÓN con valores por defecto
    //
    // Esta es la desestructuración más compleja del ejercicio.
    // Extraemos datos de múltiples niveles, con valores por defecto en cada uno.
    //
    // ESTRUCTURA QUE ESTAMOS DESESTRUCTURANDO:
    // usuario
    //   ├── nombre (string)
    //   ├── email (string)
    //   ├── edad (number | undefined)
    //   ├── perfil (object | undefined)
    //   │     ├── avatar (string)
    //   │     ├── bio (string)
    //   │     └── redes (object | undefined)
    //   ├── habilidades (array | undefined)
    //   └── direccion (object | undefined)
    //         ├── ciudad (string)
    //         └── pais (string)
    //
    // CADA = {} o = "texto" es un "paracaídas":
    // si la propiedad no existe, se usa ese valor en vez de romperse.
    const {
        nombre = "Sin nombre",
        email = "Sin email",
        edad,
        perfil: {
            avatar = "👤",
            bio = "Sin biografía",
            redes = {}
        } = {},
        habilidades = [],
        direccion: {
            ciudad = "Desconocida",
            pais = "Desconocido"
        } = {}
    } = usuario;

    // OPTIONAL CHAINING + NULLISH COALESCING para datos específicos
    //
    // Esta es la COMBINACIÓN ESTRELLA de JavaScript moderno:
    // ?. accede de forma segura (no da error si algo no existe)
    // ?? proporciona un valor alternativo si el resultado es null/undefined
    //
    // LEYENDO LA PRIMERA LÍNEA:
    // usuario?.perfil?.redes?.twitter ?? "No disponible"
    //   1. Intenta acceder a usuario (si es null → undefined)
    //   2. Intenta acceder a .perfil (si no existe → undefined)
    //   3. Intenta acceder a .redes (si no existe → undefined)
    //   4. Intenta acceder a .twitter (si no existe → undefined)
    //   5. Si el resultado final es null/undefined → usa "No disponible"
    const twitter = usuario?.perfil?.redes?.twitter ?? "No disponible";
    const github = usuario?.perfil?.redes?.github ?? "No disponible";
    const linkedin = usuario?.perfil?.redes?.linkedin ?? "No disponible";

    // Log de extracción de datos
    // Usamos operadores ternarios (condición ? valorSiTrue : valorSiFalse)
    // para mostrar un icono diferente según si el dato existe o no:
    // ✓ = dato encontrado (verde)
    // ⚠ = dato no encontrado (amarillo)
    addLog(`✓ Nombre extraído: ${nombre}`, "success");
    addLog(`✓ Email extraído: ${email}`, "success");
    addLog(`${edad ? '✓' : '⚠'} Edad: ${edad ?? 'No especificada'}`, edad ? "success" : "warning");
    addLog(`✓ Avatar: ${avatar}`, "success");
    addLog(`${bio !== "Sin biografía" ? '✓' : '⚠'} Bio: ${bio}`, bio !== "Sin biografía" ? "success" : "warning");
    addLog(`⚠ Twitter: ${twitter}`, twitter === "No disponible" ? "warning" : "success");
    addLog(`⚠ GitHub: ${github}`, github === "No disponible" ? "warning" : "success");
    addLog(`✓ Habilidades: ${habilidades.length} encontradas`, habilidades.length > 0 ? "success" : "warning");

    // Renderizar las habilidades usando map()
    //
    // OPERADOR TERNARIO (? :)
    // Es un if/else en una sola línea:
    //   condición ? valorSiTrue : valorSiFalse
    //
    // Si hay habilidades: las transformamos en etiquetas HTML con map()
    // Si no hay: mostramos una etiqueta "Sin habilidades"
    //
    // .join('') une todos los elementos del array en un solo string
    // sin separador entre ellos. Es necesario porque map() devuelve un array
    // de strings, y necesitamos un solo string para insertar en innerHTML.
    const tagsHTML = habilidades.length > 0
        ? habilidades.map(hab => `<span class="tag">${hab}</span>`).join('')
        : '<span class="tag">Sin habilidades</span>';

    // Renderizar la tarjeta completa
    contenedor.innerHTML = `
        <div class="perfil-card">
            <div class="perfil-avatar">${avatar}</div>
            <div class="perfil-info">
                <h3>${nombre}</h3>
                <p class="email">${email}</p>
                
                <div class="perfil-detalles">
                    <div class="detalle-item">
                        <label>Edad</label>
                        <span>${edad ?? "No especificada"}</span>
                    </div>
                    <div class="detalle-item">
                        <label>Ciudad</label>
                        <span>${ciudad}</span>
                    </div>
                    <div class="detalle-item">
                        <label>País</label>
                        <span>${pais}</span>
                    </div>
                    <div class="detalle-item">
                        <label>Twitter</label>
                        <span>${twitter}</span>
                    </div>
                    <div class="detalle-item">
                        <label>GitHub</label>
                        <span>${github}</span>
                    </div>
                    <div class="detalle-item">
                        <label>LinkedIn</label>
                        <span>${linkedin}</span>
                    </div>
                </div>

                <div class="perfil-tags">
                    <h4>Habilidades</h4>
                    <div class="tags-container">${tagsHTML}</div>
                </div>
            </div>
        </div>
    `;

    // Demostraciones en consola
    demostrarDestructuring(usuario);
    demostrarDestructuringAnidado(usuario);
    demostrarArrayDestructuring(usuario);
    demostrarOptionalChaining(usuario);
    demostrarNullishCoalescing(usuario);
}

// -------------------------------------------------------------------------
// 8. FUNCIÓN AUXILIAR: Añadir línea al log visual
// -------------------------------------------------------------------------
// Esta función crea una nueva línea en el panel de "log" (registro) visual.
// Es como un "diario" que muestra qué datos se extrajeron correctamente
// y cuáles faltan.
//
// ¿POR QUÉ UNA FUNCIÓN AUXILIAR?
// Porque la vamos a llamar muchas veces (una por cada dato).
// En vez de repetir el mismo código 10 veces, lo metemos en una función
// y la llamamos con diferentes parámetros.
// Esto se llama principio DRY: Don't Repeat Yourself (No te repitas).
function addLog(mensaje, tipo) {
    const log = document.getElementById('logExtraccion');
    const linea = document.createElement('div');
    // className con template literal para añadir la clase del tipo
    // Resultado: "log-line success", "log-line warning", o "log-line error"
    // Cada clase tiene un color diferente en CSS (verde, amarillo, rojo)
    linea.className = `log-line ${tipo}`;
    linea.textContent = mensaje;
    log.appendChild(linea);
}

// -------------------------------------------------------------------------
// 9. FUNCIÓN GLOBAL: Cargar usuario (llamada desde los botones)
// -------------------------------------------------------------------------
// Esta función se llama cuando el usuario hace clic en un botón.
// Recibe el tipo de usuario ("completo", "incompleto", "minimo", "nulo")
// y carga sus datos para renderizar el perfil.
//
// ¿POR QUÉ ES UNA FUNCIÓN "GLOBAL"?
// Porque se llama desde el HTML con onclick="cargarUsuario('completo')".
// Para que el HTML pueda encontrarla, debe estar en el ámbito global
// (fuera de cualquier otra función).
//
// usuarios[tipo] usa NOTACIÓN DE CORCHETES para acceder a una propiedad
// de forma dinámica. Es equivalente a:
//   tipo = "completo" → usuarios["completo"] → usuarios.completo
//   tipo = "nulo"     → usuarios["nulo"]     → usuarios.nulo
function cargarUsuario(tipo) {
    const usuario = usuarios[tipo];
    renderizarPerfil(usuario);
}

// -------------------------------------------------------------------------
// RESUMEN DE CONCEPTOS APRENDIDOS
// -------------------------------------------------------------------------
//
// ┌─────┬───────────────────────────────┬────────────────────────────────────────┐
// │  #  │  Concepto                     │  Idea clave                            │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  1  │  Object Destructuring         │  const { prop1, prop2 } = objeto;      │
// │     │                               │  Extrae propiedades en variables       │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  2  │  Destructuring con renombre   │  const { prop: nuevo } = objeto;       │
// │     │                               │  Extrae con otro nombre de variable    │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  3  │  Destructuring con default    │  const { prop = "def" } = objeto;      │
// │     │                               │  Valor por defecto si es undefined     │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  4  │  Destructuring anidado        │  const { obj: { prop } = {} } = obj;   │
// │     │                               │  Extrae de objetos dentro de objetos   │
// │     │                               │  ¡Siempre poner = {} como paracaídas!  │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  5  │  Array Destructuring          │  const [primero, segundo] = array;     │
// │     │                               │  Extrae por POSICIÓN, no por nombre    │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  6  │  Rest operator en arrays      │  const [primero, ...resto] = array;    │
// │     │                               │  Captura todos los restantes en array  │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  7  │  Optional Chaining (?.)       │  objeto?.propiedad?.anidada            │
// │     │                               │  Acceso seguro: no da error si falta   │
// │     │                               │  Devuelve undefined en vez de crashear │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  8  │  Nullish Coalescing (??)      │  valor ?? "default"                    │
// │     │                               │  Solo reemplaza null/undefined         │
// │     │                               │  NO reemplaza 0, "", false             │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │  9  │  Guard Clause                 │  if (!dato) return;                    │
// │     │                               │  Salir pronto si los datos son malos   │
// │     │                               │  Evita errores antes de que ocurran    │
// ├─────┼───────────────────────────────┼────────────────────────────────────────┤
// │ 10  │  Operador Ternario (? :)      │  condición ? valorTrue : valorFalse    │
// │     │                               │  Un if/else en una sola línea          │
// └─────┴───────────────────────────────┴────────────────────────────────────────┘
//
// LA COMBINACIÓN ESTRELLA:
// usuario?.perfil?.redes?.twitter ?? "No disponible"
//   → Intenta acceder de forma segura + da un valor alternativo si no existe
//   → Es el patrón más usado en aplicaciones reales con datos de APIs
//
// CONSEJO FINAL:
// Siempre que trabajes con datos que vienen de fuera (APIs, formularios,
// bases de datos), asume que PUEDEN faltar campos. Usa ?. y ?? para que
// tu aplicación NUNCA se rompa por datos incompletos.
// -------------------------------------------------------------------------
