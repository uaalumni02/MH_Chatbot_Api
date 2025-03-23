const OpenAI = require("openai");
import chatbotPrompt from "../helpers/prompt/prompt";
import analysisPrompt from "../helpers/prompt/analysisPrompt";
import Chat from "../models/chat";
import Db from "../db/db";

class ChatData {
  static async addChat(req, res) {
    try {
      const { userName, prompt } = req.body; // Ensure userId is included

      if (!userName || !prompt) {
        return res
          .status(400)
          .json({ success: false, error: "User ID and prompt are required" });
      }

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      // Get chatbot response
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: chatbotPrompt + prompt }],
        max_tokens: 300,
        temperature: 0.6,
      });

      if (!chatResponse.choices[0].message.content) {
        throw new Error("Invalid response from OpenAI API");
      }
      const summaryResponse = chatResponse.choices[0].message.content;

      // Analyze user mood
      const moodAnalysis = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "system", content: analysisPrompt + prompt }],
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

      // Save chat history to the database, including mood response
      const chatData = new Chat({
        userName: userName,
        prompt: prompt,
        response: summaryResponse,
        mood: moodResponse, // Save mood to database
      });

      await chatData.save();

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
