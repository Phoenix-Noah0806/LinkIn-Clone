# Quick Start Guide

## ✅ Your .env file has been created!

The `.env` file in the `backend` folder is already configured with:
- Your MongoDB Atlas connection string
- Your JWT secret key
- Server port (5000)

## 🚀 Getting Started

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Install Frontend Dependencies
Open a new terminal:
```bash
cd frontend
npm install
```

### Step 3: Start the Backend Server
In the backend terminal:
```bash
npm start
```
You should see: "MongoDB Connected Successfully" and "Server running on port 5000"

### Step 4: Start the Frontend
In the frontend terminal:
```bash
npm start
```
The React app will open automatically at `http://localhost:3000`

## 📝 First Steps

1. **Sign Up**: Create a new account with your name, email, and password
2. **Create a Post**: Write your first post after logging in
3. **Explore**: Like and comment on posts, edit or delete your own posts

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Make sure your IP address is whitelisted in MongoDB Atlas
- Go to MongoDB Atlas → Network Access → Add IP Address (or use 0.0.0.0/0 for development)

### Port Already in Use
- Backend: Change PORT in `.env` file
- Frontend: React will automatically use the next available port

### Module Not Found Errors
- Make sure you've run `npm install` in both `backend` and `frontend` folders

## 🎉 You're All Set!

Your LinkedIn clone is ready to use. All features are implemented:
- ✅ User authentication
- ✅ Create posts (with optional image uploads)
- ✅ View all posts (public feed, latest first)
- ✅ Like posts
- ✅ Comment on posts
- ✅ Edit/Delete your posts
- ✅ User profiles (click on any user's name to view their profile)
- ✅ Image uploads (up to 5MB per image)

## 🆕 New Features

### Image Uploads
- Click "📷 Add Photo" when creating a post
- Supported formats: JPEG, JPG, PNG, GIF, WEBP
- Maximum file size: 5MB
- Preview images before posting

### User Profiles
- Click on any user's name or avatar in a post to view their profile
- See all posts by that user
- View user information and join date

Enjoy building your social network! 🚀

