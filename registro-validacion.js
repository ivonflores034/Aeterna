document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formRegistro");

    // Expresiones regulares para validación estricta
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexPassword = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // Mínimo 8 caracteres, 1 Mayúscula, 1 Número

    // Elementos de los campos del formulario
    const campos = {
        nombre: {
            input: document.getElementById("nombre"),
            error: document.getElementById("error-nombre"),
            validar: (val) => val.trim().length >= 3
        },
        email: {
            input: document.getElementById("email"),
            error: document.getElementById("error-email"),
            validar: (val) => regexEmail.test(val)
        },
        password: {
            input: document.getElementById("password"),
            error: document.getElementById("error-password"),
            validar: (val) => regexPassword.test(val)
        },
        confirmPassword: {
            input: document.getElementById("confirmPassword"),
            error: document.getElementById("error-confirmPassword"),
            validar: (val) => val === document.getElementById("password").value
        }
    };

    // Función genérica para mostrar/ocultar estados de error visuales
    function verificarCampo(campo) {
        const esValido = campo.validar(campo.input.value);
        if (!esValido && campo.input.value.length > 0) {
            campo.input.classList.add("input-error");
            campo.error.style.display = "block";
            return false;
        } else {
            campo.input.classList.remove("input-error");
            campo.error.style.display = "none";
            return true;
        }
    }

    // Escuchar el evento input para validación interactiva y en tiempo real
    Object.keys(campos).forEach(key => {
        campos[key].input.addEventListener("input", function () {
            verificarCampo(campos[key]);
            
            // Si se cambia la contraseña original, revalidar también la confirmación
            if (key === "password" && campos.confirmPassword.input.value.length > 0) {
                verificarCampo(campos.confirmPassword);
            }
        });
    });

    // Control de envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Detener envío por defecto
        
        let formularioCorrecto = true;

        // Validar todos los campos obligatoriamente antes de procesar
        Object.keys(campos).forEach(key => {
            const campoEsValido = campos[key].validar(campos[key].input.value);
            if (!campoEsValido) {
                campos[key].input.classList.add("input-error");
                campos[key].input.focus();
                campos[key].error.style.display = "block";
                formularioCorrecto = false;
            }
        });

        if (formularioCorrecto) {
            // Simulación Premium de éxito
            const btnSubmit = form.querySelector(".btn-registro-submit");
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin me-2"></i> Verificando Credenciales...`;

            setTimeout(() => {
                alert("¡Bienvenido a Aeterna! Su membresía de alta gama ha sido registrada con éxito.");
                form.reset();
                window.location.href = "index.html"; // Redirección automática
            }, 2000);
        }
    });
});