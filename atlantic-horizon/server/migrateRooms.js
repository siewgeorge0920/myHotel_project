import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const roomSchema = new mongoose.Schema({
  name: String,
  department: String,
  unitNumbers: [String]
});

const physSchema = new mongoose.Schema({
  department: String,
  roomType: String,
  roomName: String,
  cleaningStatus: { type: String, default: 'Clean' }
});

async function migrate() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/atlantic-horizon');
  const Room = mongoose.model('Room', roomSchema);
  const PhysicalRoom = mongoose.model('PhysicalRoom', physSchema);

  const rooms = await Room.find({});
  console.log(`Found ${rooms.length} room types.`);
  let count = 0;
  
  for(const r of rooms) {
    if(r.unitNumbers && r.unitNumbers.length > 0) {
      for(const unit of r.unitNumbers) {
        const exist = await PhysicalRoom.findOne({ roomName: unit });
        if(!exist) {
          await PhysicalRoom.create({
            department: r.department || 'Unassigned',
            roomType: r.name,
            roomName: unit
          });
          count++;
        }
      }
    }
  }
  console.log(`Migrated ${count} physical units successfully!`);
  process.exit(0);
}
migrate();
