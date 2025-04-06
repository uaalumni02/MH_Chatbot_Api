import Db from "../db/db";
import Journal from "../models/journal";

import * as Response from "../helpers/response/response";

class JournalData {
  static async addJournalEntry(req, res) {
    const JournalData = { ...req.body };
    try {
      const JournalInfo = await Db.addJournal(Journal, JournalData);
      return Response.responseOkCreated(res, JournalInfo);
    } catch (error) {
        console.log(error)
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
  static async getEntryByUser(req, res) { //populate is now working....will use AI for sentence completion based on mood etc
    const { userName } = req.params;
    try {
      const entryByUserName = await Db.getEntryByUserName(Journal, userName);
      return Response.responseOk(res, entryByUserName);
    } catch (error) {
        console.log(error)
      return Response.responseNotFound(res);
    }
  }
}

export default JournalData;
