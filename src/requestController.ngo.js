import { asyncHandler } from "../middlewares/asyncHandler.js";
import Request from "../models/Request.js";
import Donation from "../models/Donation.js";

// NGO part: ekta donation er jonno request pathano (koto packets chai shoho)
export const createRequest = asyncHandler(async (req, res) => {
  const { donationId, requestedPackets } = req.body;

  if (!donationId || !requestedPackets) {
    return res.status(400).json({ error: "donationId and requestedPackets are required" });
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    return res.status(404).json({ error: "Donation not found" });
  }                 

  if (Number(requestedPackets) > donation.remainingPackets) {
    return res.status(400).json({ error: "Ei koto packets available nai" });
  }

  const alreadyRequested = await Request.findOne({ donationId, ngoId: req.userId });
  if (alreadyRequested) {
    return res.status(400).json({ error: "You already requested this donation" });
  }

  const request = await Request.create({
    donationId,
    ngoId: req.userId,
    requestedPackets,
  });

  return res.status(201).json({ request });
});

// NGO part: "amar kono request ki notun accept hoyeche" check kora (popup er jonno)
export const getNewAcceptedRequests = asyncHandler(async (req, res) => {
  const newlyAccepted = await Request.find({
    ngoId: req.userId,
    status: "accepted",
    notified: false,
  }).populate("donationId", "contact address packets duration");

  await Request.updateMany(
    { ngoId: req.userId, status: "accepted", notified: false },
    { notified: true }
  );

  return res.status(200).json({ requests: newlyAccepted });
});

// NGO part: history (j shob request NGO er accept hoyeche)
export const getNgoHistory = asyncHandler(async (req, res) => {
  const history = await Request.find({ ngoId: req.userId, status: "accepted" })
    .populate({
      path: "donationId",
      select: "address packets duration restaurantId",
      populate: { path: "restaurantId", select: "name contact address" },
    })
    .sort({ updatedAt: -1 });

  return res.status(200).json({ history });
});