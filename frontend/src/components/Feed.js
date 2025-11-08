import React, { useState, useEffect } from 'react';
import CreatePost from './CreatePost';
import Post from './Post';
import api from '../utils/api';
import './Feed.css';

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await api.get('/posts');
      setPosts(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
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
      <div className="feed-container">
        <div className="loading">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="feed-container">
      <div className="feed-content">
        <CreatePost onPostCreated={handlePostCreated} />
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <Post
                key={post._id}
                post={post}
                currentUser={user}
                onPostUpdated={handlePostUpdated}
                onPostDeleted={handlePostDeleted}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;

