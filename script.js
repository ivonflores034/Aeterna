document.addEventListener('DOMContentLoaded', () => {
    inicializarFiltros();
    inicializarMotorVideos();
});

// ==========================================================================
// FILTRADO COREOGRÁFICO DE DESTINOS
// ==========================================================================
function aplicarFiltroCoreografico(criterioValidacion) {
    const tarjetas = document.querySelectorAll('.tarjeta-pais');

    tarjetas.forEach(t => t.classList.add('fade-oculto'));

    setTimeout(() => {
        tarjetas.forEach(t => {
            t.classList.toggle('completamente-oculto', !criterioValidacion(t));
            setTimeout(() => {
                if (!t.classList.contains('completamente-oculto')) t.classList.remove('fade-oculto');
            }, 50);
        });
    }, 400);
}

function inicializarFiltros() {
    const barraBuscar = document.getElementById('inputBuscarPais');
    const botonesFiltro = document.querySelectorAll('.btn-filtro');

    barraBuscar?.addEventListener('keyup', () => {
        const texto = barraBuscar.value.toLowerCase();
        aplicarFiltroCoreografico(t => {
            const nombre = t.querySelector('.nombre-pais')?.textContent.toLowerCase();
            return nombre ? nombre.includes(texto) : false;
        });
    });

    botonesFiltro.forEach(btn => {
        btn.addEventListener('click', () => {
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            const cont = btn.dataset.continente;
            aplicarFiltroCoreografico(t => cont === 'todos' || t.classList.contains(cont));
        });
    });
}

// ==========================================================================
// MOTOR DE VIDEOS INTERCALADOS
// ==========================================================================
const videosLocales = Array.from({ length: 45 }, (_, i) => `videos/pais${i + 1}.mp4`);
let indiceVideo = -1;

const ganarIndiceAleatorio = (max, actual) => {
    let nuevo;
    do { nuevo = Math.floor(Math.random() * max); } while (nuevo === actual && max > 1);
    return nuevo;
};

function inicializarMotorVideos() {
    const v = [document.getElementById('bg-video-1'), document.getElementById('bg-video-2')];
    if (!v[0] || !v[1] || !videosLocales.length) return;

    let activo = 0;

    const configurarVideo = (idx, srcIdx) => {
        v[idx].src = videosLocales[srcIdx];
        v[idx].load();
    };

    indiceVideo = ganarIndiceAleatorio(videosLocales.length, indiceVideo);
    configurarVideo(0, indiceVideo);
    v[0].play().catch(e => console.log("Autoplay retenido:", e));

    let siguienteIdx = ganarIndiceAleatorio(videosLocales.length, indiceVideo);
    configurarVideo(1, siguienteIdx);

    setInterval(() => {
        v[1 - activo].classList.replace('oculto', 'activo');
        v[1 - activo].play().catch(e => console.log(e));
        v[activo].classList.replace('activo', 'oculto');

        setTimeout(() => {
            indiceVideo = ganarIndiceAleatorio(videosLocales.length, indiceVideo);
            configurarVideo(1 - activo, indiceVideo); 
        }, 1500);

        activo = 1 - activo;
    }, 10000);
}