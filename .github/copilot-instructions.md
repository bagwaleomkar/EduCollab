# EduCollab - AI Agent Instructions

## Architecture Overview

EduCollab is a collaborative study platform with a **React frontend + Express backend** architecture. This is NOT a Firestore project - it recently migrated from Firestore to MongoDB.

### Technology Stack
- **Frontend**: React 18.2.0 + Tailwind CSS 3.3.6 + React Router 6.20.0
- **Backend**: Express 5.2.1 + MongoDB (Mongoose 9.1.3)
- **Authentication**: Firebase Auth (email/password + Google OAuth)
- **Authorization**: Firebase Admin SDK verifies tokens on backend

### Critical Architecture Pattern: Dual Authentication System

**Frontend (src/firebase.js)**:
- Firebase Auth handles login/signup/logout
- Frontend gets Firebase ID token
- `apiService.js` automatically attaches token to all API requests via Axios interceptor

**Backend (server/middleware/authMiddleware.js)**:
- Firebase Admin SDK verifies tokens sent from frontend
- `verifyToken` middleware extracts `firebaseUid` from token
- Backend uses `firebaseUid` to query MongoDB (NOT Firestore IDs)
- DEV MODE: If Firebase Admin credentials missing, auth is bypassed with console warnings

### Data Models Use Firebase UIDs

All Mongoose models use `firebaseUid` as the user identifier:
- **User.firebaseUid** (primary key, indexed)
- **Group.createdBy** and **Group.members[]** store Firebase UIDs
- **Task.userId** and **Resource.userId** reference Firebase UIDs
- Never use MongoDB ObjectIds for user references

## Development Workflow

### Starting the Application

**Terminal 1 - Backend:**
```powershell
cd server
node server.js
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```powershell
npm start
```
React dev server runs on `http://localhost:3000`

### Environment Configuration

**Frontend (.env in root)**:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=educollab-3b4e0
# ... other Firebase config
```

**Backend (server/.env)**:
```env
MONGODB_URI=mongodb+srv://...
PORT=5000
FIREBASE_PROJECT_ID=educollab-3b4e0
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="..."
```

## Code Patterns & Conventions

### API Service Pattern (src/services/apiService.js)

All backend communication goes through `apiService.js` - never call `fetch()` or create new Axios instances:
```javascript
import { userAPI, groupAPI, taskAPI, resourceAPI } from '../services/apiService';

// Automatically includes Firebase token
const user = await userAPI.getUser(firebaseUid);
const groups = await groupAPI.getUserGroups(firebaseUid);
```

### Component Architecture

**Layout Pattern**: All main views use `Navbar + Sidebar + Main Content`:
```jsx
<div className="min-h-screen bg-gray-50">
  <Navbar />
  <div className="flex">
    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    <main className="flex-1 lg:ml-64">
      {/* Content */}
    </main>
  </div>
</div>
```

**Reusable Components** (src/components/common/):
- `UIComponents.jsx`: Card, Button, StatCard, Badge, EmptyState, Input, Select, TextArea, Modal
- `Icons.jsx`: All SVG icons exported as React components

### Authentication Context (src/contexts/AuthContext.jsx)

**Pattern**: Firebase Auth + MongoDB Profile Creation
```javascript
// On signup/login, profile is automatically created in MongoDB
const signup = async (email, password, name, role) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName: name });
  await createUserProfile(result.user, { name, role }); // MongoDB API call
};
```

### Route Protection

All authenticated routes wrapped in `<ProtectedRoute>`:
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

## Key Files & Responsibilities

**Backend Entry Point**: `server/server.js`
- Connects to MongoDB via `config/db.js`
- Mounts routes: `/api/users`, `/api/groups`, `/api/tasks`, `/api/resources`
- All routes protected by `verifyToken` middleware

**API Routes Pattern** (e.g., server/routes/userRoutes.js):
```javascript
const { verifyToken } = require('../middleware/authMiddleware');
router.post('/', verifyToken, async (req, res) => {
  const firebaseUid = req.user.uid; // Extracted by middleware
  // Use firebaseUid to query/create MongoDB documents
});
```

**Frontend Routing** (src/App.js):
- `/` redirects to `/dashboard`
- `/login` and `/register` are public
- All other routes require authentication

## Common Tasks

### Adding a New API Endpoint

1. Define Mongoose model in `server/models/` (use `firebaseUid` for user refs)
2. Create route file in `server/routes/` with `verifyToken` middleware
3. Mount route in `server/server.js`
4. Add API methods to `src/services/apiService.js`
5. Use API methods in React components

### Adding a New Protected Page

1. Create component in `src/components/`
2. Add route in `src/App.js` wrapped with `<ProtectedRoute>`
3. Add navigation link in `src/components/Sidebar.jsx`

### Mock Data vs Real Data

**Current State**: Components use `src/data/mockData.js` for demo data
**Migration Path**: Replace mock data imports with API calls from `apiService.js`

## Troubleshooting Patterns

### "Cannot connect to MongoDB"
Check `server/.env` has valid `MONGODB_URI`. For MongoDB Atlas, verify IP whitelist includes `0.0.0.0/0` or your IP.

### "Invalid or expired token"
- Verify `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` in `server/.env`
- Check private key has `\n` escaped properly: `"-----BEGIN PRIVATE KEY-----\n..."`

### CORS Errors
Backend already has CORS enabled for all origins. If issues persist, check `server.js` line 19: `app.use(cors())`

### Port Conflicts
If port 5000 is in use:
1. Change `PORT=5001` in `server/.env`
2. Update `REACT_APP_API_URL=http://localhost:5001/api` in frontend `.env`

## Project-Specific Rules

1. **Never use Firestore** - All database operations go through MongoDB API
2. **Never create new Axios instances** - Use `apiService.js`
3. **Always use firebaseUid** - Not MongoDB ObjectIds for user references
4. **Components use Tailwind only** - No custom CSS files except `index.css`
5. **Icons from Icons.jsx** - Don't install icon libraries
6. **UI from UIComponents.jsx** - Don't install component libraries

## Recent Migration Notes

This project recently migrated from Firestore to MongoDB (see [MONGODB_MIGRATION_COMPLETE.md](MONGODB_MIGRATION_COMPLETE.md)). Key changes:
- Removed `useFirestore.js` hook - replaced with `apiService.js`
- Firebase now handles ONLY authentication (no Firestore imports)
- All data operations go through Express API + MongoDB
- Backend verifies Firebase tokens but stores data in MongoDB
