import express from "express";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

app.post("/api", async (req, res) => {
  try {
    const { input, mode } = req.body;

let systemPrompt = "You help restaurants.";

if (mode === "menu") {
  systemPrompt = "Create high-quality menu descriptions.";
} else if (mode === "customer") {
  systemPrompt = "Reply politely to customer complaints.";
} else if (mode === "upsell") {
  systemPrompt = "Suggest upsells for restaurant orders.";
}

    const response = await client.chat.completions.create({
      model: "openai/gpt-3.5-turbo",
      messages: [
  { role: "system", content: systemPrompt },
  { role: "user", content: input }
]
    });

    res.json({ reply: response.choices[0].message.content });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error happened" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});