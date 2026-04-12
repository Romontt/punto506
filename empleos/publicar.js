const form = document.getElementById('form-publicar');
const btnEnviar = document.getElementById('btn-enviar');
const mensajeExito = document.getElementById('mensaje-exito');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Bloquear botón mientras envía
    btnEnviar.disabled = true;
    btnEnviar.innerText = 'ENVIANDO...';

    const datos = {
        nombre_comercio: document.getElementById('nombre_comercio').value,
        titulo_puesto: document.getElementById('titulo_puesto').value,
        afiche_url: document.getElementById('afiche_url').value,
        aprobado: false // Siempre entra pendiente de revisión
    };

    try {
        const { error } = await supabase
            .from('empleos')
            .insert([datos]);

        if (error) throw error;

        // Feedback visual
        form.classList.add('hidden');
        mensajeExito.classList.remove('hidden');
        
        // Redirigir después de 3 segundos
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3500);

    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un problema al enviar la vacante. Intente de nuevo.');
        btnEnviar.disabled = false;
        btnEnviar.innerText = 'ENVIAR PARA APROBACIÓN';
    }
});
