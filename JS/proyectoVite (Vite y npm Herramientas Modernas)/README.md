# Vite + npm - Herramientas de Desarrollo Modernas

## Objetivo

Aprender a configurar un proyecto web profesional desde cero usando **Node.js**, **npm** (gestor de paquetes) y **Vite** (herramienta de build ultrarrápida). Este es el estándar de la industria en 2024-2025 para cualquier proyecto frontend.

## Conceptos que aprenderás

### 1. Node.js y npm: El ecosistema de herramientas

**Node.js** es un entorno de ejecución de JavaScript fuera del navegador. **npm** (Node Package Manager) es su gestor de paquetes, el registro de librerías más grande del mundo (+2 millones de paquetes).

```
ANTES (sin Node.js):
├── index.html
├── style.css
└── script.js          ← Todo manual, sin dependencias

AHORA (con Node.js + Vite):
├── package.json       ← Manifiesto del proyecto
├── vite.config.js     ← Configuración del bundler
├── index.html
└── src/
    ├── main.js        ← Punto de entrada
    ├── style.css      ← Estilos
    └── utils.js       ← Módulos auxiliares
```

### 2. `package.json` - El manifiesto del proyecto

Es el archivo que describe tu proyecto y gestiona sus dependencias.

```json
{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^6.0.0"
  },
  "dependencies": {
    "dayjs": "^1.11.0"
  }
}
```

**Campos clave:**

| Campo | Qué hace |
|-------|----------|
| `name` | Nombre único del proyecto |
| `version` | Versión semántica (major.minor.patch) |
| `scripts` | Comandos personalizados (`npm run dev`) |
| `dependencies` | Paquetes necesarios en producción |
| `devDependencies` | Paquetes solo para desarrollo |

### 3. Comandos npm esenciales

```bash
npm init -y                    # Crea package.json con valores por defecto
npm install paquete            # Instala y añade a dependencies
npm install -D paquete         # Instala y añade a devDependencies
npm uninstall paquete          # Desinstala un paquete
npm run dev                    # Ejecuta el script "dev" de package.json
npm run build                  # Genera la versión de producción
npm install                    # Instala TODAS las dependencias del package.json
```

### 4. Vite: La herramienta de build moderna

**Vite** (francés para "rápido") es un bundler y dev server creado por Evan You (creador de Vue.js).

```
FLUJO DE TRABAJO CON VITE:

Desarrollo:
  src/main.js ──→ Vite Dev Server ──→ Navegador
  (módulos)       (HMR instantáneo)    (ves los cambios al instante)

Producción:
  src/main.js ──→ Vite Build ──→ dist/
  (módulos)       (bundle +         (archivos optimizados
                   minificación)      listos para subir)
```

**Ventajas sobre alternativas antiguas:**

| Característica | Webpack (antiguo) | Vite (moderno) |
|----------------|-------------------|----------------|
| Inicio del servidor | Lento (bundle todo) | Instantáneo (ESM nativo) |
| Hot Module Replacement | Segundos | Milisegundos |
| Configuración | Compleja (100+ líneas) | Mínima (5-10 líneas) |
| Build para producción | Sí | Sí (con Rollup) |

### 5. Hot Module Replacement (HMR)

HMR permite que los cambios en tu código se reflejen **instantáneamente** en el navegador sin recargar la página completa.

```
Editas utils.js ──→ Vite detecta el cambio ──→ Solo ese módulo se actualiza
                       (sin recargar)            (el estado se preserva)
```

### 6. Importar paquetes de npm

Una vez instalados con `npm install`, puedes importarlos en tu código:

```javascript
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');
const ahora = dayjs().format('dddd, D [de] MMMM [de] YYYY');
```

### 7. Variables de entorno

Vite soporta variables de entorno con el prefijo `VITE_`:

```bash
# .env (archivo de variables de entorno)
VITE_API_URL=https://api.ejemplo.com
VITE_APP_NAME=Mi App
```

```javascript
// En tu código JavaScript:
const apiUrl = import.meta.env.VITE_API_URL;
```

## Cómo ejecutar este ejercicio

### Paso 1: Instalar Node.js

Descarga e instala Node.js desde https://nodejs.org (versión LTS recomendada).

Verifica la instalación:
```bash
node --version    # Debe mostrar v18+ o v20+
npm --version     # Debe mostrar 9+ o 10+
```

### Paso 2: Instalar dependencias

```bash
cd "proyectoVite (Vite y npm Herramientas Modernas)"
npm install
```

Esto lee `package.json` e instala todo lo necesario en `node_modules/`.

### Paso 3: Iniciar servidor de desarrollo

```bash
npm run dev
```

Abre la URL que muestra la terminal (normalmente `http://localhost:5173`).

### Paso 4: Probar el HMR

1. Abre `src/style.css` y cambia un color
2. Observa cómo el navegador se actualiza **instantáneamente** sin recargar
3. Abre `src/main.js` y modifica un texto
4. El cambio aparece al instante

### Paso 5: Build para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` con archivos optimizados (minificados, con hash en el nombre para caché).

```bash
npm run preview
```

Sirve la versión de producción localmente para verificar que todo funciona.

## Estructura del proyecto

```
proyectoVite/
├── index.html              ← HTML principal (Vite lo usa como entrada)
├── package.json            ← Manifiesto y dependencias
├── vite.config.js          ← Configuración de Vite
├── .env                    ← Variables de entorno
├── src/
│   ├── main.js             ← Punto de entrada JS (importa todo)
│   ├── style.css           ← Estilos globales
│   └── utils.js            ← Módulo de utilidades
├── node_modules/           ← Dependencias instaladas (NO subir a Git)
└── dist/                   ← Build de producción (se genera con npm run build)
```

## Buenas prácticas

### Hacer:
- Incluir `node_modules/` y `dist/` en `.gitignore`
- Usar versiones exactas o rangos semánticos en dependencias
- Separar la lógica en módulos dentro de `src/`
- Usar variables de entorno para URLs de APIs y claves

### Evitar:
- Subir `node_modules/` a Git (puede pesar cientos de MB)
- Hardcodear URLs de APIs en el código
- Instalar paquetes innecesarios (cada dependencia es código que mantener)
- Usar `npm install -g` para herramientas del proyecto (mejor como devDependencies)

## Ejercicios propuestos

1. Añade el paquete `lodash-es` y usa alguna de sus funciones
2. Crea un archivo `.env` con una variable `VITE_API_URL` y muéstrala en la UI
3. Añade un nuevo módulo `src/api.js` que haga fetch a una API pública
4. Ejecuta `npm run build` y examina los archivos generados en `dist/`

## Recursos adicionales

- [Documentación oficial de Vite](https://vitejs.dev/)
- [Documentación de npm](https://docs.npmjs.com/)
- [Node.js](https://nodejs.org/)

## Checklist de aprendizaje

- [ ] Entiendo qué es Node.js y por qué es necesario para el desarrollo moderno
- [ ] Sé crear un proyecto con `npm init` y gestionar dependencias
- [ ] Entiendo la diferencia entre `dependencies` y `devDependencies`
- [ ] Sé configurar Vite como herramienta de desarrollo
- [ ] Entiendo el concepto de HMR y sus ventajas
- [ ] Sé importar paquetes de npm en mi código
- [ ] Sé generar un build de producción con `npm run build`
- [ ] Entiendo el propósito de `.gitignore` y `node_modules/`
