import { supabase } from './supabase.js';

export async function cargarEntrevistas() {
    const grid = document.getElementById('grid-entrevistas');
    const countDisplay = document.getElementById('count-stories');
    
    const { data, error } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = `<p class="col-span-full text-center text-red-500 uppercase text-[10px]">Error al cargar datos</p>`;
        return;
    }

    if (countDisplay) countDisplay.innerText = data.length;

    grid.innerHTML = data.map((vid, index) => {
        const videoId = vid.video_id.split('/').pop().replace('watch?v=', '');
        
        return `
            <article class="video-card group flex flex-col sm:flex-row overflow-hidden rounded-r-2xl">
                <div class="w-full sm:w-56 shrink-0 aspect-video sm:aspect-square bg-stone-900 relative">
                    <iframe 
                        width="100%" height="100%" 
                        src="https://www.youtube.com/embed/${videoId}?modestbranding=1" 
                        frameborder="0" allowfullscreen
                        class="grayscale-[0.4] group-hover:grayscale-0 transition-all">
                    </iframe>
                </div>

                <div class="p-5 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-2 mb-2">
                            <span class="text-[7px] text-p506-gold font-black uppercase tracking-widest border border-p506-gold/30 px-1.5 py-0.5 rounded">Story ${data.length - index}</span>
                            <span class="text-[7px] text-stone-500 uppercase font-bold tracking-widest italic">Local Business</span>
                        </div>
                        <h2 class="serif-title text-base text-white group-hover:text-p506-gold transition-colors leading-tight mb-2">
                            ${vid.nombre_negocio}
                        </h2>
                        <p class="text-stone-400 text-[10px] leading-relaxed line-clamp-3 font-light italic">
                            "${vid.descripcion_corta}"
                        </p>
                    </div>

                    <div class="mt-4 flex items-center justify-between">
                        <span class="text-[7px] text-stone-600 font-bold uppercase tracking-widest">Pococí, CR</span>
                        <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" class="text-[8px] font-black text-white hover:text-p506-gold transition-all border-b border-white/10 pb-0.5">
                            ABRIR EN YT →
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}
