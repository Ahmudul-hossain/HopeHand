import express from "express";
import {
  createDonation,
  getMyDonations,
  deleteDonation,
} from "../controllers/donationController.restaurant.js";
import { getAllDonations } from "../controllers/donationController.ngo.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createDonation);       
router.get("/mine", protect, getMyDonations);     
router.delete("/:id", protect, deleteDonation);  
router.get("/", protect, getAllDonations);        

export default router;