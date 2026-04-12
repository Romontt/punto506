const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('form-publicar');
const btnEnviar = document.getElementById('btn-enviar');
const mensajeExito = document.getElementById('mensaje-exito');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnEnviar.innerText = "ENVIANDO...";
    btnEnviar.disabled = true;

    // Captura de datos - Asegúrate de que los IDs coincidan con tu HTML
    const nombreComercio = document.getElementById('nombre_comercio').value;
    const tituloPuesto = document.getElementById('titulo_puesto').value;
    const aficheUrl = document.getElementById('afiche_url').value;

    try {
        // INSERT coincidiendo exactamente con tus columnas de la captura
        const { error } = await _supabase
            .from('empleos')
            .insert([
                { 
                    nombre_comercio: nombreComercio, 
                    titulo_puesto: tituloPuesto, // Nombre exacto de tu tabla
                    afiche_url: aficheUrl,       // Nombre exacto de tu tabla
                    aprobado: false              // Para que tú lo valides luego
                }
            ]);

        if (error) throw error;

        // Éxito
        form.classList.add('hidden');
        mensajeExito.classList.remove('hidden');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);

    } catch (err) {
        console.error("Error detalle:", err);
        alert("Error: " + err.message);
        btnEnviar.innerText = "Enviar para Aprobación";
        btnEnviar.disabled = false;
    }
});
