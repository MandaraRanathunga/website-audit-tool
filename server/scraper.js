import axios from "axios";
import * as cheerio from "cheerio";
import https from "https";

export async function scrapeMetrics(url) {
  let html;

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      },
      timeout: 15000,
      httpsAgent: new https.Agent({ keepAlive: true }),
      maxRedirects: 5,
      validateStatus: (status) => status < 500,
    });

    html = response.data;
  } catch (err) {
    console.warn("Primary fetch failed, retrying without SSL verification...");

    const fallback = await axios.get(url, {
      timeout: 15000,
      httpsAgent: new https.Agent({ rejectUnauthorized: false }),
    });

    html = fallback.data;
  }

  const $ = cheerio.load(html);

  // --- Clean Content Extraction ---
  const bodyText = $("body")
    .find("p, h1, h2, h3, h4, h5, h6, li")
    .map((_, el) => $(el).text())
    .get()
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

  const wordCount = bodyText.split(" ").filter(Boolean).length;

  // --- Headings ---
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;

  // --- Meta ---
  const metaTitle = $("title").text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || null;

  const ogTitle = $('meta[property="og:title"]').attr("content") || null;
  const ogDescription =
    $('meta[property="og:description"]').attr("content") || null;

  const canonical = $('link[rel="canonical"]').attr("href") || null;
  const favicon = $('link[rel="icon"]').attr("href") || null;

  // --- CTA Detection ---
  const ctaKeywords =
    /contact|get started|buy|sign up|signup|subscribe|request|demo|try|free|download|book|schedule|learn more|start|join/i;

  let ctaCount = 0;
  $("button, a").each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr("href") || "";
    if (ctaKeywords.test(text) || ctaKeywords.test(href)) {
      ctaCount++;
    }
  });

  // --- Links ---
  let internalLinks = 0;
  let externalLinks = 0;
  const base = new URL(url);

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    try {
      const parsed = new URL(href, url);
      if (parsed.hostname === base.hostname) internalLinks++;
      else externalLinks++;
    } catch {
      internalLinks++;
    }
  });

  // --- Images ---
  const images = $("img");
  const totalImages = images.length;

  let missingAlt = 0;
  images.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim() === "") missingAlt++;
  });

  const missingAltPercent =
    totalImages > 0 ? Math.round((missingAlt / totalImages) * 100) : 0;

  const pageTextForAI = bodyText.slice(0, 6000);

  return {
    url,
    wordCount,
    headings: { h1: h1Count, h2: h2Count, h3: h3Count },
    metaTitle,
    metaDescription,
    ogTitle,
    ogDescription,
    canonical,
    favicon,
    ctaCount,
    links: { internal: internalLinks, external: externalLinks },
    images: {
      total: totalImages,
      missingAlt,
      missingAltPercent,
    },
    pageTextForAI,
  };
}