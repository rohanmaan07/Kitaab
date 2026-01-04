const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });
const systemPrompt = require("./systemPrompt");
const rohanPoetry = require("./rohanPoetry.json");

async function chatWithBot(userMsg, id) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  // Fetch existing chat history from cache
  let history = cache.get(id) || [];

  // Add the new user message
  history.push({
    role: "user",
    parts: [{ text: userMsg }],
  });

  // Pick a random poem sample
  const randomPoem =
    rohanPoetry.poems[Math.floor(Math.random() * rohanPoetry.poems.length)].content;

  // Combine system + poem + conversation history into a SINGLE structured message
  const finalHistory = [
    {
      role: "user",
      parts: [
        {
          text: `${systemPrompt}

Poetry Style Sample:
${randomPoem}

Here is the conversation so far:
${history
  .map((msg) => `${msg.role.toUpperCase()}: ${msg.parts[0].text}`)
  .join("\n")}

User: ${userMsg}`,
        },
      ],
    },
  ];

  const payload = {
    contents: finalHistory,
  };

  try {
    const response = await axios.post(apiUrl, payload);

    const candidate = response.data.candidates?.[0];
    if (!candidate) return "Sorry, main is waqt reply generate nahi kar pa raha.";

    const parts = candidate.content?.parts || [];
    let botReply = "";

    for (const part of parts) {
      if (part.text) botReply += part.text + " ";
    }

    botReply = botReply.trim();

    if (botReply) {
      history.push({
        role: "model",
        parts: [{ text: botReply }],
      });

      cache.set(id, history);
    }

    return botReply;
  } catch (error) {
    console.error(
      "Gemini API ERROR:",
      error.response?.data || error.message
    );

    throw new Error("Something went wrong while communicating with the bot.");
  }
}

module.exports = { chatWithBot };
