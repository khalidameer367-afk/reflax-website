import { createClient } from "@supabase/supabase-js";

// Public client — safe to use in client components (uses the anon key,
// which only has the permissions you grant it via Row Level Security).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only client — uses the service role key, which bypasses Row Level
// Security. NEVER import this file from a client component. Only used
// inside /src/app/api/** route handlers.
export function supabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
