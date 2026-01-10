import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { AppDispatch } from '../store/store';
import { register } from '../feature/authThunks';
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
    setError('');
    setSuccess('');

    if (!isGmailValid) {
      setError('Only Gmail addresses are allowed');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await dispatch(register({ email, password })).unwrap();

      setSuccess('Account created successfully! Redirecting to login...');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login', { state: { registered: true } });
      }, 1500);
    } catch (err: any) {
      setError(err?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="register-container">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
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

          {/* Password */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
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

          {/* Global Messages */}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* Submit */}
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
