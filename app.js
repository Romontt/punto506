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
             class="portal-card animate-reveal" 
             style="animation-delay: ${i * 0.1}s">
            <img src="${cat.img}" alt="${cat.nombre}" loading="lazy">
            <div class="portal-card-content">
                <div class="mb-1 h-px w-6 bg-[#e63946]/50"></div>
                <h3 class="serif-title text-white text-[15px] tracking-[0.15em] uppercase">${cat.nombre}</h3>
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
        if(grid) grid.innerHTML = '<p class="text-stone-600 text-center py-20 col-span-full uppercase text-[9px] tracking-[0.5em] font-bold italic">Preparando la experiencia...</p>';
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
            <article class="group glass-card animate-reveal"
                  style="animation-delay: ${i * 0.08}s; animation-fill-mode: forwards;">
                <div class="relative h-64 overflow-hidden">
                    <img src="${n.imagen}" 
                         class="w-full h-full object-cover group-hover:scale-110 transition duration-[2s] ease-out" 
                         alt="${n.nombre}"
                         loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#0f1115] via-transparent opacity-80"></div>
                    <div class="absolute top-6 left-6 text-white text-[7px] font-black tracking-[0.4em] uppercase bg-[#e63946] px-3 py-1.5 shadow-lg">${n.categoria}</div>
                </div>
                <div class="p-8 text-center flex flex-col flex-grow">
                    <h3 class="business-title text-xl text-white uppercase tracking-wider font-bold mb-4 group-hover:text-[#e63946] transition-colors duration-500">${n.nombre}</h3>
                    <p class="elegant-italic text-stone-400 text-[14px] leading-relaxed line-clamp-2 mb-8 italic">
                        "${n.servicios_resumen}"
                    </p>
                    <button onclick="verDetalle(${n.id})" 
                            class="mt-auto w-full py-4 text-white text-[9px] font-bold uppercase tracking-[0.5em] border border-white/10 hover:bg-[#e63946] hover:border-[#e63946] transition-all duration-700">
                        Detalles Exclusivos
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

    contenedorBase.className = "relative w-full overflow-hidden";
    
    const scrollContainer = document.createElement('div');
    scrollContainer.id = "subcat-scroll";
    scrollContainer.className = "flex overflow-x-auto hide-scroll gap-2 py-2 px-4 md:flex-wrap md:justify-center md:px-0";
    
    const hint = document.createElement('div');
    hint.id = "subcat-hint";
    hint.className = "absolute right-0 top-0 bottom-0 flex items-center pr-2 pointer-events-none transition-opacity duration-300 md:hidden";
    hint.innerHTML = `<svg class="w-4 h-4 text-[#e63946] animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    etiquetas.forEach(tag => {
        const btn = document.createElement('button');
        btn.innerText = tag.toUpperCase();
        const activo = etiquetaActual === tag;
        btn.className = `whitespace-nowrap text-[8px] tracking-[0.4em] px-5 py-2.5 border transition-all duration-700 ${activo ? 'bg-[#e63946] border-[#e63946] text-white font-bold' : 'border-white/10 text-stone-500 hover:text-stone-200'}`;
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
        b.classList.remove('text-[#e63946]', 'border-[#e63946]', 'font-black');
        b.classList.add('text-stone-500', 'border-transparent');
    });
    btn.classList.add('text-[#e63946]', 'border-[#e63946]', 'font-black');
}

// --- MODAL DETALLE COMPACTO PARA MÓVIL ---
function verDetalle(id) {
    const n = negociosRaw.find(item => item.id === id);
    if (!n) return;

    const mensajeWA = encodeURIComponent(`¡Hola! Vi a ${n.nombre} en Punto 506 y me gustaría solicitar más información.`);

    const modalContenido = document.getElementById('modal-content');
    modalContenido.innerHTML = `
        <div class="relative w-full h-[35vh] md:h-[50vh] overflow-hidden">
            <img src="${n.imagen}" alt="${n.nombre}" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-[#1a1d23] via-transparent to-black/10"></div>
            <button onclick="cerrarModal()" class="absolute top-4 right-4 z-50 bg-black/50 backdrop-blur-md text-white p-2.5 rounded-full border border-white/10">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
        </div>
        
        <div class="px-5 md:px-12 pb-10 -mt-12 relative z-10">
            <div class="bg-[#1a1d23] p-6 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl">
                
                <div class="text-center mb-6">
                    <span class="text-[#e63946] text-[8px] font-black tracking-[0.4em] uppercase block mb-2">${n.categoria}</span>
                    <h2 class="serif-title text-2xl md:text-4xl text-white uppercase tracking-tight">${n.nombre}</h2>
                </div>
                
                <div class="space-y-6 mb-8">
                    <div>
                        <p class="elegant-italic text-white text-lg md:text-xl leading-snug italic text-center">"${n.servicios_resumen}"</p>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 h-fit">
                        <div class="bg-white/5 p-4 border border-white/5 rounded-xl">
                            <span class="block text-[7px] text-stone-500 uppercase tracking-widest mb-1 font-bold italic">Horario</span>
                            <p class="text-stone-200 text-[10px] uppercase font-medium">${n.horario || 'Lunes a Sábado'}</p>
                        </div>
                        <div class="bg-white/5 p-4 border border-white/5 rounded-xl">
                            <span class="block text-[7px] text-stone-500 uppercase tracking-widest mb-1 font-bold italic">Lugar</span>
                            <p class="text-stone-200 text-[10px] uppercase font-medium truncate">${n.direccion || 'Costa Rica'}</p>
                        </div>
                    </div>
                </div>

                <div class="flex gap-3 mb-10">
                    <a href="https://api.whatsapp.com/send?phone=${n.whatsapp}&text=${mensajeWA}" target="_blank" 
                       class="flex-1 text-center py-4 bg-[#e63946] text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl shadow-lg shadow-[#e63946]/10">WhatsApp</a>
                    <a href="${n.instagram || '#'}" target="_blank" 
                       class="flex-1 text-center py-4 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-xl">Instagram</a>
                </div>

                <div class="border-t border-white/5 pt-8">
                    <div id="form-wrapper">
                        <form id="feedback-form" action="https://formspree.io/f/mlgwzggv" method="POST" class="max-w-xl mx-auto space-y-3">
                            <input type="hidden" name="Negocio" value="${n.nombre}">
                            <textarea name="comentario" required placeholder="Tu opinión nos importa (anónimo)..." 
                                class="w-full bg-black/40 border border-white/5 p-4 text-white text-xs focus:outline-none focus:border-[#e63946] transition-all h-24 resize-none rounded-xl"></textarea>
                            <button type="submit" class="w-full py-4 bg-transparent border border-[#e63946]/40 text-[#e63946] text-[8px] font-black uppercase tracking-[0.4em] rounded-xl hover:bg-[#e63946] hover:text-white transition-all">
                                Enviar Sugerencia
                            </button>
                        </form>
                    </div>
                    <div id="success-message" class="hidden text-center py-6 bg-[#2d6a4f]/10 rounded-xl border border-[#2d6a4f]/20">
                        <p class="text-[#2d6a4f] text-[9px] uppercase tracking-[0.3em] font-black">¡Gracias por tu mensaje!</p>
                    </div>
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

    document.getElementById('modal-negocio').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function cerrarModal() {
    document.getElementById('modal-negocio').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

loadData();
