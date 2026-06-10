import React, { useState } from 'react';
import { authService } from '../services/api';
import './AdminLogin.css';

const AdminLogin = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validatePassword = (pwd) => {
    if (pwd.length < 12) {
      return 'Password must be at least 12 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain uppercase letters';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain lowercase letters';
    }
    if (!/\d/.test(pwd)) {
      return 'Password must contain numbers';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return 'Password must contain special characters (!@#$%^&*, etc.)';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Hardcoded test credentials
      if (username === 'admin.prank' && password === '1234567890') {
        onLoginSuccess({ id: 1, username: 'admin.prank' });
        setLoading(false);
        return;
      }

      const result = await authService.login(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        onLoginSuccess(result.admin);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      const result = await authService.register(username, password);
      if (result.error) {
        setError(result.error);
      } else {
        setError('');
        alert('Registration successful! Please login.');
        setPassword('');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Admin Dashboard</h1>
          <p>Manage Your Campaign Data</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading || !username || !password}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="register-section">
          <p>New admin?</p>
          <form onSubmit={handleRegister} className="register-form">
            <button
              type="submit"
              className="btn-register"
              disabled={loading || !username || !password}
            >
              {loading ? 'Creating...' : 'Create New Account'}
            </button>
          </form>
        </div>

        <div className="password-requirements">
          <p><strong>Password Requirements:</strong></p>
          <ul>
            <li>At least 12 characters long</li>
            <li>Contains uppercase letters (A-Z)</li>
            <li>Contains lowercase letters (a-z)</li>
            <li>Contains numbers (0-9)</li>
            <li>Contains special characters (!@#$%^&*)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
