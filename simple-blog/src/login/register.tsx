import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../store/store';
import { register } from '../thunk/authThunks';
import '../styles/register.css';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isGmailValid = email.endsWith('@gmail.com');
  const passwordsMatch = password === confirmPassword;

  const isFormValid =
    email &&
    password &&
    confirmPassword &&
    isGmailValid &&
    passwordsMatch;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    await dispatch(register({ email, password })).unwrap();

    alert('Registration successful! Please check your email.');
    navigate('/login');

  } catch (err: any) {
    console.error('Registration failed:', err);
    
    alert(err || 'Registration failed. Please try again.'); 
  }
};

  return (
    <div className="auth-page">
      <div className="register-container">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} noValidate>
      
          <div className="form-group">
            <input
              type="email"
              placeholder="Gmail address"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              required
            />
            {email && !isGmailValid && (
              <p className="error">Only Gmail addresses are allowed</p>
            )}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && !passwordsMatch && (
              <p className="error">Passwords do not match</p>
            )}
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
           <button type="submit" disabled={!isFormValid || loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
      </form>

        <p className="form-toggle">
          Already have an account?{' '}
          <span className="register-link" onClick={() => navigate('/login')}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
