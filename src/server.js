import express from "express";
import "dotenv/config";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const { log, error } = console;

const port = process.env.PORT || 3000;

const router = express.Router();

import userRoutes from "./routes/user.routes";
import chatRoutes from "./routes/chat.routes";
import chat_api from "./routes/chat_api.routes";
import pdfRoutes from "./routes/pdf.routes";
import logoutRoutes from "./routes/logout.routes";
import journalRoutes from "./routes/journal.routes";
import chatByIdRoutes from "./routes/chat_by_id.routes";
import journalAiRoutes from "./routes/journal_ai.routes";

const corsOptions = {
  origin: "http://localhost:3001", // Front-end origin
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const DB_URL = process.env.MONGO_URL;

try {
  mongoose.connect(DB_URL, { useNewUrlParser: true });
  console.log("Connection Successful");
} catch (err) {
  console.error("Unable to Connect to MongoDB", err);
}

router.use("/user", userRoutes);
router.use("/v1/chat/completions", chatRoutes);
router.use("/chat", chat_api);
router.use("/pdf", pdfRoutes);
router.use("/logout", logoutRoutes);
router.use("/journal", journalRoutes);
router.use("/chat_id", chatByIdRoutes);
router.use("/journal_ai", journalAiRoutes);

app.use("/api", router);

app.listen(port, () => log("server is running"));
export default app;
