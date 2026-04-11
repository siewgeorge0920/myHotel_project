import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_HOST || 'smtp.zoho.com',
  port: parseInt(process.env.ZOHO_PORT) || 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.ZOHO_USER, 
    pass: process.env.ZOHO_PASS, 
  },
});

export const sendGiftCardEmail = async (recipientEmail, giftCardDetails) => {
  const { code, amount, recipientName, purchaserName } = giftCardDetails;

  const mailOptions = {
    from: `"The Atlantic Horizon Manor" <${process.env.ZOHO_USER}>`,
    to: recipientEmail,
    subject: 'A Luxury Gift for You - Atlantic Horizon Manor',
    html: `
      <div style="font-family: 'Cinzel', serif; max-width: 600px; margin: auto; border: 1px solid #d4af37; padding: 40px; background-color: #0d0f0b; color: white;">
        <h1 style="color: #d4af37; text-align: center; letter-spacing: 4px;">THE ATLANTIC HORIZON</h1>
        <h2 style="text-align: center; font-weight: 300; border-bottom: 1px solid #333; padding-bottom: 20px;">GIFT VOUCHER</h2>
        
        <p>Dear ${recipientName || 'Valued Guest'},</p>
        
        <p>${purchaserName || 'Someone special'} has sent you a luxury experience at The Atlantic Horizon Manor.</p>
        
        <div style="background-color: #1a1d17; border: 1px dashed #d4af37; padding: 30px; text-align: center; margin: 30px 0;">
          <p style="margin: 0; font-size: 14px; text-transform: uppercase; color: #888;">Your Unique Code</p>
          <h1 style="margin: 10px 0; color: #d4af37; font-size: 32px; letter-spacing: 5px;">${code}</h1>
          <p style="margin: 0; font-size: 20px;">Value: €${amount.toFixed(2)}</p>
        </div>
        
        <p style="font-size: 14px; color: #aaa; font-style: italic;">
          This code can be used for online bookings at our website or presented at the front desk upon check-in.
        </p>
        
        <div style="margin-top: 40px; border-top: 1px solid #333; padding-top: 20px; font-size: 12px; color: #666; text-align: center;">
          <p>THE ATLANTIC HORIZON MANOR</p>
          <p>Coastal Sanctuary & Heritage Site</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
