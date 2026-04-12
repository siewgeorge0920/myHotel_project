import Staff from '../models/Staff.js';
import bcrypt from 'bcrypt';

class AuthController {
  /**
   * 🔐 Secure Login Logic
   */
  async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await Staff.findOne({ username });
      if (!user) return res.status(401).json({ error: "Invalid credentials." });

      // Compare hashed passwords (V3 Standard)
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: "Invalid credentials." });

      if (user.status !== 'Active') return res.status(403).json({ error: "Account deactivated." });

      res.status(200).json({
        id: user._id,
        name: user.name,
        role: user.role,
        token: 'v3-temp-token' // In production, generate a real JWT here
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 🛠️ Seed Admin (Initial Setup Helper)
   * Supports ?force=true to reset credentials from .env
   */
  async seed(req, res) {
    const { force } = req.query;
    const username = process.env.ADMIN_USERNAME || 'admin';
    const plainPassword = process.env.ADMIN_PASSWORD || 'admin123';

    try {
      const existing = await Staff.findOne({ username });
      
      if (existing && force !== 'true') {
        return res.status(400).json({ error: "Admin already seeded. Use ?force=true to reset." });
      }

      if (existing && force === 'true') {
        await Staff.deleteOne({ username });
      }

      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      const admin = new Staff({
        staff_id: `STAFF-${Math.floor(Math.random() * 900 + 100)}`,
        name: 'The Boss',
        username: username,
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      res.status(201).json({ 
        message: "Admin seeded successfully.", 
        credentials: { username, password: '(From .env)' } 
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
