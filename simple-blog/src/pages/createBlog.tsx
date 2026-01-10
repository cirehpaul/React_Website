import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../store/store';
import { createBlog } from '../store/blogSlice';
import '../styles/createBlog.css';

export default function CreateBlog() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="create-blog-page">
        <div className="not-logged-in">
          <h2>You are not logged in</h2>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await dispatch(createBlog({ title, content }));
    setLoading(false);
    navigate('/blogs');
  };

  return (
    <div className="create-blog-page">
      <div className="create-card">
        <h2>Create Blog</h2>
        <p className="subtitle">Share your thoughts with the world</p>

        <form className="create-form" onSubmit={handlePublish}>
          <div className="image-upload">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" />
            ) : (
              <span>Upload cover image</span>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              placeholder="Enter blog title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Content</label>
            <textarea
              placeholder="Write your blog content..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish'}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/blogs')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
