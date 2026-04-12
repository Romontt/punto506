const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Verificar sesión
const adminKey = sessionStorage.getItem('key_admin');
if (!adminKey) window.location.href = 'admin.html';

// Variable para rastrear en qué filtro estamos actualmente
let filtroActual = 'pendientes';

async function cargarSolicitudes(filtro = 'todas') {
    filtroActual = filtro; // Guardamos el filtro actual
    const container = document.getElementById('solicitudes-container');
    const counterTotal = document.getElementById('counter-total');
    
    container.innerHTML = `<div class="col-span-full text-center py-20 animate-pulse text-stone-500 uppercase text-[10px] tracking-widest">Sincronizando...</div>`;

    const { data: empleos, error } = await _supabase
        .from('empleos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        return;
    }

    // Actualizar contador
    counterTotal.innerText = empleos.length;

    // Filtrar según el botón presionado
    const listaFiltrada = empleos.filter(job => {
        if (filtro === 'pendientes') return job.aprobado === false;
        if (filtro === 'aprobadas') return job.aprobado === true;
        return true;
    });

    if (listaFiltrada.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-stone-600 uppercase tracking-widest text-[10px] py-10">No hay registros en esta sección.</p>`;
        return;
    }

    container.innerHTML = '';

    listaFiltrada.forEach(job => {
        const card = document.createElement('div');
        card.className = "glass neon-border p-5 rounded-3xl flex flex-col gap-4 group hover:bg-white/[0.05]";
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-white font-bold text-lg leading-tight">${job.nombre_comercio}</h3>
                    <p class="text-[#d4a373] text-[9px] uppercase tracking-[0.2em] font-black mt-1">${job.titulo_puesto}</p>
                </div>
                <div class="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${job.aprobado ? 'bg-green-500/10 text-green-500' : 'bg-orange-500/10 text-orange-400'}">
                    ${job.aprobado ? '● Activa' : '○ Espera'}
                </div>
            </div>
            
            <div class="relative overflow-hidden rounded-2xl aspect-video bg-black/40">
                <img src="${job.afiche_url}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80" alt="Afiche">
            </div>

            <div class="flex gap-2 mt-2">
                ${!job.aprobado ? `
                    <button onclick="aprobar('${job.id}')" class="flex-1 bg-white text-black text-[10px] font-black uppercase py-4 rounded-xl hover:bg-[#d4a373] transition-all duration-300">Aprobar Ahora</button>
                ` : `
                    <div class="flex-1 bg-white/5 border border-white/10 text-stone-400 text-[9px] font-bold uppercase py-4 rounded-xl text-center">Publicado</div>
                `}
                <button onclick="eliminar('${job.id}')" class="px-5 bg-red-500/10 text-red-500 border border-red-500/10 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

// FUNCIONES GLOBALES
window.aprobar = async (id) => {
    const { error } = await _supabase
        .from('empleos')
        .update({ aprobado: true })
        .eq('id', id);

    if (error) {
        alert("Error al aprobar: " + error.message);
    } else {
        cargarSolicitudes('aprobadas');
    }
};

window.eliminar = async (id) => {
    if (!confirm("¿Eliminar esta vacante permanentemente?")) return;
    
    // Forzamos que el ID sea tratado correctamente
    const idParaBorrar = isNaN(id) ? id : parseInt(id);

    const { error } = await _supabase
        .from('empleos')
        .delete()
        .eq('id', idParaBorrar);

    if (error) {
        alert("Error al eliminar: " + error.message);
    } else {
        console.log("Borrado exitoso de:", idParaBorrar);
        cargarSolicitudes(filtroActual);
    }
};
window.cargarSolicitudes = cargarSolicitudes;

// Carga inicial
document.addEventListener('DOMContentLoaded', () => cargarSolicitudes('pendientes'));
