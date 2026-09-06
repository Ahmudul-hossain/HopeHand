import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../../hopehand-backend/hopehand-backend/models/User.js";

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
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
};

export const loginUser = async (req, res) => {
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
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logged out" });
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json({ user });
};