import express from "express";
import {
  getRequestsForMyDonations,
  acceptRequest,
  declineRequest,
  getRestaurantHistory,
} from "../controllers/requestController.restaurant.js";
import {
  createRequest,
  getNewAcceptedRequests,
  getNgoHistory,
} from "../controllers/requestController.ngo.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRequest);
router.get("/for-my-donations", protect, getRequestsForMyDonations);
router.patch("/:id/accept", protect, acceptRequest);
router.patch("/:id/decline", protect, declineRequest);
router.get("/mine/new-accepted", protect, getNewAcceptedRequests);
router.get("/history/restaurant", protect, getRestaurantHistory);
router.get("/history/ngo", protect, getNgoHistory);

export default router;