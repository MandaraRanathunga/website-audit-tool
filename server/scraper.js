import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeMetrics(url) {
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; WebAuditBot/1.0; +https://audit.tool)",
    },
    timeout: 15000,
  });

  const $ = cheerio.load(html);

  // --- Word Count ---
  const bodyText = $("body").text().replace(/\s+/g, " ").trim();
  const wordCount = bodyText.split(" ").filter(Boolean).length;

  // --- Headings ---
  const h1Count = $("h1").length;
  const h2Count = $("h2").length;
  const h3Count = $("h3").length;

  // --- Meta ---
  const metaTitle = $("title").text().trim() || null;
  const metaDescription =
    $('meta[name="description"]').attr("content")?.trim() || null;

  // --- CTAs ---
  // Buttons + links with common CTA text patterns
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
  const parsedBase = new URL(url);

  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    try {
      const parsed = new URL(href, url);
      if (parsed.hostname === parsedBase.hostname) {
        internalLinks++;
      } else {
        externalLinks++;
      }
    } catch {
      internalLinks++;
    }
  });

  // --- Images ---
  const allImages = $("img");
  const totalImages = allImages.length;
  let missingAlt = 0;
  allImages.each((_, el) => {
    const alt = $(el).attr("alt");
    if (!alt || alt.trim() === "") missingAlt++;
  });
  const missingAltPercent =
    totalImages > 0 ? Math.round((missingAlt / totalImages) * 100) : 0;

  // --- Raw page text for AI (trimmed) ---
  const pageTextForAI = bodyText.slice(0, 6000); // limit tokens

  return {
    url,
    wordCount,
    headings: { h1: h1Count, h2: h2Count, h3: h3Count },
    metaTitle,
    metaDescription,
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