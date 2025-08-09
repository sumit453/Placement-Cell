import mongoose from "mongoose";

export async function connectDB() {
  const uri =
    process.env.MONGODB_URI || "mongodb://localhost:27017/placement_cell";
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    autoIndex: true,
  });
  console.log("MongoDB connected");
}
