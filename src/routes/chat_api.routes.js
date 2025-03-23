import express from "express";
import checkAuth from "../middleware/check-auth";
import chatController from "../controllers/chat";

const router = express.Router();

router.route("/").get(checkAuth, chatController.allChats);

router.route("/:userName").get(checkAuth, chatController.getChatByUser);

export default router;
