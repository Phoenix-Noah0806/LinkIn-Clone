# LinkedIn Clone

A full-stack social networking web application similar to LinkedIn, built with React.js, Node.js, Express.js, and MongoDB.

## Features

### Core Features
- ✅ **User Authentication**: Sign up and login with email and password
- ✅ **Create Posts**: Users can create text posts after logging in
- ✅ **View All Posts**: Public feed showing all posts from all users, sorted by latest first
- ✅ **User Profile Display**: Shows user's name in the navigation bar

### Bonus Features
- ✅ **Like Posts**: Users can like/unlike posts
- ✅ **Comments**: Users can add comments to posts
- ✅ **Edit Posts**: Users can edit their own posts
- ✅ **Delete Posts**: Users can delete their own posts
- ✅ **User Profiles**: View any user's profile with their posts
- ✅ **Image Uploads**: Upload images with posts (up to 5MB)
- ✅ **Public Feed**: All users can see posts from every registered user
- ✅ **Latest First**: Posts are sorted by creation date (newest first)

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Project Structure

```
LinkedIn clone/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── posts.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Feed.js
│   │   │   ├── CreatePost.js
│   │   │   ├── Post.js
│   │   │   └── Navbar.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

## Installation & Setup

### 1. Clone the Repository

```bash
cd "LinkedIn clone"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create a .env file (copy from .env.example)
# Windows (PowerShell):
Copy-Item .env.example .env

# Or manually create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/linkedin-clone
# JWT_SECRET=your-secret-key-change-this-in-production

# Start the backend server
npm start

# For development with auto-reload:
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```

The frontend will run on `http://localhost:3000`

## Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/linkedin-clone
JWT_SECRET=your-secret-key-change-this-in-production
```

**Note**: For MongoDB Atlas (cloud database), replace `MONGODB_URI` with your Atlas connection string.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Posts
- `GET /api/posts` - Get all posts (protected)
- `POST /api/posts` - Create a new post (protected)
- `PUT /api/posts/:id` - Update a post (protected, owner only)
- `DELETE /api/posts/:id` - Delete a post (protected, owner only)
- `PUT /api/posts/:id/like` - Like/unlike a post (protected)
- `POST /api/posts/:id/comment` - Add a comment to a post (protected)

## How to Use

1. **Start MongoDB**: Make sure MongoDB is running on your system
   - If using local MongoDB: `mongod` (or start MongoDB service)
   - If using MongoDB Atlas: Ensure your connection string is correct

2. **Start Backend Server**: 
   ```bash
   cd backend
   npm start
   ```

3. **Start Frontend Server**:
   ```bash
   cd frontend
   npm start
   ```

4. **Access the Application**: 
   - Open your browser and go to `http://localhost:3000`
   - You'll see the login page
   - Click "Sign up" to create a new account
   - After registration, you'll be automatically logged in
   - Create posts and interact with other users' posts

## Features Walkthrough

### 1. User Registration & Login
- Visit the app → You'll see a login page
- Click "Sign up" to create an account
- Fill in your name, email, and password (min 6 characters)
- After registration, you're automatically logged in

### 2. Create a Post
- Once logged in, you'll see the feed page
- At the top, there's a "Create a Post" section
- Type your post (max 1000 characters)
- Click "Post" to publish

### 3. View All Posts
- All posts from all users appear in the feed
- Posts are sorted by latest first
- Each post shows:
  - User's name and avatar
  - Post content
  - Time when posted
  - Like count
  - Comment count

### 4. Interact with Posts
- **Like**: Click the "Like" button to like/unlike a post
- **Comment**: Click "Comment" to view/add comments
- **Edit**: If it's your post, click "Edit" to modify it
- **Delete**: If it's your post, click "Delete" to remove it

### 5. Logout
- Click the "Logout" button in the top navigation bar

## Development

### Backend Development
- The backend uses Express.js for routing
- MongoDB with Mongoose for database operations
- JWT for authentication
- bcryptjs for password hashing

### Frontend Development
- React.js with functional components and hooks
- React Router for navigation
- Axios for API calls
- Modern CSS with responsive design

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or start MongoDB service
- Check your `MONGODB_URI` in `.env` file
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Backend: Change `PORT` in `.env` file
- Frontend: React will prompt to use a different port

### CORS Issues
- CORS is already configured in the backend
- Ensure backend is running on port 5000

### Authentication Issues
- Clear browser localStorage if you encounter token issues
- Check that JWT_SECRET is set in backend `.env`

## Future Enhancements

Potential features to add:
- User profile pages
- Image upload for posts
- Follow/unfollow users
- Notifications
- Search functionality
- Post sharing
- Real-time updates

## License

This project is open source and available for educational purposes.

## Author

Created as a full-stack development project demonstrating React.js, Node.js, Express.js, and MongoDB skills.

