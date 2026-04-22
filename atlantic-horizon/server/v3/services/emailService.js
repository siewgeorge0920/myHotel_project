import nodemailer from 'nodemailer';
import configHelper from '../utils/configHelper.js';

class EmailService {
  /**
   *  Initialize Transporter
   */
  async getTransporter() {
    const user = await configHelper.getSetting('email_user');
    const pass = await configHelper.getSetting('email_pass');
    const host = await configHelper.getSetting('email_host', 'smtp.zoho.com');
    const port = parseInt(await configHelper.getSetting('email_port', '465'));

    if (!user || !pass) {
      console.warn(" SMTP Credentials missing. Email system initialization deferred.");
    }

    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });
  }

  /**
   *  Premium Manor HTML Wrapper
   * Wraps raw content in a branded, high-end sanctuary frame.
   */
  _wrapInManorTheme(content, title = 'Official Communication') {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600&display=swap');
            body { margin: 0; padding: 0; background-color: #0d0f0b; font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
            .container { max-width: 600px; margin: 40px auto; background-color: #0d0f0b; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px; overflow: hidden; }
            .header { background: linear-gradient(to bottom, #1a1d17, #0d0f0b); padding: 50px 20px; text-align: center; border-bottom: 1px solid rgba(212, 175, 55, 0.1); }
            .logo { height: 70px; width: auto; opacity: 0.9; margin-bottom: 20px; }
            .title { font-family: 'Cinzel', serif; color: #d4af37; text-transform: uppercase; letter-spacing: 5px; font-size: 14px; margin: 0; }
            .content { padding: 50px 40px; color: rgba(255, 255, 255, 0.85); line-height: 1.8; font-size: 15px; }
            .content b, .content strong { color: #d4af37; font-weight: 600; }
            .footer { padding: 30px; text-align: center; background-color: #080a07; font-size: 11px; color: rgba(255, 255, 255, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.05); }
            .footer p { margin: 5px 0; text-transform: uppercase; letter-spacing: 2px; }
            .divider { height: 1px; width: 60px; background: #d4af37; margin: 30px auto; opacity: 0.3; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://theatlantichorizon.ie/images/Logo.png" alt="Manor Crest" class="logo">
              <p class="title">${title}</p>
            </div>
            <div class="content">
              ${content}
              <div class="divider"></div>
              <p style="font-style: italic; font-size: 14px; color: rgba(212, 175, 55, 0.6);">Warmest Regards,<br/><b>The Atlantic Horizon Management</b></p>
            </div>
            <div class="footer">
              <p>The Atlantic Horizon Manor</p>
              <p>Ireland's Southwest Coast • Established for Perfection</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   *  Template Parser
   * Replaces {{key}} and converts newlines to <br/>
   */
  _parseTemplate(html, data) {
    if (!html) return '';
    
    // 1. Placeholder injection
    let parsed = html.replace(/\{\{(.*?)\}\}/g, (match, key) => {
      const value = data[key.trim()];
      return value !== undefined ? value : match;
    });

    // 2. Format newlines to HTML breaks if no HTML block tags are already present
    if (!parsed.includes('<p>') && !parsed.includes('<div>')) {
      parsed = parsed.replace(/\n/g, '<br/>');
    }

    return parsed;
  }

  /**
   *  Generic Send Helper
   */
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
      console.error(` Email Transmission Failure to ${to}:`, error.message);
      throw error;
    }
  }

  /**
   *  Send Booking Confirmation
   */
  async sendBookingEmail(recipientEmail, booking) {
    console.log(`[Diagnostic] sendBookingEmail for ${booking.booking_id}`);

    const dbTemplate = await configHelper.getSetting('email_template_booking');
    const defaultTemplate = `
Dear {{guest_name}},

Your stay at The Atlantic Horizon Manor is confirmed. We look forward to welcoming you to our sanctuary.

Booking Details:
ID: {{booking_id}}
Room: {{room_type}}
Dates: {{stay_range}}

See you soon.
    `;

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

  /**
   *  Send Gift Card Confirmation
   */
  async sendGiftCardEmail(recipientEmail, details) {
    const dbTemplate = await configHelper.getSetting('email_template_giftcard');
    const { code, amount, recipientName, purchaserName } = details;

    const defaultTemplate = `
Dear {{recipient_name}},

{{purchaser_name}} has sent you a luxury experience at The Atlantic Horizon Manor.

Your Unique Code:
{{code}}

Value:
€{{amount}}

This code can be used for online bookings or at check-in.
    `.trim();

    const bodyContent = this._parseTemplate(dbTemplate || defaultTemplate, {
      recipient_name: recipientName || 'Valued Guest',
      purchaser_name: purchaserName || 'Someone special',
      code: code,
      amount: amount.toFixed(2)
    });

    const html = this._wrapInManorTheme(bodyContent, 'Gift Voucher Issued');
    return this._send(recipientEmail, 'A Luxury Gift for You - Atlantic Horizon Manor', html);
  }

  /**
   *  Send Check-in Welcome
   */
  async sendCheckInEmail(recipientEmail, booking) {
    const dbTemplate = await configHelper.getSetting('email_template_checkin');
    const defaultTemplate = `
Dear {{guest_name}},

Welcome to the Manor. Your stay has officially begun. 

Your assigned sanctuary: {{room_number}}

Enjoy your luxury experience.
    `.trim();

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
