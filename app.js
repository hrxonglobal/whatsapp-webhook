import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const VERIFY_TOKEN = "123456";   // Meta webhook verify token
const ACCESS_TOKEN = "EAANLmJjtiW0BQgeoQQrJ9xYD8BiRIiogxPqQEBi5j2ZBXg4vxWpg29XI4yZCLosxBhQ62KbqbK6IJW6ql23roPhZCcRU4kXmgPMMZA2TZAoagZA2n3GGehYj0sqESN0gCzscaYZBLyRO1FZCi37HJFUNxlx5qPXyY6fUp52Y90hOdDZCOoNvzPpwDmFDTjscyJ0lZB6gZDZD";  // Permanent token

// 🔹 Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook verified");
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 🔹 Receive message + auto reply
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body.entry?.[0];
    const change = entry?.changes?.[0];
    const message = change?.value?.messages?.[0];

    if (message) {
      const from = message.from;
      const phoneId = change.value.metadata.phone_number_id;

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

      console.log("Reply sent to:", from);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

app.listen(8080, () => console.log("Server running on port 8080"));