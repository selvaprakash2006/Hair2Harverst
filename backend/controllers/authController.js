import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "hair2harvest-secret-key-123";

const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasNonalphas = /\W/.test(password);
  if (password.length < minLength) return "Password must be at least 8 characters long";
  if (!hasUpperCase) return "Password must contain at least one uppercase letter";
  if (!hasLowerCase) return "Password must contain at least one lowercase letter";
  if (!hasNumbers) return "Password must contain at least one number";
  if (!hasNonalphas) return "Password must contain at least one special character";
  return null;
};

export const register = (req, res) => {
  const { phone, password, role, name, location, contact, shop_name } = req.body;
  const passwordError = validatePassword(password);
  if (passwordError) return res.status(400).json({ error: passwordError });
  
  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      "INSERT INTO users (phone, password, role, name, location, contact, shop_name) VALUES (?, ?, ?, ?, ?, ?, ?)"
    ).run(phone, hashedPassword, role, name, location, contact, shop_name);
    
    const token = jwt.sign({ id: result.lastInsertRowid, phone, role }, JWT_SECRET);
    res.json({ token, user: { id: result.lastInsertRowid, phone, role, name, shop_name } });
  } catch (err) {
    res.status(400).json({ error: "Phone number already registered" });
  }
};

export const login = (req, res) => {
  const { phone, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, JWT_SECRET);
  res.json({ token, user: { id: user.id, phone: user.phone, role: user.role, name: user.name, shop_name: user.shop_name } });
};

export const forgotPassword = (req, res) => {
  const { phone } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE phone = ?").get(phone);
  if (!user) return res.status(404).json({ error: "Phone number not found" });
  
  const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiry = new Date(Date.now() + 3600000).toISOString(); // 1 hour
  
  db.prepare("UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?").run(resetToken, expiry, user.id);
  
  // In a real app, send SMS here. For now, just return the token for the demo.
  res.json({ message: "Reset token generated", resetToken });
};

export const resetPassword = (req, res) => {
  const { resetToken, newPassword } = req.body;
  const passwordError = validatePassword(newPassword);
  if (passwordError) return res.status(400).json({ error: passwordError });

  const user = db.prepare("SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?").get(resetToken, new Date().toISOString());
  if (!user) return res.status(400).json({ error: "Invalid or expired reset token" });

  try {
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare("UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?").run(hashedPassword, user.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
