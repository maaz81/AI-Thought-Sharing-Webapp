const openRouterClient = require('../../utils/openaiClient');

const generatePostSuggestions = async (req, res) => {
  const { title, description, tags } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }

  const prompt = `
You are an assistant for blog writers.

Given the title: "${title}"
And description: "${description}"

1. Suggest 5 catchy, unique blog titles.
2. Rewrite the original description into 3 different, improved versions.
   - Each version should be at least **50 words long**.
   - Make them more engaging and informative.
3. 10 tags related to the topic

Respond in JSON format as:
{
  "titles": ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"],
  "descriptions": ["Description 1", "Description 2", "Description 3"],
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8", "tag9", "tag10"]
}
`;

  try {
    const aiReply = await openRouterClient(prompt);

    const jsonStart = aiReply.indexOf('{');
    const jsonEnd = aiReply.lastIndexOf('}') + 1;
    const jsonString = aiReply.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);
    res.status(200).json(result);

  } catch (err) {
    console.error("AI Generation Error:", err.message);
    res.status(500).json({ error: "AI generation failed" });
  }
};


const handleAIChat = async (req, res) => {
  const { message } = req.body;

  try {
    const aiReply = await openRouterClient(message);
    res.status(200).json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ error: err.message || 'AI chat failed' });
  }
};


/**
 * NEW: AI Review / Co-author endpoint
 * - Takes title + content
 * - Returns improvedTitle, improvedContent, suggestions[]
 */
const handleAIReview = async (req, res) => {
  const { title, content } = req.body;

  if (!title && !content) {
    return res.status(400).json({ error: "Title or content is required for review" });
  }

  const prompt = `
You are a thoughtful writing assistant for an idea/thought sharing platform.

User's current writing:

Title: "${title || ''}"

Content:
"""
${content || ''}
"""

Your tasks:
1. Improve the title to be clearer and more engaging, but keep the original intent.
2. Rewrite the content with:
   - Better structure
   - Simple, clear language
   - Keep the same meaning and tone
3. Give 3–5 short bullet-point suggestions on how the user can further improve it.

Respond ONLY in valid JSON:

{
  "improvedTitle": "string",
  "improvedContent": "string",
  "suggestions": ["string", "string", "string"]
}
`;

  try {
    const aiReply = await openRouterClient(prompt);

    const jsonStart = aiReply.indexOf('{');
    const jsonEnd = aiReply.lastIndexOf('}') + 1;
    const jsonString = aiReply.slice(jsonStart, jsonEnd);

    const result = JSON.parse(jsonString);

    return res.status(200).json(result);
  } catch (err) {
    console.error("AI Review Error:", err.message);
    return res.status(500).json({ error: "AI review failed" });
  }
};

module.exports = { 
  generatePostSuggestions, 
  handleAIChat,
  handleAIReview,       // 👈 NEW EXPORT
};
