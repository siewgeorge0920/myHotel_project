import Setting from '../models/setting.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Global Configuration Helper
 * Fetches operational constants from the Setting collection (DB) first.
 * Falls back to process.env if not found or if DB retrieval fails.
 */
export const getSetting = async (key, defaultValue = null) => {
  try {
    const setting = await Setting.findOne({ key });
    if (setting) return setting.value;
    
    // Fallback to .env (normalized uppercase key)
    const envValue = process.env[key.toUpperCase()];
    if (envValue !== undefined) return envValue;

    return defaultValue;
  } catch (error) {
    console.error(`[ConfigHelper] Error fetching key "${key}":`, error.message);
    return process.env[key.toUpperCase()] || defaultValue;
  }
};

/**
 * Batch Fetch Settings
 * Useful for initializing a module with multiple constants.
 */
export const getSettings = async (keysMap) => {
  const result = {};
  for (const [key, fallbackEnv] of Object.entries(keysMap)) {
    result[key] = await getSetting(key, process.env[fallbackEnv]);
  }
  return result;
};
