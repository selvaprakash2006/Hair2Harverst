import express from "express";
import { 
  getAvailablePickups, 
  acceptPickup, 
  completePickup, 
  getMyCollections, 
  getStats, 
  getUsers,
  createStaff,
  getAssignmentRequests,
  approveAssignment,
  assignStaff
} from "../controllers/adminController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.get("/available-pickups", authenticate, getAvailablePickups);
router.post("/accept-pickup/:id", authenticate, acceptPickup);
router.post("/complete-pickup/:id", authenticate, completePickup);
router.get("/my-collections", authenticate, getMyCollections);
router.get("/stats", authenticate, getStats);
router.get("/users", authenticate, getUsers);
router.post("/create-staff", authenticate, createStaff);
router.get("/assignment-requests", authenticate, getAssignmentRequests);
router.post("/approve-assignment/:requestId", authenticate, approveAssignment);
router.post("/assign-staff", authenticate, assignStaff);

export default router;
