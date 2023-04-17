import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import { httpServer, server } from "./src/server";


const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL || "");

mongoose.connection.on("connected", () => {
  console.log(`✅ Successfully connected to Mongo!`);
  httpServer.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`✅ Server is running on port ${port}`);
  });
});
