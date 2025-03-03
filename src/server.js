import express from "express";
import "dotenv/config";
import mongoose, { connect } from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const { log, error } = console;

const port = process.env.PORT || 3000;

const router = express.Router();

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

app.use("/api", router);

app.listen(port, () => log("server is running"));
export default app;
