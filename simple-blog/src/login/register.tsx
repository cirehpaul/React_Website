import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store'; 
import { register } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';

const Register: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isGmail = email.endsWith('@gmail.com');
  const isPasswordMatch = password === confirmPassword && password !== '';
  const isDisabled = !isGmail || !isPasswordMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isGmail) {
      setError('Email must be a Gmail address');
      return;
    }

    if (!isPasswordMatch) {
      setError('Passwords do not match');
      return;
    }

    try {
      const result = await dispatch(register({ email, password })).unwrap();
      setSuccess('Account created successfully!');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit" disabled={isDisabled}>
          Register
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <span className="link" onClick={() => navigate('/login')}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Register;
