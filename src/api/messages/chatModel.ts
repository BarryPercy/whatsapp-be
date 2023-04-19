import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatsSchema = new Schema(
  {
    members: [
      {
        name: { type: String },
        email: { type: String },
        status: { type: String },
        avatar: { type: String },
        role: { type: String },
      },
    ],
    messages: [
      {
        timestamp: { type: Number },
        sender: { type: String },
        content: {
          text: { type: String },
          media: { type: String },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("chats", ChatsSchema);
