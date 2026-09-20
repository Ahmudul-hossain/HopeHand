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

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, contact, address, role } = req.body;

  if (!name || !email || !password || !contact || !address || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!["restaurant", "ngo"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "Email is already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    contact,
    address,
    role,
  });

  const token = generateToken(user._id);
  res.cookie("token", token, cookieOptions);

  return res.status(201).json({
    message: "User registered",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      contact: user.contact,
      address: user.address,
      role: user.role,
    },
  });
});