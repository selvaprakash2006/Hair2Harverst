import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "..", "..", "hair2harvest.db"));

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT UNIQUE,
    password TEXT,
    role TEXT, -- 'salon', 'admin', 'labour'
    name TEXT, -- This will be used as owner_name for salons
    shop_name TEXT,
    location TEXT, -- This will be used as shop_location for salons
    contact TEXT,
    reset_token TEXT,
    reset_token_expiry DATETIME
  );

  CREATE TABLE IF NOT EXISTS pickups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    salon_id INTEGER,
    vendor_id INTEGER, -- This will be the admin or labour who collected it
    quantity REAL,
    pickup_date TEXT,
    status TEXT, -- 'pending', 'accepted', 'collected'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(salon_id) REFERENCES users(id),
    FOREIGN KEY(vendor_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS assignment_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pickup_id INTEGER,
    labour_id INTEGER,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(pickup_id) REFERENCES pickups(id),
    FOREIGN KEY(labour_id) REFERENCES users(id)
  );
`);

// Seed Admin if not exists
const adminExists = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
if (!adminExists) {
  const hashedPassword = bcrypt.hashSync("Admin@123", 10);
  db.prepare("INSERT INTO users (phone, password, role, name) VALUES (?, ?, ?, ?)").run(
    "9999999999",
    hashedPassword,
    "admin",
    "System Admin"
  );
}

export default db;
