// Configuración única de Supabase
const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg';

// Crear el cliente una sola vez
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Función para registrar actividad (la puedes llamar desde cualquier parte)
async function registrarActividad(tipo, detalle) {
    try {
        const { error } = await _supabase
            .from('registros_actividad')
            .insert([{ tipo_actividad: tipo, detalle: detalle, fecha: new Date() }]);
        
        if (error) console.error("Error al registrar actividad:", error);
    } catch (e) {
        console.error("Fallo crítico en analítica:", e);
    }
}

// Exportar funciones si usas módulos, o simplemente dejarlas globales
window._supabase = _supabase;
window.registrarActividad = registrarActividad;
