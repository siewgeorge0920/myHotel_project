import v3App from './v3/index.js';

const PORT = process.env.PORT || 5000;

/**
 * 🛰️ Atlantic Horizon Manor - Backend V3 (Production Entry)
 */
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  v3App.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏰 THE ATLANTIC HORIZON MANOR - BACKEND V3.0`);
    console.log(`📡 Suite listening at http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
}

export default v3App;
