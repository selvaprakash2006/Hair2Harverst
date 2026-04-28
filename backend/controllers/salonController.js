import db from "../config/db.js";

export const createPickup = (req, res) => {
  if (req.user.role !== "salon") return res.status(403).json({ error: "Forbidden" });
  const { quantity, pickupDate } = req.body;
  const result = db.prepare(
    "INSERT INTO pickups (salon_id, quantity, pickup_date, status) VALUES (?, ?, ?, ?)"
  ).run(req.user.id, quantity, pickupDate, "pending");
  res.json({ id: result.lastInsertRowid });
};

export const getMyPickups = (req, res) => {
  const pickups = db.prepare(`
    SELECT p.*, u.name as vendor_name 
    FROM pickups p 
    LEFT JOIN users u ON p.vendor_id = u.id 
    WHERE p.salon_id = ?
    ORDER BY p.created_at DESC
  `).all(req.user.id);
  res.json(pickups);
};

export const updateLocation = (req, res) => {
  if (req.user.role !== "salon") return res.status(403).json({ error: "Forbidden" });
  const { location } = req.body;
  
  try {
    db.prepare("UPDATE users SET location = ? WHERE id = ?").run(location, req.user.id);
    res.json({ success: true, message: "Location updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update location" });
  }
};
