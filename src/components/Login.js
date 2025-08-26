import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, sendOtp } from '../services/api';

const Login = ({ setIsAuthenticated }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!phoneNumber) {
      setError('Phone number is required');
      return;
    }

    if (phoneNumber.length !== 10 || !/^\d+$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      // First check if user exists
      const userResponse = await loginUser(phoneNumber);

      if (userResponse.data && userResponse.data.length > 0) {
        // User exists, send OTP
        const otpResponse = await sendOtp(phoneNumber);

        if (otpResponse.data.status === 'success') {
          // Redirect to OTP verification
          navigate('/verify-otp', { state: { phoneNumber } });
        } else {
          setError('Failed to send OTP. Please try again.');
        }
      } else {
        setError('User not found. Please register first.');
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('User not found. Please register first.');
      } else {
        setError('An error occurred. Please try again.');
      }
      console.error('Login error:', err);
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
          <h2 className="form-title">Welcome Back</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="phone">Mobile Number</label>
              <input
                type="text"
                id="phone"
                className="form-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter your 10-digit mobile number"
                maxLength="10"
              />
              <div className="form-icon">📱</div>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Sending Verification Code...
                </>
              ) : (
                'SEND VERIFICATION CODE'
              )}
            </button>
          </form>
          <div className="link">
            Don't have an account? <Link to="/register">Create Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;