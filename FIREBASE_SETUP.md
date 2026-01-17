# EduCollab - Collaborative Study Platform



A modern, real-time collaborative learning platform built with React and Firebase.

## Features

- **Authentication**
  - Email/Password authentication
  - Google Sign-In
  - User profiles with roles (Student/Mentor)
  - Protected routes

- **Study Groups**
  - Create and join study groups
  - Subject-based organization
  - Member management
  - Real-time updates

- **Tasks & Planner**
  - Create and assign tasks
  - Priority levels (High, Medium, Low)
  - Task status tracking
  - Due date management

- **Notes & Resources**
  - File upload and sharing
  - PDF, PPT, and document support
  - Subject categorization
  - Download capabilities

- **Progress Tracking**
  - Study hours tracking
  - Task completion rates
  - Weekly analytics
  - Achievement system

## Tech Stack

- **Frontend**: React 18, Tailwind CSS
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Routing**: React Router v6

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
   - Enable Google Sign-In
4. Create Firestore Database:
   - Go to Firestore Database
   - Create database in production mode
   - Start collection (will be created automatically by app)
5. Enable Cloud Storage:
   - Go to Storage
   - Get started with default rules
6. Get your Firebase config:
   - Go to Project Settings > General
   - Scroll to "Your apps" section
   - Copy the Firebase configuration

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd EduCollab
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the root directory:
```bash
cp .env.example .env
```

4. Update `.env` with your Firebase credentials:
```
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Firestore Security Rules

Add these security rules to your Firestore Database:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // User profiles
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Study groups
    match /groups/{groupId} {
      allow read: if request.auth != null && 
                   request.auth.uid in resource.data.members;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                     request.auth.uid in resource.data.members;
      allow delete: if request.auth != null && 
                     request.auth.uid == resource.data.createdBy;
    }
    
    // Tasks
    match /tasks/{taskId} {
      allow read: if request.auth != null && 
                   request.auth.uid in resource.data.assignedTo;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
                     (request.auth.uid == resource.data.createdBy || 
                      request.auth.uid in resource.data.assignedTo);
      allow delete: if request.auth != null && 
                     request.auth.uid == resource.data.createdBy;
    }
    
    // Resources/Notes
    match /resources/{resourceId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                             request.auth.uid == resource.data.uploadedBy;
    }
  }
}
```

## Firebase Storage Rules

Add these storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /resources/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow delete: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Project Structure

```
EduCollab/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── UIComponents.jsx    # Reusable UI components
│   │   │   └── Icons.jsx           # SVG icon components
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── Login.jsx               # Login page
│   │   ├── Register.jsx            # Registration page
│   │   ├── MyStudyGroups.jsx       # Study groups management
│   │   ├── TasksPlanner.jsx        # Task management
│   │   ├── NotesResources.jsx      # File management
│   │   ├── Progress.jsx            # Progress tracking
│   │   ├── Navbar.jsx              # Navigation bar
│   │   ├── Sidebar.jsx             # Sidebar menu
│   │   └── ProtectedRoute.jsx      # Route protection
│   ├── contexts/
│   │   └── AuthContext.jsx         # Authentication context
│   ├── hooks/
│   │   └── useFirestore.js         # Firestore custom hooks
│   ├── services/
│   │   └── storageService.js       # Firebase Storage service
│   ├── firebase.js                 # Firebase configuration
│   └── App.js                      # Main app component
├── .env                            # Environment variables
├── .env.example                    # Environment template
└── package.json
```

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Key Features Implementation

### Authentication
- Uses Firebase Authentication
- Supports email/password and Google OAuth
- Stores user profiles in Firestore
- Auto-redirects based on auth state

### Study Groups
- Real-time synchronization
- Member-based access control
- Create, join, and manage groups
- Subject categorization

### Tasks
- Priority-based organization
- Status tracking (pending/completed)
- Due date reminders
- Group or personal tasks

### Resources
- File upload to Firebase Storage
- Metadata stored in Firestore
- Download and preview support
- Subject and type filtering

## Environment Variables

| Variable | Description |
|----------|-------------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, email support@educollab.com or open an issue in the repository.

## Roadmap

- [ ] AI-powered study assistant
- [ ] Video conferencing integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Gamification features
- [ ] Calendar integration
- [ ] Real-time chat
- [ ] Collaborative whiteboard

## Authors

- Your Name - Initial work

## Acknowledgments

- Firebase for backend infrastructure
- Tailwind CSS for styling
- React community for excellent documentation
