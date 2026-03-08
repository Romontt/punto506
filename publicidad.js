/* publicidad.js 
   Módulo independiente para el botón flotante de Amazon.
   Inyecta su propio HTML, CSS y Lógica sin afectar el sitio principal.
*/

(function() {
    // 1. Inyección de Estilos (Corregidos y unificados)
    const style = document.createElement('style');
    style.innerHTML = `
        #amazon-floating-container {
            position: fixed;
            bottom: 25px;
            right: 25px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        }

        .amazon-tooltip {
            background: #ff9900;
            color: #000;
            padding: 8px 15px;
            border-radius: 15px 15px 0 15px; /* Estilo gota de chat */
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            max-width: 200px;
            line-height: 1.3;
            text-align: right;
            animation: bounceIn 1s ease-out, pulse 2s infinite;
        }

        .amazon-btn-main {
            background: #232f3e;
            border: 2px solid #ff9900;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 8px 20px rgba(0,0,0,0.4);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .amazon-btn-main:hover { transform: scale(1.1) rotate(5deg); }
        
        #amazon-modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.9);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 100000;
            backdrop-filter: blur(8px);
        }

        .amazon-modal-card {
            background: #111;
            border: 1px solid #333;
            width: 90%;
            max-width: 380px;
            border-radius: 24px;
            padding: 30px;
            text-align: center;
            color: #eee;
        }

        .amazon-wa-link {
            background: #ff9900;
            color: #000;
            display: block;
            padding: 15px;
            border-radius: 12px;
            font-weight: bold;
            text-decoration: none;
            margin: 20px 0;
            transition: background 0.3s;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }

        @keyframes bounceIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 2. Crear Estructura HTML
    const amazonHTML = `
        <div id="amazon-floating-container">
            <div class="amazon-tooltip">¿Necesitas traer algo de Amazon para tu negocio? 📦</div>
            <button class="amazon-btn-main" onclick="openAmazonModal()">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff9900" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
            </button>
        </div>

        <div id="amazon-modal-overlay" onclick="closeAmazonModal(event)">
            <div class="amazon-modal-card">
                <h2 style="color:#ff9900; font-size: 22px; margin-bottom: 10px;">Cotización Gratis</h2>
                <p style="font-size: 14px; line-height: 1.5; color: #aaa;">
                    Dinos qué ocupas traer de Amazon y te damos la información y cotización totalmente gratis. ¡Ideal para tu negocio en Guápiles!
                </p>
                
                <div style="background:#222; height:100px; margin: 20px 0; border-radius: 15px; display: flex; align-items: center; justify-content: center; border: 1px dashed #444; color: #555; font-style: italic; font-size: 12px;">
                    [ Espacio para Google AdSense ]
                </div>

                <a href="https://wa.me/50662117858?text=Hola!%20Vengo%20del%20Directorio.%20Quiero%20cotizar%20un%20producto%20de%20Amazon" target="_blank" class="amazon-wa-link">
                    Consultar por WhatsApp
                </a>
                <button onclick="document.getElementById('amazon-modal-overlay').style.display='none'" style="background:none; border:none; color:#777; cursor:pointer; font-size:13px;">Cerrar</button>
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
