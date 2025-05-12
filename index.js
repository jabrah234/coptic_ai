import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import rateLimit from "express-rate-limit";
import NodeCache from "node-cache";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const cache = new NodeCache({ stdTTL: 86400 });

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? "https://your-domain.com" : "*",
  })
);
app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), "public")));
app.use('/icons', express.static(path.join(__dirname, 'public/icons')));


const traditionPrompts = {
  "General Christian": `
    You are Ⲱⲟⲩⲛⲓⲁⲧⲕ, a Christian AI formed in love and humility.
    You speak gently, rooted in the Bible and the life of Jesus Christ.
    Encourage prayer, reflection, and kindness. Speak ecumenically — honoring all traditions.
    Reference Scripture (e.g., 'John 3:16'), common saints, and core teachings like love, grace, hope, and faith.
    When quoting Scripture or tradition, provide citations (e.g., book, chapter, verse, or source name).
  `,
  "Oriental Orthodox": `...`, // Keep the others as they are
  "Eastern Orthodox": `...`,
  "Roman Catholic": `...`,
  "Protestant": `...`,
  "Evangelical": `...`,
  "Pentecostal": `...`,
};

const getLiturgicalContext = (tradition, date) => {
  const liturgicalSeasons = {
    "Roman Catholic": { "2025-04-23": "Eastertide" },
    "Eastern Orthodox": { "2025-04-23": "Paschal Season" },
    "Oriental Orthodox": { "2025-04-23": "Resurrection Season" },
    "Protestant": { "2025-04-23": "Easter Season" },
    "Evangelical": { "2025-04-23": "Easter Season" },
    "Pentecostal": { "2025-04-23": "Easter Season" },
    "General Christian": { "2025-04-23": "Easter Season" },
  };
  return liturgicalSeasons[tradition]?.[date.toISOString().split("T")[0]] || "Ordinary Time";
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/ask", limiter);

async function queryAI(prompt, userMessage) {
  try {
    const response = await fetch("http://localhost:8000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, user_message: userMessage }),
    });
    const data = await response.json();
    return data.reply;
  } catch (error) {
    console.error("AI Server error:", error);
    return "Ⲱⲟⲩⲛⲓⲁⲧⲕ is reflecting... Please try again soon.";
  }
}

app.post("/ask", async (req, res) => {
  const { message, tradition } = req.body;
  const cacheKey = `${tradition}:${message}`;
  const cachedReply = cache.get(cacheKey);

  if (cachedReply) {
    return res.json({ reply: cachedReply });
  }

  const systemPrompt = traditionPrompts[tradition] || traditionPrompts["General Christian"];
  const liturgicalContext = getLiturgicalContext(tradition, new Date());
  const fullPrompt = `${systemPrompt}\nToday is in the ${liturgicalContext} season.`;

  const reply = await queryAI(fullPrompt, message);
  cache.set(cacheKey, reply);
  res.json({ reply });
});

app.listen(3000, () => {
  console.log("🔥 Ⲱⲟⲩⲛⲓⲁⲧⲕ backend running at http://localhost:3000");
});
