// api/anonymize.js
const express = require("express");
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // 建議用 .env 管理
});
const openai = new OpenAIApi(configuration);

router.use(express.json());

router.post("/", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided" });
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: `請去識別化以下內容：${text}` }],
    });

    const result = completion.data.choices[0].message.content;
    res.status(200).json({ anonymized: result });
  } catch (err) {
    console.error("API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to process message" });
  }
});

module.exports = router;
