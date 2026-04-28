import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = path.join(__dirname, "..", "..", "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);

// Initialize DB
await db.read();

db.data ||= {
  users: [],
  pickups: [],
  assignment_requests: []
};

// Seed admin
const adminExists = db.data.users.find(u => u.role === "admin");

if (!adminExists) {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  db.data.users.push({
    id: Date.now(),
    phone: "9999999999",
    password: hashedPassword,
    role: "admin",
    name: "System Admin"
  });

  await db.write();
}

export default db;