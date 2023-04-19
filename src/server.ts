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
import userRouter from "../src/api/users";
import passport from "passport";
import googleStrategy from "./lib/auth/google";
import chatsRouter from "./api/messages/index";
import { newConnectionHandler } from "./socket/index"
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from "./interfaces";

const expressServer = Express();

const httpServer = createServer(expressServer);
const socketServer = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(httpServer);
socketServer.on("connection", newConnectionHandler)

passport.use("google", googleStrategy);
passport.use("google", googleStrategy);
expressServer.use(cors());
expressServer.use(Express.json());
expressServer.use(passport.initialize());

expressServer.use("/users", userRouter);
expressServer.use("/chats", chatsRouter);

expressServer.use(badRequestHandler);
expressServer.use(unauthorizedHandler);
expressServer.use(forbiddenHandler);
expressServer.use(notFoundHandler);

expressServer.use(validationErrorHandler);
expressServer.use(genericErrorHandler);

export { httpServer, expressServer };
