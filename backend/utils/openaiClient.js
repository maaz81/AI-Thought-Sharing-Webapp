const axios = require('axios');

const openRouterClient = async (prompt) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-oss-20b:free', // or deepseek-coder, if you're using that
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://your-app.com', // optional but good
          'X-Title': 'Post-AI-Suggester'
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error('OpenRouter API Error:', error?.response?.data || error.message);
    throw new Error('AI request failed');
  }
};

module.exports = openRouterClient;
