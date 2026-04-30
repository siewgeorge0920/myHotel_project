import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(` V3 Database Integrated: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.error(` V3 Connection Error: ${error.message}`);
    // In production/Vercel, we want to know if MONGO_URI is actually set
    if (!process.env.MONGO_URI) {
      console.error(" CRITICAL: MONGO_URI is not defined in environment variables!");
    }
  }
};

export default connectDB;
