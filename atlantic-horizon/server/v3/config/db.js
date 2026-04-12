import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`🚀 V3 Database Integrated: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ V3 Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
