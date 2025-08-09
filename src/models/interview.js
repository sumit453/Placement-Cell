import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);
