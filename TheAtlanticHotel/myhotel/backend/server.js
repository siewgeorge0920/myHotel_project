const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 引入我们的 Models
const Room = require('./models/room.js');
const Staff = require('./models/staff.js');
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
    return res.status(200).json({ role: 'admin', name: 'Boss', message: 'Welcome back, Boss! 👑' });
  }

  // B. Check 员工 (去 Database 找)
  try {
    // 🚨 重点在这里：以前你是找 userId: username，现在换成 name: username
    // B. Check 员工 (去 Staff 抽屉找)
      const user = await Staff.findOne({ name: username, password: password });
    
    if (user) {
      if(user.status === 'Active') {
        return res.status(200).json({ role: 'staff', name: user.name, message: `Welcome, ${user.name}!` });
      } else {
        return res.status(401).json({ message: 'Account Suspended 🚫' });
      }
    }
    
    // C. 如果 Database 里完全没有这个人
    res.status(401).json({ message: 'Ouh, Wrong Name or Password ! ❌' });
  } catch (error) {
    res.status(500).json({ message: 'Error Server', error: error.message });
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
// 👑 ADMIN IAM API (Staff Management)
// ==========================================

// 1. 获取所有员工 (Read)
app.get('/api/staff', async (req, res) => {
  try {
    const staffList = await Staff.find();
    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Error fetch staff" });
  }
});

// 2. 创建新员工 (Create) - 解决你的 Error！
app.post('/api/staff', async (req, res) => {
  try {
    const newStaff = await Staff.create(req.body);
    await new Log({ action: "Created New Staff", performedBy: "Admin", targetId: newStaff.name }).save();
    res.status(200).json({ message: "Staff created successfully! 🎉" });
  } catch (error) {
    // 🚨 11000 是 MongoDB 撞名 (Duplicate Key) 的 Error Code
    if (error.code === 11000) {
      return res.status(400).json({ message: "Alamak, Name already exists! Please use another name." });
    }
    res.status(500).json({ message: "Error create staff: " + error.message });
  }
});

// 3. 更新员工资料 (Update)
app.put('/api/staff/:id', async (req, res) => {
  try {
    // 如果老板没有填新的 Password，就不要动原本的 Password
    if (!req.body.password) {
      delete req.body.password; 
    }
    const updatedStaff = await Staff.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await new Log({ action: "Updated Staff Info", performedBy: "Admin", targetId: updatedStaff.name }).save();
    res.status(200).json({ message: "Staff info updated! ✅" });
  } catch (error) {
    res.status(500).json({ message: "Error update staff" });
  }
});

// 4. 删除员工 (Delete)
app.delete('/api/staff/:id', async (req, res) => {
  try {
    // ✨ 这里一定要换成 Staff！
    const user = await Staff.findByIdAndDelete(req.params.id); 
    
    if (!user) return res.status(404).json({ message: "Staff tidak dijumpai!" });

    await new Log({ action: "Deleted Staff", performedBy: "Admin", targetId: user.name }).save();
    res.status(200).json({ message: "Staff berjaya di-delete 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Error delete staff", error: error.message });
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
// 🎁 1. Gift Card 的蓝图 & API
// ==========================================
const giftCardSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  status: { type: String, default: 'Paid' },
  createdAt: { type: Date, default: Date.now }
});
const GiftCard = mongoose.model('GiftCard', giftCardSchema);

app.post('/api/giftcards', async (req, res) => {
  try {
    const newCard = await GiftCard.create(req.body);
    await new Log({ action: "Purchased Gift Card", performedBy: "Guest", targetId: newCard._id }).save();
    res.status(200).json({ message: "Gift Card purchased successfully! 🎉" });
  } catch (error) {
    res.status(500).json({ message: "Error saving gift card" });
  }
});

// ==========================================
// ✉️ 2. Newsletter (订阅邮件) 的蓝图 & API
// ==========================================
const newsletterSchema = new mongoose.Schema({ email: String });
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

app.post('/api/newsletter', async (req, res) => {
  try {
    await Newsletter.create({ email: req.body.email });
    res.status(200).json({ message: "Thanks for subscribing! 💌" });
  } catch (error) {
    res.status(500).json({ message: "Error subscribing" });
  }
});





// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`✅ Backend server tengah run kat port: ${PORT}`);
});