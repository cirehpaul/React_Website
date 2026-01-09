import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBlog } from '../store/blogSlice';
import type { RootState, AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import '../styles/createBlog.css';

export default function CreateBlog() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      await dispatch(createBlog({ title, content })).unwrap(); 
      setTitle('');
      setContent('');
      navigate('/blogs');
    } catch (err: any) {
      console.error('Error creating blog:', err);
      alert(err.message || 'Failed to create blog');
    } finally {
      setLoading(false);
    }
  };

  // If user is not logged in
  if (!user) {
    return (
      <div className="create-blog-container">
        <div className="not-logged-in">
          <h2> Please log in first</h2>
          <p>You need to be logged in to create a blog post.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="create-blog-container">
      <h1> Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="create-form">
        <div className="form-group">
          <label>
            Title: <span className="required-field">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Give your blog post an amazing title"
            required
          />
        </div>

        <div className="form-group">
          <label>
            Content: <span className="required-field">*</span>
          </label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write your thoughts, ideas, and stories here..."
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? ' Creating...' : ' Publish Blog'}
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate('/blogs')}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
