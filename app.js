const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 👇 VERIFY TOKEN (Railway variable me bhi same hona chahiye)
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "hrxon123";


// ===============================
// 1️⃣ Webhook verification (GET)
// ===============================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook verified");
    return res.status(200).send(challenge);
  } else {
    console.log("❌ Verification failed");
    return res.sendStatus(403);
  }
});


// ===============================
// 2️⃣ Receive messages (POST)
// ===============================
app.post("/webhook", (req, res) => {
  console.log("📩 Incoming webhook:");
  console.dir(req.body, { depth: null });

  res.sendStatus(200);
});


// ===============================
// 3️⃣ Home route (optional)
// ===============================
app.get("/", (req, res) => {
  res.send("🚀 HRXON WhatsApp Webhook Running");
});


// ===============================
// Server start
// ===============================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});