import express from "express";
import checkAuth from "../middleware/check-auth";

import userController from "../controllers/user";

const router = express.Router();

router.route("/").post(userController.addUser);

export default router;
