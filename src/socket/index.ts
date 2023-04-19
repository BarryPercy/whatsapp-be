import { Socket } from "socket.io";
import MessagesModel from '../api/messages/model'


export const newConnectionHandler =  (socket: Socket) => {
  console.log("A new client connected!", socket.id)
  socket.on("sendMessage", async (payload) =>{
    console.log("heres sender->",payload)
    const message = new MessagesModel({
        sender: payload.message.sender,
        content:{
            text:payload.message.text
        }
    })
    await message.save();
    console.log(message)
  })
}
