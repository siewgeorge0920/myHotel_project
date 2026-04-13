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

    // 🛡️ Ensure all metadata values are strings! Stripe requirement.
    const metadataStringified = {};
    Object.keys(data).forEach(key => {
      metadataStringified[key] = (data[key] !== undefined && data[key] !== null) ? data[key].toString() : '';
    });

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
          unit_amount: Math.round(parseFloat(amount) * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      metadata: { 
        type: 'gift_card', 
        ...metadataStringified
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
    const existing = await GiftCard.findOne({ stripe_session_id: sessionId });
    if (existing) return { success: true, code: existing.code, alreadyProcessed: true };

    // 2. Retrieve Stripe Session
    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new Error("Payment verification failed: Session not paid.");
    }

    // 🛡️ Case-insensitive check for metadata fields if needed, but we rely on our createSession keys
    const m = session.metadata;
    const amount = m.amount || m.total_amount;
    const purchaserName = m.purchaser_name || m.purchaserName;
    const purchaserEmail = m.purchaser_email || m.purchaserEmail;
    const recipientName = m.recipient_name || m.recipientName;
    const recipientEmail = m.recipient_email || m.recipientEmail;
    const notes = m.notes || '';

    if (!amount) throw new Error("Crucial data missing: 'amount' not found in Stripe session metadata.");

    return await this.instantActivate({
      amount,
      purchaserName,
      purchaserEmail,
      recipientName,
      recipientEmail,
      notes,
      stripeSessionId: sessionId
    });
  }

  /**
   * ⚡ Instant Activation (Bypass Stripe)
   */
  async instantActivate(data) {
    const { amount, purchaserName, purchaserEmail, recipientName, recipientEmail, notes, stripeSessionId } = data;

    // 1. Generate Unique Code (ATH-XXXX-XXXX)
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

    // 2. Create Record
    const giftCard = new GiftCard({
      code,
      initial_amount: parseFloat(amount),
      balance: parseFloat(amount),
      purchaser_name: purchaserName || 'Direct Issue',
      purchaser_email: purchaserEmail || 'admin@manor.com',
      recipient_name: recipientName,
      recipient_email: recipientEmail,
      notes: notes || 'Manual/Instant issuance',
      stripe_session_id: stripeSessionId || `INST-${Date.now()}`,
      status: 'Active'
    });

    await giftCard.save();

    // 3. 📧 Dispatch Notifications
    try {
      await emailService.sendGiftCardEmail(recipientEmail, {
        code,
        amount: parseFloat(amount),
        recipientName,
        purchaserName: purchaserName || 'The Manor'
      });
    } catch (emailErr) {
       console.error("V3 Instant GC Email Failed:", emailErr.message);
    }

    // 4. Audit Logging
    await Log.create({
      action: `Sold/Issued Gift Card: ${code} (€${amount})`,
      performedBy: purchaserName || 'System',
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
