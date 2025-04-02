const OpenAI = require("openai");
const PDFDocument = require("pdfkit");
import chatbotPrompt from "../helpers/prompt/prompt";
import analysisPrompt from "../helpers/prompt/analysisPrompt";
import * as Response from "../helpers/response/response";
import Chat from "../models/chat";
import Db from "../db/db";

class ChatData {
  static async addChat(req, res) {
    try {
      const { userName, prompt } = req.body;

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

      // Save chat history to the database
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

  static async allChats(req, res) {
    try {
      const allChats = await Db.getAllChats(Chat);
      console.log(allChats[0].mood)
      return Response.responseOk(res, allChats);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }

  static async getChatByUser(req, res) {
    const { userName } = req.params;
    try {
      const chatByUserName = await Db.getChatByUserName(Chat, userName);
      return Response.responseOk(res, chatByUserName);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }

  static async clearChatHistory(req, res) {
    const { userName } = req.params;
    try {
      const clearChats = await Db.removeChats(Chat, userName);
      return Response.responseOk(res, {
        message: "Chat history cleared successfully",
        deletedCount: clearChats.deletedCount,
      });
    } catch (error) {
      return Response.responseServerError(res);
    }
  }

  static async getChatPdf(req, res) {
    const { userName } = req.params;
    try {
      const chatByUserName = await Db.getChatByUserName(Chat, userName);

      if (!chatByUserName || chatByUserName.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "No chat history found" });
      }

      // Create a new PDF document
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${userName}_chat.pdf`
      );

      // Pipe PDF output to response
      doc.pipe(res);

      // Title
      doc
        .fontSize(20)
        .text(`Chat History`, { align: "center" });
      doc.moveDown();

      // Iterate through chat history and add prompt/response
      chatByUserName.forEach((chat) => {
        doc
          .fontSize(14)
          .fillColor("black")
          .text(`Prompt: ${chat.prompt}`, { bold: true });
        doc.moveDown(0.3);
        doc.fontSize(12).fillColor("gray").text(`Response: ${chat.response}`);
        doc.moveDown(1);
      });

      // Finalize PDF
      doc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      return res
        .status(500)
        .json({ success: false, message: "Error generating PDF" });
    }
  }
}

module.exports = ChatData;
