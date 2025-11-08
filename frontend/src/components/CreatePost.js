import React, { useState } from 'react';
import api from '../utils/api';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Please enter some text for your post');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let response;
      const trimmedText = text.trim();
      
      if (image) {
        // Use FormData when there's an image
        const formData = new FormData();
        formData.append('text', trimmedText);
        formData.append('image', image);
        
        // Verify FormData contents (for debugging - remove in production)
        // console.log('FormData text:', trimmedText);
        // for (let pair of formData.entries()) {
        //   console.log(pair[0] + ': ' + pair[1]);
        // }
        
        response = await api.post('/posts', formData);
      } else {
        // Use JSON when there's no image
        response = await api.post('/posts', { text: trimmedText });
      }

      onPostCreated(response.data);
      setText('');
      setImage(null);
      setImagePreview(null);
      // Reset file input
      const fileInput = document.getElementById('image-upload');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <h3>Create a Post</h3>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          rows="4"
          maxLength="1000"
        />
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Preview" className="image-preview" />
            <button type="button" onClick={removeImage} className="remove-image-btn">
              ×
            </button>
          </div>
        )}
        <div className="file-upload-section">
          <label htmlFor="image-upload" className="file-upload-label">
            📷 Add Photo
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file-upload-input"
          />
        </div>
        <div className="post-actions">
          <span className="char-count">{text.length}/1000</span>
          <button type="submit" className="post-btn" disabled={loading || !text.trim()}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

