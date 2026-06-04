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


    // ==========================================================================
    // GENERADOR DE ATMÓSFERA: COPOS DE NIEVE FLOTANTES
    // ==========================================================================
    const contenedorNieve = document.getElementById('contenedor-nieve');
    const iconosNieve = ['❄️', '❅', '❆']; 

    function crearCopoNieve() {
        if (!contenedorNieve) return;

        const copo = document.createElement('div');
        copo.classList.add('copo-nieve-caida');
        copo.innerText = iconosNieve[Math.floor(Math.random() * iconosNieve.length)];

        // Posicionamiento aleatorio horizontal a lo largo del viewport
        copo.style.left = Math.random() * 110 + 'vw';
        
        // Escala aleatoria para simular profundidad de campo (3D)
        const escala = Math.random() * 0.6 + 0.4;
        copo.style.transform = `scale(${escala})`;
        
        // Tiempos aleatorios para romper patrones lineales de caída
        const duracion = Math.random() * 8 + 12;
        copo.style.animationDuration = duracion + 's';
        copo.style.animationDelay = Math.random() * 3 + 's';

        contenedorNieve.appendChild(copo);

        // Remover del DOM una vez completada la trayectoria
        setTimeout(() => {
            copo.remove();
        }, (duracion + 3) * 1000);
    }

    // Inicializar ráfaga base de entrada
    for (let i = 0; i < 20; i++) {
        crearCopoNieve();
    }
    
    // Generación constante espaciada
    setInterval(crearCopoNieve, 750);
});