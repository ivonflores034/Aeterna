document.addEventListener("DOMContentLoaded", function ()  {
    
    // ==========================================================================
    // MOTOR DE VIDEOS ASÍNCRONO SIMPLIFICADO
    // ==========================================================================
    const videosCorea = ["videos/pais1.mp4", "videos/pais42.mp4"];
    let idx = 0;

    const v1 = document.getElementById("bg-video-corea-1");
    const v2 = document.getElementById("bg-video-corea-2");

    function inicializarMotorVideosCorea() {
        if (!v1 || !v2) return;

        // Carga y reproducción inmediata
        v1.src = videosCorea[0];
        v1.play().catch(() => console.log("Autoplay mitigado"));

        // Precarga del segundo video
        v2.src = videosCorea[1];

        setInterval(intercalarVideosCorea, 10000);
    }

    function intercalarVideosCorea() {
        idx = idx === 0 ? 1 : 0;

        // Identificar activo y oculto en base a clases actuales
        const esV1Activo = v1.classList.contains("activo");
        const activo = esV1Activo ? v1 : v2;
        const oculto = esV1Activo ? v2 : v1;

        // Intercambio fluido
        oculto.play().catch(err => console.log(err));
        oculto.classList.replace("oculto", "activo");
        activo.classList.replace("activo", "oculto");

        // Preparar la siguiente pista tras la transición CSS
        setTimeout(() => {
            activo.src = videosCorea[idx];
            activo.load();
        }, 1500);
    }

    inicializarMotorVideosCorea();
    // ==========================================================================
    // 1. INTERSECTION OBSERVER (ANIMACIÓN SCROLL)
    // ==========================================================================
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.scroll-animado').forEach(el => observer.observe(el));
});