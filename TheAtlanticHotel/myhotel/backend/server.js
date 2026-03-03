const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 引入我们的 Models
const Room = require('./models/room.js');
const Staff = require('./models/staff.js');
const User = require('./models/user.js');
const Booking = require('./models/booking.js');
const Log = require('./models/log.js');
const Setting = require('./models/setting.js');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ==========================================
// 🚀 CONNECT MONGODB
// ==========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Fuiyoh! 🚀 MongoDB Atlas 连接成功!');
  })
  .catch((error) => {
    console.log('Alamak, Database 连线失败 ❌:', error.message);
  });

// ==========================================
// 🔐 API ROUTES: LOGIN & IAM
// ==========================================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // A. Check 老板 (Hardcoded Admin)
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ role: 'admin', message: 'Welcome back, Boss! 👑' });
  }

  // B. Check 员工 (去 Database 找新版本的 User)
  try {
    // 🚨 重点在这里：去 User 抽屉找，找的条件是 userId 和 password 要对得上！
    const user = await User.findOne({ userId: username, password: password, role: 'staff' });
    
    if (user) {
      // 如果找到了，并且他的 status 是 Active，就放行！
      if(user.status === 'Active') {
        return res.status(200).json({ role: 'staff', name: user.name, message: `Welcome, ${user.name}!` });
      } else {
        return res.status(401).json({ message: 'Akaun anda telah digantung (Account Suspended) 🚫' });
      }
    }
    
    // C. 如果 Database 里完全没有这个人
    res.status(401).json({ message: 'Alamak, ID atau Password salah! ❌' });
  } catch (error) {
    res.status(500).json({ message: 'Error Server', error: error.message });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    const newStaff = new Staff(req.body);
    await newStaff.save();
    res.status(201).json({ message: 'Ngam! Akaun Staff berjaya dicipta! 🎉' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal create staff', error: error.message });
  }
});

// ==========================================
// 🏨 API ROUTES: ROOMS
// ==========================================
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil data bilik", error: error.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const newRoom = new Room(req.body); 
    const savedRoom = await newRoom.save();
    res.status(201).json({ message: "Ngam wei! Bilik berjaya ditambah! 🎉", data: savedRoom });
  } catch (error) {
    res.status(500).json({ message: "Alamak, error boss", error: error.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom) {
      return res.status(404).json({ message: "Alamak, bilik tak wujud!" });
    }
    res.status(200).json({ message: "Ngam wei! Bilik berjaya di-delete 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Error boss", error: error.message });
  }
});


// ==========================================
// 👑 ADMIN IAM API (拿员工名单 & 加员工)
// ==========================================
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({ role: 'staff' }); // 只拿员工，不拿老板
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetch staff" });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    
    // Admin 加人的时候，顺便写进 Log 日记里！
    await new Log({ action: "Created New Staff", performedBy: "Admin", targetId: newUser.userId }).save();
    
    res.status(201).json({ message: "Ngam! Staff baru berjaya ditambah! 🎉" });
  } catch (error) {
    res.status(500).json({ message: "Error create staff", error: error.message });
  }
});

// ==========================================
// 📅 CALENDAR & BOOKING API
// ==========================================
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetch bookings" });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json({ message: "Booking confirmed! 🎉" });
  } catch (error) {
    res.status(500).json({ message: "Error create booking", error: error.message });
  }
});


// ==========================================
// 🕵️‍♂️ API ROUTES: SYSTEM LOGS (老板的“天眼”)
// ==========================================
app.get('/api/logs', async (req, res) => {
  try {
    // .sort({ timestamp: -1 }) 的意思是：最新的记录排最上面
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetch logs" });
  }
});


// ==========================================
// 🎨 API ROUTES: SYSTEM SETTINGS (Logo)
// ==========================================

// 1. 拿 Logo (如果 DB 没有，就给 Default 的)
app.get('/api/settings/logo', async (req, res) => {
  try {
    const logoSetting = await Setting.findOne({ key: 'hotel_logo' });
    // 如果 DB 里面有，就用 DB 的；如果没有，就默认指向你 public 里面的 Logo
    const logoUrl = logoSetting ? logoSetting.value : '/images/Logo.png';
    res.status(200).json({ logoUrl });
  } catch (error) {
    res.status(500).json({ message: "Error fetch logo" });
  }
});

// 2. 老板专属：Update Logo 进 DB
app.post('/api/settings/logo', async (req, res) => {
  try {
    const { logoUrl } = req.body;
    // 去 DB 找 'hotel_logo'，找到就 update，找不到就 create (upsert: true)
    await Setting.findOneAndUpdate(
      { key: 'hotel_logo' },
      { value: logoUrl },
      { upsert: true, new: true }
    );
    res.status(200).json({ message: "Ngam! Logo berjaya di-update 进 DB 啦! 🎨" });
  } catch (error) {
    res.status(500).json({ message: "Error update logo" });
  }
});

// ==========================================
// 👑 ADMIN IAM API (Update & Delete Staff)
// ==========================================
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    await new Log({ action: "Deleted Staff", performedBy: "Admin", targetId: user.name }).save();
    res.status(200).json({ message: "Staff berjaya di-delete 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Error delete staff" });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await new Log({ action: "Updated Staff Info/Password", performedBy: "Admin", targetId: updatedUser.name }).save();
    res.status(200).json({ message: "Staff info updated! ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error update staff" });
  }
});


// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`✅ Backend server tengah run kat port: ${PORT}`);
});