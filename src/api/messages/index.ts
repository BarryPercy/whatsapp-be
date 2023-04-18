import Express from "express";
import createHttpError from "http-errors";
import ChatsSchema from "./chatModel";
import UserModel from "../users/model";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";

const chatsRouter = Express.Router();

//Get all chats that the user is a member of
chatsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const chats = await ChatsSchema.find({ members: req.body.user._id });
    res.send(chats);
  } catch (error) {
    next(error);
  }
});

//Create new chat or return existing chat
chatsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const { recipient } = req.body;
    if (!recipient) {
      throw createHttpError(400, "Recipient is required.");
    }

    const existingChat = await ChatsSchema.findOne({
      members: { $all: [req.body.user._id, recipient] },
    });
    if (existingChat) {
      return res.send(existingChat);
    }

    const members = [req.body.user._id, recipient];
    const newChat = new ChatsSchema({ members });
    const { _id } = await newChat.save();
    res.status(201).send({ _id });

    //TODO: Join sockets of both users to the new room
  } catch (error) {
    next(error);
  }
});

//Get message history for a specific chat
chatsRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const chat = await ChatsSchema.findOne({
      _id: req.params.id,
      members: req.body.user._id,
    });
    if (chat) {
      const messages = await ChatsSchema.find({ chatId: req.params.id });
      res.send(messages);
    } else {
      next(createHttpError(404, "Chat does not exist or unauthorized."));
    }
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
