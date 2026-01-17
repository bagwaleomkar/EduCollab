// Firebase Admin SDK Middleware for Token Verification
const admin = require('firebase-admin');

// Initialize Firebase Admin (only once)
let isFirebaseInitialized = false;

try {
  if (!admin.apps.length) {
    // Check if credentials are provided
    if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      isFirebaseInitialized = true;
      console.log('✅ Firebase Admin initialized');
    } else {
      console.warn('⚠️  Firebase Admin credentials not found - Auth middleware will be in DEV MODE');
      console.warn('⚠️  Get credentials from: https://console.firebase.google.com/project/educollab-3b4e0/settings/serviceaccounts/adminsdk');
    }
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
}

// Middleware to verify Firebase ID token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    // DEV MODE: Skip verification if Firebase Admin is not initialized
    if (!isFirebaseInitialized) {
      console.warn('⚠️  DEV MODE: Skipping token verification');
      // In dev mode, extract uid from token manually (unsafe - for development only)
      // Token format: base64 encoded JSON
      try {
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        req.user = {
          uid: payload.user_id || payload.sub,
          email: payload.email,
        };
        return next();
      } catch (e) {
        return res.status(401).json({ error: 'Invalid token format' });
      }
    }

    // PRODUCTION: Verify the token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
