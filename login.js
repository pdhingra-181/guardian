const client = window.supabaseClient;

document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert("❌ " + error.message);
    return;
  }

  const user = data.user;

  const { data: contact } = await client
    .from("emergency_contacts")
    .select("contact_email")
    .eq("user_id", user.id)
    .maybeSingle();

  window.location.href = contact
    ? "index.html"
    : "add-contact.html";
});
