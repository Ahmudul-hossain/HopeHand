import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import { log } from "./middlewares/logger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "dns";
import donationRouter from "./routes/donationRoute.js";
import requestRouter from "./routes/requestRoute.js";
dotenv.config();
console.log("JWT_SECRET loaded:", process.env.JWT_SECRET);

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();

mongoose.connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(`Error connecting database ${err}`));

const port = process.env.PORT || 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:5176",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(log);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.status(200).json({ message: "HULULU" });
});
app.use("/auth", authRouter);
app.use("/donations", donationRouter);
app.use("/requests", requestRouter);
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});