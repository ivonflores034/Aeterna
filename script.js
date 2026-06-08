// El método 'document.addEventListener' escucha un evento en la página.
// 'DOMContentLoaded' significa "cuando todo el HTML de la página ya se cargó y estructuró".
// La flecha '() => { ... }' es una función que ejecuta las dos funciones de adentro inmediatamente después de que la página está lista.
document.addEventListener('DOMContentLoaded', () => {
    inicializarFiltros(); // Llama a la función que prepara el buscador y los botones de los continentes.
    inicializarMotorVideos(); // Llama a la función que maneja los videos de fondo intercalados.
});

// ==========================================================================
// FILTRADO COREOGRÁFICO DE DESTINOS
// ==========================================================================

// Definición de la función de filtrado. Recibe como parámetro 'criterioValidacion', que es una función/regla lógica (un test) para decidir qué tarjetas se muestran y cuáles no.
function aplicarFiltroCoreografico(criterioValidacion) {
    // Busca en todo el HTML todas las tarjetas que tengan la clase '.tarjeta-pais' y las guarda en la constante 'tarjetas'.
    const tarjetas = document.querySelectorAll('.tarjeta-pais');

    // '.forEach' recorre las tarjetas una por una. A cada tarjeta individual la llama 't'.
    // 't.classList.add' le agrega la clase CSS 'fade-oculto' a cada tarjeta para iniciar una animación de desaparición suave (baja la opacidad).
    tarjetas.forEach(t => t.classList.add('fade-oculto'));

    // 'setTimeout' genera una pausa de 400 milisegundos para esperar a que termine la animación visual de desvanecimiento antes de cambiar el estado físico de la tarjeta.
    setTimeout(() => {
        // Vuelve a recorrer cada tarjeta 't' después de la pausa.
        tarjetas.forEach(t => {
            // 'classList.toggle' añade o quita una clase según una condición.
            // Si '!criterioValidacion(t)' es verdadero (la tarjeta NO cumple el filtro de búsqueda), le añade 'completamente-oculto' (display: none). Si sí cumple, se la quita.
            t.classList.toggle('completamente-oculto', !criterioValidacion(t));
            
            // Un pequeño retraso de 50ms para que el navegador registre el cambio de estado físico antes de devolverle la opacidad.
            setTimeout(() => {
                // Si la tarjeta NO está oculta (es decir, pasó el filtro), le quita 'fade-oculto' para que vuelva a aparecer con una transición suave.
                if (!t.classList.contains('completamente-oculto')) t.classList.remove('fade-oculto');
            }, 50);
        });
    }, 400); // 400 milisegundos es el tiempo que dura la transición en desaparecer en tu CSS.
}

// Función que prepara los elementos del HTML que van a activar los filtros.
function inicializarFiltros() {
    // Captura el input del buscador de texto por su ID.
    const barraBuscar = document.getElementById('inputBuscarPais');
    // Captura todos los botones de categorías de continentes usando su clase común.
    const botonesFiltro = document.querySelectorAll('.btn-filtro');

    // El signo '?' (optional chaining) evita que la página falle si por algún motivo no existe la barra de búsqueda.
    // 'addEventListener('keyup')' detecta cada vez que el usuario suelta una tecla al escribir en el buscador.
    barraBuscar?.addEventListener('keyup', () => {
        // Lee el texto que el usuario escribió (.value) y lo convierte todo a minúsculas (.toLowerCase) para evitar problemas con mayúsculas.
        const texto = barraBuscar.value.toLowerCase();
        
        // Ejecuta el filtro coreográfico pasándole la regla que debe cumplir cada tarjeta 't'.
        aplicarFiltroCoreografico(t => {
            // Busca el nombre del país dentro de la tarjeta actual. Si existe, lo pasa a minúsculas.
            const nombre = t.querySelector('.nombre-pais')?.textContent.toLowerCase();
            // Retorna 'true' si el nombre del país incluye el texto buscado, de lo contrario retorna 'false'.
            return nombre ? nombre.includes(texto) : false;
        });
    });

    // Recorre cada botón de continente uno por uno (llamado individualmente 'btn').
    botonesFiltro.forEach(btn => {
        // Le añade el evento 'click' a cada botón.
        btn.addEventListener('click', () => {
            // Remueve la clase 'activo' de todos los botones para "desmarcarlos" visualmente.
            botonesFiltro.forEach(b => b.classList.remove('activo'));
            // Le añade la clase 'activo' solo al botón al que el usuario le dio clic.
            btn.classList.add('activo');
            
            // Obtiene el continente guardado en el atributo HTML personalizado 'data-continente' (ej: data-continente="europa").
            const cont = btn.dataset.continente;
            
            // Aplica el filtro: una tarjeta se muestra si el botón presionado es 'todos' O si la tarjeta tiene una clase CSS que coincide con el nombre del continente seleccionado.
            aplicarFiltroCoreografico(t => cont === 'todos' || t.classList.contains(cont));
        });
    });
}

// ==========================================================================
// MOTOR DE VIDEOS INTERCALADOS (Para transiciones de fondo imperceptibles)
// ==========================================================================

// Genera automáticamente una lista (Array) de 45 rutas de video, desde 'videos/pais1.mp4' hasta 'videos/pais45.mp4', para no escribirlas a mano.
const videosLocales = Array.from({ length: 45 }, (_, i) => `videos/pais${i + 1}.mp4`);
// Variable global para recordar cuál es el índice del video que se está reproduciendo actualmente. Empieza en -1 porque no hay ninguno aún.
let indiceVideo = -1;

// Una función flecha que calcula un número entero aleatorio para elegir un video al azar.
// Recibe 'max' (total de videos) y 'actual' (video sonando para no repetirlo seguidamente).
const ganarIndiceAleatorio = (max, actual) => {
    let nuevo;
    // El ciclo 'do...while' genera un número al azar y lo repite si el número nuevo es igual al que ya se estaba reproduciendo. Asegura variedad.
    do { nuevo = Math.floor(Math.random() * max); } while (nuevo === actual && max > 1);
    return nuevo; // Devuelve el nuevo número único seleccionado.
};

// Función principal que configura el sistema de fondo continuo usando dos contenedores de video en paralelo.
function inicializarMotorVideos() {
    // Guarda en una lista (array) los dos elementos de video del HTML ('bg-video-1' y 'bg-video-2').
    const v = [document.getElementById('bg-video-1'), document.getElementById('bg-video-2')];
    // Control de seguridad: Si no existen los videos en el HTML o la lista de videos está vacía, detiene la función inmediatamente para que no dé error.
    if (!v[0] || !v[1] || !videosLocales.length) return;

    // Controla cuál de los dos videos está visible en la pantalla (0 representa el primer contenedor, 1 el segundo).
    let activo = 0;

    // Sub-función interna para asignar la ruta del archivo de video a un contenedor específico y dejarlo precargado.
    const configurarVideo = (idx, srcIdx) => {
        v[idx].src = videosLocales[srcIdx]; // Asigna la ruta del video (ej: 'videos/pais5.mp4') al atributo 'src' del HTML.
        v[idx].load(); // Le ordena al navegador que empiece a descargar/cargar el video en memoria en segundo plano.
    };

    // --- Configuración Inicial ---
    // Elige el primer número de video aleatorio.
    indiceVideo = ganarIndiceAleatorio(videosLocales.length, indiceVideo);
    // Configura el primer contenedor (v[0]) con ese video inicial.
    configurarVideo(0, indiceVideo);
    // Intenta reproducir el video 1. El '.catch' evita que la consola muestre un error feo si el navegador bloquea el autoplay por políticas de sonido.
    v[0].play().catch(e => console.log("Autoplay retenido:", e));

    // Elige un segundo número de video diferente para tenerlo listo de antemano.
    let siguienteIdx = ganarIndiceAleatorio(videosLocales.length, indiceVideo);
    // Configura el segundo contenedor (v[1]) con el video que va a sonar después. Queda listo y pausado en "la recámara".
    configurarVideo(1, siguienteIdx);

    // --- Ciclo de Intercambio Continuo ---
    // 'setInterval' es un temporizador infinito. Cada 10000ms (10 segundos) ejecuta el código de adentro para cambiar de video.
    setInterval(() => {
        // 1. Al video que estaba oculto ('1 - activo') le cambia la clase CSS de 'oculto' a 'activo' para que se superponga visualmente.
        v[1 - activo].classList.replace('oculto', 'activo');
        // 2. Comienza a reproducir el nuevo video que ya estaba precargado, logrando que el cambio sea instantáneo y sin pantallas negras.
        v[1 - activo].play().catch(e => console.log(e));
        // 3. Al video viejo que estaba en pantalla ('activo') le cambia la clase de 'activo' a 'oculto' (lo manda al fondo).
        v[activo].classList.replace('activo', 'oculto');

        // 'setTimeout' ejecuta una acción 1.5 segundos después de que inició el cambio.
        // Esto le da tiempo al nuevo video de cubrir toda la pantalla antes de alterar el contenedor viejo.
        setTimeout(() => {
            // Elige un nuevo número aleatorio para la siguiente transición.
            indiceVideo = ganarIndiceAleatorio(videosLocales.length, indiceVideo);
            // Prepara el contenedor que acaba de quedar oculto ('1 - activo') con el nuevo video para la próxima vuelta del ciclo.
            configurarVideo(1 - activo, indiceVideo); 
        }, 1500);

        // Cambia el valor de 'activo'. Si era 0 pasa a ser 1, si era 1 pasa a ser 0. Intercala los roles para la siguiente ronda en 10 segundos.
        activo = 1 - activo;
    }, 10000); // Esto ocurre rigurosamente cada 10 segundos.
}