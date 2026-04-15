// entrevistas.js
import { supabase } from './supabase.js';

export async function cargarEntrevistasPagina() {
    const grid = document.getElementById('grid-entrevistas');
    
    // Consulta a Supabase
    const { data, error } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = '<p class="text-red-500 text-[10px] text-center col-span-full uppercase tracking-widest">Error al conectar con la base de datos</p>';
        console.error(error);
        return;
    }

    if (!data || data.length === 0) {
        grid.innerHTML = '<p class="text-stone-500 text-[10px] text-center col-span-full uppercase tracking-widest">Próximamente más historias...</p>';
        return;
    }

    grid.innerHTML = data.map(vid => `
        <article class="video-card bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col group">
            <div class="aspect-video relative overflow-hidden bg-stone-900">
                <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/${vid.video_id}?rel=0" 
                    title="${vid.nombre_negocio}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                </iframe>
            </div>
            
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="serif-title text-p506-gold text-sm font-bold mb-3">${vid.nombre_negocio}</h3>
                <p class="text-stone-400 text-xs italic leading-relaxed mb-6 flex-grow">
                    "${vid.descripcion_corta}"
                </p>
                
                <div class="flex justify-between items-center pt-4 border-t border-white/5">
                    <span class="text-[8px] text-stone-600 uppercase tracking-widest">Pococí, CR</span>
                    <a href="https://www.youtube.com/watch?v=${vid.video_id}" target="_blank" class="text-[9px] text-p506-gold font-black uppercase tracking-widest hover:underline">
                        Ver en YouTube →
                    </a>
                </div>
            </div>
        </article>
    `).join('');
}
