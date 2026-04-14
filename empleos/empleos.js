// Configuración de Supabase
const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function renderEmpleos() {
    // Asegúrate de que en tu HTML el id sea "grid-empleos"
    const grid = document.getElementById('grid-empleos');
    
    if (!grid) {
        console.error("No se encontró el contenedor #grid-empleos");
        return;
    }

    // Mostrar un estado de carga inicial
    grid.innerHTML = `
        <div class="col-span-full text-center py-20 opacity-40">
            <div class="w-10 h-10 border-2 border-[#d4a373]/20 border-t-[#d4a373] rounded-full animate-spin mx-auto mb-4"></div>
            <p class="serif-title text-[10px] tracking-[0.3em] uppercase text-white">Sincronizando vacantes...</p>
        </div>
    `;

    // Consulta: Solo traemos los que están marcados como aprobados
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

    // Renderizado de las tarjetas
    grid.innerHTML = empleos.map(emp => `
        <div class="glass-card animate-reveal flex flex-col h-full bg-[#1c1614]/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-[#d4a373]/50 transition-all duration-500">
            
            <div class="relative overflow-hidden bg-black flex items-center justify-center" style="min-height: 320px; max-height: 400px;">
                <img src="${emp.afiche_url}" 
                     class="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100" 
                     alt="Vacante ${emp.titulo_puesto}"
                     style="display: block;">
                
                <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    <span class="text-[8px] text-[#d4a373] font-black uppercase tracking-widest">Nuevo</span>
                </div>
            </div>
            
            <div class="p-6 flex flex-col flex-grow">
                <span class="serif-title text-[8px] text-[#d4a373] tracking-[0.3em] uppercase font-bold">${emp.nombre_comercio}</span>
                <h3 class="serif-title text-base mt-2 mb-6 text-white leading-tight tracking-wide">${emp.titulo_puesto}</h3>
                
                <a href="https://wa.me/${emp.whatsapp_contacto ? emp.whatsapp_contacto.replace(/\s+/g, '') : ''}" 
                   target="_blank" 
                   class="mt-auto block ${!emp.whatsapp_contacto ? 'pointer-events-none opacity-50' : ''}">
                    <button class="w-full py-4 border border-[#d4a373]/30 text-[#d4a373] text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-300 rounded-xl">
                        ${emp.whatsapp_contacto ? 'Postular por WhatsApp' : 'Sin contacto disponible'}
                    </button>
                </a>
            </div>
        </div>
    `).join('');
}

// Ejecutar la función cuando el documento esté listo
document.addEventListener('DOMContentLoaded', renderEmpleos);
