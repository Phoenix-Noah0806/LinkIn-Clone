import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Post from './Post';
import './Profile.css';

const Profile = ({ currentUser }) => {
  const { id } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/users/${id}`);
      setProfileUser(response.data.user);
      setPosts(response.data.posts);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error || !profileUser) {
    return (
      <div className="profile-container">
        <div className="error-message">{error || 'User not found'}</div>
        <Link to="/feed" className="back-link">← Back to Feed</Link>
      </div>
    );
  }

  const isOwnProfile = currentUser.id === profileUser._id;

  return (
    <div className="profile-container">
      <Link to="/feed" className="back-link">← Back to Feed</Link>
      
      <div className="profile-header">
        <div className="profile-avatar-large">
          {profileUser.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h1>{profileUser.name}</h1>
          <p className="profile-email">{profileUser.email}</p>
          {profileUser.createdAt && (
            <p className="profile-joined">
              Joined {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}
            </p>
          )}
        </div>
      </div>

      <div className="profile-stats">
        <div className="stat-item">
          <div className="stat-number">{posts.length}</div>
          <div className="stat-label">Posts</div>
        </div>
      </div>

      <div className="profile-posts-section">
        <h2>{isOwnProfile ? 'Your Posts' : `${profileUser.name}'s Posts`}</h2>
        {posts.length === 0 ? (
          <div className="no-posts">
            <p>{isOwnProfile ? "You haven't posted anything yet." : `${profileUser.name} hasn't posted anything yet.`}</p>
          </div>
        ) : (
          <div className="profile-posts-list">
            {posts.map(post => (
              <Post
                key={post._id}
                post={post}
                currentUser={currentUser}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

