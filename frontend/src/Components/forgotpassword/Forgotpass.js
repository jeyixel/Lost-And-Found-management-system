import React, { useState } from 'react';
import './forgotpassword.css'; // Import CSS file
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 for email entry, 2 for OTP verification
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call to verify OTP
    setTimeout(() => {
      setLoading(false);
      alert('Password reset link sent to your email!');
      // Reset form after successful submission
      setEmail('');
      setOtp('');
      setStep(1);
    }, 1500);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h2 className="forgot-password-title">Forgot Password</h2>
          <p className="forgot-password-subtitle">
            {step === 1 
              ? "Enter your email to receive a verification code" 
              : "Enter the verification code sent to your email"}
          </p>
        </div>

        {step === 1 ? (
          <form className="forgot-password-form" onSubmit={handleEmailSubmit}>
            <div className="form-group">
              <label htmlFor="email-address" className="visually-hidden">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="loading-spinner"></span>
                    Processing...
                  </span>
                ) : "Send Verification Code"}
              </button>
            </div>
          </form>
        ) : (
          <form className="forgot-password-form" onSubmit={handleOtpSubmit}>
            <div className="form-group">
              <label htmlFor="email-display" className="form-label">
                Email address
              </label>
              <div className="email-display">
                <span className="email-text">{email}</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="edit-button"
                >
                  Edit
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="otp" className="form-label">
                Verification Code
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                autoComplete="one-time-code"
                required
                className="form-input"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className="submit-button"
              >
                {loading ? (
                  <span className="loading-text">
                    <span className="loading-spinner"></span>
                    Verifying...
                  </span>
                ) : "Reset Password"}
              </button>
            </div>
          </form>
        )}

        <div className="login-link">
          {/* <a href="#" className="back-to-login">
            Return to login
          </a> */}

          <Link to="/login" className="back-to-login">Return to login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;