import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "..", "..", "hair2harvest.db");

// Create DB connection
const db = await open({
  filename: dbPath,
  driver: sqlite3.Database,
});

// Initialize tables
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE,
    password TEXT,
    role TEXT,
    name TEXT,
    shop_name TEXT,
    location TEXT,
    contact TEXT,
    reset_token TEXT,
    reset_token_expiry DATETIME
  );

  CREATE TABLE IF NOT EXISTS pickups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salon_id INTEGER,
    vendor_id INTEGER,
    quantity REAL,
    pickup_date TEXT,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(salon_id) REFERENCES users(id),
    FOREIGN KEY(vendor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS assignment_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pickup_id INTEGER,
    labour_id INTEGER,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(pickup_id) REFERENCES pickups(id),
    FOREIGN KEY(labour_id) REFERENCES users(id)
  );
`);

// Seed admin
const adminExists = await db.get("SELECT * FROM users WHERE role = 'admin'");

if (!adminExists) {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await db.run(
    "INSERT INTO users (phone, password, role, name) VALUES (?, ?, ?, ?)",
    ["9999999999", hashedPassword, "admin", "System Admin"]
  );
}

export default db;