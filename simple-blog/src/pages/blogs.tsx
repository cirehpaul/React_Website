import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../store/blogSlice';
import { logout } from '../feature/authThunks';
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

  const blogs = useSelector((state: RootState) => state.blog.blogs);
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
    <div className="blogs-page">
      
      <div className="header">
        <div className="name">CPBC</div>
        <div className="actions">
          <button onClick={() => navigate('/blogs/create')}>Create BLOG</button>
          <button onClick={handleLogout}>LOGOUT</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading blogs...</div>
      ) : blogs.length === 0 ? (
        <div className="empty-message">
          <h3>No blogs yet</h3>
          <button onClick={() => navigate('/blogs/create')}>
            Create First Blog
          </button>
        </div>
      ) : (
        <div className="blog-container">
          {blogs.map(blog => (
            <div key={blog.id} className="blog-card">
              <h3>{blog.title}</h3>
              <p>{blog.content}</p>

              <div className="blog-footer">
                <span className="blog-date">
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
                <button onClick={() => handleDelete(blog.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pagination">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          &lt;
        </button>

        <span>● ● ●</span>

        <button
          onClick={() => setPage(p => p + 1)}
          disabled={blogs.length < 5}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}
