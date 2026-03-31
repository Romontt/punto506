// entrevistas.js

export function initEntrevistas() {
    const videoID = "0OVvZqsCFlI"; // ID confirmado de Uy Ke Rico

    // 1. Crear el botón flotante PREMIUM (Posición ajustada a bottom-24)
    const button = document.createElement('button');
    button.id = 'btn-entrevistas-flotante';
    button.className = `
        fixed bottom-24 right-6 z-[99] 
        flex items-center gap-2.5 
        bg-[#130f0e] border border-[#A67C52] 
        text-[#A67C52] px-5 py-2.5 md:px-6 md:py-2.5
        shadow-[0_4px_10px_rgba(166,124,82,0.15)] 
        hover:shadow-[0_0_20px_rgba(166,124,82,0.3)] 
        hover:-translate-y-0.5 
        transition-all duration-300 ease-out 
        cursor-pointer
    `;
    
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        <span class="font-medium text-[9px] md:text-[10px] uppercase tracking-[0.3em]">Entrevistas</span>
    `;

    // 2. Crear el Modal de Videos (DISEÑO REFINADO Y ELEGANTE)
    const modalId = 'modal-entrevistas';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = "fixed inset-0 z-[100] hidden bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 transition-opacity duration-500";
        modal.innerHTML = `
            <div class="relative w-full max-w-lg md:max-w-4xl bg-[#0a0a0a] border border-[#A67C52]/30 overflow-hidden shadow-[0_0_60px_rgba(0,0,0,1)] rounded-sm">
                
                <div class="absolute inset-1.5 border border-[#A67C52]/5 pointer-events-none"></div>

                <button id="close-entrevistas" class="absolute top-5 right-5 z-50 text-stone-600 hover:text-[#A67C52] transition-colors p-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <div class="text-center mb-8 md:mb-12 pt-8 md:pt-12">
                    <span class="text-[#A67C52] text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase block mb-2">Historias locales</span>
                    <h2 class="text-xl md:text-3xl text-white uppercase tracking-[0.1em] font-light">Conoce a los Emprendedores</h2>
                    <div class="h-px w-12 md:w-16 bg-[#A67C52]/50 mx-auto mt-4 md:mt-6"></div>
                </div>
                    
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 overflow-y-auto max-h-[55vh] p-8 md:p-14 pt-0 md:pt-0 pr-2 custom-scrollbar">
                    
                    <div class="group/video relative">
                        <div id="video-container-${videoID}" class="relative aspect-video overflow-hidden bg-black border border-[#A67C52]/10">
                            <div id="thumb-${videoID}" class="absolute inset-0 z-10 cursor-pointer">
                                <img src="https://img.youtube.com/vi/${videoID}/hqdefault.jpg" 
                                     class="w-full h-full object-cover opacity-70 transition-all duration-[1.5s] group-hover/video:scale-110 group-hover/video:opacity-100" 
                                     style="object-position: center;"
                                     alt="Entrevista Uy Ke Rico">
                                
                                <div class="absolute inset-0 bg-black/40 group-hover/video:bg-transparent transition-colors flex items-center justify-center">
                                    <div class="w-12 h-12 flex items-center justify-center rounded-full border border-[#A67C52]/50 bg-[#0a0a0a]/80 text-[#A67C52] group-hover/video:bg-[#A67C52] group-hover/video:text-black transition-all duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-5 text-center">
                            <h3 class="text-sm md:text-base text-white uppercase tracking-[0.2em] font-light mb-2">Uy Ke Rico</h3>
                            <p class="text-stone-500 text-[10px] md:text-[11px] font-light italic mb-6 leading-relaxed">"Descubre la historia del sabor 100% guapileño"</p>
                            
                            <button id="play-btn-${videoID}" 
                                    class="inline-block px-8 py-2 text-[#A67C52] text-[8px] font-bold uppercase tracking-[0.5em] border border-[#A67C52]/20 hover:bg-[#A67C52] hover:text-black transition-all duration-700">
                                Ver Entrevista
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Función para cargar el video (Embed)
    const loadVideo = () => {
        const container = document.getElementById(`video-container-${videoID}`);
        container.innerHTML = `
            <iframe 
                class="w-full h-full" 
                src="https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0&modestbranding=1" 
                title="YouTube video player" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowfullscreen>
            </iframe>`;
    };

    // 3. Agregar el botón al body
    document.body.appendChild(button);

    // 4. Lógica de modales
    const openModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Limpiamos el video al cerrar para que deje de sonar
        document.getElementById(`video-container-${videoID}`).innerHTML = `
            <div id="thumb-${videoID}" class="absolute inset-0 z-10 cursor-pointer">
                <img src="https://img.youtube.com/vi/${videoID}/hqdefault.jpg" class="w-full h-full object-cover opacity-70" alt="Entrevista">
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div class="w-12 h-12 flex items-center justify-center rounded-full border border-[#A67C52]/50 bg-[#0a0a0a]/80 text-[#A67C52]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="translate-x-0.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    </div>
                </div>
            </div>`;
        // Re-asignamos el evento al nuevo thumb creado
        document.getElementById(`thumb-${videoID}`).onclick = loadVideo;
    };

    button.onclick = openModal;
    document.getElementById('close-entrevistas').onclick = closeModal;
    document.getElementById(`thumb-${videoID}`).onclick = loadVideo;
    document.getElementById(`play-btn-${videoID}`).onclick = loadVideo;

    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}
