import { Socket } from "socket.io";
import MessagesModel from '../api/messages/model'
import { UserList } from "../interfaces";
import chatModel from "../api/messages/chatModel";

let userList:UserList[] = []
export const newConnectionHandler =  (socket: Socket) => {
  console.log("A new client connected!", socket.id)
  
  socket.on("joinRoom", chatId => {
    socket.join(chatId);
    console.log(`Client with ID ${socket.id} joined room ${chatId}`);
  });
  socket.on("sendMessage", async (payload) =>{
    const message = new MessagesModel({
        sender: payload.message.sender,
        content:{
            text:payload.message.content.text
        }
    })
    await message.save();
    const chat = await chatModel.findByIdAndUpdate(
        payload.message._id,
        {$push:{messages:message}},
        {new:true, runValidators: true}
        )
    socket.to(payload.message._id).emit("newMessage", payload.message);
  
  })
}
