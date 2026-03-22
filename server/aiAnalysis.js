import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIAnalysis(metrics) {
  const systemPrompt = `You are a senior web strategist and SEO specialist at a high-performing marketing agency. 
Your role is to audit websites and produce structured, specific, actionable reports.

Rules for Insights:
- Be grounded in the extracted metrics.
- Be specific and non-generic.
- Clearly reference the factual data provided (e.g. mention the exact word count, exact missing alt tags, exact heading counts).
- No vague advice.
- Output ONLY valid JSON matching the exact structure requested.`;

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

Return a JSON object with EXACTLY this structure:
{
  "seo_structure": { "score": "Good|Fair|Poor", "observations": ["obs 1 referencing data", "obs 2"] },
  "messaging_clarity": { "score": "Good|Fair|Poor", "observations": ["obs 1", "obs 2"] },
  "cta_usage": { "score": "Good|Fair|Poor", "observations": ["obs 1", "obs 2"] },
  "content_depth": { "score": "Good|Fair|Poor", "observations": ["obs 1", "obs 2"] },
  "ux_concerns": { "score": "Good|Fair|Poor", "observations": ["obs 1", "obs 2"] },
  "recommendations": [ { "priority": 1, "title": "...", "reasoning": "...", "action": "..." } ]
}`;

  try {
    const response = await client.responses.create({
   model: "gpt-4o-mini",
   text: { format: { type: "json_object" } }, 
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

    return {
      parsed,
      systemPrompt,
      userPrompt,
      rawOutput: raw,
    };
  } catch (err) {
    console.error("AI Error:", err.message);
    // Return fallback instead of throwing so prompt logs always populate
    return {
      parsed: { error: "AI analysis failed", details: err.message },
      systemPrompt,
      userPrompt,
      rawOutput: `API Error: ${err.message}`,
    };
  }
}