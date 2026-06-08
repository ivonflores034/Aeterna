document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formRegistro");

    const regexNombre = /^[A-ZÁÉÍÓÚÑ][a-zA-ZáéíóúñÁÉÍÓÚÑ\s]{3,}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    const campos = {
        nombre: { input: document.getElementById("nombre"), error: document.getElementById("error-nombre"), validar: val => regexNombre.test(val.trim()) },
        email: { input: document.getElementById("email"), error: document.getElementById("error-email"), validar: val => regexEmail.test(val) },
        password: { input: document.getElementById("password"), error: document.getElementById("error-password"), validar: val => regexPassword.test(val) },
        confirmPassword: { input: document.getElementById("confirmPassword"), error: document.getElementById("error-confirmPassword"), validar: val => val === campos.password.input.value }
    };

    // Función unificada: maneja la validación visual y acepta un parámetro para forzar el error si el campo está vacío al enviar
    function verificarCampo(campo, forzarValidacion = false) {
        const esValido = campo.validar(campo.input.value);
        const mostrarError = !esValido && (forzarValidacion || campo.input.value.length > 0);
        
        campo.input.classList.toggle("input-error", mostrarError);
        campo.error.style.display = mostrarError ? "block" : "none";
        return !mostrarError;
    }

    // Asignar eventos en tiempo real
    Object.keys(campos).forEach(key => {
        campos[key].input.addEventListener("input", () => {
            verificarCampo(campos[key]);
            if (key === "password" && campos.confirmPassword.input.value.length > 0) {
                verificarCampo(campos.confirmPassword);
            }
        });
    });

    // Control de envío
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        
        // Ejecuta la validación en todos los campos (forzando la revisión aunque estén vacíos)
        let formularioCorrecto = true;
        Object.keys(campos).forEach(key => {
            if (!verificarCampo(campos[key], true)) {
                formularioCorrecto = false;
                campos[key].input.focus();
            }
        });

        if (formularioCorrecto) {
            const btnSubmit = form.querySelector(".btn-registro-submit");
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Verificando Credenciales...`;

            setTimeout(() => {
                alert("¡Bienvenido a Aeterna! Su membresía de alta gama ha sido registrada con éxito.");
                form.reset();
                window.location.href = "index.html";
            }, 2000);
        }
    });
});