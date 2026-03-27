import { createClient } from '@supabase/supabase-js';

// Service role client — server-side only, never exposed to the browser
export function createServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    // Desativa o Data Cache interno do Next.js 14 para todas as queries
    // (por padrão o Next.js cacheia fetch() calls entre requests)
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
  });
}
