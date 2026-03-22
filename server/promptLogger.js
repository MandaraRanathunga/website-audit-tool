import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve("../prompt-logs");

export function savePromptLog(url, metrics, aiResult) {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const safeUrl = url.replace(/https?:\/\//, "").replace(/[^a-z0-9]/gi, "_").slice(0, 40);
  const filename = `${timestamp}_${safeUrl}.json`;
  const filepath = path.join(LOG_DIR, filename);

  const log = {
    timestamp: new Date().toISOString(),
    url,
    metrics_input: {
      wordCount: metrics.wordCount,
      headings: metrics.headings,
      metaTitle: metrics.metaTitle,
      metaDescription: metrics.metaDescription,
      ctaCount: metrics.ctaCount,
      links: metrics.links,
      images: metrics.images,
    },
    prompt_log: {
      system_prompt: aiResult.systemPrompt,
      user_prompt: aiResult.userPrompt,
      full_request_body: aiResult.requestBody,
      raw_model_output: aiResult.rawOutput,
    },
    parsed_output: aiResult.parsed,
  };

  fs.writeFileSync(filepath, JSON.stringify(log, null, 2));
  return filename;
}