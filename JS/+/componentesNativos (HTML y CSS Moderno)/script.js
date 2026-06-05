// =========================================================================
// LECCIÓN: HTML y CSS Moderno (2023-2024)
// =========================================================================
// Este archivo es MUY CORTO porque la magia está en el HTML y CSS.
// La mayoría de las features modernas de HTML/CSS NO necesitan JavaScript.
//
// CONCEPTOS QUE APRENDERÁS:
// 1. Popover API (HTML) - Popovers nativos sin JS
// 2. CSS :has() - Parent selector
// 3. Container Queries - Responsive por contenedor
// 4. CSS Nesting - Anidamiento nativo
//
// ¿Por qué son importantes?
// - Reducen la necesidad de JavaScript
// - Son más accesibles y performantes
// - Son el futuro del desarrollo web
// =========================================================================

// -------------------------------------------------------------------------
// 1. POPOVER API - Eventos opcionales
// -------------------------------------------------------------------------
// La Popover API funciona SIN JavaScript, pero podemos escuchar eventos
// para añadir lógica adicional (analytics, animaciones, etc.).
//
// EVENTOS DISPONIBLES:
// - 'beforetoggle': Se dispara ANTES de mostrar/ocultar
// - 'toggle': Se dispara DESPUÉS de mostrar/ocultar
//
// MÉTODOS DISPONIBLES:
// - element.showPopover(): Muestra el popover
// - element.hidePopover(): Oculta el popover
// - element.togglePopover(): Alterna mostrar/ocultar
// -------------------------------------------------------------------------

// Escuchamos eventos de todos los popovers
document.querySelectorAll('[popover]').forEach(popover => {
    
    // Evento: Antes de mostrar/ocultar
    popover.addEventListener('beforetoggle', (event) => {
        console.log(`Popover "${popover.id}" - beforetoggle`);
        console.log(`  Nueva acción: ${event.newState}`);  // 'open' o 'closed'
        
        // Podríamos cancelar la apertura con event.preventDefault()
        // if (algunaCondicion) event.preventDefault();
    });
    
    // Evento: Después de mostrar/ocultar
    popover.addEventListener('toggle', (event) => {
        console.log(`Popover "${popover.id}" - toggle`);
        console.log(`  Estado anterior: ${event.oldState}`);
        console.log(`  Estado nuevo: ${event.newState}`);
    });
});

// -------------------------------------------------------------------------
// 2. CSS :has() - Ejemplos adicionales en consola
// -------------------------------------------------------------------------
// :has() es tan potente que merece ejemplos adicionales.
// -------------------------------------------------------------------------

console.log('\n=== CSS :has() - EJEMPLOS ADICIONALES ===\n');

console.log('SELECTORES ÚTILES CON :has():');
console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│  Selector                      │  Qué selecciona           │');
console.log('├─────────────────────────────────────────────────────────────┤');
console.log('│  .card:has(img)                │  Cards con imagen          │');
console.log('│  .card:has(button:disabled)    │  Cards con botón disabled  │');
console.log('│  form:has(input:invalid)       │  Forms con campos inválidos│');
console.log('│  .list:has(> li:nth-child(5))  │  Lists con 5+ items        │');
console.log('│  .parent:has(.child, .other)   │  Parents con child O other │');
console.log('│  .card:not(:has(img))          │  Cards SIN imagen          │');
console.log('└─────────────────────────────────────────────────────────────┘');

console.log('\nCASOS DE USO REALES:');
console.log('1. Resaltar formularios con errores:');
console.log('   form:has(input:invalid) { border-color: red; }');
console.log('\n2. Ocultar secciones vacías:');
console.log('   .section:not(:has(> *)) { display: none; }');
console.log('\n3. Estilizar labels según el estado del input:');
console.log('   label:has(+ input:focus) { color: blue; }');
console.log('\n4. Cambiar layout según contenido:');
console.log('   .card:has(img) { grid-template-columns: 1fr 2fr; }');

// -------------------------------------------------------------------------
// 3. CONTAINER QUERIES - Ejemplos adicionales
// -------------------------------------------------------------------------

console.log('\n=== CONTAINER QUERIES - EJEMPLOS ADICIONALES ===\n');

console.log('DIFERENCIA CON MEDIA QUERIES:');
console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│  Media Queries              │  Container Queries            │');
console.log('├─────────────────────────────────────────────────────────────┤');
console.log('│  @media (min-width: 768px)  │  @container (min-width: 400px)│');
console.log('│  Basado en la VENTANA       │  Basado en el CONTENEDOR      │');
console.log('│  Global (afecta a todo)     │  Local (solo al contenedor)   │');
console.log('│  Componentes NO reutilizables│  Componentes reutilizables   │');
console.log('└─────────────────────────────────────────────────────────────┘');

console.log('\nUNIDADES DE CONTAINER QUERY:');
console.log('- cqw: 1% del ancho del contenedor');
console.log('- cqh: 1% de la altura del contenedor');
console.log('- cqi: 1% del tamaño inline del contenedor');
console.log('- cqb: 1% del tamaño block del contenedor');
console.log('\nEjemplo: font-size: 5cqi; (5% del ancho del contenedor)');

// -------------------------------------------------------------------------
// 4. CSS NESTING - Ejemplos adicionales
// -------------------------------------------------------------------------

console.log('\n=== CSS NESTING - EJEMPLOS ADICIONALES ===\n');

console.log('SINTAXIS BÁSICA:');
console.log('┌─────────────────────────────────────────────────────────────┐');
console.log('│  .padre {                                                   │');
console.log('│      color: red;                                            │');
console.log('│                                                             │');
console.log('│      .hijo {              ← Anidado directamente            │');
console.log('│          color: blue;                                       │');
console.log('│      }                                                      │');
console.log('│                                                             │');
console.log('│      &:hover {            ← & = .padre                      │');
console.log('│          color: green;                                      │');
console.log('│      }                                                      │');
console.log('│                                                             │');
console.log('│      &.active {           ← & = .padre                      │');
console.log('│          font-weight: bold;                                 │');
console.log('│      }                                                      │');
console.log('│  }                                                          │');
console.log('└─────────────────────────────────────────────────────────────┘');

console.log('\nVENTAJAS SOBRE SASS/LESS:');
console.log('✅ No necesitas compilar');
console.log('✅ Funciona nativamente en el navegador');
console.log('✅ Mejor rendimiento (no hay paso de compilación)');
console.log('✅ Soportado en todos los navegadores modernos (2024)');

console.log('\nLIMITACIONES:');
console.log('⚠️  El selector anidado DEBE empezar con un símbolo o &');
console.log('    ❌ .padre { div { } }      ← ERROR (empieza con letra)');
console.log('    ✅ .padre { & div { } }    ← CORRECTO (empieza con &)');
console.log('    ✅ .padre { .hijo { } }    ← CORRECTO (empieza con .)');

// -------------------------------------------------------------------------
// 5. INICIALIZACIÓN
// -------------------------------------------------------------------------

console.log('\n🎨 Componentes Nativos Modernos cargado');
console.log('📚 Explora las diferentes secciones para ver las features en acción');
console.log('🔍 Abre la consola para ver ejemplos adicionales');

// -------------------------------------------------------------------------
// RESUMEN DE CONCEPTOS APRENDIDOS
// -------------------------------------------------------------------------
//
// ┌─────────────────────────────────────────────────────────────────────┐
// │  FEATURE              │  AÑO  │  REEMPLAZA A                       │
// ├─────────────────────────────────────────────────────────────────────┤
// │  Popover API          │  2023 │  Modales custom con JS             │
// │  CSS :has()           │  2023 │  JavaScript para parent selectors  │
// │  Container Queries    │  2023 │  Media Queries para componentes    │
// │  CSS Nesting          │  2024 │  Preprocesadores (SASS/LESS)       │
// └─────────────────────────────────────────────────────────────────────┘
//
// TENDENCIA:
// El desarrollo web moderno se mueve hacia:
// 1. Menos JavaScript (más HTML/CSS nativo)
// 2. Componentes verdaderamente reutilizables
// 3. Mejor accesibilidad por defecto
// 4. Mejor rendimiento (menos código, menos librerías)
//
// CONSEJOS PRÁCTICOS:
// 1. Usa Popover API en lugar de librerías de modales cuando sea posible
// 2. Usa :has() para reducir JavaScript en selecciones condicionales
// 3. Usa Container Queries para componentes que se usan en diferentes contextos
// 4. Usa CSS Nesting para código más organizado (ya no necesitas SASS)
// 5. Mantente actualizado: CSS está evolucionando muy rápido (2023-2024)
//
// PRÓXIMOS PASOS:
// - Explora las demos interactivas
// - Redimensiona el contenedor para ver Container Queries en acción
// - Abre la consola para ver ejemplos adicionales
// - Intenta aplicar estas features en tus propios proyectos
// -------------------------------------------------------------------------
