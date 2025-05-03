const SUPABASE_URL = "https://iuyvyfexngrorrofozgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eXZ5ZmV4bmdyb3Jyb2ZvemdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzg0MDEsImV4cCI6MjA1OTcxNDQwMX0.-ObtFbjMFbHXNMwM2d_A0JlJI_FIfAAE_m0TErmf7II";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("contactName").value.trim();
  const relation = document.getElementById("relation").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const phone = document.getElementById("contactPhone").value.trim();

  if (!name || !relation || !email || !phone) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;

  if (!userId) {
    alert("🔐 You must be logged in.");
    window.location.href = "login.html";
    return;
  }

  const { error } = await supabase.from("emergency_contacts").insert([
    {
      user_id: userId,
      contact_name: name,
      relation,
      contact_email: email,
      contact_phone: phone
    }
  ]);

  if (error) {
    console.error("❌ Error saving contact:", error.message);
    alert("❌ Failed to save contact.");
  } else {
    alert("✅ Contact saved!");
    window.location.href = "index.html";
  }
});
