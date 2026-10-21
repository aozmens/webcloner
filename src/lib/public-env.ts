// Public configuration, safe for the browser (NEXT_PUBLIC_*). Supabase's anon key is public by design:
// row level security decides what it can read and write.
export const publicEnv = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};
