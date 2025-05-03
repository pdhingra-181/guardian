const SUPABASE_URL = "https://iuyvyfexngrorrofozgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eXZ5ZmV4bmdyb3Jyb2ZvemdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzg0MDEsImV4cCI6MjA1OTcxNDQwMX0.-ObtFbjMFbHXNMwM2d_A0JlJI_FIfAAE_m0TErmf7II";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("⚠️ Fill all fields!");

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) return alert("❌ " + error.message);

  alert("✅ Account created. Please verify your email.");
  window.location.href = "login.html";
});
