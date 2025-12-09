// utils/autoTagService.js
const openRouterClient = require("./openaiClient");

/**
 * Auto-generate tags using AI based on title + content
 * existingTags: array of tags already given by user
 */
async function generateAutoTags({ title, content, existingTags = [] }) {
  const safeTitle = title || "";
  const safeContent = content || "";

  const prompt = `
You are an assistant that generates tags for a thought-sharing / blog-style web app.

Given:
Title: "${safeTitle}"

Content:
"""
${safeContent}
"""

Existing tags (user provided, if any): [${existingTags.join(", ")}]

TASKS:
1. Understand the core topics, technologies, emotions, and themes.
2. Generate 8–12 short, relevant tags (1–3 words each).
3. Avoid duplicates of existing tags.
4. Tags should be lowercase, machine-friendly, no spaces where possible (use hyphens or single words).

Respond ONLY in valid JSON:
{
  "tags": ["tag-one", "tag-two", "tag-three"]
}
`;

  const aiReply = await openRouterClient(prompt);

  // Try to extract JSON from AI reply
  const jsonStart = aiReply.indexOf("{");
  const jsonEnd = aiReply.lastIndexOf("}") + 1;
  const jsonString = aiReply.slice(jsonStart, jsonEnd);

  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    console.error("Failed to parse auto-tag JSON:", err.message);
    return [];
  }

  let tags = Array.isArray(parsed.tags) ? parsed.tags : [];

  // normalize: string only, trim, lowercase, remove empties
  tags = tags
    .map((t) => (typeof t === "string" ? t.trim().toLowerCase() : ""))
    .filter(Boolean);

  // remove duplicates vs existingTags
  const existingSet = new Set(
    existingTags.map((t) => t.toString().trim().toLowerCase()).filter(Boolean)
  );

  const uniqueAITags = tags.filter((t) => !existingSet.has(t));

  return uniqueAITags;
}

module.exports = {
  generateAutoTags,
};
