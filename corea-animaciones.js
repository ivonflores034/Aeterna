document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // MOTOR DE VIDEOS ASÍNCRONO SIMPLIFICADO
    // ==========================================================================
    const videosCorea = ["videos/pais1.mp4", "videos/pais42.mp4"];
    let indiceVideoActual = 0;

    const videoElemento1 = document.getElementById("bg-video-corea-1");
    const videoElemento2 = document.getElementById("bg-video-corea-2");

    function inicializarMotorVideosCorea() {
        if (!videoElemento1 || !videoElemento2) return;

        // Carga y reproducción inmediata del primer video
        videoElemento1.src = videosCorea[0];
        videoElemento1.play().catch(() => console.log("Autoplay mitigado por el navegador"));

        // Precarga del segundo video en segundo plano
        videoElemento2.src = videosCorea[1];

        setInterval(intercalarVideosCorea, 10000);
    }

    function intercalarVideosCorea() {
        indiceVideoActual = (indiceVideoActual + 1) % videosCorea.length;
        const proximoIndice = (indiceVideoActual + 1) % videosCorea.length;

        // Determinar dinámicamente cuál video está activo y cuál oculto
        const activo = videoElemento1.classList.contains("activo") ? videoElemento1 : videoElemento2;
        const oculto = activo === videoElemento1 ? videoElemento2 : videoElemento1;

        // Intercambio fluido de clases y reproducción
        oculto.play().catch(err => console.log(err));
        oculto.classList.replace("oculto", "activo");
        activo.classList.replace("activo", "oculto");

        // Preparar y precargar de forma asíncrona la siguiente pista
        setTimeout(() => {
            activo.src = videosCorea[proximoIndice];
            activo.load();
        }, 1500); // Sincronizado con la transición CSS
    }

    inicializarMotorVideosCorea();

    // ==========================================================================
    // 1. INTERSECTION OBSERVER (ANIMACIÓN SCROLL)
    // ==========================================================================
    const elementosAnimados = document.querySelectorAll('.scroll-animado');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    elementosAnimados.forEach(el => observer.observe(el));

    // ==========================================================================
    // 2. GENERADOR DE PÉTALOS EFICIENTE
    // ==========================================================================
    const contenedorFlores = document.getElementById('contenedor-flores');

    function crearPetalo() {
        if (!contenedorFlores) return;

        const flor = document.createElement('div');
        flor.classList.add('flor-caida');
        flor.innerText = '🌺';

        const escala = Math.random() * 0.7 + 0.5;
        const duracion = Math.random() * 8 + 11;

        flor.style.left = Math.random() * 110 + 'vw';
        flor.style.transform = `scale(${escala})`;
        flor.style.animationDuration = duracion + 's';
        flor.style.animationDelay = Math.random() * 4 + 's';

        contenedorFlores.appendChild(flor);

        // Limpieza de memoria automática al terminar la caída
        setTimeout(() => flor.remove(), (duracion + 4) * 1000);
    }

    // Inicialización del ambiente
    for (let i = 0; i < 15; i++) crearPetalo();
    setInterval(crearPetalo, 900);
});