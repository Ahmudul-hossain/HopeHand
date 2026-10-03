import { asyncHandler } from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  if (role && user.role !== role) {
    const displayRole = user.role === "ngo" ? "NGO" : "Restaurant";
    return res.status(400).json({
      error: `This account is already registered as ${displayRole}`,
    });
  }

  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);

  return res.status(200).json({
    message: "Login successful",
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logged out" });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json({ user });
});

export const updateGoal = asyncHandler(async (req, res) => {
  const { monthlyGoal } = req.body;

  if (!monthlyGoal || Number(monthlyGoal) <= 0) {
    return res.status(400).json({ error: "Please give a valid goal number" });
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { monthlyGoal: Number(monthlyGoal) },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ message: "Goal updated", user });
});

// notun: profile er name, contact, address, email update kora (format check shoho)
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, contact, address, email } = req.body;

  if (!name || !contact || !address || !email) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const contactPattern = /^[0-9]{10,15}$/;
  if (!contactPattern.test(contact)) {
    return res.status(400).json({ error: "Contact number must be 10 to 15 digits only" });
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    return res.status(400).json({ error: "Please give a valid email address" });
  }

  const existingUser = await User.findOne({ email, _id: { $ne: req.userId } });
  if (existingUser) {
    return res.status(400).json({ error: "This email is already used by another account" });
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { name, contact, address, email },
    { new: true }
  ).select("-password");

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  return res.status(200).json({ message: "Profile updated", user });
});