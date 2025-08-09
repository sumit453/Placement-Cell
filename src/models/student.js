import mongoose from "mongoose";

const scoresSchema = new mongoose.Schema(
  {
    dsa: { type: Number, min: 0, max: 100, default: 0 },
    webd: { type: Number, min: 0, max: 100, default: 0 },
    react: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true, unique: true },
    college: { type: String, required: true, trim: true },
    batch: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["placed", "not_placed"],
      default: "not_placed",
    },
    scores: { type: scoresSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
