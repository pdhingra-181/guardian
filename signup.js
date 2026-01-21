const client = window.supabaseClient;

document.getElementById("signupBtn").addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    alert("✅ Signup successful! Check your email for confirmation.");
    window.location.href = "login.html";

  } catch (err) {
    console.error(err);
    alert("❌ " + err.message);
  }
});
