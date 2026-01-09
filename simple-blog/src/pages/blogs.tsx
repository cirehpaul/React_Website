import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../store/blogSlice';
import { logout } from '../store/authSlice';
import type { RootState, AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import '../styles/blogs.css';


interface Blog {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Blogs() {
  const dispatch = useDispatch<AppDispatch>(); 
  const navigate = useNavigate();

 
  const blogs: Blog[] = useSelector((state: RootState) => state.blog.blogs);
  const user = useSelector((state: RootState) => state.auth.user);

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setLoading(true);
    dispatch(fetchBlogs({ page })).finally(() => setLoading(false));
  }, [page, user, dispatch, navigate]);

  const handleLogout = () => {
    dispatch(logout()); 
    navigate('/login');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      dispatch(deleteBlog(id));
    }
  };

  return (
    <div className="blogs-container">
      <div className="blogs-header">
        <h1>Blog Posts</h1>
        <div className="action-buttons">
          <button onClick={() => navigate('/blogs/create')}>Create Blog</button>
          <button onClick={handleLogout}>🚪 Logout</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">
          <p>Loading blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-message">
          <h3>No blogs found yet</h3>
          <p>Start sharing your thoughts by creating your first blog post!</p>
          <button onClick={() => navigate('/blogs/create')}>Create First Blog</button>
        </div>
      ) : (
        <div className="blogs-list">
          {blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>
              <div className="blog-meta">
                <span className="blog-date">
                  {new Date(blog.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <button className="delete-btn" onClick={() => handleDelete(blog.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
          ← Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={blogs.length < 5}>
          Next →
        </button>
      </div>
    </div>
  );
}
