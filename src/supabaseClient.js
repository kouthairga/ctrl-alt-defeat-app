import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let supabase;
let isSupabaseConfigured = false;
try {
	if (!supabaseUrl || !supabaseAnonKey) throw new Error('Missing Supabase URL or ANON key');
	supabase = createClient(supabaseUrl, supabaseAnonKey);
	isSupabaseConfigured = true;
} catch (err) {
	// Provide a minimal stub so the app doesn't crash when Supabase isn't configured.
	// Methods return the same shape: { data, error } or a no-op subscription.
	// This allows local dev without leaking credentials.
	// Log a warning to help developers notice the missing config.
	// eslint-disable-next-line no-console
	console.warn('Supabase not configured or invalid URL; auth features disabled.', err.message);
	supabase = {
		auth: {
			signInWithOAuth: async () => ({ data: null, error: new Error('Supabase not configured') }),
			signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
			signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
			getSession: async () => ({ data: { session: null } }),
			onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
		}
	};
}

export { supabase, isSupabaseConfigured };
