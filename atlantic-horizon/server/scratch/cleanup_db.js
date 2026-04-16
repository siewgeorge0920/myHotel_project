import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from one level up (server/.env)
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI not found in .env file");
  process.exit(1);
}

const cleanup = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected.");

    const db = mongoose.connection.db;
    const collectionsToDrop = ['orders', 'menus', 'keycards'];

    for (const colName of collectionsToDrop) {
      const collections = await db.listCollections({ name: colName }).toArray();
      if (collections.length > 0) {
        console.log(`Dropping collection: ${colName}...`);
        await db.dropCollection(colName);
        console.log(`Dropped ${colName}.`);
      } else {
        console.log(`Collection ${colName} does not exist. Skipping.`);
      }
    }

    console.log("Cleanup complete.");
    process.exit(0);
  } catch (error) {
    console.error("Cleanup failed:", error);
    process.exit(1);
  }
};

cleanup();
