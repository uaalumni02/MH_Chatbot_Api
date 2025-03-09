const OpenAI = require("openai");
import chatbotPrompt from "../helpers/prompt/prompt";

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
            content:
              "Analyze the following message and determine the user's mood (positive, neutral, or negative) and provide a mood score (-1 for negative, 0 for neutral, 1 for positive): " +
              prompt,
          },
        ],
        max_tokens: 10,
        temperature: 0.5,
      });

      if (!moodAnalysis.choices[0].message.content) {
        throw new Error("Invalid response from OpenAI API for mood analysis");
      }

      const moodResponse = moodAnalysis.choices[0].message.content;

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
