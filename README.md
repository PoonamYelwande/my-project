# Quora Clone

A full-stack Interactive Q & A Web Portal application built with React.js, Node.js, and MongoDB.

## Features

- **User Authentication**: Sign up and login functionality
- **Ask Questions**: Users can post questions with titles and descriptions
- **Answer Questions**: Users can provide answers to questions
- **Homepage**: View all latest questions from all users
- **Profile Page**: View user's questions and answers
- **Question Details**: View individual questions with all answers

## Tech Stack

- **Frontend**: React.js, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (MongoDB Compass or MongoDB server running on localhost:27017)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory (already created, but you can modify it):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/quora-clone
JWT_SECRET=your-secret-key-change-this-in-production
```

4. Make sure MongoDB is running on your system (MongoDB Compass or MongoDB server)

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Project Structure

```
QuoraClone/
├── backend/
│   ├── models/          # MongoDB models (User, Question, Answer)
│   ├── routes/          # API routes (auth, questions, answers, users)
│   ├── middleware/      # Authentication middleware
│   ├── server.js        # Express server setup
│   └── package.json
├── frontend/
│   ├── public/          # Public assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context (AuthContext)
│   │   ├── App.js       # Main App component
│   │   └── index.js     # Entry point
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/:id` - Get a single question
- `POST /api/questions` - Create a question (requires auth)
- `PUT /api/questions/:id` - Update a question (requires auth)
- `DELETE /api/questions/:id` - Delete a question (requires auth)

### Answers
- `POST /api/answers` - Create an answer (requires auth)
- `PUT /api/answers/:id` - Update an answer (requires auth)
- `DELETE /api/answers/:id` - Delete an answer (requires auth)

### Users
- `GET /api/users/:id` - Get user profile with questions and answers
- `GET /api/users/profile/me` - Get current user profile (requires auth)

## Usage

1. Start MongoDB (make sure it's running on localhost:27017)
2. Start the backend server (port 5000)
3. Start the frontend server (port 3000)
4. Open your browser and navigate to `http://localhost:3000`
5. Sign up for a new account or login
6. Start asking questions and providing answers!

## Notes

- Make sure MongoDB is running before starting the backend server
- The JWT secret in `.env` should be changed in production
- All passwords are hashed using bcrypt before storing in the database



