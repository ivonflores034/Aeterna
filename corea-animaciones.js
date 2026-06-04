document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // MOTOR DE VIDEOS ASÍNCRONO DE ENTRADA (PAIS1 Y PAIS42)
    // ==========================================================================
    const videosCorea = ["videos/pais1.mp4", "videos/pais42.mp4"];
    let indiceVideoActual = 0;

    const videoElemento1 = document.getElementById("bg-video-corea-1");
    const videoElemento2 = document.getElementById("bg-video-corea-2");

    function inicializarMotorVideosCorea() {
        if (!videoElemento1 || !videoElemento2) return;

        // Cargar el primer video de entrada de forma inmediata
        videoElemento1.src = videosCorea[0];
        videoElemento1.play().catch(err => console.log("Autoplay mitigado por el navegador"));

        // Preparar el segundo video en la sombra (precarga en segundo plano)
        videoElemento2.src = videosCorea[1];

        // Cambiar fluidamente de video cada 10 segundos
        setInterval(intercalarVideosCorea, 10000);
    }

    function intercalarVideosCorea() {
        // Cambiar el índice de selección
        indiceVideoActual = (indiceVideoActual + 1) % videosCorea.length;
        const proximoIndice = (indiceVideoActual + 1) % videosCorea.length;

        if (videoElemento1.classList.contains("activo")) {
            // El 1 está visible, pasamos al 2 de forma fluida
            videoElemento2.play().catch(err => console.log(err));
            videoElemento2.classList.remove("oculto");
            videoElemento2.classList.add("activo");

            videoElemento1.classList.remove("activo");
            videoElemento1.classList.add("oculto");

            // Precargar el siguiente video en el contenedor que quedó oculto
            setTimeout(() => {
                videoElemento1.src = videosCorea[proximoIndice];
                videoElemento1.load();
            }, 1500); // Espera a que termine la transición de opacidad

        } else {
            // El 2 está visible, regresamos al 1 de forma fluida
            videoElemento1.play().catch(err => console.log(err));
            videoElemento1.classList.remove("oculto");
            videoElemento1.classList.add("activo");

            videoElemento2.classList.remove("activo");
            videoElemento2.classList.add("oculto");

            setTimeout(() => {
                videoElemento2.src = videosCorea[proximoIndice];
                videoElemento2.load();
            }, 1500);
        }
    }

    // Ejecutar el motor de videos de fondo
    inicializarMotorVideosCorea();


    // ==========================================================================
    // 1. ANIMACIÓN DE ENTRADA AL HACER SCROLL (FADE IN + FLOAT UP)
    // ==========================================================================
    const elementosAnimados = document.querySelectorAll('.scroll-animado');

    const opcionesObersver = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, opcionesObersver);

    elementosAnimados.forEach(elemento => {
        observer.observe(elemento);
    });

    // ==========================================================================
    // 2. GENERADOR DE PÉTALOS IMPERCEPTIBLES (OPACIDAD MUY BAJA)
    // ==========================================================================
    const contenedorFlores = document.getElementById('contenedor-flores');
    const iconosFlores = ['🌸', '🌺']; 

    function crearPetalo() {
        if (!contenedorFlores) return;

        const flor = document.createElement('div');
        flor.classList.add('flor-caida');
        flor.innerText = iconosFlores[Math.floor(Math.random() * iconosFlores.length)];

        flor.style.left = Math.random() * 110 + 'vw';
        const escala = Math.random() * 0.7 + 0.5;
        flor.style.transform = `scale(${escala})`;
        
        const duracion = Math.random() * 8 + 11;
        flor.style.animationDuration = duracion + 's';
        flor.style.animationDelay = Math.random() * 4 + 's';

        contenedorFlores.appendChild(flor);

        setTimeout(() => {
            flor.remove();
        }, (duracion + 4) * 1000);
    }

    for (let i = 0; i < 15; i++) {
        crearPetalo();
    }
    setInterval(crearPetalo, 900);
});