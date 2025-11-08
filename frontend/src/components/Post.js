import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import './Post.css';

const Post = ({ post, currentUser, onPostUpdated, onPostDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const isOwner = post.user._id === currentUser.id || post.user === currentUser.id;
  const isLiked = post.likes?.some(like => 
    (typeof like === 'object' ? like._id : like) === currentUser.id
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleLike = async () => {
    try {
      const response = await api.put(`/posts/${post._id}/like`);
      onPostUpdated(response.data);
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;

    setLoading(true);
    try {
      const response = await api.put(`/posts/${post._id}`, { text: editText });
      onPostUpdated(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    setLoading(true);
    try {
      await api.delete(`/posts/${post._id}`);
      onPostDeleted(post._id);
    } catch (err) {
      console.error('Error deleting post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    try {
      const response = await api.post(`/posts/${post._id}/comment`, { text: commentText });
      onPostUpdated(response.data);
      setCommentText('');
      setShowCommentForm(false);
      setShowComments(true);
    } catch (err) {
      console.error('Error adding comment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.user._id || post.user}`} className="post-user-info">
          <div className="user-avatar">
            {post.user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className="user-name">{post.user.name}</div>
            <div className="post-time">{formatDate(post.createdAt)}</div>
          </div>
        </Link>
        {isOwner && (
          <div className="post-actions-menu">
            <button 
              className="edit-btn" 
              onClick={() => {
                setIsEditing(true);
                setEditText(post.text);
              }}
              disabled={loading}
            >
              Edit
            </button>
            <button 
              className="delete-btn" 
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="edit-form">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows="4"
            maxLength="1000"
          />
          <div className="edit-actions">
            <button onClick={handleEdit} disabled={loading || !editText.trim()}>
              Save
            </button>
            <button onClick={() => {
              setIsEditing(false);
              setEditText(post.text);
            }} disabled={loading}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="post-content">{post.text}</div>
          {post.image && (
            <div className="post-image-container">
              <img 
                src={`${process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5000'}${post.image}`} 
                alt="Post" 
                className="post-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
        </>
      )}

      <div className="post-footer">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          disabled={loading}
        >
          {isLiked ? '❤️' : '🤍'} Like ({post.likes?.length || 0})
        </button>
        <button 
          className="comment-btn"
          onClick={() => {
            setShowComments(!showComments);
            setShowCommentForm(!showCommentForm);
          }}
        >
          💬 Comment ({post.comments?.length || 0})
        </button>
      </div>

      {showCommentForm && (
        <form className="comment-form" onSubmit={handleComment}>
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write a comment..."
            maxLength="500"
          />
          <button type="submit" disabled={loading || !commentText.trim()}>
            Post
          </button>
        </form>
      )}

      {showComments && post.comments && post.comments.length > 0 && (
        <div className="comments-section">
          {post.comments.map((comment, index) => (
            <div key={index} className="comment">
              <div className="comment-user-avatar">
                {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="comment-content">
                <div className="comment-user-name">{comment.user?.name || 'Unknown'}</div>
                <div className="comment-text">{comment.text}</div>
                <div className="comment-time">{formatDate(comment.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;

