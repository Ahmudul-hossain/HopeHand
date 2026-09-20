import mongoose from "mongoose";
//resturant er donation er database 
const donationSchema = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contact: { type: String, required: true },
  address: { type: String, required: true },
  packets: { type: Number, required: true },
  remainingPackets: { type: Number, required: true },
  duration: { type: String, required: true },
}, { timestamps: true });

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;