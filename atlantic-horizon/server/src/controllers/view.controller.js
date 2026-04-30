import mongoose from 'mongoose';
import catchAsync from '../utils/catchAsync.js';

class ViewController {
  getBookingSuccess = catchAsync(async (req, res) => {
    const { bookingId } = req.query;
    res.render('booking-success', { 
      bookingId: bookingId || 'ATH-PENDING',
      title: 'Reservation Confirmed | Atlantic Horizon'
    });
  });

  getGiftCardSuccess = catchAsync(async (req, res) => {
    const { sessionId } = req.query;
    res.render('gift-card-success', { 
      title: 'Gift Voucher Issued | Atlantic Horizon'
    });
  });

  getSystemStatus = catchAsync(async (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.render('system-status', { 
      dbStatus,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: Math.floor(process.uptime()),
      title: 'System Status | Atlantic Horizon'
    });
  });
}

export default new ViewController();
