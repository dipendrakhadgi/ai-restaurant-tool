// server/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API endpoint
app.post("/api", async (req, res) => {
  const { input, mode } = req.body;

  try {
    const promptMap = {
      menu: `Write a creative menu description for: ${input}`,
      customer: `Write a polite customer response for: ${input}`,
      upsell: `Suggest upsell items for: ${input}`,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI assistant for restaurants." },
        { role: "user", content: promptMap[mode] || input },
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Error generating response" });
  }
});

// Use dynamic port for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));