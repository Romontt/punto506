async function cargarEmpleos() {
    const contenedor = document.getElementById('contenedor-empleos');

    // Jalar datos de la tabla 'empleos'
    const { data: empleos, error } = await supabase
        .from('empleos')
        .select('*')
        .eq('aprobado', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    if (empleos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-span-full text-center p-20 border border-dashed border-stone-800 rounded-2xl">
                <p class="elegant-italic text-stone-500">No hay vacantes activas por el momento.</p>
            </div>`;
        return;
    }

    contenedor.innerHTML = '';

    empleos.forEach(empleo => {
        contenedor.innerHTML += `
            <div class="glass-card animate-reveal">
                <div class="relative overflow-hidden group h-80">
                    <img src="${empleo.afiche_url}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Afiche">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#130f0e] to-transparent opacity-60"></div>
                </div>
                <div class="p-8">
                    <span class="text-[10px] tracking-[0.2em] text-[#d4a373] uppercase font-bold">${empleo.nombre_comercio}</span>
                    <h3 class="business-title text-xl mt-2 mb-6">${empleo.titulo_puesto}</h3>
                    
                    <a href="https://wa.me/${empleo.whatsapp_contacto}?text=Hola,%20vi%20la%20vacante%20de%20${empleo.titulo_puesto}%20en%20Punto506" 
                       target="_blank" 
                       class="w-full">
                        <button class="w-full">POSTULAR POR WHATSAPP</button>
                    </a>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', cargarEmpleos);
