import { supabase } from './supabase.js';

export async function cargarEntrevistas() {
    const grid = document.getElementById('grid-entrevistas');
    const countDisplay = document.getElementById('count-stories');
    
    const { data, error } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = `<div class="col-span-full py-10 text-center text-red-400 text-[10px] uppercase tracking-widest">Error de conexión</div>`;
        return;
    }

    // Actualizar contador
    if (countDisplay) countDisplay.innerText = data.length;

    grid.innerHTML = data.map((vid, index) => {
        const videoId = vid.video_id.split('/').pop().replace('watch?v=', '');
        
        return `
            <article class="video-card rounded-2xl overflow-hidden flex flex-col group h-full" style="animation: fadeInUp 0.8s ease forwards; animation-delay: ${index * 0.1}s;">
                <div class="relative aspect-video overflow-hidden">
                    <iframe 
                        width="100%" height="100%" 
                        src="https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0" 
                        frameborder="0" 
                        allowfullscreen
                        class="grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700">
                    </iframe>
                    <div class="absolute top-4 left-4">
                        <span class="bg-black/60 backdrop-blur-md text-[#d4a373] text-[7px] font-bold px-2 py-1 rounded border border-[#d4a373]/30 uppercase tracking-widest">Episodio ${data.length - index}</span>
                    </div>
                </div>

                <div class="p-6 flex flex-col flex-grow">
                    <h2 class="serif-title text-sm text-white group-hover:text-[#d4a373] transition-colors mb-3 leading-snug">
                        ${vid.nombre_negocio}
                    </h2>
                    
                    <p class="text-stone-500 text-[11px] leading-relaxed mb-6 flex-grow line-clamp-3">
                        ${vid.descripcion_corta}
                    </p>

                    <div class="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
                        <div class="flex items-center gap-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-[#d4a373] animate-pulse"></div>
                            <span class="text-[8px] text-stone-500 uppercase tracking-tighter">Pococí, Limón</span>
                        </div>
                        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="text-[9px] font-black text-white hover:text-[#d4a373] transition-colors flex items-center gap-2">
                            EXPANDIR
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}
