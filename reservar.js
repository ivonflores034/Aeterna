/**
 * Motor de Gestión de Reservas Dinámicas — Agencia Aeterna
 */

// Cambiar de pantalla y validar el paso actual
function nextStep(stepNumber) {
    if (stepNumber === 2) {
        // Validar Paso 1 obligatoriamente
        if (!validarPaso1()) return;
    }
    if (stepNumber === 3) {
        // Validar Paso 2 obligatoriamente
        if (!validarPaso2()) return;
        
        // Cargar los datos recopilados en la vista previa del Ticket de Cristal
        inyectarDatosTicket();
    }

    // Cambiar estados visuales de los pasos
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('step-active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('step-active');

    // Cambiar estados de los puntos indicadores superiores
    document.querySelectorAll('.step-indicator').forEach((dot, idx) => {
        if (idx < stepNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function prevStep(stepNumber) {
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('step-active');
    });
    document.getElementById(`step-${stepNumber}`).classList.add('step-active');

    document.querySelectorAll('.step-indicator').forEach((dot, idx) => {
        if (idx < stepNumber) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Validación minuciosa del Paso 1 (Filtros e Itinerario)
function validarPaso1() {
    let isValid = true;
    const destino = document.getElementById('destino');
    const fechaIda = document.getElementById('fechaIda');
    const fechaRegreso = document.getElementById('fechaRegreso');

    // Validación de Destino
    if (!destino.value) {
        mostrarError('destino', true);
        isValid = false;
    } else {
        mostrarError('destino', false);
    }

    // Validación de Fecha de Ida
    if (!fechaIda.value) {
        mostrarError('fechaIda', true);
        isValid = false;
    } else {
        mostrarError('fechaIda', false);
    }

    // Validación de Fecha de Regreso coherente
    if (!fechaRegreso.value) {
        mostrarError('fechaRegreso', true);
        isValid = false;
    } else if (fechaIda.value && new Date(fechaRegreso.value) < new Date(fechaIda.value)) {
        // Si el regreso es menor a la ida, lanzar error lógico
        const errSpan = document.getElementById('error-fechaRegreso');
        errSpan.innerText = "El regreso no puede ser antes de la fecha de ida.";
        mostrarError('fechaRegreso', true);
        isValid = false;
    } else {
        mostrarError('fechaRegreso', false);
    }

    return isValid;
}

// Validación minuciosa del Paso 2 (Pasajeros)
function validarPaso2() {
    let isValid = true;
    const nombre = document.getElementById('nombrePasajero');
    const pasaporte = document.getElementById('pasaporte');
    const email = document.getElementById('emailContacto');

    if (nombre.value.trim().length < 4) {
        mostrarError('nombre', true);
        isValid = false;
    } else {
        mostrarError('nombre', false);
    }

    if (pasaporte.value.trim().length < 5) {
        mostrarError('pasaporte', true);
        isValid = false;
    } else {
        mostrarError('pasaporte', false);
    }

    // Regex simple para verificar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value)) {
        mostrarError('email', true);
        isValid = false;
    } else {
        mostrarError('email', false);
    }

    return isValid;
}

// Auxiliar para encender o apagar los avisos de error
function mostrarError(fieldId, show) {
    const inputEl = document.getElementById(fieldId === 'nombre' || fieldId === 'email' ? `${fieldId}Contacto` : fieldId === 'pasaporte' ? 'pasaporte' : fieldId);
    const feedbackEl = document.getElementById(`error-${fieldId}`);
    
    if (inputEl && feedbackEl) {
        if (show) {
            inputEl.classList.add('input-error');
            feedbackEl.style.display = 'block';
        } else {
            inputEl.classList.remove('input-error');
            feedbackEl.style.display = 'none';
        }
    }
}

// Clonación en tiempo real al Ticket Final del Paso 3
function inyectarDatosTicket() {
    document.getElementById('view-nombre').innerText = document.getElementById('nombrePasajero').value.toUpperCase();
    document.getElementById('view-pasaporte').innerText = document.getElementById('pasaporte').value.toUpperCase();
    document.getElementById('view-destino').innerText = document.getElementById('destino').value;
    document.getElementById('view-ida').innerText = document.getElementById('fechaIda').value;
    document.getElementById('view-regreso').innerText = document.getElementById('fechaRegreso').value;
    document.getElementById('view-clase').innerText = document.getElementById('claseCabina').value;
}

// Procesar envío final simulado
document.getElementById('bookingForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert(`¡Felicidades por elegir la excelencia! Su solicitud de reserva en ${document.getElementById('destino').value} ha sido enviada con éxito. Nuestro Concierge privado le contactará por email.`);
    // Redirección elegante al inicio tras terminar la experiencia de usuario
    window.location.href = "index.html";
});