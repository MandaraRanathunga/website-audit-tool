import { scrapeMetrics } from "./scraper.js";
import { generateAIAnalysis } from "./aiAnalysis.js";
import { savePromptLog } from "./promptLogger.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    const metrics = await scrapeMetrics(url);
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
    } catch (aiError) {
      aiReport = { error: "AI analysis failed", details: aiError.message };
    }

    res.json({ success: true, metrics, insights: aiReport, aiReport, promptLog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || "Audit failed" });
  }
}
