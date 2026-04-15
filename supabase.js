import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// --- CONFIGURACIÓN PROYECTO 1 (Eventos y Empleos) ---
const supabaseUrl = 'https://svkyczglvidntguqduej.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2a3ljemdsdmlkbnRndXFkdWVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5MDAwODEsImV4cCI6MjA5MDQ3NjA4MX0.gASHvLpE4xrSKY0ll5Votnz1oBAtrTXWnT7ww__Tdpg'

// CLIENTE PARA EVENTOS: Usa el esquema 'public' por defecto (Soluciona el error PGRST205)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// CLIENTE PARA EMPLEOS: Mantiene el esquema 'empleos' para tus otros códigos
export const supabaseEmpleos = createClient(supabaseUrl, supabaseAnonKey, {
  db: { schema: 'empleos' }
})

// --- CONFIGURACIÓN PROYECTO 2 (Métricas) ---
const urlActividad = 'https://yfqxnjohojtbjevrmbmq.supabase.co'
const keyActividad = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmcXhuam9ob2p0YmpldnJtYm1xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MjI4ODgsImV4cCI6MjA4ODM5ODg4OH0.ze32GU0sW7EZ5oicnLFlHpthtLcSTUxZ9rlHSyQLFso'

export const supabaseActividad = createClient(urlActividad, keyActividad)
