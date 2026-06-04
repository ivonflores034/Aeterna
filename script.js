// Función global que maneja la coreografía de la animación (Fade-Out -> Filtrar -> Fade-In)
function aplicarFiltroCoreografico(criterioValidacion) {
    const tarjetas = document.querySelectorAll('.tarjeta-pais');

    // PASO 1: Desvanecer absolutamente TODAS las tarjetas al mismo tiempo (Fade-out)
    tarjetas.forEach(tarjeta => {
        tarjeta.classList.add('fade-oculto');
    });

    // PASO 2: Esperar 400ms (lo que dura el desvanecimiento) para hacer el cambio en la sombra
    setTimeout(() => {
        tarjetas.forEach(tarjeta => {
            // Evaluamos si la tarjeta cumple el criterio de búsqueda o continente
            if (criterioValidacion(tarjeta)) {
                // Si pasa el filtro, le quitamos el display:none para que ocupe su lugar central
                tarjeta.classList.remove('completamente-oculto');
            } else {
                // Si no pasa, la eliminamos por completo del flujo visual
                tarjeta.classList.add('completamente-oculto');
            }
        });

        // PASO 3: Un micro-segundo después (para dar tiempo a Bootstrap a centrar el row), las hacemos flotar hacia arriba
        setTimeout(() => {
            tarjetas.forEach(tarjeta => {
                if (!tarjeta.classList.contains('completamente-oculto')) {
                    tarjeta.classList.remove('fade-oculto'); // Hace el hermoso Fade-In flotante
                }
            });
        }, 50);

    }, 400); // Duración exacta de la salida en CSS
}

// 1. Filtrado por Botones de Continente
function filtrarContinente(continente) {
    aplicarFiltroCoreografico((tarjeta) => {
        const perteneceAContinente = tarjeta.classList.contains(continente);
        return continente === 'todos' || perteneceAContinente;
    });

    // Actualizar estados visuales de los botones estéticos
    document.querySelectorAll('.btn-filtro').forEach(btn => btn.classList.remove('activo'));
    const btnActivo = document.getElementById(`btn-${continente}`);
    if (btnActivo) btnActivo.classList.add('activo');
}

// 2. Filtrado por la Barra de Búsqueda
function buscarPais() {
    const textoUsuario = document.getElementById('inputBuscarPais').value.toLowerCase();

    aplicarFiltroCoreografico((tarjeta) => {
        const elementoNombre = tarjeta.querySelector('.nombre-pais');
        if (elementoNombre) {
            const nombrePais = elementoNombre.textContent.toLowerCase();
            return nombrePais.includes(textoUsuario);
        }
        return false;
    });
}

// ==========================================================================
// MOTOR DE VIDEOS LOCALES (.MP4) ALEATORIOS (41 VIDEOS)
// ==========================================================================

// 1. Generar automáticamente la lista con las rutas de tus 41 videos
const listaVideosLocales = [];
for (let i = 1; i <= 41; i++) {
    listaVideosLocales.push(`videos/pais${i}.mp4`);
}

let indiceVideoLocal = 0;
const tiempoIntercaladoLocal = 10000; // 10 segundos

// Función para obtener un índice aleatorio diferente al actual
function obtenerIndiceAleatorio(max, indiceActual) {
    let nuevoIndice;
    do {
        // Genera un número entero aleatorio entre 0 y el total de videos - 1
        nuevoIndice = Math.floor(Math.random() * max);
    } while (nuevoIndice === indiceActual && max > 1); // Evita que salga el mismo video de forma consecutiva
    return nuevoIndice;
}

function intercalarVideosNativos() {
    const videoElement = document.getElementById('bg-video-luxury');
    const sourceElement = document.getElementById('video-source-luxury');
    
    if (!videoElement || !sourceElement || listaVideosLocales.length === 0) return;

    // Configurar el primer video de forma aleatoria inmediatamente al cargar la página
    indiceVideoLocal = obtenerIndiceAleatorio(listaVideosLocales.length, -1);
    sourceElement.src = listaVideosLocales[indiceVideoLocal];
    videoElement.load();

    // Iniciar el ciclo infinito cada 10 segundos
    setInterval(() => {
        // Seleccionar el siguiente video al azar sin repetir el actual
        indiceVideoLocal = obtenerIndiceAleatorio(listaVideosLocales.length, indiceVideoLocal);
        
        // Fase 1: Desvanecer sutilmente el video actual (Fade-out)
        videoElement.style.opacity = '0';
        
        setTimeout(() => {
            // Fase 2: Cambiar la ruta del video al nuevo seleccionado aleatoriamente
            sourceElement.src = listaVideosLocales[indiceVideoLocal];
            videoElement.load();
            
            // Forzar reproducción y asegurar silencio para saltar bloqueos de navegadores
            videoElement.muted = true;
            videoElement.play().catch(error => console.log("Autoplay retenido:", error));
            
            // Fase 3: Devolver la opacidad para el efecto de transición premium (Fade-in)
            videoElement.style.opacity = '1';
        }, 800); // Sincronizado con los 0.8s de la transición CSS del contenedor

    }, tiempoIntercaladoLocal);
}

// Inicializar el motor cuando la estructura de la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    intercalarVideosNativos();
});