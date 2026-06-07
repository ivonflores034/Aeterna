document.addEventListener("DOMContentLoaded", function () {
    
    // ==========================================================================
    // MOTOR DE VIDEOS ALPINOS ASÍNCRONO (PAIS5 Y PAIS45)
    // ==========================================================================
    const videosSuiza = ["videos/pais5.mp4", "videos/pais45.mp4"];
    let indiceVideoActual = 0;

    const videoElemento1 = document.getElementById("bg-video-suiza-1");
    const videoElemento2 = document.getElementById("bg-video-suiza-2");

    function inicializarMotorVideosSuiza() {
        if (!videoElemento1 || !videoElemento2) return;

        // Inyectar y reproducir de golpe el primer video alpino en el contenedor activo
        videoElemento1.src = videosSuiza[0];
        videoElemento1.play().catch(err => console.log("Autoplay mitigado por restricciones del navegador"));

        // Precargar silenciosamente el segundo video en el contenedor oculto
        videoElemento2.src = videosSuiza[1];

        // Intercambiar las fuentes de forma cruzada cada 10 segundos continuos
        setInterval(intercalarVideosSuiza, 10000);
    }

    function intercalarVideosSuiza() {
        indiceVideoActual = (indiceVideoActual + 1) % videosSuiza.length;
        const proximoIndice = (indiceVideoActual + 1) % videosSuiza.length;

        if (videoElemento1.classList.contains("activo")) {
            // El contenedor 1 está al aire, reproducimos y desvanecemos hacia el 2
            videoElemento2.play().catch(err => console.log(err));
            videoElemento2.classList.remove("oculto");
            videoElemento2.classList.add("activo");

            videoElemento1.classList.remove("activo");
            videoElemento1.classList.add("oculto");

            // Reemplazar la fuente del contenedor oculto tras finalizar la transición de opacidad
            setTimeout(() => {
                videoElemento1.src = videosSuiza[proximoIndice];
                videoElemento1.load();
            }, 1500); 

        } else {
            // El contenedor 2 está al aire, regresamos fluidamente al contenedor 1
            videoElemento1.play().catch(err => console.log(err));
            videoElemento1.classList.remove("oculto");
            videoElemento1.classList.add("activo");

            videoElemento2.classList.remove("activo");
            videoElemento2.classList.add("oculto");

            setTimeout(() => {
                videoElemento2.src = videosSuiza[proximoIndice];
                videoElemento2.load();
            }, 1500);
        }
    }

    // Arrancar el motor multimedia alpino
    inicializarMotorVideosSuiza();


    // ==========================================================================
    // ANIMACIÓN DE REVELACIÓN AL HACER SCROLL (INTERSECTION OBSERVER)
    // ==========================================================================
    const elementosAnimados = document.querySelectorAll('.scroll-animado');

    const opcionesObserver = {
        root: null,
        threshold: 0.12,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Evita repetir la animación
            }
        });
    }, opcionesObserver);

    elementosAnimados.forEach(elemento => {
        observer.observe(elemento);
    });

});