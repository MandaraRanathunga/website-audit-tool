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
- Be grounded in the extracted metrics (do not hallucinate).
- Be specific and non-generic (avoid fluff).
- Clearly reference the factual data in EVERY observation (e.g., "Word count is 450", "H1 is missing", "CTA count is 0").
- No vague advice. Connect structural/UX concerns directly to the extracted link/image/heading data.

Rules for Recommendations:
- Provide 3 to 5 prioritized recommendations.
- Include clear reasoning tied directly to the extracted metrics.
- Make the recommendations actionable and concise.

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

Return a JSON object with EXACTLY this structure. Ensure insights clearly reference the metrics:
{
  "seo_structure": { "score": "Good|Fair|Poor", "observations": ["Observation explicitly referencing headings/meta data", "..."] },
  "messaging_clarity": { "score": "Good|Fair|Poor", "observations": ["Observation referencing page content/titles", "..."] },
  "cta_usage": { "score": "Good|Fair|Poor", "observations": ["Observation explicitly citing the CTA count", "..."] },
  "content_depth": { "score": "Good|Fair|Poor", "observations": ["Observation explicitly citing word count", "..."] },
  "ux_concerns": { "score": "Good|Fair|Poor", "observations": ["Observation referencing links, alt text, or structural issues", "..."] },
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