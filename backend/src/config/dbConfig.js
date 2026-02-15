import mongoose from "mongoose";

const connectDB=async()=>{
  try{
    // connection options
    const options={
      maxPoolSize:10,
      serverSelectionTimeoutMS:5000,
      socketTimeoutMS:45000,
    }

    // connect to MongoDB
    const conn=await mongoose.connect(process.env.MONGO_DB_URL,options)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`database : ${conn.connection.host}`)
    
    // connection event handler
    mongoose.connection.on("connected",()=>{
      console.log("Mongoose connected to MOngoDB")
    });

    mongoose.connection.on("error",(err)=>{
      console.log("❌ MongoDB connection Error", err)
    });

    mongoose.connection.on("disconnected",()=>{
      console.log("⚠️ MongoDB disconnected")
    });

    // graceful shutdown

    process.on('SIGINT',async()=>{
      await mongoose.connection.close();
      console.log("MongoDB connection closed through app termination")
      process.exit(0)
    })

  }catch(err){
    console.log("❌ MongoDB connection failed", err.message)
    process.exit(1)
  }
}

export default connectDB;