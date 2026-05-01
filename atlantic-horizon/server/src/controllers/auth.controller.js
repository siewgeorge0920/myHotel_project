import Staff from '../models/staff.model.js';
import LoginLog from '../models/loginLog.model.js';
import bcrypt from 'bcryptjs';
import { sendSuccess } from '../utils/responseHandler.js';
import { recordLog } from '../utils/logger.js';
import catchAsync from '../utils/catchAsync.js';

class AuthController {
  /**
   * Authenticates a user and establishes a session.
   * Performs server-side input validation on the login form data.
   */
  login = catchAsync(async (req, res) => {
    const { username, password } = req.body;

    // Server-Side Input Validation: Ensure form data is present
    if (!username || username.trim() === '') {
      return res.status(400).json({ success: false, message: "Username is required." });
    }
    if (!password || password.trim() === '') {
      return res.status(400).json({ success: false, message: "Password is required." });
    }

    // Retrieve user and check credentials
    const user = await Staff.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials." });

    // Validate password using bcrypt
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials." });

    // Check account status
    if (user.status !== 'Active') return res.status(403).json({ success: false, message: "Account deactivated." });

    // Establish express-session
    req.session.user = {
      id: user._id,
      name: user.name,
      role: user.role,
      username: user.username
    };

    // Maintain backwards compatibility with the existing token system
    const token = `session-${user._id}-${Date.now()}`;
    
    // Set cookie for state maintenance
    res.cookie('sessionToken', token, { 
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: false, // Allow frontend to read for secondary checks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/' // Crucial: Ensure cookie is sent for all /api/* routes
    });

    // Record the Entrance Session (Login Log)
    try {
      const userAgent = req.headers['user-agent'] || 'Unknown';
      const ip = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
      
      await LoginLog.create({
        user_id: user._id,
        name: user.name,
        role: user.role,
        location: {
          ip: ip,
          device: userAgent.split(')')[0].split('(')[1] || 'Unknown', // Simplified OS/Device
          raw: userAgent
        },
        login_at: new Date(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });

      // Also record standard audit log
      await recordLog(user, 'STAFF_LOGIN', user.username, `Successful session established for ${user.name}`);
    } catch (logErr) {
      console.error("[Login Log Error] Failed to record entrance:", logErr.message);
    }

    sendSuccess(res, {
      id: user._id,
      name: user.name,
      role: user.role,
      token: token
    }, "Welcome back.");
  });

  /**
   * Verifies the active session using the middleware.
   */
  verify = catchAsync(async (req, res) => {
    // If the 'protect' middleware passed, the session is valid
    sendSuccess(res, {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    }, "Session active.");
  });

  /**
   * Seeds test accounts for grading and testing purposes.
   */
  seed = catchAsync(async (req, res) => {
    const { force } = req.query;
    const testAccounts = [
      { name: 'The Boss', username: 'boss', password: '123', role: 'admin' },
      { name: 'Hotel Manager', username: 'manager', password: '123', role: 'manager' },
      { name: 'Standard Staff', username: 'staff', password: '123', role: 'staff' }
    ];

    const existing = await Staff.findOne({ username: 'boss' });
    if (existing && force !== 'true') {
      return res.status(400).json({ success: false, message: "Accounts already seeded." });
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
      generated.push({ username: acc.username, role: acc.role });
    }

    sendSuccess(res, generated, "Hierarchy seeded successfully.", 201);
  });

  /**
   * Retrieves all staff directory data.
   */
  getAllStaff = catchAsync(async (req, res) => {
    const staff = await Staff.find().select('-password').sort({ name: 1 });
    sendSuccess(res, staff, "Staff directory retrieved.");
  });

  /**
   * Creates a new staff account with data validation.
   */
  createStaff = catchAsync(async (req, res) => {
    const { name, username, password, role, status } = req.body;

    // Server-Side Input Validation: Check required fields and formatting
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ success: false, message: "Name must be at least 2 characters long." });
    }
    if (!username || username.trim().length < 4) {
      return res.status(400).json({ success: false, message: "Username must be at least 4 characters long." });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
    }
    const validRoles = ['staff', 'manager', 'admin'];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified." });
    }

    // Check if username already exists to prevent duplicate key errors from database
    const existingStaff = await Staff.findOne({ username });
    if (existingStaff) {
      return res.status(400).json({ success: false, message: "Username is already taken." });
    }

    const hashedPassword = await bcrypt.hash(password || 'staff123', 10);
    const newStaff = new Staff({
      staff_id: `STAFF-${Math.floor(Math.random() * 900 + 100)}`,
      name,
      username,
      password: hashedPassword,
      role: role || 'staff',
      status: status || 'Active'
    });
    
    // Save to database
    await newStaff.save();
    await recordLog(req.user, 'STAFF_CREATE', newStaff.username, `New staff account: ${newStaff.name}`);
    sendSuccess(res, newStaff, "Staff account established.", 201);
  });

  /**
   * Updates existing staff data with validation.
   */
  updateStaff = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Server-Side Validation: Ensure safe updates
    if (updateData.username && updateData.username.trim().length < 4) {
      return res.status(400).json({ success: false, message: "Username must be at least 4 characters long." });
    }
    if (updateData.password) {
      if (updateData.password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters long." });
      }
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    
    const staff = await Staff.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff record not found." });
    }
    
    await recordLog(req.user, 'STAFF_UPDATE', staff.username, `Updated identity for ${staff.name}`);
    sendSuccess(res, staff, "Identity reconfigured.");
  });

  /**
   * Deletes a staff account from the database.
   */
  deleteStaff = catchAsync(async (req, res) => {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ success: false, message: "Staff record not found." });
    }
    
    const uName = staff.username;
    await Staff.findByIdAndDelete(req.params.id);
    await recordLog(req.user, 'STAFF_DELETE', uName, `Purged staff account.`);
    sendSuccess(res, null, "Identity purged.");
  });
}

export default new AuthController();
