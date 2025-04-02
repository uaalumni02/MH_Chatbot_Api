import express from "express";
import checkAuth from "../middleware/check-auth";
import journalController from "../controllers/journal";

const router = express.Router();

router
  .route("/")
  .post(checkAuth, journalController.addJournalEntry)
  .get(checkAuth, journalController.allJournalEntries);

router.route("/:userName").get(checkAuth, journalController.getEntryByUser);

export default router;
