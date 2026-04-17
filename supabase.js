// Configuración única de Supabase - VERIFICA CADA LETRA
const SUPABASE_URL = 'https://svkyczglvidntguqduej.supabase.co'.trim();
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg'.trim();

// Usamos un try-catch para atrapar el error antes de que explote
let _supabase;
try {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log("Conexión con Supabase iniciada correctamente.");
} catch (e) {
    console.error("Error crítico al iniciar Supabase Client:", e);
}

window._supabase = _supabase;
