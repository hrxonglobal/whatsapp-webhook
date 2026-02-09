const express = require("express");
const app = express();

app.use(express.json());

const VERIFY_TOKEN = "hrxon123";

// root test
app.get("/", (req, res) => {
  res.send("SERVER OK");
});

// webhook verify
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// receive messages
app.post("/webhook", (req, res) => {
  console.log("MSG:", req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("RUNNING"));