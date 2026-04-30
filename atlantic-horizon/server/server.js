import app from './src/app.js';

const PORT = process.env.PORT || 5001; // Updated to 5001 as seen in terminal output earlier

/**
 *  Atlantic Horizon Manor - Backend (Modular Production Entry)
 */
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(` THE ATLANTIC HORIZON MANOR - BACKEND`);
    console.log(` Status: Modular Reorganization Complete`);
    console.log(` Suite listening at http://localhost:${PORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  });
}

export default app;
