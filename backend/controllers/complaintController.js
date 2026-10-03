import { asyncHandler } from "../middlewares/asyncHandler.js";
import Complaint from "../models/Complaint.js";
// Restaurant part: kunu NGO er birudhe complain kora
export const createComplaint = asyncHandler(async (req, res) => {
  const { ngoName, message } = req.body;

  if (!ngoName || !message) {
    return res.status(400).json({ error: "NGO name and message are required" });
  }

  const complaint = await Complaint.create({
    fromUserId: req.userId,
    ngoName,
    message,
  });
  return res.status(201).json({ message: "Complaint submitted", complaint });
});