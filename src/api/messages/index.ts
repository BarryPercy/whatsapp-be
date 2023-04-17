import Express from "express";
import createHttpError from "http-errors";
import MessagesSchema from "./model";

const messagesRouter = Express.Router();

//create new message
messagesRouter.post("/messages/new", async (req, res, next) => {
  try {
    const newMessage = new MessagesSchema(req.body);
    const { _id } = await newMessage.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});
//All messages
messagesRouter.get("/messages", async (req, res, next) => {
  try {
    const messages = await MessagesSchema.find();
    res.send(messages);
  } catch (error) {
    next(error);
  }
});

//get specific message
messagesRouter.get("/messages/:id", async (req, res, next) => {
  try {
    const messages = await MessagesSchema.findById(req.params.id);
    if (messages) {
      res.send(messages);
    } else {
      next(createHttpError(404, "Message does not exist!"));
    }
  } catch (error) {
    next(error);
  }
});

messagesRouter.put("/messages/:id", async (req, res, next) => {
  try {
    const updatedMessage = await MessagesSchema.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedMessage) {
      res.send(updatedMessage);
    } else {
      next(createHttpError(404, `Message does not exist!`));
    }
  } catch (error) {
    next(error);
  }
});

messagesRouter.delete("/messages/:id", async (req, res, next) => {
  try {
    const messageToDelete = await MessagesSchema.findByIdAndDelete(
      req.params.id
    );
    if (messageToDelete) {
      res.status(204).send();
    } else {
      next(createHttpError(404, `Message does not exist!`));
    }
  } catch (error) {
    next(error);
  }
});
export default messagesRouter;
