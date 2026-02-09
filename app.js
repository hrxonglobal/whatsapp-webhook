const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "hrxon_verify_123";

// Home route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// Webhook verification route (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Webhook receive messages (POST)
app.post("/webhook", (req, res) => {
  console.log("Webhook event:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));