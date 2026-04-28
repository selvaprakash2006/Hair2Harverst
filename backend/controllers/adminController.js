import db from "../config/db.js";
import bcrypt from "bcryptjs";

export const getAvailablePickups = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "labour") return res.status(403).json({ error: "Forbidden" });
  const pickups = db.prepare(`
    SELECT p.*, u.name as owner_name, u.shop_name, u.location as shop_location, u.contact as salon_contact
    FROM pickups p
    JOIN users u ON p.salon_id = u.id
    WHERE p.status = 'pending'
    ORDER BY p.created_at DESC
  `).all();
  res.json(pickups);
};

export const acceptPickup = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "labour") return res.status(403).json({ error: "Forbidden" });
  
  if (req.user.role === "labour") {
    // Labours "Request" assignment
    try {
      db.prepare("INSERT INTO assignment_requests (pickup_id, labour_id) VALUES (?, ?)")
        .run(req.params.id, req.user.id);
      res.json({ success: true, message: "Assignment requested" });
    } catch (err) {
      res.status(400).json({ error: "Request already exists or invalid" });
    }
  } else {
    // Admins can still "Accept" (self-assign) directly
    db.prepare("UPDATE pickups SET vendor_id = ?, status = 'accepted' WHERE id = ? AND status = 'pending'")
      .run(req.user.id, req.params.id);
    res.json({ success: true });
  }
};

export const getAssignmentRequests = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const requests = db.prepare(`
    SELECT ar.*, u.name as labour_name, p.quantity, p.pickup_date, s.shop_name
    FROM assignment_requests ar
    JOIN users u ON ar.labour_id = u.id
    JOIN pickups p ON ar.pickup_id = p.id
    JOIN users s ON p.salon_id = s.id
    WHERE ar.status = 'pending'
  `).all();
  res.json(requests);
};

export const approveAssignment = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { requestId } = req.params;
  const request = db.prepare("SELECT * FROM assignment_requests WHERE id = ?").get(requestId);
  if (!request) return res.status(404).json({ error: "Request not found" });

  const transaction = db.transaction(() => {
    db.prepare("UPDATE pickups SET vendor_id = ?, status = 'accepted' WHERE id = ?").run(request.labour_id, request.pickup_id);
    db.prepare("UPDATE assignment_requests SET status = 'approved' WHERE id = ?").run(requestId);
    db.prepare("UPDATE assignment_requests SET status = 'rejected' WHERE pickup_id = ? AND status = 'pending'").run(request.pickup_id);
  });
  transaction();
  res.json({ success: true });
};

export const assignStaff = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { pickupId, labourId } = req.body;
  
  const transaction = db.transaction(() => {
    db.prepare("UPDATE pickups SET vendor_id = ?, status = 'accepted' WHERE id = ?").run(labourId, pickupId);
    db.prepare("UPDATE assignment_requests SET status = 'rejected' WHERE pickup_id = ? AND status = 'pending'").run(pickupId);
  });
  transaction();
  res.json({ success: true });
};

export const completePickup = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "labour") return res.status(403).json({ error: "Forbidden" });
  db.prepare("UPDATE pickups SET status = 'collected' WHERE id = ? AND vendor_id = ?")
    .run(req.params.id, req.user.id);
  res.json({ success: true });
};

export const getMyCollections = (req, res) => {
  if (req.user.role !== "admin" && req.user.role !== "labour") return res.status(403).json({ error: "Forbidden" });
  const pickups = db.prepare(`
    SELECT p.*, u.name as owner_name, u.shop_name, u.location as shop_location, u.contact as salon_contact
    FROM pickups p
    JOIN users u ON p.salon_id = u.id
    WHERE p.vendor_id = ?
    ORDER BY p.created_at DESC
  `).all(req.user.id);
  res.json(pickups);
};

export const getStats = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const totalSalons = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'salon'").get();
  const totalHair = db.prepare("SELECT SUM(quantity) as sum FROM pickups WHERE status = 'collected'").get();
  const recentPickups = db.prepare(`
    SELECT p.*, s.name as salon_name, v.name as vendor_name
    FROM pickups p
    JOIN users s ON p.salon_id = s.id
    LEFT JOIN users v ON p.vendor_id = v.id
    ORDER BY p.created_at DESC LIMIT 10
  `).all();

  res.json({
    totalSalons: totalSalons.count,
    totalHair: totalHair.sum || 0,
    recentPickups
  });
};

export const getUsers = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const users = db.prepare("SELECT id, phone, role, name, shop_name, location, contact FROM users WHERE role != 'admin'").all();
  res.json(users);
};

export const createStaff = (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });
  const { phone, password, role, name, contact } = req.body;
  if (role !== "admin" && role !== "labour") return res.status(400).json({ error: "Invalid role" });
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare(
      "INSERT INTO users (phone, password, role, name, contact) VALUES (?, ?, ?, ?, ?)"
    ).run(phone, hashedPassword, role, name, contact);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "Phone number already exists" });
  }
};
