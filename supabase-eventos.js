import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Configuración exclusiva para la Cartelera de Eventos
const supabaseUrl = 'https://svkyczglvidntguqduej.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg'

// Exportamos un cliente "limpio" que apunta al esquema PUBLIC
export const supabaseEventos = createClient(supabaseUrl, supabaseAnonKey)
