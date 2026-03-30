// entrevistas.js

export function initEntrevistas() {
    // 1. Crear el botón flotante
    const button = document.createElement('button');
    button.id = 'btn-entrevistas-flotante';
    button.className = "fixed bottom-24 right-6 z-50 flex items-center gap-2 bg-black border-2 border-[#D4AF37] text-[#D4AF37] px-4 py-3 rounded-full shadow-lg hover:scale-110 transition-all cursor-pointer";
    
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-youtube text-red-600"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2 60.81 60.81 0 0 1 15 0 2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2 60.81 60.81 0 0 1-15 0 2 2 0 0 1-2-2Z"/><path d="m10 15 5-3-5-3z"/></svg>
        <span class="font-bold text-[10px] uppercase tracking-widest">Entrevistas</span>
    `;

    // 2. Crear el Modal de Videos (Estructura básica)
    const modal = document.createElement('div');
    modal.id = 'modal-entrevistas';
    modal.className = "fixed inset-0 z-[60] hidden bg-black/90 backdrop-blur-md flex items-center justify-center p-4";
    modal.innerHTML = `
        <div class="relative w-full max-w-4xl bg-[#130f0e] border border-[#d4a373]/20 p-8 rounded-lg">
            <button id="close-entrevistas" class="absolute -top-12 right-0 text-white hover:text-[#d4a373] transition-colors">
                <span class="text-xs uppercase tracking-widest font-bold">Cerrar [X]</span>
            </button>
            <div class="text-center mb-8">
                <h2 class="text-[#d4a373] text-2xl font-bold uppercase tracking-widest">Entrevistas Exclusivas</h2>
                <p class="text-stone-500 text-[10px] uppercase mt-2">Conoce la historia detrás de nuestros negocios</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[60vh] pr-2">
                <div class="aspect-video bg-black border border-[#d4a373]/10">
                   <iframe class="w-full h-full" src="https://www.youtube.com/embed/TU_ID_DE_VIDEO" frameborder="0" allowfullscreen></iframe>
                </div>
                <div class="aspect-video bg-black border border-[#d4a373]/10">
                   <iframe class="w-full h-full" src="https://www.youtube.com/embed/OTRO_ID" frameborder="0" allowfullscreen></iframe>
                </div>
            </div>
        </div>
    `;

    // 3. Agregar al body
    document.body.appendChild(button);
    document.body.appendChild(modal);

    // 4. Lógica de abrir y cerrar
    button.onclick = () => {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    const cerrar = () => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        // Pausar videos al cerrar (opcional, refrescando el innerHTML)
        const iframes = modal.querySelectorAll('iframe');
        iframes.forEach(f => { const src = f.src; f.src = src; });
    };

    document.getElementById('close-entrevistas').onclick = cerrar;
    modal.onclick = (e) => { if (e.target === modal) cerrar(); };
}
