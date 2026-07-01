# Calculador de Pólizas de Seguros

API REST en Spring Boot que recibe un JSON con los datos de un seguro
(hogar, vida o salud) y devuelve un JSON con el cálculo de la póliza.
Incluye un frontend HTML servido por la propia app para probarlo
manualmente, validaciones de entrada, manejo global de errores y un
filtro de correlación para trazabilidad.

---

## 1. Stack tecnológico

| Capa | Tecnología |
|------|------------|
| Lenguaje | Java 21 |
| Framework | Spring Boot 4.1.0 |
| Módulo web | `spring-boot-starter-webmvc` |
| Validación | `spring-boot-starter-validation` (Jakarta Bean Validation) |
| Build | Maven (`./mvnw`) |
| Frontend | HTML + CSS + JS vanilla (sin frameworks) |
| Logging | SLF4J + Logback (incluido en Spring Boot) |

No se usan bases de datos, Lombok, Spring Security ni librerías
externas: el proyecto es deliberadamente pequeño y portable.

---

## 2. Estructura del proyecto

```
CalculadorSeguros/
├── pom.xml
├── README.md
└── src/
    ├── main/
    │   ├── java/com/angel/calculadorseguros/
    │   │   ├── CalculadorSegurosApplication.java   # entrypoint de Spring Boot
    │   │   ├── controller/
    │   │   │   └── Controller.java                 # 3 endpoints POST
    │   │   ├── modelo/                             # records de entrada y salida
    │   │   │   ├── SolicitudHogar.java
    │   │   │   ├── SolicitudVida.java
    │   │   │   ├── SolicitudSalud.java
    │   │   │   └── RespuestaPoliza.java
    │   │   ├── servicio/
    │   │   │   └── CalculadorPolizaService.java    # lógica de cálculo
    │   │   ├── filtro/
    │   │   │   └── CorrelationIdFilter.java        # filter HTTP (X-Request-Id)
    │   │   └── error/
    │   │       ├── ApiError.java                   # DTO uniforme de error
    │   │       └── GlobalExceptionHandler.java     # @RestControllerAdvice
    │   └── resources/
    │       ├── application.properties              # puerto + patrón de log
    │       └── static/
    │           ├── index.html                      # estructura del frontend
    │           ├── css/
    │           │   └── styles.css                  # todos los estilos
    │           └── js/
    │               ├── app.js                      # entrypoint, orquesta
    │               ├── ui.js                       # manipulación del DOM
    │               ├── validators.js               # reglas de validación cliente
    │               └── api.js                      # fetch al backend
    └── test/
        └── java/com/angel/calculadorseguros/
            └── CalculadorSegurosApplicationTests.java  # contextLoads()
```

---

## 3. Arquitectura

El proyecto sigue la separación clásica en 3 capas más dos
componentes transversales:

```
   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
   │  Controller  │ ───> │   Service    │ ───> │    Modelo    │
   │  (HTTP in)   │ <─── │  (cálculo)   │ <─── │  (records)   │
   └──────────────┘      └──────────────┘      └──────────────┘
          │                                            ▲
          │ ┌────────────────────────────────────────┐ │
          └►│  Filtro + Advice (transversales)       │◄┘
            └────────────────────────────────────────┘
```

- **Controller**: traduce HTTP a/desde Java. Valida con `@Valid`.
- **Service**: contiene las fórmulas de cálculo. Puro Java, sin
  dependencias de Spring en sus métodos.
- **Modelo**: records inmutables. Los de entrada llevan las
  anotaciones de validación.
- **Filtro**: corre antes y después del controller; tareas
  transversales (en este caso, ID de correlación y logging).
- **Advice**: captura excepciones y las traduce a JSON uniforme.

---

## 4. Cómo ejecutar

Requisitos: Java 21 y Maven (o el wrapper `./mvnw` ya incluido).

```bash
# arrancar
./mvnw spring-boot:run

# o también
./mvnw package
java -jar target/calculador-seguros-0.0.1-SNAPSHOT.jar
```

Una vez arriba:

- Frontend: <http://localhost:8080/>
- API base: `http://localhost:8080/demo/{hogar|vida|salud}`

Puerto configurable en `src/main/resources/application.properties`
(`server.port=8080`).

### 4.1 Smoke test rápido (verificación end-to-end)

Con la app arrancada, en otra terminal:

```bash
# 1) Petición válida → 200
curl -i -X POST http://localhost:8080/demo/hogar \
  -H "Content-Type: application/json" \
  -d '{"metrosCuadrados":80,"anioConstruccion":1995,"valorMercado":150000,"zona":"centro"}'

# 2) Validación falla (metrosCuadrados < 20) → 400 + ApiError con helpUrl
curl -i -X POST http://localhost:8080/demo/hogar \
  -H "Content-Type: application/json" \
  -d '{"metrosCuadrados":5,"anioConstruccion":1995,"valorMercado":150000,"zona":"centro"}'

# 3) JSON malformado → 400 + ApiError con helpUrl
curl -i -X POST http://localhost:8080/demo/hogar \
  -H "Content-Type: application/json" \
  -d '{ mal '

# 4) Extraer solo el helpUrl de un error con jq
curl -s -X POST http://localhost:8080/demo/vida \
  -H "Content-Type: application/json" \
  -d '{"edadAsegurado":10,"capitalSolicitado":100000,"esFumador":false,"esDeportista":true}' \
  | jq -r .helpUrl
# → https://http.cat/400
```

---

## 5. Endpoints

Todos reciben **POST** con un JSON en el body y devuelven
`RespuestaPoliza` con código `200 OK`.

### 5.1 `POST /demo/hogar`

```bash
curl -X POST http://localhost:8080/demo/hogar \
  -H "Content-Type: application/json" \
  -d '{
    "metrosCuadrados": 80,
    "anioConstruccion": 1995,
    "valorMercado": 150000,
    "zona": "centro"
  }'
```

Respuesta:

```json
{
  "tipo": "HOGAR",
  "precioBase": 550.0,
  "factor": 1.0,
  "precioFinal": 550.0,
  "fechaCalculo": "2026-06-30"
}
```

### 5.2 `POST /demo/vida`

```bash
curl -X POST http://localhost:8080/demo/vida \
  -H "Content-Type: application/json" \
  -d '{
    "edadAsegurado": 35,
    "capitalSolicitado": 100000,
    "esFumador": false,
    "esDeportista": true
  }'
```

### 5.3 `POST /demo/salud`

```bash
curl -X POST http://localhost:8080/demo/salud \
  -H "Content-Type: application/json" \
  -d '{
    "edadAsegurado": 30,
    "copagoSeleccionado": 0,
    "coberturaDental": false,
    "coberturaFamiliar": true
  }'
```

---

## 6. Validaciones

Todas se declaran con anotaciones de Jakarta Bean Validation
(`jakarta.validation.constraints.*`) en los records de entrada.
Spring las aplica automáticamente gracias a `@Valid` en el controller.

### `SolicitudHogar`

| Campo | Validación |
|-------|------------|
| `metrosCuadrados` | `@NotNull @Positive @Min(20)` |
| `anioConstruccion` | `@NotNull @Min(1900)` |
| `valorMercado` | `@NotNull @Positive` |
| `zona` | `@NotBlank` |

### `SolicitudVida`

| Campo | Validación |
|-------|------------|
| `edadAsegurado` | `@NotNull @Min(18) @Max(90)` |
| `capitalSolicitado` | `@NotNull @Positive` |
| `esFumador` | `@NotNull` |
| `esDeportista` | `@NotNull` |

### `SolicitudSalud`

| Campo | Validación |
|-------|------------|
| `edadAsegurado` | `@NotNull @Min(0) @Max(120)` |
| `copagoSeleccionado` | `@NotNull @PositiveOrZero` |
| `coberturaDental` | `@NotNull` |
| `coberturaFamiliar` | `@NotNull` |

> **¿Por qué `Integer`/`Double`/`Boolean` y no `int`/`double`/`boolean`?**
> Las anotaciones de validación solo funcionan sobre **tipos objeto
> (wrappers)**, no sobre primitivos. Con un primitivo el campo siempre
> tiene un valor por defecto (`0` o `false`) y `@NotNull` no puede
> distinguir "el cliente no lo envió" de "el cliente envió `0`/`false`".

---

## 7. Manejo de errores

Cualquier error (validación, JSON malformado, excepción inesperada)
se traduce a un JSON uniforme definido en `error/ApiError.java`:

```json
{
  "timestamp": "2026-07-01T12:34:56",
  "status": 400,
  "error": "Bad Request",
  "message": "Los datos enviados no son válidos",
  "path": "/demo/vida",
  "correlationId": "f7c1-...",
  "helpUrl": "https://http.cat/400",
  "fieldErrors": [
    { "field": "edadAsegurado", "message": "edadAsegurado mínima 18" }
  ]
}
```

Casos cubiertos por `GlobalExceptionHandler`:

| Excepción | HTTP | Cuándo se lanza |
|-----------|------|-----------------|
| `MethodArgumentNotValidException` | 400 | `@Valid` detecta un campo que no cumple sus anotaciones |
| `HttpMessageNotReadableException` | 400 | El body no es un JSON válido o los tipos no encajan |
| `Exception` (catch-all) | 500 | Cualquier otra excepción no controlada |

El handler siempre añade:
- `correlationId`: leyéndolo del MDC, de forma que el ID que ve el cliente
  en la respuesta es el mismo que aparecerá en los logs del servidor.
- `helpUrl`: URL pública de [http.cat](https://http.cat/) con la imagen
  del "gato" correspondiente al status. Ver sección 7.1.

La construcción del body de error está centralizada en un helper
privado `build(...)` del propio `GlobalExceptionHandler`, que también
usa `status.getReasonPhrase()` para rellenar el campo `error`
("Bad Request", "Internal Server Error", etc.) en vez de hardcodearlo.

## 7.1. http.cat y el campo `helpUrl`

[http.cat](https://http.cat/) es un servicio público que devuelve
una imagen (un gato) por cada código HTTP: `https://http.cat/400`,
`https://http.cat/500`, etc. Lo usamos para que cada respuesta de
error incluya un enlace accionable: el cliente puede pintar la
imagen, enlazarla, o simplemente mostrársela al desarrollador que
está depurando.

**Cómo se construye la URL**: en el record `ApiError` hay una
constante `HTTP_CAT_BASE = "https://http.cat/"` y un método estático
`helpUrlFor(int status)` que devuelve `HTTP_CAT_BASE + status`.
Los 3 handlers lo invocan al construir el body, así que **toda**
respuesta de error lleva el `helpUrl` correcto sin tener que
duplicar la URL en cada método (DRY).

**Por qué un `String` y no un objeto**: el contrato es simple
("esta es la URL") y mantenerlo como String permite al cliente
usarlo como quiera: como `href` de un `<a>`, como `src` de un
`<img>`, como link en un log, etc.

**Ejemplo de uso desde el cliente**:

```bash
curl -s -X POST http://localhost:8080/demo/vida \
  -H "Content-Type: application/json" \
  -d '{"edadAsegurado":10,"capitalSolicitado":100000,"esFumador":false,"esDeportista":true}' \
  | jq -r .helpUrl
# → https://http.cat/400
```

**Nota sobre CORS en el frontend**: el frontend muestra la imagen
con `<img src="{helpUrl}">` directamente. El navegador carga
imágenes cross-origin sin necesidad de la cabecera
`Access-Control-Allow-Origin` (esa restricción aplica solo a
`fetch`/XHR). Por eso http.cat es trivial de consumir desde el
lado del cliente sin proxy ni configuración adicional.

**Limitación**: si http.cat estuviera caído, la imagen no carga.
Aceptable para el alcance del proyecto; en producción se podría
añadir un fallback (placeholder, proxy interno con caché, etc.).

---

## 8. Filtro de correlación (X-Request-Id)

`CorrelationIdFilter` (extiende `OncePerRequestFilter`) se ejecuta
al inicio de TODA petición HTTP y:

1. Lee la cabecera `X-Request-Id` de la petición o genera un UUID.
2. Lo guarda en el **MDC** de SLF4J y lo añade como cabecera de la
   respuesta (`X-Request-Id`).
3. Loguea método, URI, status y duración.
4. Limpia el MDC en el `finally` para no contaminar el siguiente
   request que reutilice el hilo.

El patrón de log configurado en `application.properties` incluye
el correlation ID en cada línea:

```
17:00:00.123 INFO  [f7c1-...] c.a.c.controller.Controller - ...
```

El frontend `index.html` lee la cabecera `X-Request-Id` de la
respuesta y la muestra por pantalla, de forma que si una petición
falla puedas copiar el ID y buscarlo en los logs.

---

## 9. Fórmulas de cálculo

Definidas en `CalculadorPolizaService`.

### Hogar
```
precioBase = metrosCuadrados * 5 + valorMercado * 0.001
factor     = 1.10  si anioConstruccion < 1980
             1.00  en otro caso
precioFinal = precioBase * factor
```

### Vida
```
precioBase = capitalSolicitado * 0.005 + edadAsegurado * 2
if (esFumador)    precioBase += 100
if (esDeportista) precioBase -= 50
precioFinal = precioBase
```

### Salud
```
precioBase = 50 + edadAsegurado * 1.5
if (copagoSeleccionado > 0)   precioBase += 30
if (coberturaDental)          precioBase += 20
if (coberturaFamiliar)        precioBase += 25
precioFinal = precioBase
```

Todos los importes se redondean a 2 decimales.

---

## 10. Frontend

El frontend vive en `src/main/resources/static/` y se sirve por
Spring Boot en `http://localhost:8080/`. Sigue una arquitectura
modular tipo MVC adaptada al cliente, con un archivo por
responsabilidad:

| Archivo | Responsabilidad |
|---------|----------------|
| `index.html` | Solo estructura HTML: 3 `<form>` con sus inputs y la zona de respuesta. Sin CSS ni JS inline. |
| `css/styles.css` | Todos los estilos (custom properties, cards, estados de error, focus, loading…). |
| `js/app.js` | Entry point. Engancha listeners y orquesta: coordina `ui`, `validators` y `api`. NO toca el HTML directamente salvo para enganchar listeners. |
| `js/ui.js` | Todo lo que lee/escribe del DOM: `construirBody`, `marcarErrores`, `mostrarResultado`, `setLoading`… |
| `js/validators.js` | Reglas de validación (espejo de las anotaciones Jakarta del backend). Función pura `validar(tipo, body) → []` o `[{field, message}]`. |
| `js/api.js` | Único módulo que conoce la URL del backend. Función `calcular(tipo, body) → { status, ok, data, correlationId }`. |

### 10.1 Convenciones del HTML

- Cada form tiene `id="form-{tipo}"` (ej. `form-hogar`).
- Cada input lleva `data-form="{tipo}"` y `data-field="{nombreBackend}"`.
- El botón de envío es `type="submit"` dentro del `<form>`.
- Cada input tiene un `<span class="error-msg">` hermano para
  mostrar el mensaje de error.
- El `app.js` se carga como **módulo ES** con
  `<script type="module" src="js/app.js">` al final del `<body>`.

### 10.2 Flujo de envío

```
click "Calcular"
   │
   ▼
ui.construirBody(tipo)        ← lee los inputs del form correspondiente
   │
   ▼
validators.validar(tipo, body) ← reglas del cliente (espejo del backend)
   │
   ├── errores.length > 0 ──► ui.marcarErrores(errores)
   │                            (resalta input en rojo + mensaje)
   │
   └── errores.length === 0 ──► ui.setLoading(form, true)
                                  api.calcular(tipo, body)
                                  ui.mostrarResultado({...})
                                  ui.setLoading(form, false)
```

### 10.3 Validación en cliente (espejo del backend)

La validación del cliente NO sustituye a la del backend: el backend
sigue siendo la **fuente de verdad** (con `@Valid` + anotaciones
Jakarta). La validación cliente existe para:

- Feedback inmediato (sin tener que ir al servidor).
- Evitar peticiones inútiles con datos obviamente mal.
- UX más agradable.

Las reglas viven en `js/validators.js` como un objeto `REGLAS`
configurable y se procesan con la función pura `validar(tipo, body)`.
Si cambias una restricción en el backend, cámbiala también aquí
para que ambas capas coincidan.

Además, los inputs HTML usan **atributos HTML5** (`required`,
`min`, `max`, `step`) como capa adicional de accesibilidad y como
documentación inline del contrato. El form lleva `novalidate` para
que el navegador no muestre sus tooltips en inglés y se use siempre
la versión en español del JS.

### 10.4 Imagen del gato en errores (http.cat)

Cuando una petición devuelve un error, `ui.js#mostrarResultado`
lee `data.helpUrl` del JSON de error y muestra la imagen del gato
de http.cat en un `<div id="cat">` debajo de la zona de respuesta.
La zona está oculta por defecto (clase `.hidden`) y se muestra solo
si la respuesta es `ok=false` y trae `helpUrl`.

```html
<div id="cat" class="cat hidden" aria-live="polite">
    <img id="cat-img" alt="">
    <p class="cat-caption"></p>
</div>
```

Detalles relevantes:

- Se usa `<img src="...">` (no `fetch`), por lo que NO hay problemas
  de CORS al cargar la imagen desde otro origen.
- El `alt` se rellena con `"HTTP {status} - gato de error (http.cat)"`
  para accesibilidad.
- El caption muestra la URL en monospace, útil para copiarla.
- Si la siguiente respuesta es OK (200), el bloque se vuelve a
  ocultar.
- **Defensa contra URL maliciosa**: `mostrarGato` valida que la
  `helpUrl` empiece por `http://` o `https://` antes de asignarla
  a `img.src`. Evita asignar esquemas peligrosos (`javascript:`,
  `data:`) si el backend fuera comprometido.
- **Defensa contra imagen rota**: si `<img>` falla al cargar
  (http.cat caído, sin red, etc.), el `onerror` oculta el bloque
  para no mostrar un icono de imagen rota al usuario.

### 10.5 Diseño responsive y accesibilidad

El CSS sigue un enfoque **mobile-first**: las reglas base son
para móvil (label encima del input, gato más pequeño) y un
`@media (min-width: 600px)` ENGRANDA el diseño a partir de
tablet/desktop. El frontend se ve bien desde 320px (móvil
pequeño) hasta 1920px+ sin media queries adicionales.

Detalles de accesibilidad:

- `lang="es"` en el `<html>` para que los lectores de pantalla
  usen la pronunciación correcta.
- `aria-live="polite"` en el bloque del gato para que los
  lectores anuncien el cambio cuando aparece.
- `:focus-visible` en inputs y botones: muestra el foco solo
  con teclado, evitando el "outline" antiestético en clicks
  de ratón.
- `min-height: 44px` en inputs y botones (recomendación de
  Apple HIG / Material para touch targets).
- `@media (prefers-reduced-motion: reduce)` desactiva las
  animaciones para usuarios con esa preferencia del sistema.
- `<noscript>` muestra un mensaje claro si JS está deshabilitado.
- Favicon inline (gato SVG) para no hacer una petición extra.

---

## 11. Pruebas

Sólo se incluye el test que Spring Boot genera por defecto
(`@SpringBootTest` + `contextLoads()`) que verifica que el contexto
de la aplicación levanta sin errores de wiring. No hay tests
unitarios ni de integración: el alcance es académico.

Para verificación end-to-end ver la sección **4.1 Smoke test rápido**.

---

## 12. Limitaciones conocidas

- **Sin tests unitarios**: las fórmulas del service y la lógica
  del advice no tienen cobertura automatizada. Ver sección 13.
- **Dependencia externa de http.cat**: si el servicio está caído,
  la imagen del gato no carga (pero el `helpUrl` en el JSON sigue
  siendo válido y el frontend no rompe gracias al `onerror`).
- **Manejo de 404 de rutas inexistentes**: si el cliente pide
  una ruta que no existe (p. ej. `/demo/octopus`), Spring devuelve
  un 404 con su ProblemDetail por defecto, sin pasar por nuestro
  `GlobalExceptionHandler`. Esto se podría cubrir con un handler
  para `NoHandlerFoundException` (ver sección 13).
- **Importes en `double`**: se usa `double` para los precios
  en vez de `BigDecimal`. Suficiente para el alcance del proyecto
  pero NO recomendado para dinero en producción (problemas de
  redondeo con operaciones acumuladas).
- **Sin autenticación**: cualquiera puede llamar a los endpoints.

---

## 13. Posibles mejoras (fuera de alcance)

- Tests unitarios de `CalculadorPolizaService` con JUnit y Mockito.
- Mensajes de validación en español vía `messages.properties`
  (ahora están hardcoded en los records, lo cual es válido pero
  no i18n-friendly).
- Excepciones de negocio propias mapeadas en el `GlobalExceptionHandler`.
- Persistencia con Spring Data JPA para guardar cotizaciones.
- Seguridad con Spring Security + JWT (filtro adicional).
- Documentación interactiva con SpringDoc / OpenAPI / Swagger UI.
- Internacionalización (i18n) de los mensajes de error.
- Capa `repository` para desacoplar el acceso a datos.
- Manejador para `NoHandlerFoundException` (404 de rutas inexistentes)
  que también incluya el `helpUrl` de http.cat.
- Proxy interno `GET /errors/cat/{status}` que devuelva los bytes
  de la imagen, para eliminar la dependencia externa de http.cat
  y permitir un fallback controlado.
- Caché del `helpUrl` por status si http.cat se volviera un SPOF.
- Migrar importes de `double` a `BigDecimal` para precisión exacta.

---

## 14. Licencia

Proyecto académico. Sin licencia específica.
