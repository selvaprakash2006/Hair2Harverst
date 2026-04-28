import express from "express";
import { createPickup, getMyPickups, updateLocation } from "../controllers/salonController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/pickup", authenticate, createPickup);
router.get("/my-pickups", authenticate, getMyPickups);
router.post("/update-location", authenticate, updateLocation);

export default router;
