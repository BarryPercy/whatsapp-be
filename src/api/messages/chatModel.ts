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
        sender: { type: String },
        content: {
          text: { type: String },
          media: { type: String },
        },
        createdAt: {type:Date},
        updatedAt: {type:Date}
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("chats", ChatsSchema);
