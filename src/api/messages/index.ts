import Express, { Request } from "express";
import createHttpError from "http-errors";
import ChatsSchema from "./chatModel";
import { JWTAuthMiddleware } from "../../lib/auth/jwt";
import { TokenPayload } from "../../lib/auth/tools";
import UserModel from "../users/model";
import MessagesSchema from "./model";

interface CustomRequest extends Request {
  user?: TokenPayload;
}

const chatsRouter = Express.Router();

//Get all chats that the user is a member of
chatsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const thisUser = await UserModel.findById((req as CustomRequest).user?._id);
    console.log(thisUser!.email);
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const chats = await ChatsSchema.find({ "members.email": thisUser!.email });
    console.log(chats);
    res.send({ chats });
  } catch (error) {
    next(error);
  }
});

chatsRouter.post("/addMessage",JWTAuthMiddleware, async (req,res,next)=>{
  try {
    const chat = await ChatsSchema.findById(req.body.chatId)
    if(!chat){
      throw createHttpError(400, "can't find chat");
    }
    console.log("body object",req.body.message)
    console.log("chat.messages",chat.messages)
  } catch (error) {
    console.log(error)
  }
})
chatsRouter.post("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const theUser = await UserModel.findById((req as CustomRequest).user?._id);
    const recipient = await UserModel.findById(req.body.recipient);
    if (!recipient) {
      throw createHttpError(400, "Recipient is required.");
    }
    const members = [
      {
        _id: theUser!._id.toString(),
        username: theUser!.name,
        email: theUser!.email,
        avatar: theUser!.avatar,
        role: theUser!.role,
      },
      {
        _id: recipient!._id.toString(),
        username: recipient!.name,
        email: recipient!.email,
        avatar: recipient!.avatar,
        role: recipient!.role,
      },
    ];
    const existingChat = await ChatsSchema.findOne({
      $and: [
        { members: { $elemMatch: { _id: recipient!.id } } },
        { members: { $elemMatch: { _id: theUser!.id } } },
      ],
    });
    if (existingChat) {
      //const messages = await ChatsSchema.find({ chatId: existingChat._id });
      return res
        .status(200)
        .send({ chatId: existingChat._id, messages: existingChat.messages });
    } else {
      const newChat = new ChatsSchema({ members });
      const { _id } = await newChat.save();

      await UserModel.updateMany(
        { _id: { $in: [theUser!._id, recipient!._id] } },
        { $addToSet: { chats: { chatId: _id } } }
      );

      res.status(201).send({ chatId: _id });
    }

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
      members: {
        $elemMatch: {
          _id: (req as CustomRequest).user!._id,
        },
      },
    });
    if (chat) {
      res.send(chat.messages);
    } else {
      next(createHttpError(404, "Chat does not exist or unauthorized."));
    }
  } catch (error) {
    next(error);
  }
});

export default chatsRouter;
