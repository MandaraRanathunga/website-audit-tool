import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { scrapeMetrics } from "./scraper.js";
import { generateAIAnalysis } from "./aiAnalysis.js";
import { savePromptLog } from "./promptLogger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/audit", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    console.log(`🔍 Auditing: ${url}`);

    const metrics = await scrapeMetrics(url);
    console.log("✅ Metrics scraped");

    let aiReport = null;
    let promptLog = null;

    try {
      const aiResult = await generateAIAnalysis(metrics);
      aiReport = aiResult.parsed;
      const logFile = savePromptLog(url, metrics, aiResult);
      promptLog = {
        systemPrompt: aiResult.systemPrompt,
        userPrompt: aiResult.userPrompt,
        rawOutput: aiResult.rawOutput,
        logFile,
      };
      console.log("✅ AI analysis complete");
    } catch (aiError) {
      console.error("❌ AI error:", aiError.message);
      aiReport = { error: "AI analysis failed", details: aiError.message };
    }

    res.json({ success: true, metrics, aiReport, promptLog });

  } catch (err) {
    console.error("❌ Audit error:", err.message);
    res.status(500).json({ success: false, error: err.message || "Audit failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
