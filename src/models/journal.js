import mongoose from "mongoose";
const { Schema } = mongoose;

const journalSchema = Schema(
  {
    userName: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    journal: {
      type: String,
    },
    // chat: {
    //   type: Schema.Types.ObjectId, // needs to take in the chat, because mood will be used to help predict text for journaling//mood data is located in chat
    //   required: false,
    //   ref: "Chat",
    // },
    __v: {
      type: Number,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Journal", journalSchema);
