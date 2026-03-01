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
        { id: 'gastronomía', nombre: 'Gastronomía', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000' },
        { id: 'estética', nombre: 'Estética & Imagen', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=1000' },
        { id: 'servicios', nombre: 'Servicios Varios', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1000' },
        { id: 'turismo', nombre: 'Destinos & Turismo', img: 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=1000&auto=format&fit=crop' }
    ];

    landing.innerHTML = categoriasConfig.map((cat, i) => `
        <div onclick="seleccionarCategoria('${cat.id}')" 
             class="portal-card animate-reveal group border-2 border-[#2c1e1a]/10" 
             style="animation-delay: ${i * 0.1}s; border-radius: 4px;">
            <img src="${cat.img}" alt="${cat.nombre}" loading="lazy" class="sepia-[20%] group-hover:sepia-0 transition-all duration-700">
            <div class="portal-card-content bg-gradient-to-t from-[#2c1e1a]/80 to-transparent">
                <div class="mb-3 h-[2px] w-10 bg-[#d4a373]"></div>
                <h3 class="serif-title text-[#f4e9d7] text-xl tracking-[0.2em] uppercase font-bold">${cat.nombre}</h3>
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
    window.history.pushState({ path: nuevaUrl }, '', nuevaUrl);
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
        if(grid) grid.innerHTML = '<p class="text-[#2c1e1a] text-center py-20 col-span-full uppercase text-[10px] tracking-[0.5em] font-bold italic opacity-60">Preparando la experiencia local...</p>';
        const loader = document.getElementById('preloader');
        if (loader) loader.classList.add('fade-out');
    }
}

function actualizarFlechasNav() {
    const hint = document.querySelector('.scroll-hint-arrow');
    const navScroll = document.getElementById('nav-categories');
    
    if(navScroll && hint) {
        navScroll.addEventListener('scroll', () => {
            const maxScroll = navScroll.scrollWidth - navScroll.clientWidth;
            if (navScroll.scrollLeft >= maxScroll - 10) {
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
            <article class="group relative bg-[#f4e9d7] border border-[#2c1e1a]/10 p-1 transition-all duration-500 animate-reveal"
                  style="animation-delay: ${i * 0.08}s; animation-fill-mode: forwards; border-radius: 2px;">
                <div class="relative h-64 overflow-hidden border border-[#2c1e1a]/5">
                    <img src="${n.imagen}" 
                         class="w-full h-full object-cover sepia-[15%] group-hover:sepia-0 group-hover:scale-105 transition duration-[2s] ease-out" 
                         alt="${n.nombre}"
                         loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#2c1e1a]/60 via-transparent opacity-80"></div>
                    <div class="absolute top-4 left-4 bg-[#5d1c15] text-[#f4e9d7] text-[8px] font-bold tracking-[0.3em] uppercase px-3 py-1.5 shadow-lg rotate-[-1deg]">
                        ${n.categoria}
                    </div>
                </div>
                <div class="p-6 text-center flex flex-col flex-grow bg-[url('https://www.transparenttextures.com/patterns/dark-linen.png')]">
                    <h3 class="serif-title text-xl text-[#2c1e1a] uppercase tracking-wider font-bold mb-3 group-hover:text-[#5d1c15] transition-colors duration-500">
                        ${n.nombre}
                    </h3>
                    <div class="w-12 h-[1px] bg-[#2c1e1a]/20 mx-auto mb-4"></div>
                    <p class="elegant-italic text-[#5a4a42] text-[15px] leading-relaxed line-clamp-2 mb-8 italic">
                        "${n.servicios_resumen}"
                    </p>
                    <button onclick="verDetalle(${n.id})" 
                            class="mt-auto w-full py-4 bg-transparent border-2 border-[#2c1e1a] text-[#2c1e1a] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-[#2c1e1a] hover:text-[#f4e9d7] transition-all duration-500">
                        Ver Detalles
                    </button>
                </div>
            </article>
        `).join('');
        grid.style.opacity = '1';
        gestionarLimiteVisual(listaFiltrada.length);
    }, 300);
}

function renderSubCategorias() {
    const contenedorBase = document.getElementById('sub-categorias');
    if (!contenedorBase) return;
    contenedorBase.innerHTML = '';
    if (categoriaActual === 'todos') return;

    const etiquetas = [...new Set(
        negociosRaw
            .filter(n => normalizar(n.categoria) === normalizar(categoriaActual) && n.etiquetas)
            .flatMap(n => n.etiquetas)
    )];

    contenedorBase.className = "relative w-full overflow-hidden mb-6";
    
    const scrollContainer = document.createElement('div');
    scrollContainer.id = "subcat-scroll";
    scrollContainer.className = "flex overflow-x-auto hide-scroll gap-3 py-4 px-4 md:flex-wrap md:justify-center md:px-0";
    
    const hint = document.createElement('div');
    hint.id = "subcat-hint";
    hint.className = "absolute right-0 top-0 bottom-0 flex items-center pr-2 pointer-events-none transition-opacity duration-300 md:hidden";
    hint.innerHTML = `<svg class="w-4 h-4 text-[#5d1c15] animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    etiquetas.forEach(tag => {
        const btn = document.createElement('button');
        btn.innerText = tag.toUpperCase();
        const activo = etiquetaActual === tag;
        // Estilo tipo sello/etiqueta rústica
        btn.className = `whitespace-nowrap text-[9px] tracking-[0.3em] px-6 py-2 border-2 transition-all duration-500 font-bold ${activo 
            ? 'border-[#5d1c15] bg-[#5d1c15] text-[#f4e9d7] shadow-md transform scale-105' 
            : 'border-[#2c1e1a]/10 text-[#2c1e1a]/60 hover:border-[#2c1e1a]/40 hover:text-[#2c1e1a]'}`;
        
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
        tituloSeccion.className = "serif-title text-[#2c1e1a] text-2xl md:text-3xl tracking-[0.2em] uppercase text-center mb-2";
    }

    const filtrados = negociosRaw.filter(n => {
        const coincideBusqueda = normalizar(n.nombre).includes(busqueda) || 
                                 normalizar(n.servicios_resumen).includes(busqueda) ||
                                 normalizar(n.categoria).includes(busqueda);
        const coincideCategoria = categoriaActual === 'todos' || normalizar(n.categoria) === normalizar(categoriaActual);
        const coincideEtiqueta = !etiquetaActual || (n.etiquetas && n.etiquetas.includes(etiquetaActual));
        return coincideBusqueda && coincideCategoria && coincideEtiqueta;
    });

    if (busqueda !== '' || categoriaActual !== 'todos') {
        renderCards(filtrados);
        gestionarVisibilidadHeader(categoriaActual); 
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
        b.classList.remove('text-[#5d1c15]', 'border-[#5d1c15]', 'font-black');
        b.classList.add('text-[#2c1e1a]/50', 'border-transparent');
    });
    btn.classList.add('text-[#5d1c15]', 'border-[#5d1c15]', 'font-black');
}

// --- MODAL DETALLE ---
function verDetalle(id) {
    const n = negociosRaw.find(item => item.id === id);
    if (!n) return;

    const mensajeWA = encodeURIComponent(`¡Hola! Vi a ${n.nombre} en Punto 506 y me gustaría solicitar más información.`);

    const modalContenido = document.getElementById('modal-content');
    // Fondo de papel/kraft para el modal
    modalContenido.className = "bg-[#f4e9d7] border-4 border-[#2c1e1a]/20 shadow-2xl overflow-y-auto max-w-2xl w-full mx-auto relative";
    
    modalContenido.innerHTML = `
        <div class="relative h-56 md:h-72 overflow-hidden border-b border-[#2c1e1a]/10">
            <img src="${n.imagen}" alt="${n.nombre}" class="w-full h-full object-cover sepia-[10%]">
            <div class="absolute inset-0 bg-gradient-to-t from-[#f4e9d7] via-transparent"></div>
            <button onclick="cerrarModal()" class="absolute top-6 right-6 z-50 bg-[#2c1e1a]/80 hover:bg-[#5d1c15] text-[#f4e9d7] p-2 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        
        <div class="p-8 md:p-12 -mt-12 relative z-10">
            <div class="text-center mb-10">
                <span class="text-[#5d1c15] text-[10px] font-black tracking-[0.5em] uppercase block mb-3">${n.categoria}</span>
                <h2 class="serif-title text-3xl md:text-5xl text-[#2c1e1a] uppercase tracking-[0.05em] leading-tight">${n.nombre}</h2>
                <div class="h-[2px] w-20 bg-[#5d1c15]/40 mx-auto mt-6"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                <div class="space-y-6">
                     <div>
                        <h4 class="text-[9px] uppercase tracking-[0.4em] font-black text-[#2c1e1a]/40 mb-3 font-sans">La Experiencia</h4>
                        <p class="elegant-italic text-[#2c1e1a] text-xl leading-relaxed italic border-l-4 border-[#d4a373] pl-5">"${n.servicios_resumen}"</p>
                     </div>
                     <div>
                        <p class="text-[#5a4a42] text-[15px] leading-relaxed font-sans">${n.descripcion || 'Una propuesta curada bajo los estándares de Punto 506.'}</p>
                     </div>
                </div>
                
                <div class="bg-[#2c1e1a]/5 p-8 border border-[#2c1e1a]/10 space-y-6 h-fit rounded-sm">
                    <div class="flex items-start gap-4">
                        <div class="text-[#5d1c15] mt-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <div>
                            <span class="block text-[9px] text-[#2c1e1a]/50 uppercase tracking-widest mb-1 font-bold">Horarios</span>
                            <p class="text-[#2c1e1a] text-[13px] font-bold uppercase tracking-wider">${n.horario || 'Consultar disponibilidad'}</p>
                        </div>
                    </div>
                    <div class="flex items-start gap-4">
                        <div class="text-[#5d1c15] mt-1"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <div>
                            <span class="block text-[9px] text-[#2c1e1a]/50 uppercase tracking-widest mb-1 font-bold">Ubicación</span>
                            <p class="text-[#2c1e1a] text-[13px] font-bold uppercase tracking-wider leading-relaxed">${n.direccion || 'Distrito Local, Pococí'}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-4 mb-12">
                <a href="https://api.whatsapp.com/send?phone=${n.whatsapp}&text=${mensajeWA}" target="_blank" 
                   class="flex-1 text-center py-5 bg-[#2c1e1a] text-[#f4e9d7] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#5d1c15] transition-all shadow-md">Conectar por WhatsApp</a>
                <a href="${n.instagram || '#'}" target="_blank" 
                   class="flex-1 text-center py-5 border-2 border-[#2c1e1a] text-[#2c1e1a] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-[#2c1e1a]/5 transition-all">Instagram Oficial</a>
            </div>

            <div class="border-t-2 border-[#2c1e1a]/5 pt-10">
                <div id="form-wrapper">
                    <h3 class="text-[10px] text-[#2c1e1a]/50 uppercase tracking-[0.4em] mb-6 text-center italic font-sans">Tu opinión construye comunidad</h3>
                    <form id="feedback-form" action="https://formspree.io/f/mlgwzggv" method="POST" class="max-w-xl mx-auto space-y-4">
                        <input type="hidden" name="Negocio" value="${n.nombre}">
                        <textarea name="comentario" required placeholder="Contanos tu experiencia de forma anónima..." 
                            class="w-full bg-white/50 border-2 border-[#2c1e1a]/10 p-5 text-[#2c1e1a] text-sm focus:outline-none focus:border-[#5d1c15] transition-colors h-32 resize-none rounded-sm"></textarea>
                        <button type="submit" class="w-full py-4 border-2 border-[#5d1c15] text-[#5d1c15] text-[10px] font-black uppercase tracking-[0.5em] hover:bg-[#5d1c15] hover:text-[#f4e9d7] transition-all shadow-sm">
                            Enviar Comentarios
                        </button>
                    </form>
                </div>
                <div id="success-message" class="hidden text-center py-8">
                    <div class="mb-4 text-[#5d1c15] flex justify-center"><svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                    <p class="text-[#5d1c15] text-[12px] uppercase tracking-[0.4em] font-black">¡Recibido, compa! Gracias.</p>
                </div>
            </div>
        </div>
    `;

    // Lógica Feedback
    const form = document.getElementById('feedback-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button');
        const originalText = submitBtn.innerText;
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
            submitBtn.innerText = "ERROR AL ENVIAR";
            submitBtn.disabled = false;
            setTimeout(() => { submitBtn.innerText = originalText; }, 2000);
        }
    });

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
