import mongoose from "mongoose";
const { Schema } = mongoose;

const chatInformationSchema = Schema(
  {
    userName: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    prompt: {
      type: Schema.Types.Mixed,
      required: [true, "prompt is required"],
    },
    response: {
      type: String,
    },
    mood: {
      type: Schema.Types.Mixed, // Ensure it can store objects
      required: false,
    },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Chat", chatInformationSchema);
