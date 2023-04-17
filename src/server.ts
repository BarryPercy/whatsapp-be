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
} from "./errorHandlers";
import messagesRouter from "./messages/index";

const server = Express();

const httpServer = createServer(server);
const socketServer = new Server(httpServer);

server.use(cors());
server.use(Express.json());

//server.use("/users", usersRouter);
server.use("/users", messagesRouter);

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

export { httpServer, server };
