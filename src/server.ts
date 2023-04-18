import Express from "express";
import { Server } from "socket.io";
import { createServer } from "http"; // CORE MODULE
import cors from "cors";
import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHandler,
  notFoundHandler,
  unauthorizedHandler,

  validationErrorHandler,
} from "./errorHandlers";
//import messageRouter from "./src/messages/index";
import userRouter from "./users";
import passport from "passport";
import googleStrategy from "./lib/auth/google";
import messagesRouter from "./api/messages/index";


const server = Express();

const httpServer = createServer(server);
const socketServer = new Server(httpServer);

passport.use("google", googleStrategy)
server.use(cors());
server.use(Express.json());
server.use(passport.initialize())


server.use("/users", userRouter);
//server.use("/users", messagesRouter);


server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);

server.use(validationErrorHandler)
server.use(genericErrorHandler);



export { httpServer, server };
