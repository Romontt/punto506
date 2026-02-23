let negociosRaw = [];
let categoriaActual = 'todos';
let etiquetaActual = null;

// --- CONFIGURACIÓN VISUAL PARA EL HERO DINÁMICO ---
const CONFIG_VISUAL = {
    'todos': {
        titulo: 'Descubre. Conecta. Destaca.',
        imagen: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070'
    },
    'gastronomía': {
        titulo: 'Experiencias Gourmet',
        imagen: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070'
    },
    'salud': {
        titulo: 'Bienestar Integral',
        imagen: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070'
    },
    'estética': {
        titulo: 'Belleza & Estilo',
        imagen: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=2070'
    },
    'turismo': {
        titulo: 'Recreación Familiar',
        imagen: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070'
    },
    'servicios': {
        titulo: 'Soluciones Profesionales',
        imagen: 'https://images.unsplash.com/photo-1454165833767-027ffea7025c?q=80&w=2070'
    }
};

const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// --- FUNCIÓN PARA ACTUALIZAR EL HERO ---
function actualizarHero(categoria) {
    const config = CONFIG_VISUAL[normalizar(categoria)] || CONFIG_VISUAL['todos'];
    const heroTitle = document.getElementById('hero-title');
    const heroBg = document.getElementById('hero-bg');

    if (heroTitle && heroBg) {
        heroTitle.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => {
            heroTitle.innerText = config.titulo;
            heroBg.style.backgroundImage = `url('${config.imagen}')`;
            heroTitle.classList.remove('opacity-0', 'translate-y-4');
        }, 400);
    }
}

// --- SEO: URLS AMIGABLES ---
function actualizarURL(categoria) {
    const nuevaUrl = categoria === 'todos' ? window.location.pathname : `?categoria=${encodeURIComponent(categoria.toLowerCase())}`;
    window.history.pushState({ path: nuevaUrl }, '', nuevaUrl);
}

// --- BOTÓN VER MÁS ---
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

    if (categoriaActual === 'todos' && totalMostrados > 8) {
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
        document.getElementById('grid-negocios').innerHTML = '<p class="text-stone-600 text-center py-20 col-span-full uppercase text-[9px] tracking-[0.5em] font-bold italic">Preparando el cafecito...</p>';
        const loader = document.getElementById('preloader');
        if (loader) loader.classList.add('fade-out');
    }
}

// --- RENDER CARDS (ESTILO BENTO HORIZONTAL) ---
function renderCards(lista) {
    const grid = document.getElementById('grid-negocios');
    grid.style.opacity = '0';
    
    const listaFiltrada = categoriaActual === 'todos' 
        ? lista 
        : lista.filter(n => normalizar(n.categoria) === normalizar(categoriaActual));

    setTimeout(() => {
        grid.innerHTML = listaFiltrada.map((n, i) => `
            <article onclick="verDetalle(${n.id})" class="glass-card group flex h-auto md:h-52 cursor-pointer overflow-hidden animate-reveal"
                     style="animation-delay: ${i * 0.1}s; animation-fill-mode: forwards;">
                
                <div class="w-1/3 min-w-[120px] h-full overflow-hidden border-r border-white/5">
                    <img src="${n.imagen}" 
                         class="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-[1s]" 
                         alt="${n.nombre}" loading="lazy">
                </div>

                <div class="w-2/3 p-5 md:p-8 flex flex-col justify-center relative">
                    <span class="text-[7px] tracking-[0.4em] text-[#d4a373] uppercase mb-2 font-black">${n.categoria}</span>
                    <h3 class="serif-title text-white text-lg md:text-xl group-hover:text-[#d4a373] transition duration-500">${n.nombre}</h3>
                    <p class="elegant-italic text-stone-400 text-[13px] mt-2 line-clamp-2 leading-relaxed">
                        ${n.servicios_resumen}
                    </p>
                    
                    <div class="absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                        <svg class="w-4 h-4 text-[#d4a373]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M17 8l4 4m0 0l-4 4m4-4H3" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </article>
        `).join('');
        
        grid.style.opacity = '1';
        gestionarLimiteVisual(listaFiltrada.length);
        actualizarHero(categoriaActual);

    }, 300);
}

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

function initFilters() {
    const input = document.getElementById('busqueda');
    const tituloSeccion = document.getElementById('categoria-titulo');

    input.addEventListener('input', () => {
        aplicarFiltrosCombinados();
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        const catValue = btn.getAttribute('data-cat');
        
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
        });
    });
}

function activarBoton(btn) {
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('text-[#d4a373]', 'border-[#d4a373]', 'font-black');
        b.classList.add('text-stone-500', 'border-transparent');
    });
    btn.classList.add('text-[#d4a373]', 'border-[#d4a373]', 'font-black');
}

function verDetalle(id) {
    const n = negociosRaw.find(item => item.id === id);
    if (!n) return;

    const googleFormBase = "https://docs.google.com/forms/d/e/1FAIpQLSfuSPB2ZQBl9COJLLgRMBkZ72aqlr-bVO-Pb0c0H7UvS801hQ/viewform";
    const prefilledLink = `${googleFormBase}?usp=pp_url&entry.2100078616=${encodeURIComponent(n.nombre)}`;
    const mensajeWA = encodeURIComponent(`¡Hola! Vi a ${n.nombre} en Punto 506 y me gustaría solicitar más información.`);

    document.getElementById('modal-content').innerHTML = `
        <div class="relative h-72 md:h-80">
            <img src="${n.imagen}" alt="${n.nombre}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-[#1c1614] via-transparent"></div>
        </div>
        <div class="p-8 md:p-14 -mt-12 relative z-10 bg-[#1c1614] animate-reveal">
            <span class="text-[#d4a373] text-[10px] font-bold tracking-[0.5em] uppercase border-b border-[#5d1c15] pb-1">${n.categoria}</span>
            <h2 class="serif-title text-3xl md:text-4xl text-white mt-6 mb-8 uppercase tracking-[0.2em] font-bold">${n.nombre}</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div class="space-y-4">
                     <h4 class="text-[9px] uppercase tracking-[0.3em] font-bold text-stone-500">Servicios Especializados</h4>
                     <p class="elegant-italic text-white text-lg leading-relaxed">${n.servicios_resumen}</p>
                </div>
                <div class="flex flex-col gap-5 border-l border-[#d4a373]/20 pl-6">
                    <div class="flex items-center gap-4">
                        <div class="text-[#d4a373] opacity-50"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <p class="text-stone-300 text-[11px] uppercase tracking-widest">${n.horario || 'Consultar Horario'}</p>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="text-[#d4a373] opacity-50"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <p class="text-stone-300 text-[11px] uppercase tracking-widest leading-relaxed">${n.direccion || 'Ubicación en Pococí'}</p>
                    </div>
                </div>
            </div>

            <p class="elegant-italic text-stone-300 text-base leading-relaxed mb-12 border-l border-[#5d1c15] pl-6">
                ${n.descripcion || 'Servicio de alta calidad seleccionado por Punto 506.'}
            </p>

            <div class="flex flex-col sm:flex-row gap-4 mb-12">
                <a href="https://api.whatsapp.com/send?phone=${n.whatsapp}&text=${mensajeWA}" target="_blank" class="w-full text-center py-5 bg-[#d4a373] text-[#130f0e] text-[10px] font-black uppercase tracking-[0.3em] hover:bg-stone-200 transition duration-500">WhatsApp Directo</a>
                <a href="${n.instagram || '#'}" target="_blank" class="w-full text-center py-5 border border-[#d4a373]/20 text-[#d4a373] text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition duration-500">Instagram</a>
            </div>

            <div class="bg-black/20 p-8 border border-dashed border-[#d4a373]/10 text-center">
                <h4 class="text-[10px] font-black uppercase tracking-widest text-[#d4a373] mb-2">Buzón de Mejora Privado</h4>
                <p class="elegant-italic text-[12px] text-stone-500 mb-6 leading-relaxed">Sus sugerencias se comparten de forma totalmente anónima.</p>
                <a href="${prefilledLink}" target="_blank" class="inline-block text-[10px] font-bold text-[#d4a373]/80 uppercase tracking-[0.4em] hover:text-white transition-colors">
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

document.getElementById('modal-negocio').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});

loadData();
