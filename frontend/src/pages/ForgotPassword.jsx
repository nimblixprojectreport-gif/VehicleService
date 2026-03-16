import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import { forgotPassword, setOtpSession } from '../api/authApi';
import '../styles/auth.css';

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await forgotPassword(identifier);
      const data = await res.json();

      if (res.ok) {
        setOtpSession(identifier);
        setSuccess(data.message || 'OTP sent! Redirecting...');
        setTimeout(() => navigate('/otp-verification'), 1500);
      } else {
        setError(data.detail || data.message || 'Could not send reset link.');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ThreeBackground />

      <div className="fp-page">
        <nav className="as-topnav">
          <Link to="/" className="as-topnav-logo">
            <div className="as-topnav-icon">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2.5L4.5 6V11.5C4.5 15.65 7.7 19.56 12 21C16.3 19.56 19.5 15.65 19.5 11.5V6L12 2.5Z"
                  fill="rgba(59,130,246,0.2)"
                  stroke="#3b82f6"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="as-topnav-name">Identity Guard</span>
          </Link>
          <button className="as-topnav-helpbtn">?</button>
        </nav>

        <div className="fp-center">
          <div className="fp-card">
            <div className="fp-card-body">
              <div className="fp-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="8" cy="9" r="4" stroke="#3b82f6" strokeWidth="1.7" />
                  <path d="M8 13v6M6 17h4M6 15h4" stroke="#3b82f6" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </div>

              <h2 className="fp-title">Forgot Password?</h2>
              <p className="fp-desc">
                No worries, it happens. Enter the email or phone number associated
                with your account and we&apos;ll send a secure recovery link.
              </p>

              <form onSubmit={handleSubmit} autoComplete="off">
                <label className="fp-field-label">Email or Phone Number</label>
                <div className="fp-input-wrap">
                  <span className="fp-input-prefix">@</span>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. alex@company.com"
                    required
                    className="fp-input"
                  />
                </div>

                <button type="submit" className="fp-btn-send" disabled={loading}>
                  {loading ? 'Sending...' : 'Send Reset Link'}
                  {!loading && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  )}
                </button>
              </form>

              {error && <p className="fp-msg fp-msg-err">{error}</p>}
              {success && <p className="fp-msg fp-msg-ok">{success}</p>}

              <Link to="/login" className="fp-back-link">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Sign In
              </Link>

              <div className="fp-info-box">
                <div className="fp-info-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2.5L4.5 6V11.5C4.5 15.65 7.7 19.56 12 21C16.3 19.56 19.5 15.65 19.5 11.5V6L12 2.5Z"
                      fill="rgba(59,130,246,0.15)"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="fp-info-text">
                  <strong>Didn&apos;t get the code?</strong>
                  <p>Please check your spam folder or wait a few minutes before requesting a new link.</p>
                </div>
              </div>
            </div>

            <footer className="fp-card-footer">
              <a href="#">Privacy Policy</a>
              <span className="fp-dot">·</span>
              <a href="#">Terms of Service</a>
              <span>© 2024 Identity Guard Inc. All rights reserved.</span>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}