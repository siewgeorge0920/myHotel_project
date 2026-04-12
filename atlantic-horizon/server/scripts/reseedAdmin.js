import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Setup Environment
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

import Staff from '../v3/models/Staff.js';

/**
 * 🚀 Reseed Admin Utility
 * Pulls credentials from .env and ensures a hashed, V3-compliant admin exists.
 */
const reseed = async () => {
  const uri = process.env.MONGO_URI;
  const username = process.env.ADMIN_USERNAME || 'admin';
  const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';

  if (!uri) {
    console.error("❌ Error: MONGO_URI missing in .env");
    process.exit(1);
  }

  try {
    console.log("🔗 Connecting to V3 Database...");
    await mongoose.connect(uri);

    console.log(`🕵️ Checking for existing user: "${username}"...`);
    const existing = await Staff.findOne({ username });

    if (existing) {
      console.log("⚠️ User already exists. Purging old credentials for V3 re-sync...");
      await Staff.deleteOne({ username });
    }

    console.log("🔐 Hashing new V3 credentials...");
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const admin = new Staff({
      staff_id: `STAFF-${Math.floor(Math.random() * 900 + 100)}`,
      name: 'The Atlantic Boss',
      username: username,
      password: hashedPassword,
      role: 'admin',
      status: 'Active'
    });

    await admin.save();
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ V3 ADMIN RESTORED SUCCESSFULLY");
    console.log(`👤 Username: ${username}`);
    console.log(`🔑 Password: (From .env)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🚀 You can now login at /login");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Restoration Failed:", error.message);
    process.exit(1);
  }
};

reseed();
