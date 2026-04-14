// Configuración de Supabase
const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Función global para manejar el contacto
window.handleContactClick = function(link) {
    if (link === '#') return;
    if (link.startsWith('mailto:')) {
        window.location.href = link;
    } else {
        window.open(link, '_blank');
    }
};

// NUEVA: Función global para compartir
window.compartirPuesto = async function(titulo, comercio) {
    const shareData = {
        title: `Vacante: ${titulo}`,
        text: `Mira esta oportunidad de empleo en ${comercio} a través de Punto 506.`,
        url: window.location.href
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            // Respaldo para PC si no soporta Share API
            await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
            alert('¡Enlace copiado al portapapeles!');
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
            textoBoton = 'Enviar Correo';
        } else {
            const numLimpio = contacto.replace(/\s+/g, '').replace(/\+/g, '');
            linkAccion = `https://wa.me/${numLimpio}`;
            textoBoton = 'Postular por WhatsApp';
        }

        return `
            <div class="glass-card animate-reveal flex flex-col h-full bg-[#1c1614]/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-[#d4a373]/50 transition-all duration-500">
                
                <div class="relative overflow-hidden bg-black flex items-center justify-center" style="min-height: 320px; max-height: 400px;">
                    <img src="${emp.afiche_url}" 
                         class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                         alt="Vacante ${emp.titulo_puesto}">
                    
                    <button onclick="compartirPuesto('${emp.titulo_puesto}', '${emp.nombre_comercio}')" 
                            class="absolute top-4 left-4 bg-black/60 hover:bg-[#d4a373] text-white hover:text-black p-2 rounded-full border border-white/10 transition-all duration-300 backdrop-blur-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                    </button>

                    <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        <span class="text-[8px] text-[#d4a373] font-black uppercase tracking-widest">Nuevo</span>
                    </div>
                </div>
                
                <div class="p-6 flex flex-col flex-grow">
                    <span class="serif-title text-[8px] text-[#d4a373] tracking-[0.3em] uppercase font-bold">${emp.nombre_comercio}</span>
                    <h3 class="serif-title text-base mt-2 mb-6 text-white leading-tight tracking-wide">${emp.titulo_puesto}</h3>
                    
                    <button onclick="handleContactClick('${linkAccion}')" 
                            class="mt-auto w-full py-4 border border-[#d4a373]/30 text-[#d4a373] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-300 rounded-xl ${!contacto ? 'pointer-events-none opacity-50' : ''}">
                        ${textoBoton}
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', renderEmpleos);
