import { asyncHandler } from "../middlewares/asyncHandler.js";
import Donation from "../models/Donation.js";

// notun donation add
export const createDonation = asyncHandler(async (req, res) => {
  const { contact, address, packets, duration } = req.body;

  if (!contact || !address || !packets || !duration) {
    return res.status(400).json({ error: "All fields are required" });
  }
// donation er pakcet num valid naki
  if (Number.isNaN(Number(packets)) || Number(packets) <= 0) {
    return res.status(400).json({ error: "Please give a valid packet number" });
  }

  const donation = await Donation.create({
    restaurantId: req.userId,
    contact,
    address,
    packets,
    remainingPackets: packets,
    duration,
  });

  return res.status(201).json({ donation });
});

// nijer sob donation dekha
export const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ restaurantId: req.userId }).sort({ createdAt: -1 });
  return res.status(200).json({ donations });
});

//  nijer donation delete kora
export const deleteDonation = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Donation.deleteOne({ _id: id, restaurantId: req.userId });
  return res.status(200).json({ message: "Donation deleted" });
});