import express from "express";
import { scrapeMetrics } from "../scraper.js";
import { generateAIAnalysis } from "../aiAnalysis.js";
import { savePromptLog } from "../promptLogger.js";

const router = express.Router();

router.post("/audit", async (req, res) => {
  const { url } = req.body;

  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "A valid URL starting with http(s):// is required." });
  }

  try {
    // Step 1: Scrape factual metrics
    console.log(`\n[1/3] Scraping metrics for: ${url}`);
    const metrics = await scrapeMetrics(url);

    // Step 2: AI analysis
    console.log(`[2/3] Sending to AI for analysis...`);
    const aiResult = await generateAIAnalysis(metrics);

    // Step 3: Save prompt log
    console.log(`[3/3] Saving prompt log...`);
    const logFile = savePromptLog(url, metrics, aiResult);

    // Return to client — separate metrics from AI insights
    return res.json({
      url,
      metrics: {
        wordCount: metrics.wordCount,
        headings: metrics.headings,
        metaTitle: metrics.metaTitle,
        metaDescription: metrics.metaDescription,
        ctaCount: metrics.ctaCount,
        links: metrics.links,
        images: metrics.images,
      },
      insights: aiResult.parsed,
      promptLog: {
        systemPrompt: aiResult.systemPrompt,
        userPrompt: aiResult.userPrompt,
        rawOutput: aiResult.rawOutput,
        logFile,
      },
    });
  } catch (err) {
    console.error("Audit failed:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router;