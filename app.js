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
        { id: 'turismo', nombre: 'Destinos & Turismo', img: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1000' }
    ];

    landing.innerHTML = categoriasConfig.map((cat, i) => `
        <div onclick="seleccionarCategoria('${cat.id}')" 
             class="portal-card animate-reveal" 
             style="animation-delay: ${i * 0.1}s">
            <img src="${cat.img}" alt="${cat.nombre}" loading="lazy">
            <div class="portal-card-content">
                <div class="mb-2 h-px w-8 bg-[#d4a373]/50"></div>
                <h3 class="serif-title text-white text-lg tracking-[0.3em] uppercase">${cat.nombre}</h3>
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
                         class="w-full h-full object-cover sepia-[10%] group-hover:sepia-0 group-hover:scale-110 transition duration-[2s] ease-out" 
                         alt="${n.nombre}"
                         loading="lazy">
                    <div class="absolute inset-0 bg-gradient-to-t from-[#130f0e] via-transparent opacity-80"></div>
                    <div class="absolute top-6 left-6 text-[#d4a373] text-[7px] font-black tracking-[0.4em] uppercase bg-[#130f0e]/80 backdrop-blur-md px-3 py-1.5 border border-[#d4a373]/20">${n.categoria}</div>
                </div>
                <div class="p-8 text-center flex flex-col flex-grow">
                    <h3 class="business-title text-xl text-white uppercase tracking-wider font-bold mb-4 group-hover:text-[#d4a373] transition-colors duration-500">${n.nombre}</h3>
                    <p class="elegant-italic text-stone-400 text-[14px] leading-relaxed line-clamp-2 mb-8 italic">
                        "${n.servicios_resumen}"
                    </p>
                    <button onclick="verDetalle(${n.id})" 
                            class="mt-auto w-full py-4 text-[#d4a373] text-[9px] font-bold uppercase tracking-[0.5em] border border-[#d4a373]/20 hover:bg-[#d4a373] hover:text-[#130f0e] transition-all duration-700">
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
        btn.className = `text-[8px] tracking-[0.4em] px-5 py-2.5 border transition-all duration-700 ${activo ? 'border-[#d4a373] text-[#d4a373] font-bold bg-[#d4a373]/5' : 'border-transparent text-stone-500 hover:text-stone-200'}`;
        btn.onclick = () => {
            etiquetaActual = (etiquetaActual === tag) ? null : tag;
            renderSubCategorias();
            aplicarFiltrosCombinados();
        };
        contenedor.appendChild(btn);
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
        b.classList.remove('text-[#d4a373]', 'border-[#d4a373]', 'font-black');
        b.classList.add('text-stone-500', 'border-transparent');
    });
    btn.classList.add('text-[#d4a373]', 'border-[#d4a373]', 'font-black');
}

// --- FUNCIÓN VER DETALLE ACTUALIZADA (MODAL PREMIUM) ---
function verDetalle(id) {
    const n = negociosRaw.find(item => item.id === id);
    if (!n) return;

    const mensajeWA = encodeURIComponent(`¡Hola! Vi a ${n.nombre} en Punto 506 y me gustaría solicitar más información.`);

    // Inyectamos el contenido respetando el nuevo diseño de SCROLL ÚNICO y UNA SOLA EQUIS
    document.getElementById('modal-content').innerHTML = `
        <button onclick="cerrarModal()" class="modal-close-btn" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>

        <div class="modal-image-container">
            <img src="${n.imagen}" alt="${n.nombre}">
            <div class="modal-image-overlay"></div>
        </div>

        <div class="modal-body-content">
            <div class="text-center">
                <span class="category-badge">${n.categoria}</span>
                <h2 class="serif-title modal-title">${n.nombre}</h2>
                <div class="accent-line"></div>
            </div>

            <div class="modal-grid">
                <div>
                    <h4 class="info-label">Propuesta de Valor</h4>
                    <p class="elegant-italic text-white text-xl mb-6">"${n.servicios_resumen}"</p>
                    <p class="text-stone-400 text-sm leading-relaxed">
                        ${n.descripcion || 'Una experiencia curada minuciosamente por el equipo de Punto 506 para garantizar los más altos estándares de calidad en Pococí.'}
                    </p>
                </div>

                <div class="modal-feedback">
                    <h4 class="info-label">Información</h4>
                    <div class="info-item">
                        <div class="icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span>${n.horario || 'Horario bajo reserva'}</span>
                    </div>
                    <div class="info-item">
                        <div class="icon"><svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
                        <span>${n.direccion || 'Ubicación Premium Pococí'}</span>
                    </div>
                </div>
            </div>

            <div class="action-buttons">
                <a href="https://api.whatsapp.com/send?phone=${n.whatsapp}&text=${mensajeWA}" target="_blank" class="btn-whatsapp">Contactar WhatsApp</a>
                <a href="${n.instagram || '#'}" target="_blank" class="btn-instagram">Ver Instagram</a>
            </div>

            <div id="feedback-section" class="modal-feedback mt-10">
                <div id="form-wrapper">
                    <h3 class="feedback-title">¿Deseas ayudarnos a elevar nuestro estándar?</h3>
                    <form id="feedback-form" action="https://formspree.io/f/mlgwzggv" method="POST" class="space-y-4">
                        <input type="hidden" name="Negocio" value="${n.nombre}">
                        <textarea name="comentario" required placeholder="Tu opinión es estrictamente anónima..." class="feedback-input"></textarea>
                        <button type="submit" class="btn-submit">Enviar Sugerencia Anónima</button>
                    </form>
                </div>
                <div id="success-message" class="hidden text-center py-4">
                    <p class="text-[#d4a373] text-[10px] font-bold tracking-widest uppercase">¡Gracias por tu aporte!</p>
                </div>
            </div>
        </div>
    `;

    // Lógica de envío sin recarga
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
            submitBtn.innerText = "ERROR - REINTENTAR";
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

// Cerrar al hacer clic fuera del contenido
document.getElementById('modal-negocio').addEventListener('click', function(e) {
    if (e.target === this) cerrarModal();
});

loadData();
