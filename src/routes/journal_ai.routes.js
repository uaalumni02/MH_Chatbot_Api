import express from "express";
import checkAuth from "../middleware/check-auth";
import journalController from "../controllers/journal";

const router = express.Router();

router
  .route("/")
  .post(checkAuth, journalController.predictText)

export default router;