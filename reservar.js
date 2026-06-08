/**
 * Motor de Gestión de Reservas — Agencia Aeterna (Optimizado)
 */

// 1. Inicialización en un solo evento 'input'
document.addEventListener("DOMContentLoaded", () => {
    ['nombrePasajero', 'pasaporte', 'destino', 'fechaIda', 'fechaRegreso', 'claseCabina'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', inyectarDatosTicket);
    });
});

// 2. Navegación de pantallas compacta
function cambiarPaso(stepNumber) {
    if (stepNumber === 2 && !validarPaso1()) return;
    if (stepNumber === 3) {
        if (!validarPaso2()) return;
        inyectarDatosTicket();
    }

    // Toggle activo para pasos e indicadores
    document.querySelectorAll('.form-step').forEach((step, idx) => step.classList.toggle('step-active', idx === stepNumber - 1));
    document.querySelectorAll('.step-indicator').forEach((dot, idx) => dot.classList.toggle('active', idx < stepNumber));
}

// 3. Validación Paso 1 (Filtros e Itinerario)
function validarPaso1() {
    const des = document.getElementById('destino'), fIda = document.getElementById('fechaIda'), fReg = document.getElementById('fechaRegreso');
    let vIda = manejarError('destino', !des.value) && manejarError('fechaIda', !fIda.value);
    
    // Validar fecha de regreso
    let errorRegreso = !fReg.value;
    if (fReg.value && fIda.value && new Date(fReg.value) < new Date(fIda.value)) {
        document.getElementById('error-fechaRegreso').innerText = "El regreso no puede ser antes de la fecha de ida.";
        errorRegreso = true;
    }
    return manejarError('fechaRegreso', errorRegreso) && vIda;
}

// 4. Validación Paso 2 (Pasajeros)
function validarPaso2() {
    const nom = document.getElementById('nombrePasajero').value.trim();
    const pas = document.getElementById('pasaporte').value.trim();
    const email = document.getElementById('emailContacto').value;

    const nombreRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñA-ZÁÉÍÓÚÑ\s]*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return [
        manejarError('nombrePasajero', nom.length < 4 || !nombreRegex.test(nom)),
        manejarError('pasaporte', pas.length < 5),
        manejarError('emailContacto', !emailRegex.test(email))
    ].every(Boolean); // Retorna true si todos son true
}

// 5. Manejo dinámico de errores
function manejarError(fieldId, tieneError) {
    document.getElementById(fieldId)?.classList.toggle('input-error', tieneError);
    const feedback = document.getElementById(`error-${fieldId}`);
    if (feedback) feedback.style.display = tieneError ? 'block' : 'none';
    return !tieneError;
}

// 6. Clonación inteligente al Boarding Pass
function inyectarDatosTicket() {
    const campos = {
        'nombrePasajero': 'view-nombre', 'pasaporte': 'view-pasaporte', 'destino': 'view-destino',
        'fechaIda': 'view-ida', 'fechaRegreso': 'view-regreso', 'claseCabina': 'view-clase'
    };

    Object.entries(campos).forEach(([idOrigen, idDestino]) => {
        let val = document.getElementById(idOrigen)?.value || "-";
        if (idOrigen === 'nombrePasajero' || idOrigen === 'pasaporte') val = val.toUpperCase();
        document.getElementById(idDestino).innerText = val;
    });
}

// 7. Eventos del Formulario (Enter y Submit) unificados
const bookingForm = document.getElementById('bookingForm');

bookingForm.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const paso1 = document.getElementById('step-1').classList.contains('step-active');
        cambiarPaso(paso1 ? 2 : 3);
    }
});

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(`¡Felicidades por elegir la excelencia! Su solicitud de reserva en ${document.getElementById('destino').value} ha sido enviada con éxito. Nuestro Concierge privado le contactará por email.`);
    window.location.href = "index.html";
});