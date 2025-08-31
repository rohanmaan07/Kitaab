const axios = require("axios");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });
const systemPrompt = require("./systemPrompt");
const rohanPoetry = require("./rohanPoetry.json");

async function chatWithBot(userMsg, id) {
  let history = cache.get(id) || [];
  history.push({ role: "user", parts: [{ text: userMsg }] });

  const randomPoem =
    rohanPoetry.poems[Math.floor(Math.random() * rohanPoetry.poems.length)].content;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: history,
    tools: [{ google_search: {} }],
    systemInstruction: {
      parts: [
        { text: systemPrompt },
        { text: `Rohan poetry style example: ${randomPoem}` }
      ],
    },
  };

  try {
    const response = await axios.post(apiUrl, payload);
    const candidate = response.data.candidates?.[0];
    if (!candidate) return "Maaf kijiye, main is waqt soch nahi paa raha hoon.";

    const parts = candidate.content?.parts || [];
    let botReply = "";

    for (const part of parts) {
      if (part.text) botReply += part.text + " ";
    }

    if (botReply.trim()) {
      history.push({ role: "model", parts: [{ text: botReply }] });
      cache.set(id, history);
    }

    return botReply.trim();
  } catch (error) {
    console.error(
      "Error calling Gemini API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Something went wrong while communicating with the bot.");
  }
}

module.exports = { chatWithBot };
