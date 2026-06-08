document.addEventListener("DOMContentLoaded", function () {
    // ==========================================================================
    // MOTOR DE VIDEOS ASÍNCRONO - PERÚ (OPTIMIZADO)
    // ==========================================================================
    const videosPeru = [
        "videos/peru1.mp4", 
        "videos/peru2.mp4", 
        "videos/peru3.mp4",
        "videos/peru4.mp4" // Tus 4 videos cinemáticos de Perú
    ];
    let indiceVideoActual = 0;

    // Vinculados a los IDs del Header Hero
    const v1 = document.getElementById("bg-video-francia-1");
    const v2 = document.getElementById("bg-video-francia-2");

    function inicializarMotorVideosPeru() {
        if (!v1 || !v2) return;

        // Primer video al contenedor activo
        v1.src = videosPeru[0];
        v1.play().catch(err => console.log("Autoplay mitigado por políticas del navegador"));

        // Precargar el segundo video (índice 1) en segundo plano
        v2.src = videosPeru[1];

        setInterval(intercalarVideosPeru, 10000);
    }

    function intercalarVideosPeru() {
        // 1. Avanzar en el historial de forma cíclica (0, 1, 2, 3...)
        indiceVideoActual = (indiceVideoActual + 1) % videosPeru.length;
        const proximoIndice = (indiceVideoActual + 1) % videosPeru.length;

        // 2. Detectar automáticamente cuál está activo y cuál oculto
        const esV1Activo = v1.classList.contains("activo");
        const activo = esV1Activo ? v1 : v2;
        const oculto = esV1Activo ? v2 : v1;

        // 3. Intercambio de roles fluido (Desaparece el activo, aparece el oculto)
        oculto.play().catch(err => console.log(err));
        oculto.classList.replace("oculto", "activo");
        activo.classList.replace("activo", "oculto");

        // 4. Preparar el Siguiente video en el contenedor que acaba de ocultarse
        setTimeout(() => {
            activo.src = videosPeru[proximoIndice];
            activo.load();
        }, 1500); 
    }

    // Arrancar el motor multimedia
    inicializarMotorVideosPeru();

    // ==========================================================================
    // ANIMACIÓN DE REVELACIÓN AL HACER SCROLL (INTERSECTION OBSERVER)
    // ==========================================================================
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target); // Detiene la observación tras animar de forma eficiente
            }
        });
    }, { threshold: 0.12 });

    // Selecciona y activa el observador para todos los elementos en una sola línea
    document.querySelectorAll('.scroll-animado').forEach(el => observer.observe(el));
});