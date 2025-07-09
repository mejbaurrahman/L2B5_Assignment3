import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";

let server: Server;

const PORT = 5000;

async function main() {
  try {
    await mongoose.connect(
      "mongodb+srv://user1:abcd1234@cluster0.xvker.mongodb.net/library-management?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("Connected to MongoDB Using Mongoose!!");
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
