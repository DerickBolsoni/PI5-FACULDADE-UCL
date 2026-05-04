import { createClient } from "@supabase/supabase-js";

const FALLBACK_SUPABASE_URL = "https://lrjkisxaapcedygkhegj.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyamtpc3hhYXBjZWR5Z2toZWdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NjYzNjgsImV4cCI6MjA4ODE0MjM2OH0.oXjKeydFL2DluB3tuGmIAaNYnhKQEYCkNPaWbWzoYFA";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || FALLBACK_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn(
    "Variáveis do Supabase ausentes no ambiente. Usando fallback de desenvolvimento."
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

