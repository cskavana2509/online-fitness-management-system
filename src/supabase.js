import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl) {
  console.error(
    "Missing VITE_SUPABASE_URL"
  );
}

if (!supabaseKey) {
  console.error(
    "Missing VITE_SUPABASE_PUBLISHABLE_KEY"
  );
}

export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(
        supabaseUrl,
        supabaseKey
      )
    : null;