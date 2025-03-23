import mongoose from "mongoose";
const { Schema } = mongoose;

const chatInformationSchema = Schema({
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

  __v: {
    type: Number,
    select: false,
  },
});

export default mongoose.model("Chat", chatInformationSchema);
