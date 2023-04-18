import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ChatsSchema = new Schema(
  {
    _id: { type: String },
    members: [
      {
        _id: { type: String },
        username: { type: String },
        email: { type: String },
        avatar: { type: String },
      },
    ],
    messages: [
      {
        _id: { type: String },
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
