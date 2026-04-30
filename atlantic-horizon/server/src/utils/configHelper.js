import Setting from '../models/setting.model.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Prioritizes DB 'Setting' collection, falls back to process.env.
 */
export const getSetting = async (key, defaultValue = null) => {
  try {
    const setting = await Setting.findOne({ key });
    return setting ? setting.value : (process.env[key.toUpperCase()] || defaultValue);
  } catch (error) {
    console.warn(`[Config] Failed to fetch "${key}", using fallback.`, error.message);
    return process.env[key.toUpperCase()] || defaultValue;
  }
};

/**
 * Batch Fetch Utility
 */
export const getSettings = async (keysMap) => {
  const result = {};
  for (const [key, envFallback] of Object.entries(keysMap)) {
    result[key] = await getSetting(key, process.env[envFallback]);
  }
  return result;
};

/**
 * Mutation Utility: Create or Update Setting
 */
export const upsertSetting = async (key, value, description = '') => {
  try {
    return await Setting.findOneAndUpdate(
      { key },
      { value, description },
      { upsert: true, new: true, runValidators: true }
    );
  } catch (error) {
    console.error(`[Config] Failed to save "${key}".`, error.message);
    throw error;
  }
};

/**
 * Validates critical environment variables
 */
export const checkEnv = () => {
    const required = [
        'MONGO_URI',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET'
    ];
    
    const missing = required.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error('CRITICAL: Missing environment variables:', missing.join(', '));
    }
};

export default { getSetting, getSettings, upsertSetting, checkEnv };
