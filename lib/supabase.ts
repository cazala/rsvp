import { createClient } from "@supabase/supabase-js"

// Read env vars (they should always be present on Vercel)
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Normalise the URL – get rid of any trailing “/”
const supabaseUrl = rawUrl.replace(/\/+$/, "")

// Keep a singleton to avoid re-initialising the SDK on hot reloads
let supabaseInstance: ReturnType<typeof createClient> | null = null

export function getSupabase() {
  if (!supabaseUrl || !anonKey) {
    console.warn("Supabase URL or Anon Key is missing.")
    return null
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
    })
  }
  return supabaseInstance
}
