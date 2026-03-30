// entrevistas.js
import { supabase } from './supabase.js'; // Asegúrate de que el archivo supabase.js exista

export async function initEntrevistas() {
    // 1. Inyectar el Botón Flotante al Body
    const btn = document.createElement('div');
    btn.innerHTML = `
        <button id="btn-entrevistas" class="fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-[#130f0e] border-2 border-[#d4a373] text-[#d4a373] px-4 py-3 rounded-full shadow-[0_0_15px_rgba(212,163,115,0.3)] hover:scale-110 transition-all group">
            <svg class="w-6 h-6 text-red-600 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            <span class="font-bold text-[10px] tracking-[0.2em] uppercase">Entrevistas</span>
        </button>
    `;
    document.body.appendChild(btn);

    // 2. Crear el Modal (Estructura oculta)
    const modal = document.createElement('div');
    modal.id = "modal-entrevistas";
    modal.className = "fixed inset-0 z-[100] hidden flex items-center justify-center p-4 bg-black/90 backdrop-blur-md";
    modal.innerHTML = `
        <div class="bg-[#1c1614] border border-[#d4a373]/20 w-full max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div class="p-6 border-b border-white/5 flex justify-between items-center">
                <div>
                    <h2 class="text-[#d4a373] text-xl font-bold uppercase tracking-[0.2em]">Entrevistas Punto 506</h2>
                    <p class="text-stone-500 text-[10px] uppercase tracking-widest mt-1">Conocé la historia detrás del sabor</p>
                </div>
                <button id="cerrar-entrevistas" class="text-stone-400 hover:text-white transition p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round"/></svg>
                </button>
            </div>
            <div id="grid-entrevistas" class="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#130f0e]">
                </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Lógica para abrir/cerrar
    const btnEntrevistas = document.getElementById('btn-entrevistas');
    const modalEntrevistas = document.getElementById('modal-entrevistas');
    const cerrarBtn = document.getElementById('cerrar-entrevistas');

    btnEntrevistas.onclick = async () => {
        modalEntrevistas.classList.remove('hidden');
        cargarVideos();
    };

    cerrarBtn.onclick = () => modalEntrevistas.classList.add('hidden');
}

async function cargarVideos() {
    const grid = document.getElementById('grid-entrevistas');
    grid.innerHTML = '<p class="text-[#d4a373] text-[9px] uppercase tracking-widest text-center col-span-full py-10 animate-pulse">Cargando historias...</p>';

    const { data, error } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = '<p class="text-red-500 text-[9px] text-center col-span-full uppercase tracking-widest">Error al cargar videos</p>';
        return;
    }

    grid.innerHTML = data.map(vid => `
        <div onclick="window.open('https://www.youtube.com/watch?v=${vid.video_id}', '_blank')" 
             class="group cursor-pointer bg-[#1c1614] border border-white/5 rounded-xl overflow-hidden hover:border-[#d4a373]/50 transition-all shadow-lg">
            <div class="aspect-video relative overflow-hidden">
                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${vid.video_id}?controls=0" class="pointer-events-none" frameBorder="0"></iframe>
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
            </div>
            <div class="p-4">
                <h3 class="text-[#d4a373] font-bold text-sm uppercase tracking-wider">${vid.nombre_negocio}</h3>
                <p class="text-stone-400 text-[11px] mt-2 italic leading-relaxed line-clamp-2">"${vid.descripcion_corta}"</p>
                <div class="mt-4 text-[8px] text-white/30 font-black tracking-[0.3em] uppercase group-hover:text-[#d4a373] transition-colors">Ver en YouTube →</div>
            </div>
        </div>
    `).join('');
}
