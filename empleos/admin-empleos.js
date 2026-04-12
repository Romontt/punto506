const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Verificar si el admin está logueado
const adminKey = sessionStorage.getItem('key_admin');
if (!adminKey) {
    window.location.href = 'admin.html';
}

async function cargarSolicitudes() {
    const container = document.getElementById('solicitudes-container');
    
    // Traer empleos que NO están aprobados primero
    const { data: empleos, error } = await _supabase
        .from('empleos')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        container.innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
        return;
    }

    if (empleos.length === 0) {
        container.innerHTML = `<p class="col-span-full text-center text-stone-600 uppercase tracking-widest text-[10px] py-10">No hay solicitudes pendientes.</p>`;
        return;
    }

    container.innerHTML = '';

    empleos.forEach(job => {
        const card = document.createElement('div');
        card.className = "bg-[#1c1614] border border-white/5 p-6 rounded-xl flex flex-col gap-4";
        
        card.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h3 class="text-white font-bold text-lg">${job.nombre_comercio}</h3>
                    <p class="text-[#d4a373] text-[10px] uppercase tracking-widest font-bold">${job.titulo_puesto}</p>
                </div>
                <span class="${job.aprobado ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'} text-[8px] px-2 py-1 rounded uppercase font-bold tracking-tighter">
                    ${job.aprobado ? 'Aprobado' : 'Pendiente'}
                </span>
            </div>
            
            <a href="${job.afiche_url}" target="_blank" class="block overflow-hidden rounded-lg aspect-video bg-black">
                <img src="${job.afiche_url}" class="w-full h-full object-cover hover:scale-105 transition-transform opacity-70" alt="Afiche">
            </a>

            <div class="grid grid-cols-2 gap-3 mt-2">
                ${!job.aprobado ? `
                    <button onclick="aprobar(${job.id})" class="bg-[#d4a373] text-black text-[9px] font-black uppercase py-3 rounded hover:brightness-110 transition-all">Aprobar</button>
                ` : '<div></div>'}
                <button onclick="eliminar(${job.id})" class="bg-red-500/10 text-red-500 border border-red-500/20 text-[9px] font-black uppercase py-3 rounded hover:bg-red-500 hover:text-white transition-all">Eliminar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function aprobar(id) {
    const { error } = await _supabase
        .from('empleos')
        .update({ aprobado: true })
        .eq('id', id);

    if (error) alert("Error: " + error.message);
    else cargarSolicitudes();
}

async function eliminar(id) {
    if (!confirm("¿Seguro que quieres eliminar esta publicación?")) return;
    
    const { error } = await _supabase
        .from('empleos')
        .delete()
        .eq('id', id);

    if (error) alert("Error: " + error.message);
    else cargarSolicitudes();
}

function cerrarSesion() {
    sessionStorage.removeItem('key_admin');
    window.location.href = 'admin.html';
}

// Iniciar carga
cargarSolicitudes();
