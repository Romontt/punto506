async function cargarEmpleos() {
    const contenedor = document.getElementById('contenedor-empleos');

    // Solo pedimos los que están aprobados
    const { data: empleos, error } = await supabase
        .from('empleos')
        .select('*')
        .eq('aprobado', true)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error cargando empleos:", error);
        return;
    }

    if (empleos.length === 0) {
        contenedor.innerHTML = `<p class="text-center text-gray-500 col-span-full">Por el momento no hay vacantes disponibles. ¡Vuelve pronto!</p>`;
        return;
    }

    // Limpiamos el cargando y dibujamos las tarjetas
    contenedor.innerHTML = '';
    
    empleos.forEach(empleo => {
        contenedor.innerHTML += `
            <div class="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-gray-700 transition transform hover:scale-105">
                <img src="${empleo.afiche_url}" alt="${empleo.titulo_puesto}" class="w-full h-auto object-cover">
                <div class="p-6">
                    <h3 class="text-xl font-bold text-teal-400">${empleo.titulo_puesto}</h3>
                    <p class="text-gray-300 mb-4">${empleo.nombre_comercio}</p>
                    <a href="https://wa.me/${empleo.whatsapp_contacto}?text=Hola,%20vigo%20su%20anuncio%20en%20Punto506" 
                       target="_blank"
                       class="block w-full text-center bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 rounded-xl transition">
                        Aplicar por WhatsApp
                    </a>
                </div>
            </div>
        `;
    });
}

// Ejecutamos la carga al abrir la página
document.addEventListener('DOMContentLoaded', cargarEmpleos);
