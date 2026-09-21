import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl && 
    supabaseAnonKey && 
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseUrl.startsWith('https://') &&
    supabaseAnonKey !== 'your_supabase_anon_public_key' &&
    supabaseAnonKey.length > 20
  );
};

let clientInstance: SupabaseClient | null = null;

if (isSupabaseConfigured() && supabaseUrl && supabaseAnonKey) {
  try {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  } catch (error) {
    console.warn('FindBack: Failed to initialize Supabase client:', error);
    clientInstance = null;
  }
}

export const supabase = clientInstance;
