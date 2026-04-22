import Staff from './Staff.model.js';
import bcrypt from 'bcrypt';
import { sendSuccess } from '../../shared/utils/responseHandler.js';
import { recordLog } from '../../shared/utils/logger.js';
import catchAsync from '../../shared/utils/catchAsync.js';

class AuthController {
  login = catchAsync(async (req, res) => {
    const { username, password } = req.body;
    const user = await Staff.findOne({ username });
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials." });

    if (user.status !== 'Active') return res.status(403).json({ success: false, message: "Account deactivated." });

    const token = `session-${user._id}-${Date.now()}`;
    
    res.cookie('sessionToken', token, { 
      maxAge: 24 * 60 * 60 * 1000, 
      httpOnly: false, // 🟢 Allow frontend to read for secondary checks
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/' // 🟢 Crucial: Ensure cookie is sent for all /api/* routes
    });

    // 🛡️ Record Audit Log for entrance
    await recordLog(user, 'STAFF_LOGIN', user.username, `Successful session established for ${user.name} (${user.role})`);

    sendSuccess(res, {
      id: user._id,
      name: user.name,
      role: user.role,
      token: token
    }, "Welcome back.");
  });

  verify = catchAsync(async (req, res) => {
    // 🛡️ If the 'protect' middleware passed, the session is valid
    sendSuccess(res, {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role
    }, "Session active.");
  });

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

  getAllStaff = catchAsync(async (req, res) => {
    const staff = await Staff.find().select('-password').sort({ name: 1 });
    sendSuccess(res, staff, "Staff directory retrieved.");
  });

  createStaff = catchAsync(async (req, res) => {
    const { name, username, password, role, status } = req.body;
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
    await recordLog(req.user, 'STAFF_CREATE', newStaff.username, `New staff account: ${newStaff.name}`);
    sendSuccess(res, newStaff, "Staff account established.", 201);
  });

  updateStaff = catchAsync(async (req, res) => {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    const staff = await Staff.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    await recordLog(req.user, 'STAFF_UPDATE', staff.username, `Updated identity for ${staff.name}`);
    sendSuccess(res, staff, "Identity reconfigured.");
  });

  deleteStaff = catchAsync(async (req, res) => {
    const staff = await Staff.findById(req.params.id);
    const uName = staff?.username;
    await Staff.findByIdAndDelete(req.params.id);
    await recordLog(req.user, 'STAFF_DELETE', uName, `Purged staff account.`);
    sendSuccess(res, null, "Identity purged.");
  });
}

export default new AuthController();
