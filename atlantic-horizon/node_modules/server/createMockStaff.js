import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Staff from './models/staff.js';

dotenv.config();

console.log("Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB.");
    
    const count = await Staff.countDocuments({ role: 'staff', status: 'Active' });
    console.log(`Currently there are ${count} active staff.`);

    if (count === 0) {
      console.log("Creating a mock staff...");
      const newStaff = new Staff({
        name: 'Mock Staff ' + Date.now(),
        password: 'password123',
        role: 'staff',
        status: 'Active'
      });
      await newStaff.save();
      console.log(`Mock staff created: ${newStaff.name}`);
    } else {
      console.log("Active staff already exists.");
    }

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });
