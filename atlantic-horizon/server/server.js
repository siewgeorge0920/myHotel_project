import v3App from './v3/index.js';

const PORT = process.env.PORT || 5000;

/**
 * 🛰️ Atlantic Horizon Manor - Backend V3 (Production Entry)
 * Starting the Controller-Service-Model architecture.
 */
v3App.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🏰 THE ATLANTIC HORIZON MANOR - BACKEND V3.0`);
  console.log(`🚀 Mode: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Suite listening at http://localhost:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});
