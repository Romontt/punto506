// entrevistas.js

export function initEntrevistas() {
    const videoID = "0OVvZqsCFlI"; // ID confirmado de Uy Ke Rico

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

    // 2. Crear el Modal de Videos (DISEÑO ULTRA ELEGANTE)
    const modalId = 'modal-entrevistas';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = "fixed inset-0 z-[100] hidden bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 transition-all duration-500";
        modal.innerHTML = `
            <div class="relative w-full max-w-5xl bg-[#0a0a0a] border border-[#A67C52]/20 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden">
                
                <div class="absolute inset-2 border border-[#A67C52]/5 pointer-events-none"></div>

                <button id="close-entrevistas" class="absolute top-6 right-6 z-50 text-[#A67C52]/50 hover:text-[#A67C52] transition-colors duration-300">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1">
                        <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>

                <div class="relative z-10 p-8 md:p-16">
                    <div class="text-center mb-12 md:mb-16">
                        <div class="flex items-center justify-center gap-4 mb-4">
                            <div class="h-[1px] w-8 bg-[#A67C52]/30"></div>
                            <span class="text-[#A67C52] text-[8px] md:text-[10px] font-light tracking-[0.8em] uppercase">Punto 506</span>
                            <div class="h-[1px] w-8 bg-[#A67C52]/30"></div>
                        </div>
                        <h2 class="text-2xl md:text-5xl text-white font-extralight tracking-[0.1em] uppercase mb-6" style="font-family: 'Playfair Display', serif;">Voces que Inspiran</h2>
                        <p class="text-[#A67C52]/60 text-[9px] md:text-[11px] tracking-[0.2em] uppercase font-light">Una mirada exclusiva al emprendimiento local</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 overflow-y-auto max-h-[50vh] px-4 custom-scrollbar">
                        
                        <div class="group/video relative">
                            <div class="relative aspect-video overflow-hidden cursor-pointer bg-[#130f0e] border border-[#A67C52]/10" onclick="window.open('https://youtu.be/${videoID}', '_blank')">
                                <img src="https://img.youtube.com/vi/${videoID}/hqdefault.jpg" 
                                     class="w-full h-full object-cover opacity-60 transition-all duration-[2s] group-hover/video:scale-110 group-hover/video:opacity-100 group-hover/video:rotate-1" 
                                     alt="Entrevista Uy Ke Rico">
                                
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <div class="w-14 h-14 flex items-center justify-center rounded-full border border-[#A67C52]/40 bg-black/20 backdrop-blur-sm group-hover/video:bg-[#A67C52] group-hover/video:border-[#A67C52] transition-all duration-500">
                                        <svg class="w-4 h-4 text-[#A67C52] group-hover/video:text-[#130f0e] transition-colors translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                                            <polygon points="5 3 19 12 5 21 5 3"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-6 text-center">
                                <h3 class="text-white text-xs md:text-sm tracking-[0.3em] uppercase font-medium mb-2">Uy Ke Rico</h3>
                                <div class="h-[1px] w-6 bg-[#A67C52]/40 mx-auto mb-3"></div>
                                <p class="text-stone-500 text-[10px] md:text-[11px] leading-relaxed italic max-w-[250px] mx-auto">"La esencia del sabor tradicional convertido en éxito empresarial."</p>
                                
                                <button onclick="window.open('https://youtu.be/${videoID}', '_blank')" 
                                        class="mt-6 px-8 py-2 border border-[#A67C52]/20 text-[#A67C52] text-[8px] uppercase tracking-[0.4em] hover:bg-[#A67C52] hover:text-black transition-all duration-500">
                                    Ver Documental
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

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
    };

    button.onclick = openModal;
    document.getElementById('close-entrevistas').onclick = closeModal;
    modal.onclick = (e) => { if (e.target === modal) closeModal(); };
}
