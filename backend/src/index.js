import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import http from "http";
import connectDb from "./config/dbConfig.js";


const PORT = process.env.PORT || 3000;



async function startServer() {
  try {
    await connectDb()
    http.createServer(app).listen(PORT, () => {
      console.log(`Server started at port ${PORT}`);
    });
  } catch (error) {
    console.log("Error while starting server", error.message);
    process.exit(1);
  }
}

startServer();
