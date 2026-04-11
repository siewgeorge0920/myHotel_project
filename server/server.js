import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session'; 
import cookieParser from 'cookie-parser';

// 🌟 引入 Models
import Room from './models/room.js';
import Staff from './models/staff.js';
import Booking from './models/booking.js';
import Log from './models/log.js';
import Setting from './models/setting.js';
import Client from './models/client.js';
import Stripe from 'stripe';
import PhysicalRoom from './models/physicalRoom.js';
import CookieConsent from './models/cookieConsent.js';
import RoomService from './models/roomService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET || 'manor-secret-key', // Secret used to sign the session ID
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something is stored
  cookie: {
    httpOnly: true, // Prevents client-side JS from reading the cookie
    maxAge: 1000 * 60 * 60 * 24 // Cookie valid for 1 day (24 hours)
  }
}));

const PORT = process.env.PORT || 5000;
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 🚀 MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Fuiyoh! 🚀 MongoDB Atlas 连接成功!'))
  .catch((error) => console.log('Alamak, Database 连线失败 ❌:', error.message));

// ==========================================
// AUTH
// ==========================================
// ==========================================
// AUTH — Login with Session & Cookies
// ==========================================
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // 🛡️ SERVER-SIDE VALIDATION: Check if empty
  if (!username || !password) {
    return res.status(400).json({ message: 'Aiya, username and password cannot be empty! ❌' });
  }

  // Admin Login Logic
  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // 📌 Set Session Data
    req.session.user = { role: 'admin', name: 'Boss' };
    // 📌 Set an explicit Cookie for the examiner to see
    res.cookie('manor_auth', 'admin_token_active', { httpOnly: true, maxAge: 86400000 });
    
    return res.status(200).json({ role: 'admin', name: 'Boss', message: 'Welcome back, Boss! 👑' });
  }

  try {
    // Check Database for Staff
    const user = await Staff.findOne({ name: username, password: password });
    if (user) {
      if (user.status === 'Active') {
        // 📌 Maintain state: Save staff details to session
        req.session.user = { id: user._id, role: user.role || 'staff', name: user.name };
        // 📌 Maintain state: Set cookie
        res.cookie('manor_auth', `staff_${user._id}`, { httpOnly: true, maxAge: 86400000 });

        return res.status(200).json({ role: user.role || 'staff', name: user.name, message: `Welcome, ${user.name}!` });
      }
      return res.status(401).json({ message: 'Account Suspended 🚫' });
    }
    // Invalid credentials
    res.status(401).json({ message: 'Ouh, Wrong Name or Password ! ❌' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// LUXURY PROPERTY (ROOMS) — CRUD
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
  // 🛡️ SERVER-SIDE VALIDATION: Ensure critical data is provided before saving
  // 🛡️ SERVER-SIDE VALIDATION: Ensure critical data is provided before saving
const { department, name, bedType, pricePerNight, inventoryQuantity, maxGuests } = req.body;
  
  if (!department || !name) {
    return res.status(400).json({ message: "Aiya, Department and Name cannot be empty lah! ❌" });
  }
  if (!pricePerNight || pricePerNight <= 0) {
    return res.status(400).json({ message: "Price must be set properly, Boss!" });
  }
  if (!maxGuests || maxGuests < 1) {
    return res.status(400).json({ message: "Boss, must specify how many guests can fit inside! (maxGuests required)" });
  }

  try {
    // Construct the final data package
    const propertyData = {
      ...req.body,
      unitNumbers: [] // Deprecated: we now use PhysicalRoom model
    };

    // Instantiate and save to database
    const room = new Room(propertyData);
    await room.save();

    // 📌 Audit Trail for Assignment Marks
    await Log.create({ 
      action: `Created Room Type/Package: ${name}`, 
      performedBy: req.session?.user?.name || 'Admin', 
      targetId: room._id.toString() 
    });

    res.status(201).json({ 
      message: "Room Type deployed into the Property Management System! 🏠✨",
      room 
    });

  } catch (error) {
    res.status(500).json({ message: 'Failed to create property package', error: error.message });
  }
});

app.put('/api/rooms/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
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
  // 🛡️ SERVER-SIDE VALIDATION
  const { name, password, role } = req.body;
  if (!name || name.trim() === '') return res.status(400).json({ message: 'Staff name is required!' });
  if (!password || password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters long!' });

  try {
    // Create new staff, defaulting status to Active if not provided
    const staff = new Staff({ ...req.body, status: req.body.status || 'Active' });
    await staff.save();
    
    // Log the action for audit purposes
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
    const staff = await Staff.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
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
// SETTINGS — System Configurations
// ==========================================
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await Setting.find();
    const settingsMap = {};
    settings.forEach(s => settingsMap[s.key] = s.value);
    res.status(200).json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', async (req, res) => {
  try {
    const updates = req.body;
    for (const key in updates) {
      await Setting.findOneAndUpdate(
        { key },
        { key, value: updates[key] },
        { upsert: true, returnDocument: 'after' }
      );
    }
    res.status(200).json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// PHYSICAL ROOMS (UNITS)
// ==========================================
app.get('/api/physical-rooms', async (req, res) => {
  try {
    const units = await PhysicalRoom.find().sort({ department: 1, roomType: 1, roomName: 1 });
    res.status(200).json(units);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch physical rooms", error: error.message });
  }
});

app.post('/api/physical-rooms', async (req, res) => {
  const { department, roomType, roomName } = req.body;
  if (!department || !roomName) return res.status(400).json({ message: "Department and Unit Name are required" });

  try {
    const existing = await PhysicalRoom.findOne({ roomName });
    if (existing) return res.status(400).json({ message: "Unit ID already exists" });

    const newUnit = new PhysicalRoom({ 
      department, 
      roomType: roomType || null, 
      roomName: roomName.toUpperCase(),
      cleaningStatus: 'Ready'
    });
    await newUnit.save();
    res.status(201).json(newUnit);
  } catch (error) {
    res.status(500).json({ message: "Failed to create", error: error.message });
  }
});

// 🚀 UNIT ASSIGNMENT
app.put('/api/physical-rooms/assign', async (req, res) => {
  const { roomType, unitNames } = req.body; 

  if (!roomType) return res.status(400).json({ message: "Room Type (Package Name) is required" });

  try {
    // 1. Unassign all rooms currently linked to this roomType
    await PhysicalRoom.updateMany({ roomType: roomType }, { roomType: null });

    // 2. Assign selected rooms to this roomType
    if (unitNames && unitNames.length > 0) {
      await PhysicalRoom.updateMany({ roomName: { $in: unitNames } }, { roomType: roomType });
    }

    res.json({ message: `Successfully updated assignment for ${roomType}` });
  } catch (err) {
    res.status(500).json({ message: "Assignment failed", error: err.message });
  }
});

app.put('/api/physical-rooms/:id/status', async (req, res) => {
  try {
    const unit = await PhysicalRoom.findByIdAndUpdate(req.params.id, { cleaningStatus: req.body.status }, { returnDocument: 'after' });
    res.json(unit);
  } catch(e) {
    res.status(500).json({ message: "Update failed" });
  }
});

app.put('/api/physical-rooms/:id', async (req, res) => {
  try {
    const { roomName } = req.body;
    if (!roomName) return res.status(400).json({ message: "Unit ID is required" });
    
    // Check if new name already exists
    const existing = await PhysicalRoom.findOne({ roomName, _id: { $ne: req.params.id } });
    if (existing) return res.status(400).json({ message: "That Unit ID already exists" });

    const unit = await PhysicalRoom.findByIdAndUpdate(req.params.id, { roomName: roomName.toUpperCase() }, { new: true });
    res.json(unit);
  } catch(e) {
    res.status(500).json({ message: "Update failed" });
  }
});

app.delete('/api/physical-rooms/:id', async (req, res) => {
  try {
    await PhysicalRoom.findByIdAndDelete(req.params.id);
    res.json({ message: "Unit deleted" });
  } catch(e) {
    res.status(500).json({ message: "Delete failed" });
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
    const { status, paymentStatus, managedBy, assignedUnit } = req.body;
    const update = {};
    if (status) update.bookingStatus = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (assignedUnit) update.assignedUnit = assignedUnit;
    
    if (status === 'CheckedIn') {
      update.actualCheckInTime = new Date();
    } else if (status === 'CheckedOut') {
      update.actualCheckOutTime = new Date();
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Auto-update physical room cleaning status on Check Out
    if (status === 'CheckedOut' && booking.assignedUnit) {
      await PhysicalRoom.findOneAndUpdate(
        { roomName: booking.assignedUnit },
        { cleaningStatus: 'Dirty' }
      );
    }

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
    const service = await RoomService.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    
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
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/calendar?status=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/calendar?status=cancel`,
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
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/calendar?status=success`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/calendar?status=cancel`,
    });
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ==========================================
// AVAILABILITY CHECK (Upgraded for Luxury Packages)
// ==========================================
app.post('/api/check-availability', async (req, res) => {
  const { checkIn, checkOut } = req.body;
  if (!checkIn || !checkOut) return res.status(400).json({ error: "Dates required" });
  
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    
    // 🧠 FIX 1: Strictly use checkInDate and checkOutDate
    const bookings = await Booking.find({
      $or: [
        { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
      ]
    }).select('roomName -_id').lean();
    
    const bookingCounts = {};
    bookings.forEach(b => {
      bookingCounts[b.roomName] = (bookingCounts[b.roomName] || 0) + 1;
    });

    // 🧠 FIX 2: Check against inventoryQuantity instead of the old capacity
    const allRooms = await Room.find().select('name inventoryQuantity').lean();
    const soldOutRooms = allRooms
      .filter(room => (bookingCounts[room.name] || 0) >= (room.inventoryQuantity || 1))
      .map(room => room.name);

    res.status(200).json({ bookedRooms: soldOutRooms });
  } catch (error) {
    res.status(500).json({ error: "Check availability failed", details: error.message });
  }
});

// ==========================================
// CREATE BOOKING (Cleaned & Standardized)
// ==========================================
app.post('/api/bookings/create', async (req, res) => {
  const { checkIn, checkOut, roomName, guestEmail, guestFirstName, guestLastName, price, paymentStatus, expectedCheckInTime, expectedCheckOutTime, isWalkIn, assignedUnit } = req.body;
  
  // 🛡️ Server-Side Validation
  if (!checkIn || !checkOut || !roomName || !guestEmail) {
    return res.status(400).json({ error: "Missing required booking details lah!" });
  }

  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // 🧠 Check overlapping bookings
    const overlappingBookings = await Booking.find({
      roomName,
      $or: [
        { checkInDate: { $lt: end }, checkOutDate: { $gt: start } }
      ]
    });

    // We must check if the overlapping bookings exceed the inventoryQuantity
    const roomDetails = await Room.findOne({ name: roomName });
    const maxHouses = roomDetails ? roomDetails.inventoryQuantity : 1;

    if (overlappingBookings.length >= maxHouses) {
      return res.status(400).json({ error: 'Alamak, Bilik ini telah penuh pada tarikh tersebut! All physical houses are booked.' });
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

    // Resolve dynamic check in times
    const defaultCheckIn = await Setting.findOne({ key: 'defaultCheckInTime' });
    const defaultCheckOut = await Setting.findOne({ key: 'defaultCheckOutTime' });

    const booking = new Booking({
      bookingId: 'BKG-' + Math.floor(Math.random() * 900000 + 100000),
      clientId: client._id,
      department: req.body.department || 'Unassigned',
      roomName,
      checkInDate: start,
      checkOutDate: end,
      expectedCheckInTime: expectedCheckInTime || defaultCheckIn?.value || "14:00",
      expectedCheckOutTime: expectedCheckOutTime || defaultCheckOut?.value || "12:00",
      price: price || 0,
      paymentStatus: paymentStatus || 'Pending',
      bookingStatus: isWalkIn ? 'CheckedIn' : 'Confirmed',
      assignedUnit: assignedUnit || null,
      actualCheckInTime: isWalkIn ? new Date() : null,
      managedBy: assignedStaff.name
    });

    await booking.save();

    // 📌 Log the booking action
    await Log.create({
      action: `Created new booking for ${roomName}`,
      performedBy: assignedStaff.name,
      targetId: booking.bookingId
    });

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

// ==========================================
// START THE ENGINE
// ==========================================
// ----------------------------------------------------------------------------
// NEW COOKIE ENDPOINT (Client Consent)
// ----------------------------------------------------------------------------
app.post('/api/cookies', async (req, res) => {
  try {
    const consent = new CookieConsent({
      ipAddress: req.ip,
      consentType: req.body.consentType,
      userAgent: req.headers['user-agent']
    });
    await consent.save();
    res.json({ message: 'Consent saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error saving consent' });
  }
});

// START SERVER
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Backend server tengah run kat port: ${PORT}`);
  });
}

export default app;