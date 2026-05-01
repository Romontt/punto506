// --- CONFIGURACIÓN BASE DE DATOS (EMPLEOS) ---
const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- CONFIGURACIÓN ANALÍTICA (MÉTRICAS) ---
const SB_METRICAS_URL = "https://yfqxnjohojtbjevrmbmq.supabase.co";
const SB_METRICAS_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmcXhuam9ob2p0YmpldnJtYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjI4ODgsImV4cCI6MjA4ODM5ODg4OH0.ze32GU0sW7EZ5oicnLFlHpthtLcSTUxZ9rlHSyQLFso";
const supabaseMetricas = supabase.createClient(SB_METRICAS_URL, SB_METRICAS_KEY);

// Función para registrar eventos en la tabla de métricas
async function registrarActividad(tipo, detalle) {
    try {
        await supabaseMetricas
            .from('registros_actividad')
            .insert([{ 
                tipo_evento: tipo, 
                nombre_negocio: detalle, 
                fecha: new Date().toISOString()
            }]);
    } catch (err) {
        console.error("Error analítica:", err);
    }
}

// Función global para el botón de publicar (llamada desde el HTML)
window.trackPublicarClick = () => {
    registrarActividad('clic_publicar_empleo', 'Usuario intenta publicar vacante');
};

// Detectar si es móvil
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// --- GESTIÓN DE HISTORIAL PARA EL ZOOM DE IMÁGENES ---
// Al abrir un modal de imagen, añadimos un estado al historial
window.abrirZoom = function(imgSrc) {
    window.history.pushState({ modalOpen: true }, '');
    // ... aquí iría tu lógica actual para abrir el modal (ej: mostrar un div contenedor)
};

// Escuchar cuando el usuario presiona el botón "atrás"
window.addEventListener('popstate', (event) => {
    // Si el modal está abierto, lo cerramos en lugar de salir de la página
    const modal = document.getElementById('modal-zoom'); // Asegúrate que este sea el ID de tu modal
    if (modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
    }
});

// Función global para manejar el contacto
window.handleContactClick = function(link, contacto, esEmail, titulo, comercio) {
    if (link === '#' || !link) return;
    
    registrarActividad('interes_empleo', `${comercio} | ${titulo}`);

    if (!isMobile && esEmail) {
        alert(`Para postularte, envía tu CV al correo: ${contacto}`);
        return;
    }

    if (link.startsWith('mailto:')) {
        window.location.href = link;
    } else {
        window.open(link, '_blank');
    }
};

// Función global para compartir
window.compartirPuesto = async function(titulo, comercio) {
    registrarActividad('compartir_empleo', `${comercio} | ${titulo}`);

    const shareData = {
        title: `Vacante: ${titulo}`,
        text: `Mira esta oportunidad de empleo en ${comercio} a través de Punto 506.`,
        url: window.location.href
    };

    try {
        if (navigator.share && isMobile) {
            await navigator.share(shareData);
        } else {
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert('¡Enlace copiado al portapapeles para compartir!');
        }
    } catch (err) {
        console.log('Error al compartir:', err);
    }
};

async function renderEmpleos() {
    const grid = document.getElementById('grid-empleos');
    
    if (!grid) {
        console.error("No se encontró el contenedor #grid-empleos");
        return;
    }

    grid.innerHTML = `
        <div class="col-span-full text-center py-20 opacity-40">
            <div class="w-10 h-10 border-2 border-[#d4a373]/20 border-t-[#d4a373] rounded-full animate-spin mx-auto mb-4"></div>
            <p class="serif-title text-[10px] tracking-[0.3em] uppercase text-white">Sincronizando vacantes...</p>
        </div>
    `;

    const { data: empleos, error } = await _supabase
        .from('empleos')
        .select('*')
        .eq('aprobado', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error al obtener empleos:", error);
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full">Error al cargar los empleos.</p>`;
        return;
    }

    if (empleos.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20 border border-white/5 rounded-3xl bg-white/5">
                <p class="text-stone-500 uppercase tracking-[0.3em] text-[10px]">No hay vacantes disponibles en este momento.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = empleos.map(emp => {
        const contacto = emp.whatsapp_contacto ? emp.whatsapp_contacto.trim() : '';
        const esEmail = contacto.includes('@');
        
        let linkAccion = '';
        let textoBoton = '';

        if (!contacto) {
            linkAccion = '#';
            textoBoton = 'Sin contacto disponible';
        } else if (esEmail) {
            linkAccion = `mailto:${contacto}`;
            textoBoton = !isMobile ? 'Ver Contacto' : 'Enviar Correo';
        } else {
            const numLimpio = contacto.replace(/\s+/g, '').replace(/\+/g, '');
            linkAccion = `https://wa.me/${numLimpio}`;
            textoBoton = 'Postular por WhatsApp';
        }

        return `
            <div class="glass-card animate-reveal flex flex-col h-full bg-[#1c1614]/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-[#d4a373]/50 transition-all duration-500">
                <div class="relative overflow-hidden bg-black flex items-center justify-center" style="min-height: 320px; max-height: 400px;">
                    <img src="${emp.afiche_url}" 
                         class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100 cursor-pointer" 
                         alt="Vacante ${emp.titulo_puesto}"
                         onclick="abrirZoom('${emp.afiche_url}')">
                    
                    <button onclick="event.stopPropagation(); compartirPuesto('${emp.titulo_puesto}', '${emp.nombre_comercio}')" 
                            class="absolute top-4 left-4 z-20 bg-[#d4a373] text-black p-2.5 rounded-full border border-white/10 transition-transform active:scale-95 backdrop-blur-md flex items-center justify-center shadow-lg shadow-black/50">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>

                    <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 z-10">
                        <span class="text-[8px] text-[#d4a373] font-black uppercase tracking-widest">Nuevo</span>
                    </div>
                </div>
                
                <div class="p-6 flex flex-col flex-grow">
                    <span class="serif-title text-[8px] text-[#d4a373] tracking-[0.3em] uppercase font-bold">${emp.nombre_comercio}</span>
                    <h3 class="serif-title text-base mt-2 mb-6 text-white leading-tight tracking-wide">${emp.titulo_puesto}</h3>
                    
                    <button onclick="handleContactClick('${linkAccion}', '${contacto}', ${esEmail}, '${emp.titulo_puesto}', '${emp.nombre_comercio}')" 
                            class="mt-auto w-full py-4 border border-[#d4a373]/30 text-[#d4a373] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-300 rounded-xl ${!contacto ? 'pointer-events-none opacity-50' : ''}">
                        ${textoBoton}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

window.scrollToTop = function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.addEventListener('scroll', () => {
    const btn = document.getElementById("btn-top");
    if (btn) {
        if (window.scrollY > 300) {
            btn.style.opacity = "1";
            btn.style.pointerEvents = "auto";
        } else {
            btn.style.opacity = "0";
            btn.style.pointerEvents = "none";
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    registrarActividad('visita_empleos', 'Bolsa de Empleo Punto 506');
    renderEmpleos();
});
