// ✅ Supabase Setup
const SUPABASE_URL = "https://iuyvyfexngrorrofozgh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml1eXZ5ZmV4bmdyb3Jyb2ZvemdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxMzg0MDEsImV4cCI6MjA1OTcxNDQwMX0.-ObtFbjMFbHXNMwM2d_A0JlJI_FIfAAE_m0TErmf7II";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ✅ Global State
let currentLocation = null;
let receiverEmail = null;

// 🛡️ Session Check + Emergency Contact Fetch
(async () => {
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (!session || sessionError) {
    alert("🔐 Please log in first.");
    window.location.href = "login.html";
    return;
  }

  const userId = session.user.id;

  const { data, error } = await supabase
    .from("emergency_contacts")
    .select("contact_name, relation, contact_email, contact_phone")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    console.error("❌ Could not load emergency contact:", error?.message, data);
    alert("❌ Please set up your emergency contact.");
    window.location.href = "add-contact.html";
    return;
  }

  receiverEmail = data.contact_email;
  console.log("✅ Emergency contact loaded:", receiverEmail);

  // Update Dashboard Info
  document.getElementById("user-email").textContent = session.user.email;
  document.getElementById("contact-name").textContent = data.contact_name || "-";
  document.getElementById("contact-relation").textContent = data.relation || "-";
  document.getElementById("contact-email").textContent = data.contact_email || "-";
  document.getElementById("contact-phone").textContent = data.contact_phone || "-";
})();

// 🎙️ Voice Distress Detection
const startBtn = document.getElementById("start-voice-btn");
const transcriptText = document.getElementById("transcript-text");
const sosBtn = document.getElementById("sos-btn");

const DISTRESS_KEYWORDS = ["help", "no", "stop", "don't", "save me", "danger", "leave me"];

if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "en-US";

  recognition.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript
      .trim()
      .toLowerCase();

    transcriptText.textContent = transcript;

    await storeTranscript(transcript);

    if (DISTRESS_KEYWORDS.some((word) => transcript.includes(word))) {
      triggerSOS("Voice distress detected!");
    }
  };

  startBtn.onclick = () => {
    recognition.start();
    transcriptText.textContent = "🎙️ Listening...";
  };
} else {
  startBtn.disabled = true;
  transcriptText.textContent = "⚠️ Speech recognition not supported.";
}

// 🗂️ Save Transcript to Supabase
async function storeTranscript(transcript) {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return console.warn("⚠️ No session, skipping transcript save");

  const { error } = await supabase.from("transcripts").insert([
    {
      user_id: session.user.id,
      transcript: transcript,
    },
  ]);

  if (error) {
    console.error("❌ Could not save transcript:", error.message);
  } else {
    console.log("📦 Transcript saved:", transcript);
  }
}

// 🚨 Manual SOS Button
sosBtn.onclick = () => {
  triggerSOS("Manual SOS Triggered!");
};

function triggerSOS(reason) {
  if (!currentLocation) {
    alert("❌ Location not available yet.");
    return;
  }

  if (!receiverEmail) {
    alert("❌ Emergency contact email not loaded.");
    return;
  }

  const timestamp = new Date().toLocaleString();
  const { lat, lng } = currentLocation;

  alert(`🚨 ${reason}\n📍 Latitude: ${lat}\n📍 Longitude: ${lng}\n⏰ Time: ${timestamp}`);

  emailjs
    .send("service_1ps814f", "template_lkrwmzp", {
      reason,
      lat,
      lng,
      time: timestamp,
      to_email: receiverEmail,
    })
    .then(
      () => alert("✅ SOS Email Sent Successfully!"),
      (error) => alert("❌ Email failed: " + error.text)
    );
}

// 🗺️ Google Maps
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 15,
    center: { lat: 0, lng: 0 },
  });

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(
      (pos) => {
        currentLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        map.setCenter(currentLocation);
        new google.maps.Marker({
          position: currentLocation,
          map: map,
          title: "You are here",
        });
      },
      () => alert("❌ Location access denied.")
    );
  } else {
    alert("❌ Geolocation not supported.");
  }
}
window.initMap = initMap;

// 💬 Assistant Q&A
const qaInput = document.getElementById("qa-input");
const qaSubmit = document.getElementById("qa-submit");
const qaResponse = document.getElementById("qa-response");

qaInput?.addEventListener("keypress", (e) => {
  if (e.key === "Enter") qaSubmit.click();
});

qaSubmit?.addEventListener("click", () => {
  const question = qaInput.value.trim().toLowerCase();
  let answer = "";

  if (question.includes("sos"))
    answer = "Click the SOS button. It will send your live location via email.";
  else if (question.includes("location"))
    answer = "Your location is tracked live using GPS.";
  else if (question.includes("voice"))
    answer = "We detect distress keywords like 'help', 'danger', etc.";
  else if (question.includes("internet"))
    answer = "Internet is required to send alerts.";
  else if (question.includes("transcript"))
    answer = "The transcript shows what the assistant hears.";
  else
    answer = "Sorry, I don't have an answer for that.";

  qaResponse.textContent = "💬 " + answer;
});

// 🧭 Dashboard Toggle + Close
const dashboard = document.getElementById("dashboard");
const dashToggle = document.getElementById("dashboard-toggle");
const dashClose = document.getElementById("dashboard-close");

dashToggle?.addEventListener("click", () => {
  dashboard.classList.toggle("open");
});

dashClose?.addEventListener("click", () => {
  dashboard.classList.remove("open");
});

// 🔒 Logout
const logoutBtn = document.getElementById("logout-btn");
logoutBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signOut();
  if (!error) window.location.href = "login.html";
});

document.addEventListener("DOMContentLoaded", () => {
  const toggleDark = document.getElementById("darkModeToggle");
  const dashOpen = document.getElementById("dashboard-toggle");
  const dashClose = document.getElementById("dashboard-close");
  const dash = document.getElementById("dashboard");

  toggleDark?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  dashOpen?.addEventListener("click", () => {
    dash.classList.add("open");
  });

  dashClose?.addEventListener("click", () => {
    dash.classList.remove("open");
  });
});
