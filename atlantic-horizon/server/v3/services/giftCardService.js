import GiftCard from '../models/GiftCard.js';
import Log from '../models/Log.js';
import { getStripe } from '../config/stripe.js';
import configHelper from '../utils/configHelper.js';
import emailService from './emailService.js';

class GiftCardService {
  /**
   * 🎫 Initialize Stripe session for Gift Card purchase
   */
  async createSession(data) {
    const { amount, purchaserEmail, recipientName } = data;
    const stripe = await getStripe();
    const baseUrl = await configHelper.getSetting('base_url', 'http://localhost:5173');

    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: purchaserEmail,
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `Atlantic Horizon - €${amount} Gift Voucher`,
            description: `Luxury gift for ${recipientName}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: { 
        type: 'gift_card', 
        amount: amount.toString(),
        ...data 
      },
      success_url: `${baseUrl}/gift-card-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/gift-cards?status=cancel`,
    });
  }

  /**
   * 🛡️ Verify Stripe Purchase & Activate Code
   */
  async verifyAndActivate(sessionId) {
    // 1. Idempotency Check
    const existing = await GiftCard.findOne({ stripeSessionId: sessionId });
    if (existing) return { success: true, code: existing.code, alreadyProcessed: true };

    // 2. Retrieve Stripe Session
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new Error("Payment verification failed: Session not paid.");
    }

    const { amount, purchaserName, purchaserEmail, recipientName, recipientEmail, notes } = session.metadata;

    // 3. Generate Unique Code (ATH-XXXX-XXXX)
    const generateCode = () => {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let res = 'ATH-';
      for (let i = 0; i < 8; i++) {
        if (i === 4) res += '-';
        res += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return res;
    };

    let code = generateCode();
    while (await GiftCard.findOne({ code })) {
      code = generateCode();
    }

    // 4. Create Record
    const giftCard = new GiftCard({
      code,
      initialAmount: parseFloat(amount),
      balance: parseFloat(amount),
      purchaserName,
      purchaserEmail,
      recipientName,
      recipientEmail,
      notes: notes || '',
      stripeSessionId: sessionId,
      status: 'Active'
    });

    await giftCard.save();

    // 5. 📧 Dispatch Notifications (Zoho)
    try {
      await emailService.sendGiftCardEmail(recipientEmail, {
        code,
        amount: parseFloat(amount),
        recipientName,
        purchaserName
      });
      
      // Also notify purchaser
      await emailService.sendGiftCardEmail(purchaserEmail, {
        code,
        amount: parseFloat(amount),
        recipientName,
        purchaserName,
        isPurchaser: true
      });
    } catch (emailErr) {
      console.error("V3 Email Notification Failed:", emailErr.message);
      // Non-blocking error for the API response
    }

    // 6. Audit Logging
    await Log.create({
      action: `Sold Gift Card: ${code} (€${amount})`,
      performedBy: 'System',
      targetId: code
    });

    return { success: true, code };
  }

  /**
   * 🔍 Validate Gift Card for usage
   */
  async validate(code) {
     const card = await GiftCard.findOne({ code: code.toUpperCase(), status: 'Active' });
     if (!card) throw new Error("Invalid or inactive code.");
     if (card.balance <= 0) throw new Error("Card balance is €0.");
     return card;
  }
}

export default new GiftCardService();
