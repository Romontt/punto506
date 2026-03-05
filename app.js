let negociosRaw = [];
let categoriaActual = 'todos';
let etiquetaActual = null;

const normalizar = (t) => t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

// --- LÓGICA DE HEADER Y SECCIONES DINÁMICAS ---
function gestionarVisibilidadHeader(categoria) {
    const purposeCard = document.getElementById('purpose-card');
    const discoverTagline = document.getElementById('discover-tagline');
    const growSection = document.getElementById('grow-network-section');

    if (categoria === 'todos') {
        if (purposeCard) purposeCard.classList.remove('hidden');
        if (discoverTagline) discoverTagline.classList.add('hidden');
        if (growSection) growSection.classList.remove('hidden'); 
    } else {
        if (purposeCard) purposeCard.classList.add('hidden');
        if (discoverTagline) discoverTagline.classList.remove('hidden');
        if (growSection) growSection.classList.add('hidden'); 
    }
}

// --- TRANSICIÓN ELEGANTE CON LOGO ---
function ejecutarTransicion(callback) {
    const loader = document.getElementById('preloader');
    if (loader) {
        loader.classList.remove('fade-out');
        setTimeout(() => {
            callback();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => {
                loader.classList.add('fade-out');
            }, 600);
        }, 500);
    } else {
        callback();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- VOLVER AL INICIO ---
function volverInicio() {
    ejecutarTransicion(() => {
        categoriaActual = 'todos';
        etiquetaActual = null;
        const inputBusqueda = document.getElementById('busqueda');
        if (inputBusqueda) inputBusqueda.value = '';
        
        actualizarURL('todos');
        gestionarVisibilidadHeader('todos');
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if(btn.getAttribute('data-cat') === 'todos') activarBoton(btn);
        });
        
        renderLanding();
    });
}

// --- RENDERIZAR CUADROS DE CATEGORÍA ---
function renderLanding() {
    const landing = document.getElementById('landing-categories');
    const resultados = document.getElementById('section-results');
    
    if(!landing) return;
    landing.classList.remove('hidden');
    if(resultados) resultados.classList.add('hidden');
    
    gestionarVisibilidadHeader('todos');

    const categoriasConfig = [
        { id: 'salud', nombre: 'Salud & Bienestar', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1000' },
        { id: 'gastronomía', nombre: 'Gastronomía', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop' },
        { id: 'estética', nombre: 'Estética & Imagen', img: 'img/estetica.png'},
        { id: 'vida nocturna', nombre: 'Vida Nocturna', img: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=1000&auto=format&fit=crop' },
        { id: 'servicios', nombre: 'Servicios Varios', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000' },
        { id: 'turismo', nombre: 'Destinos & Turismo', img: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=1000&auto=format&fit=crop' },
        { id: 'eventos', nombre: 'Eventos & Recepciones', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=1000&auto=format&fit=crop' }
    ];

    landing.className = "grid grid-cols-2 md:grid-cols-3 gap-4 px-4 md:px-0";

    landing.innerHTML = categoriasConfig.map((cat, i) => `
        <div onclick="seleccionarCategoria('${cat.id}')" 
             class="portal-card animate-reveal h-40 md:h-64" 
             style="animation-delay: ${i * 0.1}s">
            <img src="${cat.img}" alt="${cat.nombre}" class="w-full h-full object-cover">
            <div class="portal-card-content p-4">
                <div class="mb-1 h-[1px] w-6 bg-[#d4a373]/50"></div>
                <h3 class="serif-title text-white text-[10px] md:text-lg tracking-[0.2em] uppercase leading-tight">${cat.nombre}</h3>
            </div>
        </div>
    `).join('');
}

function seleccionarCategoria(id) {
    ejecutarTransicion(() => {
        categoriaActual = id;
        etiquetaActual = null;
        
        const botones = document.querySelectorAll('.filter-btn');
        botones.forEach(btn => {
            if(btn.getAttribute('data-cat') === id) activarBoton(btn);
        });

        actualizarURL(id);
        gestionarVisibilidadHeader(id);
        renderSubCategorias();
        aplicarFiltrosCombinados();
    });
}

function actualizarURL(categoria) {
    const nuevaUrl = categoria === 'todos' ? window.location.pathname : `?categoria=${encodeURIComponent(categoria.toLowerCase())}`;
    window.history.pushState({ step: 'categoria', path: nuevaUrl }, '', nuevaUrl);
}

function expandirGrid() {
    const wrapper = document.getElementById('wrapper-grid');
    const btnContainer = document.getElementById('btn-ver-mas-container');
    if(wrapper) wrapper.classList.add('grid-expandido');
    if(btnContainer) btnContainer.classList.add('hidden');
}

function gestionarLimiteVisual(totalMostrados) {
    const wrapper = document.getElementById('wrapper-grid');
    const btnContainer = document.getElementById('btn-ver-mas-container');
    if (!wrapper || !btnContainer) return;

    if (categoriaActual === 'todos' && totalMostrados > 8) {
        wrapper.classList.remove('grid-expandido');
        wrapper.classList.add('grid-limitado');
        btnContainer.classList.remove('hidden');
    } else {
        wrapper.classList.add('grid-expandido');
        btnContainer.classList.add('hidden');
    }
}

async function loadData() {
    try {
        const response = await fetch('negocios.json');
        negociosRaw = await response.json();
        
        const params = new URLSearchParams(window.location.search);
        const catParam = params.get('categoria');

        if (catParam && catParam !== 'todos') {
            categoriaActual = catParam;
            gestionarVisibilidadHeader(catParam);
            aplicarFiltrosCombinados();
        } else {
            renderLanding();
        }

        initFilters();
        actualizarFlechasNav();

        setTimeout(() => {
            const loader = document.getElementById('preloader');
            if (loader) loader.classList.add('fade-out');
        }, 950);

    } catch (e) { 
        const grid = document.getElementById('grid-negocios');
        if(grid) grid.innerHTML = '<p class="text-stone-600 text-center py-20 col-span-full uppercase text-[9px] tracking-[0.5em] font-bold italic">Preparando la experiencia...</p>';
        const loader = document.getElementById('preloader');
        if (loader) loader.classList.add('fade-out');
    }
}

function actualizarFlechasNav() {
    const navScroll = document.getElementById('nav-categories');
    const hint = document.getElementById('scroll-hint');
    
    if(navScroll && hint) {
        navScroll.addEventListener('scroll', () => {
            const maxScroll = navScroll.scrollWidth - navScroll.clientWidth;
            if (navScroll.scrollLeft >= maxScroll - 15) {
                hint.style.opacity = '0';
            } else {
                hint.style.opacity = '1';
            }
        });
    }
}

function renderCards(listaFiltrada) {
    const landing = document.getElementById('landing-categories');
    const resultados = document.getElementById('section-results');
    const grid = document.getElementById('grid-negocios');
    
    if(landing) landing.classList.add('hidden');
    if(resultados) resultados.classList.remove('hidden');
    
    grid.style.opacity = '0';

    setTimeout(() => {
       grid.innerHTML = listaFiltrada.map((n, i) => `
    <article class="group glass-card animate-reveal overflow-hidden"
          style="animation-delay: ${i * 0.08}s; animation-fill-mode: forwards;">
        
        <div class="relative h-48 md:h-64 overflow-hidden">
            <img src="${n.imagen}" 
                 class="w-full h-full object-cover sepia-[10%] group-hover:sepia-0 group-hover:scale-110 transition duration-[2s] ease-out" 
                 alt="${n.nombre}"
                 loading="lazy">
            <div class="absolute inset-0 bg-gradient-to-t from-[#130f0e] via-transparent opacity-80"></div>
            <div class="absolute top-4 left-4 text-[#d4a373] text-[6px] font-black tracking-[0.4em] uppercase bg-[#130f0e]/80 backdrop-blur-md px-2 py-1 border border-[#d4a373]/20">${n.categoria}</div>
        </div>

        <div class="p-5 md:p-8 text-center flex flex-col flex-grow">
            <h3 class="business-title text-base md:text-xl text-white uppercase tracking-wider font-bold mb-2 group-hover:text-[#d4a373] transition-colors duration-500">${n.nombre}</h3>
            <p class="elegant-italic text-stone-400 text-[11px] md:text-[14px] leading-relaxed line-clamp-2 mb-4 italic">
                "${n.servicios_resumen}"
            </p>
            <button onclick="verDetalle(${n.id})" 
                    class="mt-auto w-full py-3 md:py-4 text-[#d4a373] text-[8px] md:text-[9px] font-bold uppercase tracking-[0.5em] border border-[#d4a373]/20 hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-700">
                Detalles
            </button>
        </div>
    </article>
`).join('');
        
        grid.style.opacity = '1';
        gestionarLimiteVisual(listaFiltrada.length);
    }, 300);
}

// --- RENDER SUB-CATEGORÍAS (ETIQUETAS) ---
function renderSubCategorias() {
    const contenedorBase = document.getElementById('sub-categorias');
    if (!contenedorBase) return;
    contenedorBase.innerHTML = '';

    const busqueda = document.getElementById('busqueda')?.value || '';
    // OCULTAR SI: Estamos en "todos" O si hay texto en el buscador
    if (categoriaActual === 'todos' || busqueda.length > 0) return;

    const etiquetas = [...new Set(
        negociosRaw
            .filter(n => normalizar(n.categoria) === normalizar(categoriaActual) && n.etiquetas)
            .flatMap(n => n.etiquetas)
    )];

    if (etiquetas.length === 0) return;

    contenedorBase.className = "relative w-full overflow-hidden mb-6";
    
    const scrollContainer = document.createElement('div');
    scrollContainer.id = "subcat-scroll";
    scrollContainer.className = "flex overflow-x-auto hide-scroll gap-2 py-2 px-4 md:flex-wrap md:justify-center md:px-0";
    
    const hint = document.createElement('div');
    hint.id = "subcat-hint";
    hint.className = "absolute right-0 top-0 bottom-0 flex items-center pr-2 pointer-events-none transition-opacity duration-300 md:hidden";
    hint.innerHTML = `<svg class="w-4 h-4 text-[#d4a373] animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    etiquetas.forEach(tag => {
        const btn = document.createElement('button');
        btn.innerText = tag.toUpperCase();
        const activo = etiquetaActual === tag;
        btn.className = `whitespace-nowrap text-[8px] tracking-[0.4em] px-5 py-2.5 border transition-all duration-700 ${activo ? 'border-[#d4a373] text-[#d4a373] font-bold bg-[#d4a373]/5' : 'border-transparent text-stone-500 hover:text-stone-200'}`;
        btn.onclick = () => {
            etiquetaActual = (etiquetaActual === tag) ? null : tag;
            renderSubCategorias();
            aplicarFiltrosCombinados();
        };
        scrollContainer.appendChild(btn);
    });

    contenedorBase.appendChild(scrollContainer);
    contenedorBase.appendChild(hint);

    scrollContainer.addEventListener('scroll', () => {
        const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
        hint.style.opacity = (scrollContainer.scrollLeft >= maxScroll - 10) ? '0' : '1';
    });
}

function aplicarFiltrosCombinados() {
    const busquedaElement = document.getElementById('busqueda');
    const busqueda = busquedaElement ? normalizar(busquedaElement.value) : '';
    const tituloSeccion = document.getElementById('categoria-titulo');
    
    if(tituloSeccion) {
        tituloSeccion.innerText = categoriaActual === 'todos' ? 'Nuestra Colección' : categoriaActual;
    }

    const filtrados = negociosRaw.filter(n => {
        // --- AQUÍ ESTÁ EL CAMBIO ---
        // Ahora busca en: Nombre, Resumen, Categoría, Descripción y Etiquetas
       const coincideBusqueda = 
    normalizar(n.nombre).includes(busqueda) || 
    normalizar(n.servicios_resumen).includes(busqueda) ||
    normalizar(n.categoria).includes(busqueda) ||
    normalizar(n.keywords_busqueda || "").includes(busqueda) || // <--- NUEVA LÍNEA: Busca en los sinónimos ocultos
    (n.descripcion && normalizar(n.descripcion).includes(busqueda)) || 
    (n.etiquetas && n.etiquetas.some(etq => normalizar(etq).includes(busqueda)));

        const coincideCategoria = categoriaActual === 'todos' || normalizar(n.categoria) === normalizar(categoriaActual);
        const coincideEtiqueta = !etiquetaActual || (n.etiquetas && n.etiquetas.includes(etiquetaActual));
        
        return coincideBusqueda && coincideCategoria && coincideEtiqueta;
    });

    if (busqueda !== '' || categoriaActual !== 'todos') {
        renderCards(filtrados);
        gestionarVisibilidadHeader(categoriaActual);
        renderSubCategorias(); 
    } else {
        renderLanding();
    }
}

function initFilters() {
    const input = document.getElementById('busqueda');
    if(input) input.addEventListener('input', () => aplicarFiltrosCombinados());

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const catValue = btn.getAttribute('data-cat');
            if(catValue === 'todos') {
                volverInicio();
            } else {
                seleccionarCategoria(catValue);
            }
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

// --- MODAL DETALLE ---
function verDetalle(id) {
    const n = negociosRaw.find(item => item.id === id);
    if (!n) return;

    const mensajeWA = encodeURIComponent(`¡Hola! Vi a ${n.nombre} en Punto 506 y me gustaría solicitar más información.`);
    const mapsUrl = (n.maps_link && n.maps_link !== "null") ? n.maps_link : `https://www.google.com/maps/search/${encodeURIComponent(n.nombre + ' ' + n.direccion)}`;

    const modalContenido = document.getElementById('modal-content');
    modalContenido.innerHTML = `
        <div class="relative h-48 md:h-64 overflow-hidden">
            <img src="${n.imagen}" alt="${n.nombre}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-[#1c1614] via-transparent to-black/20"></div>
            <button onclick="cerrarModal()" class="absolute top-6 right-6 z-50 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        
        <div class="p-8 md:p-12 -mt-10 relative z-10 bg-[#1c1614]">
            <div class="text-center mb-10">
                <span class="text-[#d4a373] text-[10px] font-black tracking-[0.5em] uppercase block mb-3">${n.categoria}</span>
                <h2 class="serif-title text-3xl md:text-4xl text-white uppercase tracking-[0.1em]">${n.nombre}</h2>
                <div class="h-px w-16 bg-[#d4a373] mx-auto mt-6"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div class="space-y-6">
                     <div>
                        <h4 class="text-[9px] uppercase tracking-[0.4em] font-black text-stone-500 mb-3">La Experiencia</h4>
                        <p class="elegant-italic text-white text-lg leading-relaxed italic border-l-2 border-[#d4a373]/30 pl-4">"${n.servicios_resumen}"</p>
                     </div>
                     <div>
                        <p class="text-stone-400 text-sm leading-relaxed">${n.descripcion || 'Una propuesta curada bajo los estándares de exclusividad de Punto 506.'}</p>
                     </div>
                </div>
                
                <div class="bg-black/30 p-6 border border-[#d4a373]/10 space-y-6 w-fit h-fit">
                    <div class="flex items-start gap-4">
                        <div class="text-[#d4a373] mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <div>
                            <span class="block text-[8px] text-stone-500 uppercase tracking-widest mb-1">Horarios de Atención</span>
                            <p class="text-stone-200 text-xs font-medium uppercase tracking-wider">${n.horario || 'Consultar disponibilidad'}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="text-[#d4a373] mt-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <div>
                            <span class="block text-[8px] text-stone-500 uppercase tracking-widest mb-1">Ubicación</span>
                            <p class="text-stone-200 text-xs font-medium uppercase tracking-wider leading-relaxed">${n.direccion || 'Distrito Premium, Pococí'}</p>
                        </div>
                    </div>
                </div>
            </div>

           <div class="flex justify-center gap-6 mb-12">
                <a href="https://api.whatsapp.com/send?phone=${n.whatsapp}&text=${mensajeWA}" 
                   target="_blank" 
                   class="w-14 h-14 flex items-center justify-center border border-[#d4a373]/30 text-[#d4a373] hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-500">
                     <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </a>
                <a href="${n.instagram || '#'}" target="_blank" class="w-14 h-14 flex items-center justify-center border border-[#d4a373]/30 text-[#d4a373] hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-500">
                    <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.247 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.247-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.247-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.247 3.608-1.308 1.266-.058 1.646-.07 4.85-.07M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.2 4.353 2.612 6.766 6.96 6.965 1.28.058 1.688.072 4.948.072s3.668-.014 4.948-.072c4.351-.2 6.763-2.612 6.96-6.965.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.2-4.353-2.612-6.765-6.96-6.965C15.668.014 15.26 0 12 0m0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324M12 16a4 4 0 110-8 4 4 0 010 8m6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881"/></svg>
                </a>
                <a href="${mapsUrl}" target="_blank" class="w-14 h-14 flex items-center justify-center border border-[#d4a373]/30 text-[#d4a373] hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-500">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="11" r="3" stroke-width="1.5"/></svg>
                </a>
            </div>

            <div class="border-t border-white/5 pt-10">
                <div id="form-wrapper">
                    <h3 class="text-[9px] text-stone-500 uppercase tracking-[0.4em] mb-6 text-center italic">¿Cómo fue tu experiencia? Tu feedback es valioso</h3>
                    <form id="feedback-form" action="https://formspree.io/f/mlgwzggv" method="POST" class="max-w-xl mx-auto space-y-4">
                        <input type="hidden" name="Negocio" value="${n.nombre}">
                        <textarea name="comentario" required placeholder="Escribe aquí tu sugerencia de forma anónima..." 
                            class="w-full bg-black/50 border border-white/10 p-4 text-white text-xs focus:outline-none focus:border-[#d4a373] transition-colors h-28 resize-none"></textarea>
                        <button type="submit" class="w-full py-4 border border-[#d4a373] text-[#d4a373] text-[9px] font-black uppercase tracking-[0.5em] hover:bg-[#d4a373] hover:text-black transition-all">
                            Enviar Comentarios
                        </button>
                    </form>
                </div>
                <div id="success-message" class="hidden text-center py-8">
                    <div class="mb-4 text-[#d4a373] flex justify-center"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                    <p class="text-[#d4a373] text-[10px] uppercase tracking-[0.4em] font-black">Mensaje recibido con éxito</p>
                </div>
            </div>
        </div>
    `;

    const form = document.getElementById('feedback-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button');
        submitBtn.innerText = "ENVIANDO...";
        submitBtn.disabled = true;

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                document.getElementById('form-wrapper').classList.add('hidden');
                document.getElementById('success-message').classList.remove('hidden');
            }
        } catch (error) {
            submitBtn.innerText = "ERROR";
            submitBtn.disabled = false;
        }
    });

    history.pushState({ step: 'modal' }, "", "#detalle");
    document.getElementById('modal-negocio').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

let cerrandoManual = false;

function cerrarModal() {
    const modal = document.getElementById('modal-negocio');
    if (!modal || modal.classList.contains('hidden')) return;

    cerrandoManual = true;
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';

    if (window.location.hash === "#detalle") {
        history.back();
    }
    
    setTimeout(() => { cerrandoManual = false; }, 100);
}

document.getElementById('modal-negocio').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});
function abrirModalRegistro() {
    const modal = document.getElementById('modal-registro');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

function cerrarModalRegistro() {
    const modal = document.getElementById('modal-registro');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Cerrar al hacer clic fuera del contenido
document.getElementById('modal-registro')?.addEventListener('click', function(e) {
    if (e.target === this) cerrarModalRegistro();
});
// --- MANEJO DEL FORMULARIO DE REGISTRO ---
document.addEventListener('submit', async function(e) {
    // 1. Identificar que es el formulario de registro
    const form = e.target.closest('#registro-form'); 
    if (!form) return;

    // 2. Bloquear la redirección de Formspree inmediatamente
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const textoOriginal = btn.innerText;
    
    // 3. Feedback visual en el botón
    btn.innerText = "PROCESANDO...";
    btn.disabled = true;

    try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
            // 4. ÉXITO: Cambiamos el contenido del botón o mostramos mensaje
            btn.innerText = "¡REGISTRO EXITOSO!";
            btn.style.backgroundColor = "#d4a373"; // Color dorado de tu branding
            btn.style.color = "#130f0e";

            // 5. Cerramos el modal tras una breve pausa para que vean el éxito
            setTimeout(() => {
                cerrarModalRegistro();
                form.reset(); // Limpiar campos
                btn.innerText = textoOriginal;
                btn.disabled = false;
                btn.style.backgroundColor = ""; // Reset estilos
                btn.style.color = "";
            }, 2500);

        } else {
            throw new Error("Error en el servidor");
        }
    } catch (error) {
        // 6. MANEJO DE ERROR
        btn.innerText = "ERROR - REINTENTAR";
        btn.disabled = false;
        console.error("Error al registrar:", error);
    }
});

// --- INICIO DE LA APP ---
loadData();
