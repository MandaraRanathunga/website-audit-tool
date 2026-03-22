import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIAnalysis(metrics) {
  const systemPrompt = `You are a senior web strategist and SEO specialist at a high-performing marketing agency. 
Your role is to audit websites and produce structured, specific, actionable reports.

Rules:
- Use ONLY provided metrics
- Be specific and reference numbers
- No vague advice
- Output ONLY JSON`;

  const userPrompt = `Audit this webpage:

URL: ${metrics.url}
Word Count: ${metrics.wordCount}
Headings: H1=${metrics.headings.h1}, H2=${metrics.headings.h2}, H3=${metrics.headings.h3}
Meta Title: ${metrics.metaTitle || "MISSING"}
Meta Description: ${metrics.metaDescription || "MISSING"}
CTA Count: ${metrics.ctaCount}
Internal Links: ${metrics.links.internal}
External Links: ${metrics.links.external}
Images: ${metrics.images.total}
Missing Alt: ${metrics.images.missingAlt} (${metrics.images.missingAltPercent}%)

Content:
${metrics.pageTextForAI}

Return JSON with:
seo_structure, messaging_clarity, cta_usage, content_depth, ux_concerns, recommendations`;

  try {
    const response = await client.responses.create({
   model: "gpt-4.1-mini",
   response_format: { type: "json_object" }, 
   input: [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
   ],
   max_output_tokens: 2000,
   });

    let raw = "";

    if (response.output_text) {
    raw = response.output_text;
    } else {
    raw = response.output
    ?.map(o => o.content?.map(c => c.text).join(""))
    .join("") || "";
   }

    const cleaned = raw.replace(/```json|```/g, "").trim();
    let parsed;

    try {
     parsed = JSON.parse(cleaned);
    } catch (err) {
     console.error("❌ AI returned invalid JSON:");
     console.error(raw);

    // fallback response instead of crashing
    parsed = {
    error: "Invalid JSON from AI",
    rawOutput: raw,
  };
}

    return parsed;
  } catch (err) {
    console.error("AI Error:", err.message);
    throw new Error("AI analysis failed");
  }
}