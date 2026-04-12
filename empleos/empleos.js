// app_empleos.js
async function renderEmpleos() {
    const grid = document.getElementById('grid-empleos');
    
    const { data: empleos, error } = await _supabase
        .from('empleos')
        .select('*')
        .eq('aprobado', true);

    if (error) return console.error(error);

    grid.innerHTML = empleos.map(emp => `
        <div class="glass-card animate-reveal">
            <div class="relative overflow-hidden group h-64">
                <img src="${emp.afiche_url}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Vacante">
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <span class="serif-title text-[8px] text-[#d4a373] tracking-[0.3em] uppercase">${emp.nombre_comercio}</span>
                <h3 class="business-title text-sm mt-2 mb-4 text-white">${emp.titulo_puesto}</h3>
                
                <a href="https://wa.me/${emp.whatsapp_contacto}" target="_blank" class="mt-auto">
                    <button class="w-full py-3 border border-[#d4a373]/40 text-[#d4a373] text-[8px] font-black uppercase tracking-[0.2em] hover:bg-[#d4a373] hover:text-[#130f0e] transition-all">
                        Postular por WhatsApp
                    </button>
                </a>
            </div>
        </div>
    `).join('');
}
