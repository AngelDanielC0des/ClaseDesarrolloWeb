/**
 * validators.js
 * ----------------------------------------------------------------
 * Reglas de validación del cliente. Son un ESPEJO de las anotaciones
 * de Jakarta Bean Validation que hay en los records del backend
 * (modelo/Solicitud*.java). Si cambias una restricción en el backend,
 * cámbiala también aquí.
 *
 * Exporta:
 *   - REGLAS:  objeto con las reglas por tipo de seguro
 *   - validar: función pura que recibe (tipo, body) y devuelve
 *              una lista de errores: [{ field, message }, ...]
 *              o [] si todo está bien.
 *
 * Importante: este módulo NO toca el DOM. Solo valida datos.
 * Eso permite reutilizarlo (tests, otros formularios, etc.) y
 * mantener separados los "datos" de la "presentación".
 */

const MENSAJES = {
    metrosCuadrados: 'Los metros cuadrados',
    anioConstruccion: 'El año de construcción',
    valorMercado: 'El valor de mercado',
    zona: 'La zona',
    edadAsegurado: 'La edad',
    capitalSolicitado: 'El capital solicitado',
    esFumador: 'Si es fumador',
    esDeportista: 'Si es deportista',
    copagoSeleccionado: 'El copago',
    coberturaDental: 'La cobertura dental',
    coberturaFamiliar: 'La cobertura familiar'
};

export const REGLAS = {
    hogar: {
        metrosCuadrados:  { required: true, tipo: 'number',  min: 20 },
        anioConstruccion: { required: true, tipo: 'integer', min: 1900 },
        valorMercado:     { required: true, tipo: 'number',  min: 0.01 },
        zona:             { required: true, tipo: 'text',    minLength: 1 }
    },
    vida: {
        edadAsegurado:     { required: true, tipo: 'integer', min: 18,  max: 90 },
        capitalSolicitado: { required: true, tipo: 'number',  min: 0.01 },
        esFumador:         { required: true, tipo: 'boolean' },
        esDeportista:      { required: true, tipo: 'boolean' }
    },
    salud: {
        edadAsegurado:      { required: true, tipo: 'integer', min: 0, max: 120 },
        copagoSeleccionado: { required: true, tipo: 'number',  min: 0 },
        coberturaDental:    { required: true, tipo: 'boolean' },
        coberturaFamiliar:  { required: true, tipo: 'boolean' }
    }
};

export function validar(tipo, body) {
    const campos = REGLAS[tipo];
    if (!campos) {
        return [{ field: '_form', message: `Tipo de seguro desconocido: ${tipo}` }];
    }
    const errores = [];
    for (const [field, regla] of Object.entries(campos)) {
        const err = validarCampo(field, body[field], regla);
        if (err) errores.push(err);
    }
    return errores;
}

function validarCampo(field, valor, regla) {
    // Booleanos: un checkbox SIEMPRE da true o false, así que este
    // caso solo saltaría si alguien construyera el body a mano.
    if (regla.tipo === 'boolean') {
        if (typeof valor !== 'boolean') {
            return { field, message: `${nombre(field)} es obligatorio` };
        }
        return null;
    }

    // ¿Está vacío?
    const vacio = valor === null || valor === undefined || valor === '' ||
                  (typeof valor === 'number' && Number.isNaN(valor));
    if (vacio) {
        return regla.required
            ? { field, message: `${nombre(field)} es obligatorio` }
            : null;
    }

    // Numéricos (enteros o decimales)
    if (regla.tipo === 'number' || regla.tipo === 'integer') {
        const num = Number(valor);
        if (Number.isNaN(num)) {
            return { field, message: `${nombre(field)} debe ser un número` };
        }
        if (regla.tipo === 'integer' && !Number.isInteger(num)) {
            return { field, message: `${nombre(field)} debe ser un número entero` };
        }
        if (regla.min !== undefined && num < regla.min) {
            return { field, message: `${nombre(field)} debe ser ≥ ${regla.min}` };
        }
        if (regla.max !== undefined && num > regla.max) {
            return { field, message: `${nombre(field)} debe ser ≤ ${regla.max}` };
        }
        return null;
    }

    // Texto
    if (regla.tipo === 'text') {
        if (regla.minLength !== undefined && String(valor).trim().length < regla.minLength) {
            return { field, message: `${nombre(field)} no puede estar vacío` };
        }
        return null;
    }

    return null;
}

function nombre(field) {
    return MENSAJES[field] || 'Este campo';
}
