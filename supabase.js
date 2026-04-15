import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://svkyczglvidntguqduej.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Tu key completa

// Este es el que usa eventos.html
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 

// Los demás se quedan igual para no romper tus otros proyectos
export const supabaseEmpleos = createClient(supabaseUrl, supabaseAnonKey, { db: { schema: 'empleos' } })
export const supabaseActividad = createClient('https://yfqxnjohojtbjevrmbmq.supabase.co', '...')
