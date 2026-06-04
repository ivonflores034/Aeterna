document.addEventListener("DOMContentLoaded", function () {
    
    // 1. ANIMACIÓN DE ENTRADA AL HACER SCROLL (FADE IN + FLOAT UP)
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

    // 2. GENERADOR DE PÉTALOS IMPERCEPTIBLES (OPACIDAD MUY BAJA)
    const contenedorFlores = document.getElementById('contenedor-flores');
    const iconosFlores = ['🌸', '🌺']; 

    function crearPetalo() {
        if (!contenedorFlores) return;

        const flor = document.createElement('div');
        flor.classList.add('flor-caida');
        flor.innerText = iconosFlores[Math.floor(Math.random() * iconosFlores.length)];

        // Atributos aleatorios de caída
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

    // Cantidad controlada de pétalos de fondo
    for (let i = 0; i < 15; i++) {
        crearPetalo();
    }
    setInterval(crearPetalo, 900);
});