const SUPABASE_URL = "https://iuyvyfexngrorrofozgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eXZ5ZmV4bmdyb3Jyb2ZvemdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzg0MDEsImV4cCI6MjA1OTcxNDQwMX0.-ObtFbjMFbHXNMwM2d_A0JlJI_FIfAAE_m0TErmf7II";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) return alert("Enter email and password.");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return alert("❌ " + error.message);

  const { data: { user } } = await supabase.auth.getUser();

  const { data: contact, error: fetchError } = await supabase
    .from("emergency_contacts")
    .select("contact_email")
    .eq("user_id", user.id)
    .single();

  if (!contact || fetchError) {
    window.location.href = "add-contact.html"; // 🆕 New screen
  } else {
    window.location.href = "index.html";
  }
});
