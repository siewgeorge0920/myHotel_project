import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import configHelper from '../utils/configHelper.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class EmailService {
  async getTransporter() {
    const user = await configHelper.getSetting('email_user');
    const pass = await configHelper.getSetting('email_pass');
    const host = await configHelper.getSetting('email_host', 'smtp.zoho.com');
    const port = parseInt(await configHelper.getSetting('email_port', '465'));

    if (!user || !pass) {
      console.warn("⚠️ SMTP Credentials missing. Email system initialization deferred.");
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  _getTemplate(name) {
    try {
      const filePath = path.join(__dirname, '../views', `${name}.html`);
      return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.error(`[EmailService] Template ${name} not found, using fallback.`);
      return '';
    }
  }

  _wrapInManorTheme(content, title = 'Official Communication') {
    const layout = this._getTemplate('email-layout');
    if (!layout) return content;
    
    return layout
      .replace('{{title}}', title)
      .replace('{{body}}', content);
  }

  _parseTemplate(html, data) {
    if (!html) return '';
    let parsed = html.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const value = data[key.trim()];
      return value !== undefined ? value : match;
    });
    if (!parsed.includes('<p>') && !parsed.includes('<div>')) {
      parsed = parsed.replace(/\n/g, '<br/>');
    }
    return parsed;
  }

  async _send(to, subject, html) {
    try {
      const transporter = await this.getTransporter();
      const fromUser = await configHelper.getSetting('email_user');
      const mailOptions = {
        from: `"The Atlantic Horizon Manor" <${fromUser}>`,
        to,
        subject,
        html
      };
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Email Transmission Failure to ${to}:`, error.message);
      throw error;
    }
  }

  async sendBookingEmail(recipientEmail, booking) {
    const dbTemplate = await configHelper.getSetting('email_template_booking');
    const defaultTemplate = this._getTemplate('email-booking');
    const checkInStr = new Date(booking.check_in).toLocaleDateString();
    const checkOutStr = new Date(booking.check_out).toLocaleDateString();
    const bodyContent = this._parseTemplate(dbTemplate || defaultTemplate, {
      guest_name: booking.guest_name,
      booking_id: booking.booking_id,
      room_type: booking.room_type,
      check_in: checkInStr,
      check_out: checkOutStr,
      stay_range: `${checkInStr} to ${checkOutStr}`
    });
    const html = this._wrapInManorTheme(bodyContent, 'Reservation Confirmed');
    return this._send(recipientEmail, `Reservation Confirmed: ${booking.booking_id}`, html);
  }

  async sendGiftCardEmail(recipientEmail, details) {
    const dbTemplate = await configHelper.getSetting('email_template_giftcard');
    const { code, amount, recipientName, purchaserName } = details;
    const defaultTemplate = this._getTemplate('email-giftcard');
    const bodyContent = this._parseTemplate(dbTemplate || defaultTemplate, {
      recipient_name: recipientName || 'Valued Guest',
      purchaser_name: purchaserName || 'Someone special',
      code: code,
      amount: amount.toFixed(2)
    });
    const html = this._wrapInManorTheme(bodyContent, 'Gift Voucher Issued');
    return this._send(recipientEmail, 'A Luxury Gift for You - Atlantic Horizon Manor', html);
  }

  async sendCheckInEmail(recipientEmail, booking) {
    const dbTemplate = await configHelper.getSetting('email_template_checkin');
    const defaultTemplate = this._getTemplate('email-checkin');
    const checkOutDate = new Date(booking.check_out);
    const checkoutDay = checkOutDate.toLocaleDateString('en-US', { weekday: 'long' });
    const bodyContent = this._parseTemplate(dbTemplate || defaultTemplate, {
      guest_name: booking.guest_name,
      room_number: booking.assigned_room || 'Pending Assignment',
      room_type: booking.room_type,
      department_name: 'Reception Desk',
      checkout_day: checkoutDay,
      checkout_time: '11:00 AM'
    });
    const html = this._wrapInManorTheme(bodyContent, 'Welcome to the Manor');
    return this._send(recipientEmail, `Welcome to The Manor, ${booking.guest_name}!`, html);
  }
}

export default new EmailService();
