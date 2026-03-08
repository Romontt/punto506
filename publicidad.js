/* publicidad.js 
   Módulo independiente para el botón flotante de Amazon.
*/

(function() {
    // 1. Inyección de Estilos (Actualizados para los dos botones)
    const style = document.createElement('style');
    style.innerHTML = `
        #amazon-floating-container {
            position: fixed;
            bottom: 95px; 
            right: 25px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-family: 'Inter', sans-serif;
        }

        .amazon-tooltip {
            background: #ff9900;
            color: #000;
            padding: 8px 15px;
            border-radius: 15px 15px 0 15px;
            font-size: 11px;
            font-weight: 800;
            margin-bottom: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            max-width: 180px;
            line-height: 1.3;
            text-align: right;
            text-transform: uppercase;
            animation: bounceIn 1s ease-out;
        }

        .amazon-btn-main {
            background: #232f3e;
            border: 2px solid #ff9900;
            width: 55px;
            height: 55px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
            transition: all 0.3s ease;
        }

        .amazon-btn-main:hover { transform: scale(1.1); }
        
        #amazon-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.95);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            backdrop-filter: blur(10px);
        }

        .amazon-modal-card {
            background: #111;
            border: 1px solid #d4a373/20;
            width: 90%;
            max-width: 360px;
            border-radius: 20px;
            padding: 35px 25px;
            text-align: center;
        }

        /* ESTILO DE BOTONES DENTRO DEL MODAL */
        .btn-modal-adv {
            display: block;
            width: 100%;
            padding: 16px;
            border-radius: 8px;
            font-size: 10px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            text-decoration: none;
            margin-bottom: 12px;
            transition: all 0.4s;
        }

        .btn-amazon-direct {
            background: #ff9900;
            color: #000;
        }

        .btn-wa-quote {
            border: 1px solid #ff9900;
            color: #ff9900;
        }

        .btn-modal-adv:hover {
            filter: brightness(1.2);
            transform: translateY(-2px);
        }

        @keyframes bounceIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 2. Crear Estructura HTML
    const amazonHTML = `
        <div id="amazon-floating-container">
            <div class="amazon-tooltip">¿Buscas algo en Amazon para tu negocio? 📦</div>
            <button class="amazon-btn-main" onclick="openAmazonModal()" aria-label="Publicidad y Cotizaciones">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ff9900" stroke-width="2"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M12 3v18"/><path d="M12 12l8.7-4.8"/><path d="M12 12L3.3 7.2"/></svg>
            </button>
        </div>

        <div id="amazon-modal-overlay" onclick="closeAmazonModal(event)">
            <div class="amazon-modal-card">
                <h2 style="color:#ff9900; font-family: 'Cinzel', serif; font-size: 18px; letter-spacing: 3px; margin-bottom: 15px; text-transform: uppercase;">Servicio de Importación</h2>
                <p style="font-size: 13px; color: #888; margin-bottom: 25px; font-style: italic;">
                    "Traemos tus herramientas y suministros desde Amazon hasta la puerta de tu local en Pococí."
                </p>
                
                <a href="https://amzn.to/4bt27Y5" target="_blank" class="btn-modal-adv btn-amazon-direct" rel="nofollow noopener">
                    Ver Ofertas en Amazon
                </a>

                <a href="https://wa.me/50662117858?text=Hola!%20Quiero%20una%20cotización%20para%20un%20producto%20de%20Amazon" target="_blank" class="btn-modal-adv btn-wa-quote">
                    Cotización Gratis (WA)
                </a>

                <button onclick="document.getElementById('amazon-modal-overlay').style.display='none'" style="background:none; border:none; color:#444; cursor:pointer; font-size:11px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px;">Cerrar</button>
            </div>
        </div>
    `;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = amazonHTML;
    document.body.appendChild(wrapper);

    // 3. Funciones Globales
    window.openAmazonModal = () => {
        document.getElementById('amazon-modal-overlay').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeAmazonModal = (e) => {
        if(e.target.id === 'amazon-modal-overlay') {
            document.getElementById('amazon-modal-overlay').style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };
})();
