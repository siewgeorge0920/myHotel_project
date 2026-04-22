import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Staff from '../server/modules/auth/Staff.model.js';
import Log from '../server/shared/models/Log.model.js';

dotenv.config({ path: '../server/.env' });

async function diagnose() {
  try {
    console.log("🔍 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log("✅ Connected.");

    const staffCount = await Staff.countDocuments();
    const logCount = await Log.countDocuments();

    console.log(`\n📊 STATS:`);
    console.log(`- Staff Records: ${staffCount}`);
    console.log(`- Log Records: ${logCount}`);

    if (staffCount === 0) {
      console.log("\n⚠️ WARNING: Your staff collection is EMPTY.");
    }
    
    if (logCount === 0) {
      console.log("⚠️ WARNING: Your logs collection is EMPTY.");
    }

    const allStaff = await Staff.find({}, { name: 1, role: 1, username: 1 });
    console.log("\n👤 STAFF LIST:");
    console.table(allStaff.map(s => ({ Name: s.name, Role: s.role, Username: s.username })));

    process.exit(0);
  } catch (err) {
    console.error("❌ Diagnostic failed:", err.message);
    process.exit(1);
  }
}

diagnose();
