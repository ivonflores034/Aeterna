// Función global que maneja la coreografía de la animación (Fade-Out -> Filtrar -> Fade-In)
function aplicarFiltroCoreografico(criterioValidacion) {
    const tarjetas = document.querySelectorAll('.tarjeta-pais');

    // PASO 1: Desvanecer TODAS las tarjetas al mismo tiempo (Fade-out)
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
// MOTOR DE VIDEOS CON DOBLE CONTENEDOR INTERCALADO
// ==========================================================================

// 1. Generar automáticamente la lista con las rutas de tus 41 videos
const listaVideosLocales = [];
for (let i = 1; i <= 45; i++) {
    listaVideosLocales.push(`videos/pais${i}.mp4`);
}

let indiceVideoLocal = 0;
const tiempoIntercaladoLocal = 10000; // 10 segundos
let usarVideoUno = true; // Controla cuál de los dos contenedores pasa al frente

// Función para obtener un índice aleatorio diferente al actual
function obtenerIndiceAleatorio(max, indiceActual) {
    let nuevoIndice;
    do {
        nuevoIndice = Math.floor(Math.random() * max);
    } while (nuevoIndice === indiceActual && max > 1);
    return nuevoIndice;
}

function inicializarMotorVideos() {
    const video1 = document.getElementById('bg-video-1');
    const video2 = document.getElementById('bg-video-2');
    
    if (!video1 || !video2 || listaVideosLocales.length === 0) return;

    // --- PASO CLAVE DE INICIO ---
    // Seleccionar el primer video aleatorio y reproducirlo INMEDIATAMENTE en el contenedor 1
    indiceVideoLocal = obtenerIndiceAleatorio(listaVideosLocales.length, -1);
    video1.src = listaVideosLocales[indiceVideoLocal];
    video1.load();
    video1.play().catch(err => console.log("Autoplay inicial retenido:", err));

    // Precargar el otro video aleatorio en el contenedor 2
    let siguienteIndice = obtenerIndiceAleatorio(listaVideosLocales.length, indiceVideoLocal);
    video2.src = listaVideosLocales[siguienteIndice];
    video2.load();

    // Iniciar el ciclo de intercambio inteligente cada 10 segundos
    setInterval(() => {
        // Intercambio de roles (Crossfade en la sombra)
        if (usarVideoUno) {
            // El video 2 pasa al frente y se reproduce
            video2.classList.remove('oculto');
            video2.classList.add('activo');
            video2.play().catch(e => console.log(e));

            // El video 1 se desvanece suavemente
            video1.classList.remove('activo');
            video1.classList.add('oculto');

            // Preparamos el siguiente video aleatorio dentro del video 1
            setTimeout(() => {
                indiceVideoLocal = obtenerIndiceAleatorio(listaVideosLocales.length, indiceVideoLocal);
                video1.src = listaVideosLocales[indiceVideoLocal];
                video1.load();
            }, 1500); // Esperamos a que termine de ocultarse para cambiarle la ruta sin que parpadee

        } else {
            // El video 1 pasa al frente y se reproduce
            video1.classList.remove('oculto');
            video1.classList.add('activo');
            video1.play().catch(e => console.log(e));

            // El video 2 se desvanece suavemente
            video2.classList.remove('activo');
            video2.classList.add('oculto');

            // Preparamos en la sombra el siguiente video aleatorio dentro del video 2
            setTimeout(() => {
                indiceVideoLocal = obtenerIndiceAleatorio(listaVideosLocales.length, indiceVideoLocal);
                video2.src = listaVideosLocales[indiceVideoLocal];
                video2.load();
            }, 1500);
        }

        // Invertimos la bandera lógica para el siguiente ciclo
        usarVideoUno = !usarVideoUno;

    }, tiempoIntercaladoLocal);
}

// Inicializar el motor cuando la estructura de la página esté lista
document.addEventListener('DOMContentLoaded', () => {
    inicializarMotorVideos();
});