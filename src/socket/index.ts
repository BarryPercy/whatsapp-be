import { Socket } from "socket.io";
import MessagesModel from '../api/messages/model'
import { UserList } from "../interfaces";

let userList:UserList[] = []
export const newConnectionHandler =  (socket: Socket) => {
  console.log("A new client connected!", socket.id)
//   socket.on("loggedIn", payload =>{
//     userList.push({ username: payload.username, id:socket.id})
//     console.log(userList)
//   })
//   socket.on("joinRoom", chatId => {
//     socket.join(chatId);
//     console.log(`Client with ID ${socket.id} joined room ${chatId}`);
//   });
//   socket.on("sendMessage", async (payload) =>{
//     console.log("heres sender->",payload)
//     const message = new MessagesModel({
//         sender: payload.message.sender,
//         content:{
//             text:payload.message.text
//         }
//     })
//     await message.save();
//     console.log(message)
//     socket.to(payload.message.chatId).emit("newMessage", payload.message);
  
//   })
}
