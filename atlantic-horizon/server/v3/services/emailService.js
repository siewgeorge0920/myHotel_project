import nodemailer from 'nodemailer';
import configHelper from '../utils/configHelper.js';

class EmailService {
  /**
   * 🏗️ Initialize Transporter
   */
  async getTransporter() {
    const user = await configHelper.getSetting('email_user');
    const pass = await configHelper.getSetting('email_pass');
    const host = await configHelper.getSetting('email_host', 'smtp.zoho.com');
    const port = parseInt(await configHelper.getSetting('email_port', '465'));

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  /**
   * 🧠 Template Parser
   * Replaces {{key}} with data[key]
   */
  _parseTemplate(html, data) {
    if (!html) return '';
    return html.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const value = data[key.trim()];
      return value !== undefined ? value : match;
    });
  }

  /**
   * 📬 Generic Send Helper
   */
  async _send(to, subject, html) {
    const transporter = await this.getTransporter();
    const fromUser = await configHelper.getSetting('email_user');
    
    const mailOptions = {
      from: `"The Atlantic Horizon Manor" <${fromUser}>`,
      to,
      subject,
      html
    };

    return transporter.sendMail(mailOptions);
  }

  /**
   * 🏨 Send Booking Confirmation
   */
  async sendBookingEmail(recipientEmail, booking) {
    const dbTemplate = await configHelper.getSetting('email_template_booking');
    
    // Default Fallback Template if DB is empty
    const defaultTemplate = `
      <div style="font-family: serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #d4af37; padding: 40px;">
        <h1 style="color: #d4af37; text-align: center;">RESERVATION CONFIRMED</h1>
        <p>Dear {{guest_name}},</p>
        <p>Your stay at The Atlantic Horizon Manor is confirmed. We look forward to welcoming you.</p>
        <div style="background: #fdfcf8; padding: 20px; border-left: 4px solid #d4af37;">
          <p><strong>Booking ID:</strong> {{booking_id}}</p>
          <p><strong>Room:</strong> {{room_type}}</p>
          <p><strong>Check-in:</strong> {{check_in}}</p>
        </div>
        <p>Warmest Regards,<br/>The Atlantic Horizon Team</p>
      </div>
    `;

    const html = this._parseTemplate(dbTemplate || defaultTemplate, {
      guest_name: booking.guest_name,
      booking_id: booking.booking_id,
      room_type: booking.room_type,
      check_in: new Date(booking.check_in).toLocaleDateString(),
      check_out: new Date(booking.check_out).toLocaleDateString()
    });

    return this._send(recipientEmail, `Reservation Confirmed: ${booking.booking_id}`, html);
  }

  /**
   * 🎫 Send Gift Card Confirmation
   */
  async sendGiftCardEmail(recipientEmail, details) {
    const dbTemplate = await configHelper.getSetting('email_template_giftcard');
    const { code, amount, recipientName, purchaserName } = details;

    const defaultTemplate = `
        <div style="font-family: serif; max-width: 600px; margin: auto; border: 1px solid #d4af37; padding: 40px; background-color: #0d0f0b; color: white;">
          <h1 style="color: #d4af37; text-align: center; letter-spacing: 4px;">THE ATLANTIC HORIZON</h1>
          <h2 style="text-align: center; font-weight: 300; border-bottom: 1px solid #333; padding-bottom: 20px;">GIFT VOUCHER</h2>
          <p>Dear {{recipient_name}},</p>
          <p>{{purchaser_name}} has sent you a luxury experience at The Atlantic Horizon Manor.</p>
          <div style="background-color: #1a1d17; border: 1px dashed #d4af37; padding: 30px; text-align: center; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; text-transform: uppercase; color: #888;">Your Unique Code</p>
            <h1 style="margin: 10px 0; color: #d4af37; font-size: 32px; letter-spacing: 5px;">{{code}}</h1>
            <p style="margin: 0; font-size: 20px;">Value: €{{amount}}</p>
          </div>
          <p style="font-size: 14px; color: #aaa; font-style: italic;">This code can be used for online bookings or at check-in.</p>
        </div>
    `;

    const html = this._parseTemplate(dbTemplate || defaultTemplate, {
      recipient_name: recipientName || 'Valued Guest',
      purchaser_name: purchaserName || 'Someone special',
      code: code,
      amount: amount.toFixed(2)
    });

    return this._send(recipientEmail, 'A Luxury Gift for You - Atlantic Horizon Manor', html);
  }

  /**
   * 🛎️ Send Check-in Welcome
   */
  async sendCheckInEmail(recipientEmail, booking) {
    const dbTemplate = await configHelper.getSetting('email_template_checkin');

    const defaultTemplate = `
      <div style="font-family: serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #d4af37; padding: 40px;">
        <h1 style="color: #d4af37; text-align: center;">WELCOME TO THE MANOR</h1>
        <p>Dear {{guest_name}},</p>
        <p>Your stay has officially begun. We are delighted to have you.</p>
        <p>Your assigned sanctuary: <strong>{{room_number}}</strong></p>
        <p>Enjoy your luxury experience.</p>
      </div>
    `;

    const html = this._parseTemplate(dbTemplate || defaultTemplate, {
      guest_name: booking.guest_name,
      room_number: booking.assigned_room || 'Pending Assignment'
    });

    return this._send(recipientEmail, `Welcome to The Manor, ${booking.guest_name}!`, html);
  }
}

export default new EmailService();
