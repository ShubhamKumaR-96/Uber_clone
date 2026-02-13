import mongoose from "mongoose";

async function connectDB() {
  try {
    
    if (!process.env.MONGO_DB_URL) {
      console.error("MONGO_DB not defined in environment variables");
      process.exit(1);
    }
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);
  

    console.log(`Successfully connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error while connecting to DB", error.message);
    process.exit(1);
  }
}

export default connectDB;
