import { asyncHandler } from "../middlewares/asyncHandler.js";
import Request from "../models/Request.js";
import Donation from "../models/Donation.js";

// Restaurant part: nijer shob donation er upor asha request dekha
export const getRequestsForMyDonations = asyncHandler(async (req, res) => {
  const myDonations = await Donation.find({ restaurantId: req.userId }).select("_id");
  const myDonationIds = myDonations.map((d) => d._id);

  const requests = await Request.find({ donationId: { $in: myDonationIds }, status: "pending" })
    .populate("ngoId", "name contact address")
    .populate("donationId", "address packets duration remainingPackets");

  return res.status(200).json({ requests });
});

// Restaurant part: ekta request accept kora (remainingPackets komiye dibe)
export const acceptRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await Request.findById(id).populate("donationId");
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  if (request.status !== "pending") {
    return res.status(400).json({ error: "Request already processed" });
  }
  if (String(request.donationId.restaurantId) !== String(req.userId)) {
    return res.status(403).json({ error: "Not your donation" });
  }

  request.status = "accepted";
  await request.save();

  const donation = await Donation.findById(request.donationId._id);
  donation.remainingPackets = Math.max(0, donation.remainingPackets - request.requestedPackets);
  await donation.save();

  return res.status(200).json({ message: "Request accepted", request });
});

// Restaurant part: ekta request decline kora
export const declineRequest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const request = await Request.findById(id).populate("donationId");
  if (!request) {
    return res.status(404).json({ error: "Request not found" });
  }
  if (String(request.donationId.restaurantId) !== String(req.userId)) {
    return res.status(403).json({ error: "Not your donation" });
  }

  request.status = "declined";
  await request.save();

  return res.status(200).json({ message: "Request declined", request });
});

// Restaurant part: history (j shob request restaurant accept korche)
export const getRestaurantHistory = asyncHandler(async (req, res) => {
  const myDonations = await Donation.find({ restaurantId: req.userId }).select("_id");
  const myDonationIds = myDonations.map((d) => d._id);

  const history = await Request.find({ donationId: { $in: myDonationIds }, status: "accepted" })
    .populate("ngoId", "name contact address")
    .populate("donationId", "address packets duration")
    .sort({ updatedAt: -1 });

  return res.status(200).json({ history });
});