/**
 * app.js
 * ----------------------------------------------------------------
 * Entry point del frontend. Se ejecuta al cargar la página
 * (gracias a <script type="module"> al final del <body>) y su
 * única misión es ORQUESTRAR: engancha listeners, coordina los
 * demás módulos y nada más.
 *
 * Flujo por click en "Calcular":
 *   1) construirBody(tipo)        ← ui.js
 *   2) validar(tipo, body)        ← validators.js
 *   3) si hay errores -> marcarErrores(errores) y PARAR
 *   4) si no -> calcular(tipo, body)   ← api.js
 *   5) mostrarResultado(...)            ← ui.js
 *
 * Este archivo NO sabe nada sobre HTML, ni sobre reglas de
 * validación, ni sobre URLs. Solo coordina.
 */

import {
    construirBody,
    clearAllErrors,
    marcarErrores,
    mostrarResultado,
    mostrarErrorRed,
    setLoading
} from './ui.js';
import { validar } from './validators.js';
import { calcular } from './api.js';

const TIPOS = ['hogar', 'vida', 'salud'];

function setupForm(tipo) {
    const form = document.getElementById(`form-${tipo}`);
    if (!form) return;

    // UX: en cuanto el usuario modifica un input que estaba en
    // error, le quitamos el rojo. No esperamos al próximo submit.
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => clearFieldErrorInline(input));
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors(tipo);

        const body = construirBody(tipo);
        const errores = validar(tipo, body);

        if (errores.length > 0) {
            marcarErrores(errores);
            return;
        }

        setLoading(form, true);
        try {
            const resultado = await calcular(tipo, body);
            mostrarResultado(resultado);
        } catch (err) {
            mostrarErrorRed(err.message);
        } finally {
            setLoading(form, false);
        }
    });
}

function clearFieldErrorInline(input) {
    input.classList.remove('input-error');
    const span = input.parentElement.querySelector('.error-msg');
    if (span) span.textContent = '';
}

document.addEventListener('DOMContentLoaded', () => {
    TIPOS.forEach(setupForm);
});
