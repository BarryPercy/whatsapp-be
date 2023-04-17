import mongoose from "mongoose";

const { Schema, model } = mongoose;

const MessagesSchema = new Schema(
  {
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    message: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);
export default model("messages", MessagesSchema);
