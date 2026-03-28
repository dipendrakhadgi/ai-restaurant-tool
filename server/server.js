import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API endpoint
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

// Dynamic port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));