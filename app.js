const express = require("express");
const app = express();

app.use(express.json());

// Root test
app.get("/", (req, res) => {
  res.send("HRXON Webhook Running ✅");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = "hrxon123";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// Receive messages
app.post("/webhook", (req, res) => {
  console.log("Message:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));