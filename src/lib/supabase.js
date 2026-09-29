import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'placeholder'

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn(
    '[DocQuest] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY. Please configure them in your environment settings.'
  )
}

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)