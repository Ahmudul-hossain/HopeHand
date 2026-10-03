import mongoose from "mongoose";
//pending rq dekhay
const requestSchema = new mongoose.Schema({
  donationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
    required: true,
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestedPackets: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "declined"],
    default: "pending",
  },
  notified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

const Request = mongoose.model("Request", requestSchema);
export default Request;