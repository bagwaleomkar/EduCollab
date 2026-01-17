# EduCollab - Collaborative Study Platform

A modern, responsive authentication system for a collaborative learning platform built with React and Tailwind CSS.

## Features

### 🔐 Authentication System
- **Student Login** - Secure login with email and password
- **User Registration** - Create new accounts with role selection (Student/Mentor)
- **Google OAuth Integration** - Quick sign-in with Google (ready for implementation)
- **Form Validation** - Real-time validation with helpful error messages
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

### 🎨 Design Highlights
- Clean, academic-style UI
- Modern gradient backgrounds
- Smooth animations and transitions
- Accessible form elements
- Professional color scheme (Blue primary with accent colors)

## Tech Stack

- **React** 18.2.0
- **React Router DOM** 6.20.0
- **Tailwind CSS** 3.3.6
- **PostCSS** & **Autoprefixer**

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
EduCollab/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login screen component
│   │   ├── Register.jsx       # Registration screen component
│   │   └── Dashboard.jsx      # Dashboard (post-login)
│   ├── App.js                 # Main app with routing
│   ├── index.js               # React entry point
│   └── index.css              # Global styles with Tailwind
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Components

### Login Component
**Location:** `src/components/Login.jsx`

**Features:**
- Email and password authentication
- Form validation (email format, password length)
- Error handling for invalid credentials
- "Forgot Password" link
- "Register here" link for new users
- Google login button
- Loading state during authentication
- Mock authentication (replace with real API)

**Test Credentials:**
- Email: `student@example.com`
- Password: `password`

### Register Component
**Location:** `src/components/Register.jsx`

**Features:**
- Full name, email, password, and confirm password fields
- Role selection (Student/Mentor)
- Comprehensive form validation
- Password matching validation
- Email existence check
- Success message after registration
- Auto-redirect to login after successful registration
- Google signup button
- Mock registration (replace with real API)

### Dashboard Component
**Location:** `src/components/Dashboard.jsx`

**Features:**
- Welcome screen after successful login
- User email display
- Logout functionality
- Placeholder for future dashboard features

## Validation Rules

### Login
- **Email:** Required, must be valid email format
- **Password:** Required, minimum 6 characters

### Register
- **Full Name:** Required, minimum 2 characters
- **Email:** Required, must be valid email format, must not already exist
- **Password:** Required, minimum 6 characters
- **Confirm Password:** Required, must match password
- **Role:** Required (Student or Mentor)

## Customization

### Colors
Edit `tailwind.config.js` to customize the color scheme:
```javascript
colors: {
  primary: { /* Blue shades */ },
  accent: { /* Red shades */ }
}
```

### Styling
Global styles are in `src/index.css` with Tailwind utilities and custom component classes.

## Mock Authentication

Currently uses mock authentication with localStorage. Replace with real backend API:

**Login:**
```javascript
// In Login.jsx, replace the setTimeout with:
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: formData.email, password: formData.password })
});
const data = await response.json();
```

**Register:**
```javascript
// In Register.jsx, replace the setTimeout with:
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
const data = await response.json();
```

## Responsive Breakpoints

- **Mobile:** < 640px
- **Tablet:** 640px - 1024px
- **Desktop:** > 1024px

The layout automatically adjusts:
- On mobile: Single column, stacked layout
- On desktop: Two-column layout (illustration + form)

## Future Enhancements

- [ ] Implement real backend API integration
- [ ] Add Google OAuth implementation
- [ ] Add "Forgot Password" functionality
- [ ] Add email verification
- [ ] Implement protected routes
- [ ] Add user profile management
- [ ] Add study group features
- [ ] Add mentor-student matching
- [ ] Implement real-time collaboration tools

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available for educational purposes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Made with ❤️ for collaborative learning**
