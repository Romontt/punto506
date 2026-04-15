import { supabase } from './supabase.js';

export async function cargarEntrevistas() {
    const grid = document.getElementById('grid-entrevistas');
    
    const { data, error } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = `<div class="col-span-full py-10 text-center text-red-400 text-xs uppercase tracking-widest">Error al conectar con las historias</div>`;
        return;
    }

    grid.innerHTML = data.map(vid => {
        const videoId = vid.video_id.split('/').pop().replace('watch?v=', '');
        
        return `
            <article class="video-card rounded-3xl overflow-hidden flex flex-col h-full group">
                <div class="relative aspect-video overflow-hidden bg-stone-900">
                    <iframe 
                        width="100%" height="100%" 
                        src="https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0" 
                        title="${vid.nombre_negocio}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        class="opacity-80 group-hover:opacity-100 transition-opacity">
                    </iframe>
                </div>

                <div class="p-8 flex flex-col flex-grow">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="w-8 h-[1px] bg-p506-gold/40"></span>
                        <span class="text-[9px] uppercase tracking-[0.3em] text-p506-gold font-semibold">Pococí Local</span>
                    </div>
                    
                    <h2 class="serif-title text-lg text-white group-hover:text-p506-gold transition-colors mb-3 leading-tight">
                        ${vid.nombre_negocio}
                    </h2>
                    
                    <p class="text-stone-500 text-xs leading-relaxed italic mb-8 flex-grow">
                        "${vid.descripcion_corta}"
                    </p>

                    <div class="mt-auto flex justify-between items-center group/btn">
                        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 hover:text-p506-gold transition-all">
                            Ver Historia Completa
                            <svg class="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}
