import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import { httpServer, server } from "./server";

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL as string);

mongoose.connection.on("connected", () => {
  httpServer.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server listening on port ${port}`);
  });
});
