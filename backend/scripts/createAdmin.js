import "dotenv/config";

import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import Admin from "../models/Admin.js";

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || "Administrator";

if (!email || !password) {
  console.error("Usage: node scripts/createAdmin.js email password [name]");

  process.exit(1);
}

try {
  await connectDB();

  const existingAdmin = await Admin.findOne({
    email: email.toLowerCase().trim(),
  });

  if (existingAdmin) {
    console.error("An admin with this email already exists.");

    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await Admin.create({
    name,
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: "superadmin",
    active: true,
  });

  console.log(`Admin created successfully: ${admin.email}`);

  process.exit(0);
} catch (error) {
  console.error("Failed to create admin:", error);

  process.exit(1);
}
