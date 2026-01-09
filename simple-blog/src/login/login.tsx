import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store'; 
import { login } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css'; // Make sure this contains the updated login CSS

const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/blogs');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={!email || !password}>
          Login
        </button>
      </form>
      <p className="form-toggle">
        Don't have an account?{' '}
        <span className="link" onClick={() => navigate('/register')}>
          Register
        </span>
      </p>
    </div>
  );
};

export default Login;
