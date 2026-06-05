# Lección: Verificador Oficial DNI y NIE con JavaScript

Esta lección documenta el desarrollo de un validador funcional de documentos de identidad españoles (DNI clásico y NIE para extranjeros). Implementamos tanto la maquetación (Bootstrap) como el algoritmo matemático del Ministerio del Interior.

## 🎯 Objetivos de la Lección
1. **Algoritmia del Mundo Real:** Entender y programar el sistema oficial de verificación "Módulo 23" para asignar letras de control.
2. **Transformación de Strings:** Extraer prefijos del NIE (X, Y, Z), sustituirlos por equivalentes numéricos (0, 1, 2) mediante `startsWith()` y `slice()`, y castear de `String` a `Number`.
3. **Validación HTML5 (Regex):** Aplicar atributos avanzados de validación directamente en las etiquetas `<input>`: `pattern="([XYZxyz][0-9]{7}|[0-9]{8})"`, previniendo envíos si el formato es inválido antes de que actúe JS.
4. **Protección del DOM:** Utilizar etiquetas `<template>` ocultas que el usuario no puede alterar accidentalmente, las cuales clonamos en JavaScript con `template.content.cloneNode(true)`.
5. **Limpieza de Nodos JS:** Aplicar métodos modernos del DOM como `replaceChildren()` para vaciar un contenedor rápidamente y evitar concatenaciones infinitas de mensajes de error al pulsar múltiples veces el botón.

## 📂 Archivos del Ejercicio
* **`index.html`:** Formulario responsivo montado sobre Bootstrap 5 con reglas estrictas de validación Regex nativas e interfaces de plantilla inerte (`<template>`).
* **`script.js`:** Lógica de saneamiento de datos (`trim`, `toUpperCase`), conversión (NIE a Num), cálculo matemático (Módulo 23 sobre la secuencia oficial) y manipulación del árbol DOM.
