/**
 * ⏳ sessionExpiry.js (24HrsLogout Logic)
 * Centralized algorithm for session validity duration.
 */

export const isSessionExpired = (loginTimestamp) => {
  if (!loginTimestamp) return true;

  const now = Date.now();
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
  
  const age = now - parseInt(loginTimestamp);
  return age > TWENTY_FOUR_HOURS;
};

export const getExpiryWindow = () => 24 * 60 * 60 * 1000;
