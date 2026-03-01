import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (supabaseUrl.includes('placeholder')) {
    console.warn('⚠️ Supabase URL is still set to placeholder in .env. Database features will fail.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

