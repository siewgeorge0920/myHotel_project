import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// 🌟 引入 Models
import Room from './models/room.js';
import Staff from './models/staff.js';
import Booking from './models/booking.js';
import Log from './models/log.js';
import Setting from './models/setting.js';
import Client from './models/client.js';
import Stripe from 'stripe';
import RoomService from './models/roomService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🚀 MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Fuiyoh! 🚀 MongoDB Atlas 连接成功!'))
  .catch((error) => console.log('Alamak, Database 连线失败 ❌:', error.message));

// ==========================================
// AUTH
// ==========================================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    return res.status(200).json({ role: 'admin', name: 'Boss', message: 'Welcome back, Boss! 👑' });
  }
  try {
    const user = await Staff.findOne({ name: username, password: password });
    if (user) {
      if (user.status === 'Active') return res.status(200).json({ role: user.role || 'staff', name: user.name, message: `Welcome, ${user.name}!` });
      return res.status(401).json({ message: 'Account Suspended 🚫' });
    }
    res.status(401).json({ message: 'Ouh, Wrong Name or Password ! ❌' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});
const PORT = process.env.PORT || 5000;

// ==========================================
// ROOMS — CRUD
// ==========================================
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms", error: error.message });
  }
});

app.post('/api/rooms', async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json({ message: 'Room created ✅', room });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create room', error: error.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json({ message: 'Room updated ✅', room });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update room', error: error.message });
  }
});

app.delete('/api/rooms/:id', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete room', error: error.message });
  }
});

// ==========================================
// STAFF — CRUD
// ==========================================
app.get('/api/staff', async (req, res) => {
  try {
    const staff = await Staff.find();
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load staff', error: error.message });
  }
});

app.post('/api/staff', async (req, res) => {
  try {
    const staff = new Staff({ ...req.body, status: req.body.status || 'Active' });
    await staff.save();
    await Log.create({ action: 'STAFF_CREATED', performedBy: req.body.createdBy || 'Admin', targetId: staff._id.toString() });
    res.status(201).json({ message: 'Staff registered ✅', staff });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register staff', error: error.message });
  }
});

app.put('/api/staff/:id', async (req, res) => {
  try {
    const update = { ...req.body };
    if (!update.password) delete update.password;
    const staff = await Staff.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });
    await Log.create({ action: 'STAFF_UPDATED', performedBy: req.body.updatedBy || 'Admin', targetId: req.params.id });
    res.status(200).json({ message: 'Staff updated ✅', staff });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update staff', error: error.message });
  }
});

app.delete('/api/staff/:id', async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    await Log.create({ action: 'STAFF_DELETED', performedBy: 'Admin', targetId: req.params.id });
    res.status(200).json({ message: 'Staff removed ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete staff', error: error.message });
  }
});

// ==========================================
// BOOKINGS — Read + Manage
// ==========================================
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('clientId', 'firstName lastName email phone address')
      .sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
  }
});

app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { status, paymentStatus, managedBy } = req.body;
    const update = {};
    if (status) update.bookingStatus = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Track in system logs
    if (status || paymentStatus) {
      await Log.create({
        action: `Updated booking ${booking.bookingId} status to ${status || 'unchanged'}, payment to ${paymentStatus || 'unchanged'}`,
        performedBy: managedBy || 'System',
        targetId: booking.bookingId
      });
    }

    res.status(200).json({ message: 'Booking updated ✅', booking });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update booking', error: error.message });
  }
});

app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    await Booking.findByIdAndDelete(req.params.id);

    await Log.create({
      action: `Deleted booking ${booking.bookingId}`,
      performedBy: 'System',
      targetId: booking.bookingId
    });

    res.status(200).json({ message: 'Booking removed ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete booking', error: error.message });
  }
});

// ==========================================
// ROOM SERVICES & CLEANING
// ==========================================
app.get('/api/room-services', async (req, res) => {
  try {
    const services = await RoomService.find().sort({ updatedAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/room-services', async (req, res) => {
  try {
    const newService = new RoomService(req.body);
    await newService.save();
    
    await Log.create({
      action: `Created room service tracking for ${req.body.roomName} / ${req.body.roomNumber}`,
      performedBy: 'System',
      targetId: req.body.roomNumber
    });

    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/room-services/:id', async (req, res) => {
  try {
    const service = await RoomService.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    await Log.create({
      action: `Updated room service/cleaning status for ${service.roomNumber}`,
      performedBy: req.body.managedBy || 'System',
      targetId: service.roomNumber
    });

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SELF CHECK-IN
// ==========================================
app.post('/api/bookings/self-check-in', async (req, res) => {
  try {
    const { bookingId, email } = req.body;
    
    // Find booking and populate the client email data
    const booking = await Booking.findOne({ bookingId: bookingId.toUpperCase() })
                                 .populate('clientId', 'email firstName lastName');
                                 
    if (!booking) {
      return res.status(404).json({ message: 'Reservation not found. Please verify your Booking ID.' });
    }

    if (!booking.clientId) {
      return res.status(404).json({ message: 'Client record missing.' });
    }

    // Verify email matches the client data
    if (booking.clientId.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ message: 'Email address does not match our records for this reservation.' });
    }

    // Check status appropriateness
    if (booking.bookingStatus === 'Cancelled' || booking.bookingStatus === 'CheckedOut') {
      return res.status(400).json({ message: `This reservation is currently marked as ${booking.bookingStatus}.` });
    }
    if (booking.bookingStatus === 'CheckedIn') {
      return res.status(400).json({ message: 'You have already checked in.' });
    }
    
    // We expect them to only check in on or after the actual check-in date 
    booking.bookingStatus = 'CheckedIn';
    await booking.save();

    await Log.create({
      action: `Self Check-In completed via Guest Portal`,
      performedBy: `Guest (${email})`,
      targetId: booking.bookingId
    });

    res.status(200).json({ message: `You are checked in, ${booking.clientId.firstName}. Proceed to your suite.` });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error during check-in.', error: error.message });
  }
});

// ==========================================
// TRANSACTIONS — Payment records overview
// ==========================================
app.get('/api/transactions', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('clientId', 'firstName lastName email phone')
      .sort({ createdAt: -1 })
      .lean();
      
    const transactions = bookings.map(b => ({
      bookingId: b.bookingId,
      clientId: b.clientId,
      clientName: b.clientId ? `${b.clientId.firstName} ${b.clientId.lastName}` : 'Guest',
      clientEmail: b.clientId ? b.clientId.email : '',
      clientPhone: b.clientId ? b.clientId.phone : '',
      roomName: b.roomName,
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate,
      amount: b.price || 0,
      paymentStatus: b.paymentStatus,
      bookingStatus: b.bookingStatus,
      managedBy: b.managedBy,
      date: b.createdAt
    }));
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch transactions', error: error.message });
  }
});

// ==========================================
// SYSTEM LOGS
// ==========================================
app.get('/api/logs', async (req, res) => {
  try {
    const logs = await Log.find().sort({ timestamp: -1 });
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: "Error fetch logs" });
  }
});

// ==========================================
// STRIPE — Payment Intent (custom page, no redirect)
// ==========================================
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, guestEmail, roomName } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency: 'eur',
      receipt_email: guestEmail,
      metadata: { roomName },
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Keep checkout session for backward compat
app.post('/api/create-checkout-session', async (req, res) => {
  const { roomName, amount, guestEmail, nights } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: guestEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `The Atlantic Horizon Manor - ${roomName}`,
            description: `Accommodation for ${nights} nights`,
          },
          unit_amount: amount * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/calendar?status=success`,
      cancel_url: `http://localhost:5173/calendar?status=cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== Resend / Generate payment link for an existing booking =====
app.post('/api/resend-payment-link', async (req, res) => {
  const { bookingId, roomName, amount, guestEmail, nights } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      ...(guestEmail ? { customer_email: guestEmail } : {}),
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `The Atlantic Horizon Manor — ${roomName}`,
            description: `Booking: ${bookingId} | ${nights || 1} night(s)`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `http://localhost:5173/calendar?status=success`,
      cancel_url: `http://localhost:5173/calendar?status=cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// AVAILABILITY CHECK
// ==========================================
app.post('/api/check-availability', async (req, res) => {
  const { checkIn, checkOut } = req.body;
  if (!checkIn || !checkOut) return res.status(400).json({ error: "Dates required" });
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const bookings = await Booking.find({
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }]
    }).select('roomName -_id').lean();
    
    const bookingCounts = {};
    bookings.forEach(b => {
      bookingCounts[b.roomName] = (bookingCounts[b.roomName] || 0) + 1;
    });

    const allRooms = await Room.find().select('name capacity').lean();
    const soldOutRooms = allRooms
      .filter(room => (bookingCounts[room.name] || 0) >= (room.capacity || 1))
      .map(room => room.name);

    res.status(200).json({ bookedRooms: soldOutRooms });
  } catch (error) {
    res.status(500).json({ error: "Check failed" });
  }
});

// ==========================================
// CREATE BOOKING
// ==========================================
app.post('/api/bookings/create', async (req, res) => {
  const { checkIn, checkOut, roomName, guestEmail, guestFirstName, guestLastName, price, paymentStatus } = req.body;
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const overlappingBookings = await Booking.find({
      roomName,
      $or: [
        { startDate: { $lt: end }, endDate: { $gt: start } },
        { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ error: 'Alamak, Bilik ini telah ditempah! 房间刚刚被别人定走啦' });
    }

    const availableStaffs = await Staff.find({ status: 'Active', role: { $in: ['staff', 'admin'] } });
    if (availableStaffs.length === 0) {
      return res.status(503).json({ error: 'We are currently short of staff to manage new bookings. Please try again later.' });
    }
    const assignedStaff = availableStaffs[Math.floor(Math.random() * availableStaffs.length)];

    let client = await Client.findOne({ email: guestEmail });
    if (!client) {
      client = new Client({
        clientId: 'CUST-' + Math.floor(Math.random() * 90000 + 10000),
        name: `${guestFirstName} ${guestLastName}`.trim(),
        email: guestEmail
      });
      await client.save();
    }

    const booking = new Booking({
      bookingId: 'BKG-' + Math.floor(Math.random() * 900000 + 100000),
      clientId: client._id,
      roomName,
      checkInDate: start,
      checkOutDate: end,
      price: price || 0,
      paymentStatus: paymentStatus || 'Pending',
      bookingStatus: 'Confirmed',
      managedBy: assignedStaff.name
    });

    await booking.save();

    res.status(201).json({ 
      message: 'Booking Successful! 🎉', 
      bookingId: booking.bookingId, 
      managedBy: assignedStaff.name 
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Failed to create booking", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend server tengah run kat port: ${PORT}`);
});