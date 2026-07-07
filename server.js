const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PI_API_KEY = process.env.PI_API_KEY;
const PI_API_BASE = "https://api.minepi.com/v2";

app.get("/", (req, res) => {
  res.send("Bullion Pi Backend is running");
});

app.post("/approve", async (req, res) => {
  try {
    const { paymentId } = req.body;

    const response = await fetch(`${PI_API_BASE}/payments/${paymentId}/approve`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Approval failed" });
  }
});

app.post("/complete", async (req, res) => {
  try {
    const { paymentId, txid } = req.body;

    const response = await fetch(`${PI_API_BASE}/payments/${paymentId}/complete`, {
      method: "POST",
      headers: {
        Authorization: `Key ${PI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ txid })
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Completion failed" });
  }
});

app.post("/cancel", async (req, res) => {
  res.json({ cancelled: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Bullion Pi backend running on port ${PORT}`);
});
