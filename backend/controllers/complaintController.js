import { asyncHandler } from "../middlewares/asyncHandler.js";
import Complaint from "../models/Complaint.js";
import User from "../models/User.js";

// Restaurant -> NGO er birudhe, ar NGO -> Restaurant er birudhe complain kora
export const createComplaint = asyncHandler(async (req, res) => {
  // targetName , ngoName purono frontend er jonno rakha holo
  const targetName = (req.body.targetName || req.body.ngoName || "").trim();
  const message = (req.body.message || "").trim();

  if (!targetName || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  // je login kora ache tar role database theke ana hocche
  const user = await User.findById(req.userId).select("role");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const fromRole = user.role;
  const targetRole = fromRole === "restaurant" ? "ngo" : "restaurant";

  const complaint = await Complaint.create({
    fromUserId: req.userId,
    fromRole,
    targetRole,
    targetName,
    message,
  });
  return res.status(201).json({ message: "Complaint submitted", complaint });
});