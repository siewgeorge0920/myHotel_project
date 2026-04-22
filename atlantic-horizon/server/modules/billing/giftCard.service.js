import crypto from 'crypto';
import GiftCard from './GiftCard.model.js';
import UserLog from '../../shared/models/UserLog.model.js';
import { getStripe } from '../../config/stripe.js';
import configHelper from '../../shared/utils/configHelper.js';
import emailService from '../../shared/services/emailService.js';

class GiftCardService {
  async createSession(data) {
    const { amount, purchaserEmail, recipientName } = data;
    const stripe = await getStripe();
    const baseUrl = process.env.CLIENT_URL || 'https://theatlantichorizon.ie';

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

  async verifyAndActivate(sessionId) {
    const existing = await GiftCard.findOne({ stripe_session_id: sessionId });
    if (existing) return { success: true, code: existing.code, alreadyProcessed: true };

    const stripe = await getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      throw new Error("Payment verification failed.");
    }

    const m = session.metadata;
    const amount = m.amount || m.total_amount;
    const purchaserName = m.purchaser_name || m.purchaserName;
    const purchaserEmail = m.purchaser_email || m.purchaserEmail;
    const recipientName = m.recipient_name || m.recipientName;
    const recipientEmail = m.recipient_email || m.recipientEmail;
    const notes = m.notes || '';

    if (!amount) throw new Error("Crucial data missing in session metadata.");

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
        const existingCard = await GiftCard.findOne({ stripe_session_id: sessionId });
        if (existingCard) return { success: true, code: existingCard.code, alreadyProcessed: true };
      }
      throw error;
    }
  }

  async instantActivate(data) {
    const { amount, purchaserName, purchaserEmail, recipientName, recipientEmail, notes, stripeSessionId } = data;

    const generateCode = (seed) => {
      const hash = crypto.createHash('sha256').update(seed).digest('hex');
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let res = 'ATH-';
      let hashInt = BigInt('0x' + hash.substring(0, 16));
      for (let i = 0; i < 8; i++) {
        if (i === 4) res += '-';
        res += chars.charAt(Number(hashInt % 32n));
        hashInt /= 32n;
      }
      return res;
    };

    const generationSeed = stripeSessionId || `MANUAL-${Date.now()}-${Math.random()}`;
    let newCode = generateCode(generationSeed);
    while (await GiftCard.findOne({ code: newCode })) {
      newCode = generateCode(generationSeed + Math.random());
    }

    const sessionIdToUse = stripeSessionId || `INST-${Date.now()}-${Math.random()}`;

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
          notes: notes || 'Manual issuance',
          status: 'Active'
        }
      },
      { upsert: true, new: true }
    );

    const isNewInsert = giftCard.code === newCode;

    if (isNewInsert) {
      try {
        await emailService.sendGiftCardEmail(recipientEmail, {
          code: giftCard.code,
          amount: parseFloat(amount),
          recipientName,
          purchaserName: purchaserName || 'The Manor'
        });
      } catch (e) {}

      await UserLog.create({
        action: `GIFT_CARD_ISSUE`,
        details: `Issued Gift Card: ${giftCard.code} (€${amount})`,
        performed_by: purchaserName || 'Direct Issue',
        target_id: giftCard.code,
        user_type: 'Staff'
      });
    }

    return { success: true, code: giftCard.code, alreadyProcessed: !isNewInsert };
  }

  async validate(code) {
     const card = await GiftCard.findOne({ code: code.toUpperCase(), status: 'Active' });
     if (!card) throw new Error("Invalid or inactive code.");
     if (card.balance <= 0) throw new Error("Card balance is €0.");
     return card;
  }

  async getAll() {
    return await GiftCard.find().sort({ createdAt: -1 });
  }

  async getHistory(code) {
    const card = await GiftCard.findOne({ code: code.toUpperCase() });
    if (!card) throw new Error("Voucher not found.");

    const logs = await UserLog.find({ target_id: card.code }).sort({ createdAt: -1 });
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

    return { card, logs, stripeStatus };
  }
}

export default new GiftCardService();
