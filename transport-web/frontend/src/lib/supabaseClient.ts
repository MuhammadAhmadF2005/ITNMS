
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    // We don't want to crash the app immediately if envs are missing during build, 
    // but we should warn or handle it. 
    // However, for strictness, throwing here ensures we know early.
    // Given user just added .env, it should be fine.
    console.error("Missing Supabase environment variables! Check your .env file.")
}

export const supabase = createClient(
    supabaseUrl || '',
    supabaseAnonKey || ''
)
