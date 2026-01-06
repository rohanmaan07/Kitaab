const Groq = require("groq-sdk");
const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 60 * 60 * 24 });
const systemPrompt = require("./systemPrompt");
const rohanPoetry = require("./rohanPoetry.json");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function chatWithBot(userMsg, id) {
  try {
    // Get or create session data
    let sessionData = cache.get(id) || { messages: [] };
    
    // Pick a random poem sample for this session if not already there
    if (!sessionData.randomPoem) {
      sessionData.randomPoem =
        rohanPoetry.poems[
          Math.floor(Math.random() * rohanPoetry.poems.length)
        ].content;
    }

    // Build messages array for Groq
    const messages = [
      {
        role: "system",
        content: `${systemPrompt}\n\nPoetry Style Sample:\n${sessionData.randomPoem}`,
      },
    ];

    // Add conversation history
    if (sessionData.messages.length > 0) {
      sessionData.messages.forEach((msg) => {
        messages.push({
          role: msg.role === "User" ? "user" : "assistant",
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userMsg,
    });

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500,
    });

    const botReply = chatCompletion.choices[0]?.message?.content || "Sorry, koi response nahi mila.";

    // Update session history
    sessionData.messages.push({ role: "User", content: userMsg });
    sessionData.messages.push({ role: "Bot", content: botReply });
    
    // Keep only last 10 exchanges (20 messages)
    if (sessionData.messages.length > 20) {
      sessionData.messages = sessionData.messages.slice(-20);
    }
    
    cache.set(id, sessionData);

    return botReply;
  } catch (error) {
    console.error("Groq API ERROR:", error.message);
    throw new Error("Something went wrong while communicating with the bot.");
  }
}

module.exports = { chatWithBot };

