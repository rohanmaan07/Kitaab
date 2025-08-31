const express = require("express");
const { chatWithBot } = require("../chatbot"); 
const router = express.Router();

router.post("/bot/chat", async (req, res) => {
  try {
    const userMsg = req.body.message;
    const id = req.body.id;
    if (!userMsg || !id) {
        return res.status(400).json({ error: "Message and ID are required." });
    }
    const reply = await chatWithBot(userMsg, id);
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

module.exports = router;

