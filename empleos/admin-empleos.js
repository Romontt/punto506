const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function cargarSolicitudes() {
    const container = document.getElementById('solicitudes-container');
    
    // 1. Intentar traer todos los datos sin filtros primero para probar
    const { data: empleos, error } = await _supabase
        .from('empleos')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("Error de Supabase:", error);
        container.innerHTML = `<p class="text-red-500 text-xs uppercase p-10 text-center">Error al conectar: ${error.message}</p>`;
        return;
    }

    // VERIFICACIÓN EN CONSOLA: Abre F12 para ver si esto imprime algo
    console.log("Datos recibidos de Supabase:", empleos);

    if (!empleos || empleos.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-stone-600 uppercase tracking-widest text-[10px] py-10">No hay solicitudes en la base de datos.</p>`;
        return;
    }

    container.innerHTML = '';

    empleos.forEach(job => {
        const card = document.createElement('div');
        card.className = "bg-[#1c1614] border border-white/5 p-6 rounded-xl flex flex-col gap-4";
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-white font-bold text-lg">${job.nombre_comercio || 'Sin nombre'}</h3>
                    <p class="text-[#d4a373] text-[10px] uppercase tracking-widest font-bold">${job.titulo_puesto || 'Sin puesto'}</p>
                </div>
                <span class="${job.aprobado ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} text-[8px] px-2 py-1 rounded uppercase font-bold tracking-tighter">
                    ${job.aprobado ? 'Aprobado' : 'Pendiente'}
                </span>
            </div>
            
            <div class="overflow-hidden rounded-lg aspect-video bg-black/50 border border-white/5">
                <img src="${job.afiche_url}" class="w-full h-full object-cover opacity-80" onerror="this.src='https://via.placeholder.com/400x225?text=Sin+Imagen'">
            </div>

            <div class="grid grid-cols-2 gap-3 mt-2">
                ${!job.aprobado ? `
                    <button onclick="aprobar(${job.id})" class="bg-[#d4a373] text-black text-[9px] font-black uppercase py-3 rounded hover:brightness-110">Aprobar</button>
                ` : '<div class="text-[8px] text-stone-500 uppercase flex items-center">Ya publicado</div>'}
                <button onclick="eliminar(${job.id})" class="bg-red-500/10 text-red-500 border border-red-500/10 text-[9px] font-black uppercase py-3 rounded hover:bg-red-500 hover:text-white">Eliminar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// Funciones globales para los botones
window.aprobar = async (id) => {
    const { error } = await _supabase.from('empleos').update({ aprobado: true }).eq('id', id);
    if (error) alert(error.message);
    else cargarSolicitudes();
};

window.eliminar = async (id) => {
    if (!confirm("¿Eliminar publicación?")) return;
    const { error } = await _supabase.from('empleos').delete().eq('id', id);
    if (error) alert(error.message);
    else cargarSolicitudes();
};

document.addEventListener('DOMContentLoaded', cargarSolicitudes);
