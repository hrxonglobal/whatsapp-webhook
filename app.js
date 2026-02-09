const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "hrxon123";

// Home route
app.get("/", (req, res) => {
  res.send("HRXON WhatsApp Webhook Running ✅");
});

// Webhook verify route
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Webhook receive messages
app.post("/webhook", (req, res) => {
  console.log("Webhook event:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});