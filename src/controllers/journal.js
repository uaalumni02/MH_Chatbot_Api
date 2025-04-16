import Db from "../db/db";
import Journal from "../models/journal";
const OpenAI = require("openai");
import predictionPrompt from "../helpers/prompt/wordPrediction";

import * as Response from "../helpers/response/response";

class JournalData {
  static async addJournalEntry(req, res) {
    const JournalData = { ...req.body };
    try {
      const JournalInfo = await Db.addJournal(Journal, JournalData);
      return Response.responseOkCreated(res, JournalInfo);
    } catch (error) {
      return Response.responseServerError(res);
    }
  }
  static async allJournalEntries(req, res) {
    try {
      const allEntries = await Db.getAllEntries(Journal);
      return Response.responseOk(res, allEntries);
    } catch (error) {
      return Response.responseNotFound(res);
    }
  }
  static async getEntryByUser(req, res) {
    const { userName } = req.params;
    try {
      const entryByUserName = await Db.getEntryByUserName(Journal, userName);
      return Response.responseOk(res, entryByUserName);
    } catch (error) {
      console.log(error);
      return Response.responseNotFound(res);
    }
  }

  static async predictText(req, res) {
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

      // Predict the next few words of the user's journal entry
      const completionResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: predictionPrompt,
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 10,
        temperature: 0.7,
      });

      const prediction = completionResponse.choices[0].message.content.trim();

      if (!prediction) {
        throw new Error("No prediction returned from OpenAI.");
      }

      return res.status(200).json({
        success: true,
        prediction,
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

export default JournalData;
