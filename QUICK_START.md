# 🚀 Quick Start Guide - Get EduCollab Running in 5 Minutes!

## Step 1: Install Dependencies (1 minute)
```bash
npm install
```
✅ Already done if Firebase is installed!

## Step 2: Create Firebase Project (3 minutes)

### A. Go to Firebase Console
👉 Visit: https://console.firebase.google.com/
- Click "Add project" or select existing
- Name it: "EduCollab" (or any name)
- Disable Google Analytics (optional)
- Click "Create project"

### B. Enable Authentication
1. Click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Email/Password" → Enable both options → Save
4. Click "Google" → Enable → Enter support email → Save

### C. Create Firestore Database
1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Select "Start in production mode"
4. Choose location (any nearby region)
5. Click "Enable"

### D. Enable Storage
1. Click "Storage" in left sidebar
2. Click "Get started"
3. Use default rules → Next
4. Choose same location as Firestore
5. Click "Done"

### E. Get Your Configuration
1. Click ⚙️ (Settings) icon → "Project settings"
2. Scroll to "Your apps" section
3. Click </> (Web) icon
4. Name: "EduCollab Web"
5. Click "Register app"
6. Copy the `firebaseConfig` object

## Step 3: Configure Environment (1 minute)

### Open `.env` file and replace with your values:

```env
REACT_APP_FIREBASE_API_KEY=AIza... (your key)
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456:web:abc123
```

**Where to find each:**
From the firebaseConfig you copied:
```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // → REACT_APP_FIREBASE_API_KEY
  authDomain: "....firebaseapp.com", // → REACT_APP_FIREBASE_AUTH_DOMAIN
  projectId: "your-project",       // → REACT_APP_FIREBASE_PROJECT_ID
  storageBucket: "....appspot.com", // → REACT_APP_FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",     // → REACT_APP_FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123:web:abc"          // → REACT_APP_FIREBASE_APP_ID
};
```

## Step 4: Add Security Rules (30 seconds)

### Firestore Rules:
1. Go to Firestore Database
2. Click "Rules" tab
3. Replace everything with:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
4. Click "Publish"

### Storage Rules:
1. Go to Storage
2. Click "Rules" tab
3. Replace with:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```
4. Click "Publish"

## Step 5: Start the App! (30 seconds)

```bash
npm start
```

🎉 Your app will open at http://localhost:3000

## First Time Using the App

### 1. Create Account
- Click "Register here"
- Enter name, email, password
- Choose Student or Mentor
- Click "Create Account"

### 2. You're In!
- Automatically logged in
- See Dashboard
- Navigation sidebar works
- Try clicking different pages

### 3. Test Features
✅ Logout (top right profile menu)
✅ Login again
✅ Try "Login with Google"
✅ All pages are now accessible

## What's Working Right Now

✅ **User Registration** - Email/Password & Google
✅ **User Login** - With error handling
✅ **Protected Routes** - Can't access without login
✅ **Dashboard** - Main landing page
✅ **All Pages** - Study Groups, Tasks, Resources, Progress
✅ **Logout** - Sign out functionality
✅ **User Profile** - Stored in Firestore
✅ **Navigation** - Sidebar & Navbar

## Quick Test Checklist

- [ ] Register new account
- [ ] Login with email/password
- [ ] Logout
- [ ] Login again
- [ ] Try Google Sign-In
- [ ] Visit all pages via sidebar
- [ ] Check navbar shows your name
- [ ] Test logout from profile menu

## Common First-Time Issues

### App shows "Loading..." forever
**Fix**: Check `.env` file has correct Firebase credentials

### "Firebase: Error (auth/invalid-api-key)"
**Fix**: Double-check `REACT_APP_FIREBASE_API_KEY` in `.env`

### "Missing or insufficient permissions"
**Fix**: Make sure you published Firestore security rules

### Register button does nothing
**Fix**: Check browser console for errors, ensure Email auth is enabled

### Google Sign-In doesn't work
**Fix**: Ensure Google provider is enabled in Firebase Auth settings

## Next Steps (Optional)

Want to add real data? Check these files:
- `INTEGRATION_EXAMPLES.js` - Code examples
- `FIREBASE_SETUP.md` - Complete documentation
- `IMPLEMENTATION_COMPLETE.md` - Full feature list

## Need Help?

1. **Check Firebase Console**: Look for errors in Authentication
2. **Browser Console**: Press F12, check Console tab for errors
3. **Verify .env**: Make sure all values are filled correctly
4. **Restart Server**: Stop (Ctrl+C) and run `npm start` again

## That's It! 🎊

You now have a fully functional Firebase-powered collaborative learning platform!

**Features Ready:**
- ✅ User authentication
- ✅ Protected pages
- ✅ User profiles
- ✅ Real-time database
- ✅ File storage capabilities

**Have Fun Building! 🚀**

---

## Pro Tips

💡 **Use Chrome DevTools**: Inspect Firebase calls in Network tab
💡 **Firebase Console**: Monitor users in Authentication section
💡 **Firestore**: Check if data is being created in Database
💡 **Test Accounts**: Create multiple accounts to test features
💡 **Error Messages**: Read them carefully - they're helpful!

## Files You Should Know

- `.env` - Your Firebase credentials (never share!)
- `src/firebase.js` - Firebase initialization
- `src/contexts/AuthContext.jsx` - Authentication logic
- `src/hooks/useFirestore.js` - Database operations
- `src/services/storageService.js` - File uploads

🎉 **Enjoy your Firebase-powered EduCollab app!**
