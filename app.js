import express from "express";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "123456";
const ACCESS_TOKEN = "EAANLmJjtiW0BQkZAZADewozf1gITxRzhTEC8CZCTljVBdlgS0IZCbJrtOm67dyu6hhmgIeRPc05msILVeQInXHwThIMwqqZCDJLwCYAWr5J4joyqUUbtiMgPO3WvgZAXDz6hSnF0b5eNxZCMdIeu2QBIRYhAd6Mh2LHHjHFP5ttqZBzltifM6cvTb4pHpOIatJX67KZB0qN3RSX4pVKBgFeGtJk2fjl19iyKZCT2qOcxByZASLl5JZC8Ud8p3dgdqy0gySAUZBd1jVY1SfLsfUgH5HB3gRGQt2aCFvcmMLrATdwZDZD";

// Verify webhook
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Receive message & auto reply
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const phoneId = change.value.metadata.phone_number_id;

      const response = await fetch(
        `https://graph.facebook.com/v19.0/${phoneId}/messages`,
        {
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
        }
      );

      const data = await response.json();
      console.log("Meta response:", data);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));