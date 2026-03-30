// entrevistas.js

export function initEntrevistas() {
    const videoID = "0OVvZqsCFlI"; // ID del video de Uy Ke Rico

    // 1. Crear el botón flotante PREMIUM
    const button = document.createElement('button');
    button.id = 'btn-entrevistas-flotante';
    button.className = `
        fixed bottom-6 right-6 z-[99] 
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

    // 2. Crear el Modal de Videos (Ajustado para Móvil)
    const modalId = 'modal-entrevistas';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = "fixed inset-0 z-[100] hidden bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-6 transition-opacity duration-300";
        modal.innerHTML = `
            <div class="relative w-full max-w-lg md:max-w-4xl bg-[#1c1614] border border-[#A67C52]/20 p-6 md:p-12 overflow-hidden shadow-2xl">
                <button id="close-entrevistas" class="absolute top-4 right-4 z-50 text-stone-500 hover:text-white transition-colors p-2">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <div class="text-center mb-8 md:mb-12">
                    <span class="text-[#A67C52] text-[8px] md:text-[10px] font-black tracking-[0.5em] uppercase block mb-2">Historias locales</span>
                    <h2 class="text-xl md:text-3xl text-white uppercase tracking-[0.1em] font-light">Conoce a los Emprendedores</h2>
                    <div class="h-px w-12 md:w-16 bg-[#A67C52]/50 mx-auto mt-4 md:mt-6"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 overflow-y-auto max-h-[65vh] md:max-h-[60vh] pr-2 custom-scrollbar">
                    
                    <div class="group/video bg-black/40 border border-[#A67C52]/10 overflow-hidden transition-all duration-500 hover:border-[#A67C52]/40">
                        <div class="relative aspect-video overflow-hidden cursor-pointer" onclick="window.open('https://youtu.be/${videoID}', '_blank')">
                            <img src="https://img.youtube.com/vi/${videoID}/maxresdefault.jpg" 
                                 class="w-full h-full object-cover transition-transform duration-[1.5s] group-hover/video:scale-110" 
                                 alt="Miniatura Uy Ke Rico">
                            
                            <div class="absolute inset-0 bg-black/40 group-hover/video:bg-black/20 transition-colors flex items-center justify-center">
                                <div class="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full border border-[#A67C52] bg-[#130f0e]/80 text-[#A67C52] group-hover/video:scale-110 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                </div>
                            </div>
                        </div>
                        
                        <div class="p-4 md:p-5 text-center">
                            <h3 class="text-sm md:text-base text-white uppercase tracking-wider font-bold mb-1">Uy Ke Rico</h3>
                            <p class="text-stone-400 text-[10px] md:text-[11px] italic mb-4">Descubre la historia del sabor 100% guapileño.</p>
                            
                            <button onclick="window.open('https://youtu.be/${videoID}', '_blank')" 
                                    class="w-full py-2.5 md:py-3 text-[#A67C52] text-[8px] font-black uppercase tracking-[0.4em] border border-[#A67C52]/20 hover:bg-[#A67C52] hover:text-[#130f0e] transition-all duration-500">
                                Ver Entrevista
                            </button>
                        </div>
                    </div>

                    </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // 3. Agregar el botón al body
    document.body.appendChild(button);

    // 4. Lógica de abrir y cerrar modales
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
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}
