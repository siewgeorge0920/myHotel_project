import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const wipeDatabase = async () => {
  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to Atlas. Commencing Server V2 Teardown...');

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    // We explicitly exclude 'staffs' and 'settings' to prevent locking you out of the admin panel
    // and to preserve the global variables we just set up.
    const keepCollections = ['staffs', 'settings', 'cookieconsents'];

    let droppedCount = 0;

    for (let collection of collections) {
      if (!keepCollections.includes(collection.name)) {
        await db.dropCollection(collection.name);
        console.log(`🗑️  Dropped collection: ${collection.name}`);
        droppedCount++;
      } else {
        console.log(`🛡️  Preserved core collection: ${collection.name}`);
      }
    }

    console.log(`\n🎉 V2 Data Wipe Complete. ${droppedCount} legacy collections destroyed.`);
    console.log('Ready for V3 Schema Deployment.');

    process.exit(0);
  } catch (error) {
    console.error('❌ Wipe failed:', error);
    process.exit(1);
  }
};

wipeDatabase();
