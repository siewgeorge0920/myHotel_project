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
    const baseUrl = process.env.CLIENT_URL || 'https://theatlantichorizion.com';

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

    try {
      return await this.instantActivate({
        amount,
        purchaserName,
        purchaserEmail,
        recipientName,
        recipientEmail,
        notes,
        stripeSessionId: sessionId
      });
    } catch (error) {
      if (error.code === 11000) {
        // Race condition: another concurrent request just completed the insert
        const existingCard = await GiftCard.findOne({ stripe_session_id: sessionId });
        if (existingCard) {
          return { success: true, code: existingCard.code, alreadyProcessed: true };
        }
      }
      throw error;
    }
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

    let newCode = generateCode();
    while (await GiftCard.findOne({ code: newCode })) {
      newCode = generateCode();
    }

    const sessionIdToUse = stripeSessionId || `INST-${Date.now()}-${Math.random()}`;

    // 2. Upsert Record (Idempotent Operation)
    const giftCard = await GiftCard.findOneAndUpdate(
      { stripe_session_id: sessionIdToUse },
      {
        $setOnInsert: {
          code: newCode,
          initial_amount: parseFloat(amount),
          balance: parseFloat(amount),
          purchaser_name: purchaserName || 'Direct Issue',
          purchaser_email: purchaserEmail || 'admin@manor.com',
          recipient_name: recipientName,
          recipient_email: recipientEmail,
          notes: notes || 'Manual/Instant issuance',
          status: 'Active'
        }
      },
      { upsert: true, new: true } // Return the updated (or newly created) document
    );

    // If the returned document's code matches the one we generated, it's newly inserted.
    const isNewInsert = giftCard.code === newCode;

    if (isNewInsert) {
      // 3. 📧 Dispatch Notifications ONLY for new inserts
      try {
        await emailService.sendGiftCardEmail(recipientEmail, {
          code: giftCard.code,
          amount: parseFloat(amount),
          recipientName,
          purchaserName: purchaserName || 'The Manor'
        });
      } catch (emailErr) {
         console.error("V3 Instant GC Email Failed:", emailErr.message);
      }

      // 4. Audit Logging ONLY for new inserts
      await Log.create({
        action: `GIFT_CARD_ISSUE`,
        details: `Sold/Issued Gift Card: ${giftCard.code} (€${amount})`,
        performed_by: purchaserName || 'Direct Issue',
        target_id: giftCard.code,
        user_type: 'Staff'
      });
    }

    return { 
      success: true, 
      code: giftCard.code, 
      alreadyProcessed: !isNewInsert 
    };
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

  /**
   * 📜 Get All Gift Cards (Admin View)
   */
  async getAll() {
    return await GiftCard.find().sort({ createdAt: -1 });
  }

  /**
   * 🕰️ Get Detailed History for a Code
   */
  async getHistory(code) {
    const card = await GiftCard.findOne({ code: code.toUpperCase() });
    if (!card) throw new Error("Voucher not found.");

    // 1. Fetch Audit Logs
    const logs = await Log.find({ target_id: card.code }).sort({ createdAt: -1 });

    // 2. Fetch Stripe Status (if applicable)
    let stripeStatus = 'N/A';
    if (card.stripe_session_id && !card.stripe_session_id.startsWith('INST-')) {
      try {
        const stripe = await getStripe();
        const session = await stripe.checkout.sessions.retrieve(card.stripe_session_id);
        stripeStatus = session.payment_status === 'paid' ? 'Succeeded' : session.payment_status;
      } catch (err) {
        stripeStatus = 'Stripe Error';
      }
    } else if (card.stripe_session_id?.startsWith('INST-')) {
      stripeStatus = 'Direct Issue';
    }

    return {
      card,
      logs,
      stripeStatus
    };
  }
}

export default new GiftCardService();
