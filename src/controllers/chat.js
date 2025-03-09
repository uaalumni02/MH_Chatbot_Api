const OpenAI = require("openai");
import chatbotPrompt from "../helpers/prompt/prompt";
import analysisPrompt from "../helpers/prompt/analysisPrompt";

class ChatData {
  static async addChat(req, res) {
    try {
      const { prompt } = req.body;

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: chatbotPrompt + prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.6,
      });
      if (!response.choices[0].message.content) {
        throw new Error("Invalid response from OpenAI API");
      }

      const summaryResponse = response.choices[0].message.content;

      // Analyze user mood
      const moodAnalysis = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: analysisPrompt + prompt,
          },
        ],
        max_tokens: 20,
        temperature: 0.5,
      });

      if (!moodAnalysis.choices[0].message.content) {
        throw new Error("Invalid response from OpenAI API for mood analysis");
      }

      let moodResponse;
      try {
        moodResponse = JSON.parse(moodAnalysis.choices[0].message.content);
      } catch (e) {
        throw new Error("Failed to parse mood analysis response");
      }

      console.log(summaryResponse, moodResponse);

      return res.status(200).json({
        success: true,
        data: summaryResponse,
        mood: moodResponse,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        error: "Internal Server Error",
      });
    }
  }
}

module.exports = ChatData;
