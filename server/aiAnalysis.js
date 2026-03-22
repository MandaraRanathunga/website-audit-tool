import dotenv from "dotenv";
dotenv.config();

const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";

export async function generateAIAnalysis(metrics) {
  const systemPrompt = `You are a senior web strategist and SEO specialist at a high-performing marketing agency. 
Your role is to audit websites and produce structured, specific, actionable reports.

Rules:
- Ground every insight in the provided factual metrics — never be vague or generic.
- Reference exact numbers from the metrics when making observations.
- Be direct, professional, and concise.
- Do NOT hallucinate metrics — only use what is provided.
- Output ONLY valid JSON. No markdown, no explanation outside the JSON.`;

  const userPrompt = `You have audited a webpage. Here are the factual metrics extracted:

URL: ${metrics.url}
Word Count: ${metrics.wordCount}
Headings: H1=${metrics.headings.h1}, H2=${metrics.headings.h2}, H3=${metrics.headings.h3}
Meta Title: ${metrics.metaTitle || "MISSING"}
Meta Description: ${metrics.metaDescription || "MISSING"}
CTA Count: ${metrics.ctaCount}
Internal Links: ${metrics.links.internal}
External Links: ${metrics.links.external}
Total Images: ${metrics.images.total}
Images Missing Alt Text: ${metrics.images.missingAlt} (${metrics.images.missingAltPercent}%)

Page Content Sample (first 6000 chars):
"""
${metrics.pageTextForAI}
"""

Based on these metrics and the content sample, produce a structured audit in this EXACT JSON format:

{
  "seo_structure": {
    "score": "<Good | Fair | Poor>",
    "observations": ["...", "..."]
  },
  "messaging_clarity": {
    "score": "<Good | Fair | Poor>",
    "observations": ["...", "..."]
  },
  "cta_usage": {
    "score": "<Good | Fair | Poor>",
    "observations": ["...", "..."]
  },
  "content_depth": {
    "score": "<Good | Fair | Poor>",
    "observations": ["...", "..."]
  },
  "ux_concerns": {
    "score": "<Good | Fair | Poor>",
    "observations": ["...", "..."]
  },
  "recommendations": [
    {
      "priority": 1,
      "title": "...",
      "reasoning": "...",
      "action": "..."
    },
    {
      "priority": 2,
      "title": "...",
      "reasoning": "...",
      "action": "..."
    },
    {
      "priority": 3,
      "title": "...",
      "reasoning": "...",
      "action": "..."
    },
    {
      "priority": 4,
      "title": "...",
      "reasoning": "...",
      "action": "..."
    },
    {
      "priority": 5,
      "title": "...",
      "reasoning": "...",
      "action": "..."
    }
  ]
}`;

  const requestBody = {
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  };

  const response = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error: ${err}`);
  }

  const data = await response.json();
  const rawOutput = data.content[0]?.text || "";

  // Parse JSON — strip any accidental fences
  const cleaned = rawOutput.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    systemPrompt,
    userPrompt,
    requestBody,
    rawOutput,
    parsed,
  };
}