import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp, sendOtp } from '../services/api';

const OTPVerification = ({ setIsAuthenticated }) => {
  const [otp, setOtp] = useState(['', '', '', '']); // Changed to 4 digits
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const location = useLocation();
  const navigate = useNavigate();

  const phoneNumber = location.state?.phoneNumber;

  useEffect(() => {
    if (!phoneNumber) {
      navigate('/login');
    }
  }, [phoneNumber, navigate]);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (resendDisabled && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
  }, [resendDisabled, countdown]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input
    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const otpValue = otp.join('');
    if (otpValue.length !== 4) { // Changed to 4 digits
      setError('Please enter the complete 4-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtp(phoneNumber, otpValue);

      if (response.data.status === 'success') {
        // Store authentication token and phone number
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('phoneNumber', phoneNumber);
        setIsAuthenticated(true);
        navigate('/');
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Verification failed. Please try again.');
      } else {
        setError('Verification failed. Please try again.');
      }
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setResendDisabled(true);
    setCountdown(30);

    try {
      const response = await sendOtp(phoneNumber);
      if (response.data.status === 'success') {
        alert('OTP has been resent to your phone');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
      console.error('Resend OTP error:', err);
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
          <h2 className="form-title">Verify Your Account</h2>
          <p className="otp-message">
            We've sent a 4-digit verification code to your phone<br />
            ending with <strong>{phoneNumber?.slice(-4)}</strong>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="otp-container">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    className="otp-input"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength="1"
                  />
                ))}
              </div>
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading-spinner"></span>
                  Verifying...
                </>
              ) : (
                'VERIFY OTP'
              )}
            </button>
          </form>
          <div className="resend-otp">
            {resendDisabled ? (
              <p>Resend OTP in {countdown} seconds</p>
            ) : (
              <button
                type="button"
                className="resend-btn"
                onClick={handleResendOtp}
              >
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;