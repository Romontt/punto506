const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('form-publicar');
const btnEnviar = document.getElementById('btn-enviar');
const mensajeExito = document.getElementById('mensaje-exito');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnEnviar.innerText = "SUBIENDO AFICHE...";
    btnEnviar.disabled = true;

    const nombreComercio = document.getElementById('nombre_comercio').value;
    const tituloPuesto = document.getElementById('titulo_puesto').value;
    const fileInput = document.getElementById('afiche_file');
    const file = fileInput.files[0];

    try {
        if (!file) throw new Error("Debes seleccionar una imagen.");

        // 1. Nombre único para el archivo en el storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

        // 2. Subir al Bucket 'afiches-empleos'
        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('afiches-empleos')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        // 3. Obtener URL Pública
        const { data: { publicUrl } } = _supabase.storage
            .from('afiches-empleos')
            .getPublicUrl(fileName);

        // 4. Insertar en tabla 'empleos'
        btnEnviar.innerText = "PROCESANDO...";
        const { error: insertError } = await _supabase
            .from('empleos')
            .insert([
                { 
                    nombre_comercio: nombreComercio, 
                    titulo_puesto: tituloPuesto, 
                    afiche_url: publicUrl,
                    aprobado: false 
                }
            ]);

        if (insertError) throw insertError;

        // Éxito
        form.classList.add('hidden');
        mensajeExito.classList.remove('hidden');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 4000);

    } catch (err) {
        console.error("Error:", err);
        alert("Hubo un error: " + err.message);
        btnEnviar.innerText = "Enviar para Aprobación";
        btnEnviar.disabled = false;
    }
});
