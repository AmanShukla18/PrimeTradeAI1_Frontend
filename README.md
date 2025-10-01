# Frontend React Application

## Overview
React.js frontend with TailwindCSS styling, JWT authentication, and responsive design.

## Project Structure
```
frontend/
├── public/             # Static files
├── src/
│   ├── components/     # Reusable components
│   ├── contexts/       # React contexts
│   ├── pages/         # Page components
│   ├── App.js         # Main app component
│   ├── index.js       # Entry point
│   └── index.css      # Global styles
├── package.json
└── tailwind.config.js
```

## Features
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Authentication**: JWT-based auth with context management
- **Protected Routes**: Route protection for authenticated users
- **Form Validation**: Client-side validation with error handling
- **CRUD Operations**: Complete notes management interface
- **Search & Filter**: Real-time search and category filtering
- **User Profile**: Profile viewing and editing functionality

## Components

### Pages
- `Login.js` - User login form
- `Signup.js` - User registration form
- `Dashboard.js` - Main dashboard with notes and profile

### Components
- `Navbar.js` - Navigation bar with user info and logout
- `NoteCard.js` - Individual note display card
- `NoteModal.js` - Modal for creating/editing notes
- `ProtectedRoute.js` - Route protection wrapper

### Contexts
- `AuthContext.js` - Authentication state management

## Styling
- **TailwindCSS**: Utility-first CSS framework
- **Custom Components**: Reusable button and input styles
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Color Scheme**: Professional blue and gray palette

## State Management
- React Context for authentication
- Local state for component-specific data
- Axios for API communication with automatic token handling