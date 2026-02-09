const express = require("express");
const app = express();

app.use(express.json());

// token from railway env
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "hrxon123";

// home route
app.get("/", (req, res) => {
  res.send("WHATSAPP WEBHOOK WORKING ✅");
});

// verification route
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// receive messages
app.post("/webhook", (req, res) => {
  console.log("Incoming:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// VERY IMPORTANT — Railway PORT
const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port " + PORT);
});