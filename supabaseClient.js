const SUPABASE_URL = "https://iuyvyfexngrorrofozgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eXZ5ZmV4bmdyb3Jyb2ZvemdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzg0MDEsImV4cCI6MjA1OTcxNDQwMX0.-ObtFbjMFbHXNMwM2d_A0JlJI_FIfAAE_m0TErmf7II";

const { createClient } = supabase;
window.supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase client initialized");
