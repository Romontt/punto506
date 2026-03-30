// entrevistas.js

export function initEntrevistas() {
    const videoID = "0OVvZqsCFlI"; // ID confirmado de Uy Ke Rico

    // 1. Botón Flotante: Más minimalista y sofisticado
    const button = document.createElement('button');
    button.id = 'btn-entrevistas-flotante';
    button.className = `
        fixed bottom-6 right-6 z-[99] 
        flex items-center gap-3 
        bg-[#130f0e]/90 backdrop-blur-md border border-[#A67C52]/40 
        text-[#A67C52] px-5 py-2.5 
        rounded-full shadow-2xl
        hover:bg-[#A67C52] hover:text-[#130f0e]
        hover:-translate-y-1 transition-all duration-500 ease-in-out
        cursor-pointer group
    `;
    
    button.innerHTML = `
        <div class="flex items-center justify-center w-6 h-6 rounded-full border border-[#A67C52]/30 group-hover:border-[#130f0e]/30">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
        </div>
        <span class="font-light text-[10px] uppercase tracking-[0.4em]">Entrevistas</span>
    `;

    // 2. Modal: Rediseño Ultra-Fino
    const modalId = 'modal-entrevistas';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = "fixed inset-0 z-[100] hidden bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-500";
        modal.innerHTML = `
            <div class="relative w-full max-w-[400px] md:max-w-3xl bg-[#130f0e] border border-[#A67C52]/10 p-1 shadow-2xl">
                <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-[#A67C52]/40 to-transparent mb-8"></div>
                
                <div class="px-6 pb-10 md:px-12">
                    <button id="close-entrevistas" class="absolute top-4 right-4 text-stone-600 hover:text-[#A67C52] transition-colors duration-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                            <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <div class="text-center mb-10">
                        <span class="text-[#A67C52]/60 text-[8px] tracking-[0.6em] uppercase block mb-3">Exclusivo</span>
                        <h2 class="text-2xl md:text-3xl text-white font-light tracking-[0.15em] uppercase italic serif-title" style="font-family: serif;">Voces que Inspiran</h2>
                        <div class="h-[1px] w-8 bg-[#A67C52]/30 mx-auto mt-6"></div>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
                        
                        <div class="group/video relative bg-black/20 overflow-hidden transition-all duration-700">
                            <div class="relative aspect-video overflow-hidden cursor-pointer border border-white/5" onclick="window.open('https://youtu.be/${videoID}', '_blank')">
                                <img src="https://img.youtube.com/vi/${videoID}/hqdefault.jpg" 
                                     class="w-full h-full object-cover transition-transform duration-[2s] group-hover/video:scale-105 grayscale-[30%] group-hover/video:grayscale-0" 
                                     alt="Entrevista Uy Ke Rico">
                                
                                <div class="absolute inset-0 bg-[#130f0e]/40 group-hover/video:bg-transparent transition-all duration-700 flex items-center justify-center">
                                    <div class="w-12 h-12 flex items-center justify-center rounded-full border border-[#A67C52]/50 bg-[#130f0e]/80 text-[#A67C52] scale-90 group-hover/video:scale-100 transition-all duration-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="pt-5 text-center">
                                <h3 class="text-white text-[11px] uppercase tracking-[0.3em] font-semibold mb-2">Uy Ke Rico</h3>
                                <div class="h-[1px] w-4 bg-[#A67C52]/20 mx-auto mb-3"></div>
                                <p class="text-stone-500 text-[10px] font-light leading-relaxed px-4">Historia de sabor y perseverancia en el corazón de Pococí.</p>
                                
                                <button onclick="window.open('https://youtu.be/${videoID}', '_blank')" 
                                        class="mt-5 text-[#A67C52]/80 text-[9px] uppercase tracking-[0.4em] hover:text-[#A67C52] transition-all duration-300">
                                    [ Ver ahora ]
                                </button>
                            </div>
                        </div>

                        </div>
                </div>
                
                <div class="w-full h-[1px] bg-gradient-to-r from-transparent via-[#A67C52]/20 to-transparent mt-2"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 3. Agregar al Body
    document.body.appendChild(button);

    // 4. Lógica de Apertura/Cierre
    const openModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    button.onclick = openModal;
    document.getElementById('close-entrevistas').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}
