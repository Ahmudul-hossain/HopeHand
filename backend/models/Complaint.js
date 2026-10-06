import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // ke complain korse: restaurant ba ngo
  fromRole: {
    type: String,
    enum: ["restaurant", "ngo"],
  },
  // kar birudhe complain: ngo ba restaurant
  targetRole: {
    type: String,
    enum: ["restaurant", "ngo"],
  },
  // jar birudhe complain (NGO ba Restaurant er nam)
  targetName: { type: String },
  // purono data er jonno rakha holo (age sudhu ngoName thakto)
  ngoName: { type: String },
  message: { type: String, required: true },
}, { timestamps: true });

const Complaint = mongoose.model("Complaint", complaintSchema);
export default Complaint;