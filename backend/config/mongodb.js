import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database Connected!"));

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not defined");

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
};

export default connectDB;
