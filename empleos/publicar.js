const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const form = document.getElementById('form-publicar');
const btnEnviar = document.getElementById('btn-enviar');
const mensajeExito = document.getElementById('mensaje-exito');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    btnEnviar.innerText = "SUBIENDO IMAGEN...";
    btnEnviar.disabled = true;

    const nombreComercio = document.getElementById('nombre_comercio').value;
    const tituloPuesto = document.getElementById('titulo_puesto').value;
    const fileInput = document.getElementById('afiche_file');
    const file = fileInput.files[0];

    try {
        if (!file) throw new Error("Debes seleccionar una imagen.");

        // 1. Generar un nombre único para el archivo
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        // 2. Subir imagen al Bucket 'afiches-empleos'
        const { data: uploadData, error: uploadError } = await _supabase.storage
            .from('afiches-empleos')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 3. Obtener la URL pública de la imagen subida
        const { data: { publicUrl } } = _supabase.storage
            .from('afiches-empleos')
            .getPublicUrl(filePath);

        // 4. Insertar los datos en la tabla 'empleos'
        btnEnviar.innerText = "GUARDANDO DATOS...";
        const { error: insertError } = await _supabase
            .from('empleos')
            .insert([
                { 
                    nombre_comercio: nombreComercio, 
                    titulo_puesto: tituloPuesto, 
                    afiche_url: publicUrl, // Aquí guardamos la URL que generó el Storage
                    aprobado: false 
                }
            ]);

        if (insertError) throw insertError;

        // Éxito total
        form.classList.add('hidden');
        mensajeExito.classList.remove('hidden');
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 3000);

    } catch (err) {
        console.error("Error completo:", err);
        alert("Error: " + err.message);
        btnEnviar.innerText = "Enviar para Aprobación";
        btnEnviar.disabled = false;
    }
});
