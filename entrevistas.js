// entrevistas.js
import { supabase } from './supabase.js';

export async function cargarEntrevistas() {
    const grid = document.getElementById('grid-entrevistas');
    
    const { data, error } = await supabase
        .from('videos_punto506')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        grid.innerHTML = `<p class="text-red-500 text-center col-span-full uppercase text-[10px]">Error: ${error.message}</p>`;
        return;
    }

    grid.innerHTML = data.map(vid => {
        // Función para extraer el ID del video si es una URL completa
        const extractVideoID = (url) => {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : url;
        };

        const idLimpio = extractVideoID(vid.video_id);

        return `
            <article class="video-card bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden flex flex-col group">
                <div class="aspect-video relative overflow-hidden bg-stone-900">
                    <iframe 
                        width="100%" 
                        height="100%" 
                        src="https://www.youtube.com/embed/${idLimpio}?rel=0" 
                        frameborder="0" 
                        allowfullscreen>
                    </iframe>
                </div>
                <div class="p-6">
                    <h3 class="serif-title text-[#d4a373] text-sm font-bold mb-3 tracking-wider">${vid.nombre_negocio}</h3>
                    <p class="text-stone-400 text-xs italic leading-relaxed mb-6 font-light">
                        "${vid.descripcion_corta}"
                    </p>
                    <div class="pt-4 border-t border-white/5 flex justify-between items-center">
                        <span class="text-[8px] text-stone-600 uppercase tracking-widest font-bold">Pococí • 506</span>
                        <a href="https://www.youtube.com/watch?v=${idLimpio}" target="_blank" class="text-[9px] text-[#d4a373] font-black uppercase tracking-widest hover:scale-105 transition-transform">
                            YouTube →
                        </a>
                    </div>
                </div>
            </article>
        `;
    }).join('');
}
