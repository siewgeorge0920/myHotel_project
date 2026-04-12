import Staff from '../models/Staff.js';
import bcrypt from 'bcrypt';
import { sendSuccess } from '../utils/responseHandler.js';

class AuthController {
  /**
   * 🔐 Secure Login Logic
   */
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await Staff.findOne({ username });
      if (!user) return res.status(401).json({ error: "Invalid credentials." });

      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Invalid credentials." });

      if (user.status !== 'Active') return res.status(403).json({ error: "Account deactivated." });

      // Build a 24-hour session identifier
      const token = `v3-session-${user._id}-${Date.now()}`;
      
      // Set a 24-hour cookie for the session
      res.cookie('sessionToken', token, { 
        maxAge: 24 * 60 * 60 * 1000, 
        httpOnly: false, // Frontend reads it for basic checks
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      sendSuccess(res, {
        id: user._id,
        name: user.name,
        role: user.role,
        token: token
      }, "Identity verified. Welcome back.");
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🛠️ Seed Admin, Manager, and Staff (Initial Setup Helper)
   * Supports ?force=true to reset credentials
   */
  async seed(req, res) {
    const { force } = req.query;

    const testAccounts = [
      { name: 'The Boss', username: 'boss', password: '123', role: 'admin' },
      { name: 'Hotel Manager', username: 'manager', password: '123', role: 'manager' },
      { name: 'Standard Staff', username: 'staff', password: '123', role: 'staff' }
    ];

    try {
      const existing = await Staff.findOne({ username: 'boss' });
      
      if (existing && force !== 'true') {
        return res.status(400).json({ error: "Accounts already seeded. Use ?force=true to reset." });
      }

      if (force === 'true') {
        await Staff.deleteMany({ username: { $in: ['boss', 'manager', 'staff'] } });
      }

      const generated = [];
      for (const acc of testAccounts) {
        const hashedPassword = await bcrypt.hash(acc.password, 10);
        const newStaff = new Staff({
          staff_id: `STAFF-${Math.floor(Math.random() * 900 + 100)}`,
          name: acc.name,
          username: acc.username,
          password: hashedPassword,
          role: acc.role
        });
        await newStaff.save();
        generated.push({ username: acc.username, role: acc.role, password: '(123)' });
      }

      res.status(201).json({ 
        message: "Manor hierarchy seeded successfully.", 
        accounts: generated
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 📋 List all staff (Admin/Manager only)
   */
  async getAllStaff(req, res) {
    try {
      const staff = await Staff.find().select('-password').sort({ name: 1 });
      res.status(200).json(staff);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * ➕ Create New Staff Account
   */
  async createStaff(req, res) {
    const { name, username, password, role, status } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password || 'staff123', 10);
      const newStaff = new Staff({
        staff_id: `STAFF-${Math.floor(Math.random() * 900 + 100)}`,
        name,
        username,
        password: hashedPassword,
        role: role || 'staff',
        status: status || 'Active'
      });
      await newStaff.save();
      res.status(201).json(newStaff);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * ✏️ Update Staff Details
   */
  async updateStaff(req, res) {
    const { id } = req.params;
    const updateData = { ...req.body };
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      } else {
        delete updateData.password;
      }
      const staff = await Staff.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      res.status(200).json(staff);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🗑️ Delete Staff Account
   */
  async deleteStaff(req, res) {
    try {
      await Staff.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Identity purged from sanctuary core." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new AuthController();
