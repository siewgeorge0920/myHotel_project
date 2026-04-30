import Stripe from 'stripe';
import { getSetting } from '../utils/configHelper.js';

/**
 * Dynamic Stripe Initialization
 * Re-reads secret key from DB/ENV on every access to ensure zero-hardcoding
 * if the admin changes keys live.
 */
export const getStripe = async () => {
  const secret = await getSetting('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY);
  return new Stripe(secret);
};
