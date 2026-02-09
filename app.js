const express = require("express");
const app = express();

const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "12345";

app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("WhatsApp Webhook Running ✅");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Receive messages
app.post("/webhook", (req, res) => {
  console.log("Message received:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));