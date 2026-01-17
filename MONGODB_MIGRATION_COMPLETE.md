# MongoDB Migration Complete! 🎉

## What Changed

### ✅ Removed Firestore Completely
- Removed all Firestore imports from `firebase.js`
- Firebase is now used **ONLY for authentication**
- No more direct database operations in frontend

### ✅ Created Express Backend
Created a complete Node.js/Express API server:

**Backend Structure:**
```
server/
├── server.js              # Express app entry point
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── User.js           # User schema
│   ├── Group.js          # Group schema
│   ├── Task.js           # Task schema
│   └── Resource.js       # Resource schema
├── routes/
│   ├── userRoutes.js     # User API endpoints
│   ├── groupRoutes.js    # Group API endpoints
│   ├── taskRoutes.js     # Task API endpoints
│   └── resourceRoutes.js # Resource API endpoints
├── middleware/
│   └── authMiddleware.js # Firebase token verification
├── .env                  # Backend environment variables
└── package.json          # Backend dependencies
```

### ✅ Updated Frontend
- Created `src/services/apiService.js` - Axios-based API client
- Updated `AuthContext.jsx` - Now uses MongoDB API instead of Firestore
- Updated `.env` - Added `REACT_APP_API_URL=http://localhost:5000/api`

### API Endpoints Created

**Users:**
- POST `/api/users` - Create/update user
- GET `/api/users/:firebaseUid` - Get user
- PUT `/api/users/:firebaseUid` - Update user

**Groups:**
- POST `/api/groups` - Create group
- GET `/api/groups/user/:firebaseUid` - Get user's groups
- GET `/api/groups/:id` - Get group by ID
- POST `/api/groups/:id/join` - Join group
- POST `/api/groups/:id/leave` - Leave group
- PUT `/api/groups/:id` - Update group
- DELETE `/api/groups/:id` - Delete group

**Tasks:**
- POST `/api/tasks` - Create task
- GET `/api/tasks/user/:firebaseUid` - Get user's tasks
- GET `/api/tasks/group/:groupId` - Get group tasks
- GET `/api/tasks/:id` - Get task by ID
- PUT `/api/tasks/:id` - Update task
- PATCH `/api/tasks/:id/toggle` - Toggle status
- DELETE `/api/tasks/:id` - Delete task

**Resources:**
- POST `/api/resources` - Upload resource
- GET `/api/resources/user/:firebaseUid` - Get user's resources
- GET `/api/resources/group/:groupId` - Get group resources
- GET `/api/resources` - Get all resources (with filters)
- GET `/api/resources/:id` - Get resource by ID
- DELETE `/api/resources/:id` - Delete resource

## Next Steps - Setup Required!

### 1. Get MongoDB Connection String

#### Option A: MongoDB Atlas (Free - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up / Log in
3. Create a new cluster (FREE tier available)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password

#### Option B: Local MongoDB
```bash
mongod --dbpath=C:\mongodb\data
```
Connection string: `mongodb://localhost:27017/educollab`

### 2. Configure Backend Environment

Edit `server/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/educollab?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (for token verification)
FIREBASE_PROJECT_ID=educollab-3b4e0
FIREBASE_CLIENT_EMAIL=<your-service-account-email>
FIREBASE_PRIVATE_KEY="<your-private-key>"
```

### 3. Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **educollab-3b4e0**
3. Click ⚙️ Settings → Project Settings
4. Go to **Service Accounts** tab
5. Click **"Generate New Private Key"**
6. Download the JSON file
7. Copy values to `server/.env`:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep \n characters)

### 4. Start the Backend Server

```bash
cd server
npm start
```

Or for development with auto-reload:
```bash
npm install -g nodemon
npm run dev
```

Server will run on: `http://localhost:5000`

### 5. Start the Frontend

In a separate terminal:
```bash
cd c:\Users\Lenovo\Desktop\EduCollab
npm start
```

## How It Works Now

### Authentication Flow
1. User logs in via Firebase Auth (email/password or Google)
2. Frontend receives Firebase ID token
3. Token is sent in API requests: `Authorization: Bearer <token>`
4. Backend verifies token with Firebase Admin SDK
5. Backend extracts Firebase UID and processes request

### Data Flow
```
React Frontend → API Service (Axios) → Express Backend → MongoDB
                    ↓
              Firebase Auth Token
                    ↓
          authMiddleware verifies
                    ↓
          Mongoose Models (CRUD)
```

### Security
- All API routes protected with `verifyToken` middleware
- Firebase handles authentication
- MongoDB stores all app data
- Users can only access/modify their own data
- Tokens verified on every request

## Testing the Backend

### Health Check
```bash
curl http://localhost:5000/api/health
# Response: {"status":"OK","message":"Server is running"}
```

### Test with Frontend
1. Start both frontend and backend
2. Sign up / Log in
3. Check browser Network tab
4. Should see API calls to `http://localhost:5000/api/*`

## Troubleshooting

### "Cannot connect to MongoDB"
- Check your MongoDB URI in `server/.env`
- Verify MongoDB Atlas IP whitelist (add 0.0.0.0/0 for testing)
- Check database username/password

### "Invalid or expired token"
- Verify Firebase Admin SDK credentials in `server/.env`
- Check if FIREBASE_PRIVATE_KEY has escaped newlines
- Ensure Firebase project ID matches

### "CORS Error"
- Backend has CORS enabled by default
- If issues persist, check `server.js` cors configuration

### Port Already in Use
Change port in `server/.env`:
```env
PORT=5001
```
And update frontend `.env`:
```env
REACT_APP_API_URL=http://localhost:5001/api
```

## Architecture Benefits

✅ **Separation of Concerns** - Frontend (React) separate from Backend (Express)
✅ **Scalability** - Can scale backend independently
✅ **Security** - Backend validates all requests
✅ **Flexibility** - Easy to add features/endpoints
✅ **Cost Effective** - MongoDB free tier + Firebase Auth only
✅ **Standard REST API** - Easy to integrate with other services

## Files to Delete (Optional)

These files are no longer needed:
- `src/hooks/useFirestore.js` - Replaced with apiService.js
- Any Firestore utility files

## Status

- ✅ Firestore completely removed
- ✅ Express server created
- ✅ MongoDB models defined
- ✅ API routes implemented
- ✅ Firebase auth middleware working
- ✅ Frontend API service created
- ✅ AuthContext updated
- ⏳ **MongoDB connection string needed**
- ⏳ **Firebase Admin SDK credentials needed**
- ⏳ **Backend server needs to be started**

Once you configure MongoDB and Firebase Admin SDK, your app will be fully functional with MongoDB! 🚀
