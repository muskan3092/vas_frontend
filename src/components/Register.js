import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, sendOtp } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_phone_number: '',
    user_password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.user_name || !formData.user_email || !formData.user_phone_number || !formData.user_password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.user_phone_number.length !== 10 || !/^\d+$/.test(formData.user_phone_number)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    if (formData.user_password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (formData.user_password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.user_email)) {
      setError('Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // First register the user
      await registerUser({
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_phone_number: formData.user_phone_number,
        user_password: formData.user_password
      });

      // Then send OTP
      const otpResponse = await sendOtp(formData.user_phone_number);

      if (otpResponse.data.status === 'success') {
        setSuccess('Registration successful! Redirecting to OTP verification...');
        setTimeout(() => {
          navigate('/verify-otp', { state: { phoneNumber: formData.user_phone_number } });
        }, 2000);
      } else {
        setError('Registration successful but failed to send OTP. Please try logging in.');
      }
    } catch (err) {
      if (err.response && err.response.status === 500) {
        setError('Phone number already registered. Please login instead.');
      } else {
        setError('Registration failed. Please try again.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h1>SmartVAS</h1>
          <p>Your Gateway to Value-Added Services</p>
        </div>
        <div className="card-body">
          <h2 className="form-title">Create Account</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="user_name">Full Name</label>
              <input
                type="text"
                id="user_name"
                name="user_name"
                className="form-input"
                value={formData.user_name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              <div className="form-icon">👤</div>
            </div>
            <div className="form-group">
              <label htmlFor="user_email">Email Address</label>
              <input
                type="email"
                id="user_email"
                name="user_email"
                className="form-input"
                value={formData.user_email}
                onChange={handleChange}
                placeholder="Enter your email address"
              />
              <div className="form-icon">✉️</div>
            </div>
            <div className="form-group">
              <label htmlFor="user_phone_number">Mobile Number</label>
              <input
                type="text"
                id="user_phone_number"
                name="user_phone_number"
                className="form-input"
                value={formData.user_phone_number}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
                maxLength="10"
              />
              <div className="form-icon">📱</div>
              <p className="password-hint">We'll send a verification code to this number</p>
            </div>
            <div className="form-group">
              <label htmlFor="user_password">Password</label>
              <input
                type="password"
                id="user_password"
                name="user_password"
                className="form-input"
                value={formData.user_password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <div className="form-icon">🔒</div>
              <p className="password-hint">Password must be at least 6 characters long</p>
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <div className="form-icon">🔒</div>
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Creating Account...
                </>
              ) : (
                'SEND VERIFICATION CODE'
              )}
            </button>
          </form>
          <div className="link">
            Already have an account? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;