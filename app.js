import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "mytoken";
const ACCESS_TOKEN = "EAANLmJjtiW0BQjrFi3sboIcoGvzDT6I9mYGpOFFGs9SadaZBQmQnaaOkePChjaLSeOZAIntF64FIBA3P0wiqjpEbP3qY8sGuXC3UGVnRzAFZC2RSi7SpboXALpw3xQZCnpTH0dlkxZAw8nFVS9yGcfM15DjTILks03zxKOCrmA5VbEZA8Ov8ydx9R0gZBrCSpKa0T1jtABo4rHcBeovaSanPlKH6qNh9S6aZCNkZA1XqA0HsdE1tvi23MF7MmEbfMVcpbuM2ZCGuTbCfNdJ4tXlaZCg9Rgts3bCrkqrzfsYH7QZD";

// Verify webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// Receive message & auto reply
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const phoneId = changes.value.metadata.phone_number_id;

      await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hello 👋\nThanks for contacting HRXON Global IT Solutions.\nWe will reply shortly.",
          },
        }),
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));