// supabase.js - Configuración Única y Centralizada
const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co'.trim();
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg'.trim();

// Creamos el cliente una sola vez para todo el sitio
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Función universal para registrar actividad (clics, visitas, etc.)
async function registrarActividad(tipo, detalle) {
    try {
        const { error } = await _supabase
            .from('registros_actividad')
            .insert([{ 
                tipo_actividad: tipo, 
                detalle: detalle, 
                fecha: new Date().toISOString() 
            }]);
        
        if (error) console.error("Error en analítica:", error);
    } catch (e) {
        console.error("Fallo de conexión al registrar actividad:", e);
    }
}

// Hacemos que todo sea accesible desde otros archivos
window._supabase = _supabase;
window.registrarActividad = registrarActividad;
