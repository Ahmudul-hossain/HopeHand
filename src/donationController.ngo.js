import { asyncHandler } from "../middlewares/asyncHandler.js";
import Donation from "../models/Donation.js";
import Request from "../models/Request.js";

// NGO part: shob restaurant er shob donation dekha (jegulate packets baki ache)
export const getAllDonations = asyncHandler(async (req, res) => {
  const myRequests = await Request.find({ ngoId: req.userId }).select("donationId");
  const requestedDonationIds = myRequests.map((r) => r.donationId.toString());

  const donations = await Donation.find({
    _id: { $nin: requestedDonationIds },
    remainingPackets: { $gt: 0 },
  })
    .populate("restaurantId", "name contact address")
    .sort({ createdAt: -1 });

  return res.status(200).json({ donations });
});