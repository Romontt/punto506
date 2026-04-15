import { supabase } from './supabase.js';

export async function cargarEntrevistas() {
    const grid = document.getElementById('grid-entrevistas');
    const countDisplay = document.getElementById('count-stories');
    
    const { data, error } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 uppercase text-[10px] tracking-widest py-12">Error al cargar datos • ${error.message}</p>`;
        return;
    }

    if (countDisplay) countDisplay.innerText = data.length;

    grid.innerHTML = data.map((vid, index) => {
        const videoId = vid.video_id.split('/').pop().replace('watch?v=', '');
        
        return `
            <article class="video-card group flex flex-col overflow-hidden rounded-t-2xl h-full" style="animation: fadeInUp 0.7s ease forwards; animation-delay: ${index * 0.1}s;">
                
                <div class="relative aspect-video w-full overflow-hidden bg-stone-900 shadow-2xl">
                    <iframe 
                        width="100%" height="100%" 
                        src="https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0" 
                        title="${vid.nombre_negocio}" 
                        frameborder="0" allowfullscreen
                        class="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-105">
                    </iframe>
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none transition-opacity group-hover:opacity-30"></div>
                </div>

                <div class="p-6 md:p-8 flex flex-col flex-grow justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-4">
                            <span class="text-[8px] text-p506-gold font-black uppercase tracking-widest border border-p506-gold/30 px-2 py-0.5 rounded">Historia #${data.length - index}</span>
                            <span class="text-[8px] text-stone-500 uppercase font-bold tracking-widest italic leading-none">Pococí • 506</span>
                        </div>
                        
                        <h2 class="serif-title text-base text-white group-hover:text-p506-gold transition-colors leading-tight mb-4 tracking-wider">
                            ${vid.nombre_negocio}
                        </h2>
                        
                        <p class="text-stone-400 text-xs leading-relaxed line-clamp-2 font-light italic opacity-80 group-hover:opacity-100 transition-opacity">
                            "${vid.descripcion_corta}"
                        </p>
                    </div>

                    <div class="mt-8 flex items-center justify-between pt-4 border-t border-white/5">
                        <div class="flex items-center gap-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-p506-gold animate-pulse"></div>
                            <span class="text-[9px] text-stone-600 font-bold uppercase tracking-widest">Pococí, CR</span>
                        </div>
                        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="text-[10px] font-black text-white hover:text-p506-gold transition-all flex items-center gap-1.5">
                            VER HISTORIA
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}
