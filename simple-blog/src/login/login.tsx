import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../store/store';
import { login } from '../thunk/authThunks';
import '../styles/login.css';


const Login: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormValid = isValidEmail && password.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please enter a valid email and password.');
      return;
    }

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/blogs');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="login-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
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

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={!isFormValid}>
            Login
          </button>
        </form>

        <p className="form-toggle">
          Don&apos;t have an account?{' '}
          <span onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
