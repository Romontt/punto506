let negociosRaw = [];
let categoriaActual = 'todos';
let etiquetaActual = null;

const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// --- SEO: URLS AMIGABLES ---
function actualizarURL(categoria) {
    const nuevaUrl = categoria === 'todos' ? window.location.pathname : `?categoria=${encodeURIComponent(categoria.toLowerCase())}`;
    window.history.pushState({ path: nuevaUrl }, '', nuevaUrl);
}

// --- SISTEMA VER MÁS (CORREGIDO) ---
function expandirGrid() {
    const wrapper = document.getElementById('wrapper-grid');
    const fade = document.getElementById('grid-fade');
    const btnContainer = document.getElementById('btn-ver-mas-container');

    if(wrapper) wrapper.classList.add('grid-expandido');
    if(fade) fade.classList.add('fade-hidden');
    if(btnContainer) btnContainer.classList.add('hidden');
}

function gestionarLimiteVisual(totalMostrados) {
    const wrapper = document.getElementById('wrapper-grid');
    const fade = document.getElementById('grid-fade');
    const btnContainer = document.getElementById('btn-ver-mas-container');

    if (!wrapper || !fade || !btnContainer) return;

    // Detectamos si es móvil (ancho menor a 768px)
    const esMovil = window.innerWidth < 768;
    // En móvil limitamos si hay más de 2, en PC si hay más de 8
    const limite = esMovil ? 2 : 8;

    if (categoriaActual === 'todos' && totalMostrados > limite) {
        wrapper.classList.remove('grid-expandido');
        wrapper.classList.add('grid-limitado');
        fade.classList.remove('fade-hidden');
        btnContainer.classList.remove('hidden');
    } else {
        wrapper.classList.add('grid-expandido');
        fade.classList.add('fade-hidden');
        btnContainer.classList.add('hidden');
    }
}

// --- CARGA DE DATOS ---
async function loadData() {
    try {
        const response = await fetch('negocios.json');
        negociosRaw = await response.json();
        
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get('categoria');
        if (catParam) {
            categoriaActual = catParam;
        }

        renderCards(negociosRaw);
        initFilters();
        renderSubCategorias();

        setTimeout(() => {
            const loader = document.getElementById('preloader');
            if (loader) loader.classList.add('fade-out');
        }, 950);

    } catch (e) { 
        console.error("Error cargando JSON:", e);
        document.getElementById('grid-negocios').innerHTML = '<p class="text-stone-600 text-center py-20 col-span-full uppercase text-[9px] tracking-[0.5em] font-bold italic">Preparando el cafecito...</p>';
        const loader = document.getElementById('preloader');
        if (loader) loader.classList.add('fade-out');
    }
}

function renderCards(lista) {
    const grid = document.getElementById('grid-negocios');
    grid.style.opacity = '0';
    
    const listaFiltrada = categoriaActual === 'todos' 
        ? lista 
        : lista.filter(n => normalizar(n.categoria) === normalizar(categoriaActual));

    setTimeout(() => {
        grid.innerHTML = listaFiltrada.map((n, i) => `
            <article class="group glass-card animate-reveal"
                  style="animation-delay: ${i * 0.1}s; animation-fill-mode: forwards;">
                <div class="relative overflow-hidden border-b border-[#d4a373]/10">
                    <img src="${n.imagen}" 
                         class="w-full h-full object-cover group-hover:scale-105 transition duration-[1.5s]" 
                         alt="${n.nombre}"
                         loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#130f0e] via-transparent opacity-80"></div>
                    <div class="absolute top-4 left-4 text-[#d4a373] text-[7px] font-black tracking-[0.4em] uppercase bg-[#130f0e]/80 px-2 py-1 border border-[#d4a373]/20">${n.categoria}</div>
                </div>
                
                <div class="p-5 md:p-8 text-center flex flex-col flex-grow">
                    <h3 class="business-title text-lg md:text-xl text-white uppercase tracking-wider font-bold mb-3">${n.nombre}</h3>
                    <p class="elegant-italic text-stone-300 text-[14px] leading-relaxed line-clamp-2 mb-6">
                        ${n.servicios_resumen}
                    </p>
                    <button onclick="verDetalle(${n.id})" 
                            class="mt-auto w-full py-4 text-[#d4a373] text-[9px] font-bold uppercase tracking-[0.3em] border border-[#d4a373]/20 hover:bg-[#d4a373] hover:text-[#130f0e] transition duration-500">
                        Explorar Detalles
                    </button>
                </div>
            </article>
        `).join('');
        grid.style.opacity = '1';

        gestionarLimiteVisual(listaFiltrada.length);
    }, 300);
}

// --- FILTROS Y NAVEGACIÓN ---
function initFilters() {
    const input = document.getElementById('busqueda');
    const tituloSeccion = document.getElementById('categoria-titulo');

    input.addEventListener('input', () => aplicarFiltrosCombinados());

    document.querySelectorAll('.filter-btn').forEach(btn => {
        const catValue = btn.getAttribute('data-cat');
        
        // Activar botón inicial según URL
        if (normalizar(catValue) === normalizar(categoriaActual)) {
            activarBoton(btn);
            tituloSeccion.innerText = categoriaActual === 'todos' ? 'Recomendaciones' : categoriaActual;
        }

        btn.addEventListener('click', () => {
            categoriaActual = catValue;
            etiquetaActual = null;
            tituloSeccion.innerText = categoriaActual === 'todos' ? 'Recomendaciones' : categoriaActual;

            activarBoton(btn);
            actualizarURL(categoriaActual); 
            renderSubCategorias();
            aplicarFiltrosCombinados();
            
            // Scroll suave hacia arriba al cambiar categoría en móvil
            if(window.innerWidth < 768) {
                window.scrollTo({ top: document.getElementById('categoria-titulo').offsetTop - 150, behavior: 'smooth' });
            }
        });
    });
}

function activarBoton(btn) {
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active', 'text-white', 'border-b-2', 'font-black');
        b.classList.add('text-stone-500', 'border-transparent');
    });
    btn.classList.add('active', 'text-white', 'border-b-2', 'font-black');
    btn.classList.remove('text-stone-500', 'border-transparent');
}

// --- LÓGICA DE SUB-CATEGORÍAS (ETIQUETAS) ---
function renderSubCategorias() {
    const contenedor = document.getElementById('sub-categorias');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    if (categoriaActual === 'todos') return;

    const etiquetas = [...new Set(
        negociosRaw
            .filter(n => normalizar(n.categoria) === normalizar(categoriaActual) && n.etiquetas)
            .flatMap(n => n.etiquetas)
    )];

    etiquetas.forEach(tag => {
        const btn = document.createElement('button');
        btn.innerText = tag.toUpperCase();
        const activo = etiquetaActual === tag;
        btn.className = `text-[9px] tracking-[0.3em] px-4 py-2 border transition-all duration-500 ${activo ? 'border-[#d4a373] text-[#d4a373] font-bold' : 'border-transparent text-stone-500 hover:text-stone-300'}`;
        
        btn.onclick = () => {
            etiquetaActual = (etiquetaActual === tag) ? null : tag;
            renderSubCategorias();
            aplicarFiltrosCombinados();
        };
        contenedor.appendChild(btn);
    });
}

function aplicarFiltrosCombinados() {
    const busqueda = normalizar(document.getElementById('busqueda').value);
    
    const filtrados = negociosRaw.filter(n => {
        const coincideBusqueda = normalizar(n.nombre).includes(busqueda) || 
                                 normalizar(n.servicios_resumen).includes(busqueda) ||
                                 normalizar(n.categoria).includes(busqueda);
        
        const coincideCategoria = categoriaActual === 'todos' || normalizar(n.categoria) === normalizar(categoriaActual);
        const coincideEtiqueta = !etiquetaActual || (n.etiquetas && n.etiquetas.includes(etiquetaActual));

        return coincideBusqueda && coincideCategoria && coincideEtiqueta;
    });

    renderCards(filtrados);
}

// --- DETALLE Y MODAL ---
function verDetalle(id) {
    const n = negociosRaw.find(item => item.id === id);
    if (!n) return;

    // RASTREO PARA TU HERMANO (Analytics Simple)
    console.log(`Interés en: ${n.nombre} | Categoría: ${n.categoria}`);

    const googleFormBase = "https://docs.google.com/forms/d/e/1FAIpQLSfuSPB2ZQBl9COJLLgRMBkZ72aqlr-bVO-Pb0c0H7UvS801hQ/viewform";
    const prefilledLink = `${googleFormBase}?usp=pp_url&entry.2100078616=${encodeURIComponent(n.nombre)}`;
    const mensajeWA = encodeURIComponent(`¡Hola! Vi a ${n.nombre} en Punto 506 y me gustaría solicitar más información.`);

    document.getElementById('modal-content').innerHTML = `
        <div class="relative h-64 md:h-80">
            <img src="${n.imagen}" alt="${n.nombre}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-[#1c1614] via-transparent"></div>
        </div>
        <div class="p-6 md:p-12 -mt-10 relative z-10 bg-[#1c1614]">
            <span class="text-[#d4a373] text-[9px] font-bold tracking-[0.5em] uppercase border-b border-[#5d1c15] pb-1">${n.categoria}</span>
            <h2 class="serif-title text-2xl md:text-4xl text-white mt-5 mb-6 uppercase tracking-[0.2em] font-bold">${n.nombre}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div class="space-y-3">
                     <h4 class="text-[8px] uppercase tracking-[0.3em] font-bold text-stone-500">Servicios</h4>
                     <p class="elegant-italic text-white text-base leading-relaxed">${n.servicios_resumen}</p>
                </div>
                <div class="flex flex-col gap-4 border-l border-[#d4a373]/20 pl-5">
                    <div class="flex items-center gap-3">
                        <p class="text-stone-300 text-[10px] uppercase tracking-widest">${n.horario || 'Consultar Horario'}</p>
                    </div>
                    <div class="flex items-start gap-3">
                        <p class="text-stone-300 text-[10px] uppercase tracking-widest leading-relaxed">${n.direccion || 'Guápiles, Pococí'}</p>
                    </div>
                </div>
            </div>

            <p class="elegant-italic text-stone-400 text-[15px] leading-relaxed mb-10 border-l border-[#5d1c15] pl-5">
                ${n.descripcion || 'Servicio de alta calidad seleccionado por Punto 506.'}
            </p>

            <div class="flex flex-col sm:flex-row gap-3 mb-10">
                <a href="https://api.whatsapp.com/send?phone=${n.whatsapp}&text=${mensajeWA}" target="_blank" class="w-full text-center py-4 bg-[#d4a373] text-[#130f0e] text-[9px] font-black uppercase tracking-[0.3em] hover:bg-stone-200 transition">WhatsApp</a>
                <a href="${n.instagram || '#'}" target="_blank" class="w-full text-center py-4 border border-[#d4a373]/20 text-[#d4a373] text-[9px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition">Instagram</a>
            </div>

            <div class="bg-black/20 p-6 border border-dashed border-[#d4a373]/10 text-center">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-[#d4a373] mb-1">Buzón de Mejora</h4>
                <a href="${prefilledLink}" target="_blank" class="text-[9px] font-bold text-[#d4a373]/60 uppercase tracking-[0.4em] hover:text-white transition">
                    Enviar Sugerencia para ${n.nombre} →
                </a>
            </div>
        </div>
    `;
    document.getElementById('modal-negocio').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.getElementById('modal-negocio').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Iniciar aplicación
loadData();

loadData();

