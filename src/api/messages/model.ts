import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessagesSchema = new Schema(
  {
    _id: { type: String },
    sender: { type: String, required: true },
    content: {
      text: { type: String },
      media: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
export default model("messages", MessagesSchema);
