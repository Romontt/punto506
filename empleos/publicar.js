// Configuración de Supabase (Asegúrate de que estas sean tus credenciales)
const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('form-publicar');
const btnEnviar = document.getElementById('btn-enviar');
const mensajeExito = document.getElementById('mensaje-exito');

form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Cambiamos el estado del botón
    btnEnviar.innerText = "ENVIANDO...";
    btnEnviar.disabled = true;

    // Capturamos los datos de los inputs
    const nombreComercio = document.getElementById('nombre_comercio').value;
    const tituloPuesto = document.getElementById('titulo_puesto').value;
    const aficheUrl = document.getElementById('afiche_url').value;

    try {
        // Insertamos en la tabla 'empleos'
        // IMPORTANTE: Asegúrate de que los nombres de las columnas en Supabase coincidan
        const { error } = await _supabase
            .from('empleos')
            .insert([
                { 
                    nombre_comercio: nombreComercio, 
                    puesto: tituloPuesto, 
                    imagen_url: aficheUrl,
                    aprobado: false // Lo enviamos como falso para que tú lo apruebes en el panel
                }
            ]);

        if (error) throw error;

        // Si todo sale bien
        form.classList.add('hidden'); // Ocultamos el formulario
        mensajeExito.classList.remove('hidden'); // Mostramos el mensaje de éxito
        
        // Opcional: Redirigir al inicio tras 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);

    } catch (err) {
        console.error("Error al publicar:", err.message);
        alert("Hubo un error al enviar la vacante: " + err.message);
        btnEnviar.innerText = "Enviar para Aprobación";
        btnEnviar.disabled = false;
    }
});
