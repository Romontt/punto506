// entrevistas.js

export function initEntrevistas() {
    // 1. Crear el botón flotante PREMIUM
    const button = document.createElement('button');
    button.id = 'btn-entrevistas-flotante';
    
    // Clases de Tailwind para el diseño premium y elegante
    button.className = `
        fixed bottom-6 right-6 z-[99] 
        flex items-center gap-2.5 
        bg-[#130f0e] border border-[#A67C52] 
        text-[#A67C52] px-6 py-2.5 
        shadow-[0_4px_10px_rgba(166,124,82,0.15)] 
        hover:shadow-[0_0_20px_rgba(166,124,82,0.3)] 
        hover:-translate-y-0.5 
        transition-all duration-300 ease-out 
        cursor-pointer
    `;
    
    // Ícono de Play sutil y texto elegante en dorado quemado
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-play">
            <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        <span class="font-medium text-[9px] uppercase tracking-[0.3em]">Entrevistas</span>
    `;

    // 2. Crear el Modal de Videos (con diseño a juego, si no lo tienes ya)
    const modalId = 'modal-entrevistas';
    let modal = document.getElementById(modalId);
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = "fixed inset-0 z-[100] hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300";
        modal.innerHTML = `
            <div class="relative w-full max-w-4xl bg-[#1c1614] border border-[#A67C52]/20 p-8 md:p-12 overflow-hidden shadow-2xl">
                <button id="close-entrevistas" class="absolute top-6 right-6 z-50 text-stone-500 hover:text-white transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="text-center mb-12">
                    <span class="text-[#A67C52] text-[10px] font-black tracking-[0.5em] uppercase block mb-3">Historias locales</span>
                    <h2 class="serif-title text-3xl md:text-4xl text-white uppercase tracking-[0.1em]">Conoce a los Emprendedores</h2>
                    <div class="h-px w-16 bg-[#A67C52]/50 mx-auto mt-6"></div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto max-h-[60vh] pr-4">
                    <div class="bg-black/30 border border-[#A67C52]/10 overflow-hidden">
                        <div class="aspect-video bg-black relative">
                           <iframe class="w-full h-full pointer-events-none" src="https://www.youtube.com/embed/TU_ID_DE_VIDEO?controls=0" frameborder="0" allowfullscreen></iframe>
                            <div class="absolute inset-0 bg-gradient-to-t from-[#1c1614] to-transparent"></div>
                        </div>
                        <div class="p-5 text-center">
                            <h3 class="business-title text-base text-white uppercase tracking-wider font-bold mb-2">Uy Ke Rico</h3>
                            <p class="elegant-italic text-stone-400 text-[11px] leading-relaxed italic mb-4">Descubre la historia del sabor 100% guapileño.</p>
                             <button onclick="window.open('https://www.youtube.com/watch?v=TU_ID_DE_VIDEO', '_blank')" 
                                     class="w-full py-3 text-[#A67C52] text-[8px] font-bold uppercase tracking-[0.5em] border border-[#A67C52]/20 hover:bg-[#A67C52] hover:text-[#130f0e] transition-all duration-700">
                                Ver entrevista completa
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

    // 4. Lógica de abrir y cerrar modales (Vanilla JS)
    const openModal = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Detener los videos al cerrar
        modal.querySelectorAll('iframe').forEach(f => {
            const src = f.src;
            f.src = src;
        });
    };

    button.onclick = openModal;
    document.getElementById('close-entrevistas').onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
}
