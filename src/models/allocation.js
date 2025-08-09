import mongoose from "mongoose";

const allocationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      required: true,
      index: true,
    },
    result: {
      type: String,
      enum: ["PASS", "FAIL", "On Hold", "Didn't Attempt"],
      default: "Didn't Attempt",
    },
  },
  { timestamps: true }
);

allocationSchema.index({ studentId: 1, interviewId: 1 }, { unique: true });

export default mongoose.model("Allocation", allocationSchema);
