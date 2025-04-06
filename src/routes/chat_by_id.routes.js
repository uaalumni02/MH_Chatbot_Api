import express from "express";
import checkAuth from "../middleware/check-auth";
import chatController from "../controllers/chat";

const router = express.Router();

router.route("/:id").get(checkAuth, chatController.getChatById);

export default router;
