import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog, updateBlog } from '../store/blogSlice';
import { logout } from '../thunk/authThunks';
import type { RootState, AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import '../styles/blogs.css';
import type { Blog } from '../store/blogSlice';

export default function Blogs() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { blogs, totalCount, loading } = useSelector((state: RootState) => state.blog);
  const user = useSelector((state: RootState) => state.auth.user);

  const [page, setPage] = useState(1);
  const limit = 2; 
  const totalPages = Math.ceil((totalCount || 0) / limit);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(fetchBlogs({ page, limit }));
  }, [page, user, dispatch, navigate]);

  useEffect(() => {
    if (!loading && blogs.length === 0 && page > 1) {
      setPage(p => p - 1);
    }
  }, [blogs, loading, page]);

  const handleEditClick = (blog: Blog) => {
    setEditingId(blog.id);
    setEditTitle(blog.title);
    setEditContent(blog.content);
  };

  const handleUpdate = async (id: string) => {
    await dispatch(updateBlog({ id, title: editTitle, content: editContent }));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this?')) {
      dispatch(deleteBlog(id));
    }
  };

  return (
    <div className="blogs-page">
      <header className="header">
        <div className="name">CPBC</div>
        <div className="actions">
          <button className="create-btn" onClick={() => navigate('/blogs/create')}>+ Create BLOG</button>
          <button className="logout-btn" onClick={() => { dispatch(logout()); navigate('/login'); }}>LOGOUT</button>
        </div>
      </header>

      <h2 className="view-title">View my latest blog</h2>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <main className="blog-container">
          {blogs && blogs.length > 0 ? (
            blogs.map((blog) => (
              <article key={blog.id} className="blog-card">
                <div className="blog-content">
                  {editingId === blog.id ? (
                    <div className="edit-fields">
                      <input 
                        className="edit-input" 
                        value={editTitle} 
                        onChange={(e) => setEditTitle(e.target.value)} 
                        placeholder="Blog Title"
                      />
                      <textarea 
                        className="edit-textarea" 
                        value={editContent} 
                        onChange={(e) => setEditContent(e.target.value)} 
                        placeholder="Blog Content"
                      />
                    </div>
                  ) : (
                    <>
                      <h3>{blog.title}</h3>
                      <p>{blog.content}</p>
                    </>
                  )}
                </div>
                
                <footer className="blog-footer">
                  <span className="blog-date">{new Date(blog.created_at).toLocaleDateString()}</span>
                  <div className="button-group">
                    {editingId === blog.id ? (
                      <>
                        <button className="save-btn" onClick={() => handleUpdate(blog.id)}>Save</button>
                        <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={() => handleEditClick(blog)}>Edit</button>
                        <button className="delete-btn" onClick={() => handleDelete(blog.id)}>Delete</button>
                      </>
                    )}
                  </div>
                </footer>
              </article>
            ))
          ) : (
            <div className="empty-message">
              <h3>No blogs found</h3>
              <button onClick={() => navigate('/blogs/create')}>Write your first blog</button>
            </div>
          )}
        </main>
      )}

      {!loading && totalPages > 1 && (
        <nav className="pagination-container">
          <div className="pagination-wrapper">
            <button
              className="prev-next"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              &larr; Previous
            </button>

            <div className="number-list">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  className={`page-number ${page === num ? 'active' : ''}`}
                  onClick={() => setPage(num)}
                >
                  {num}
                </button>
              ))}
            </div>

            <button
              className="prev-next"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next &rarr;
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}