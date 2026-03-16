import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import {
  resetPassword,
  getResetToken,
  getOtpIdentifier,
  clearOtpSession,
} from '../api/authApi';
import '../styles/auth.css';

const EyeOpen = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const evalStrength = (val) => {
  const checks = {
    len: val.length >= 8,
    upper: /[A-Z]/.test(val),
    num: /[0-9]/.test(val),
    special: /[^A-Za-z0-9]/.test(val),
  };
  const score = Object.values(checks).filter(Boolean).length;
  const levels = [
    null,
    { pct: '20%', color: '#ef4444', text: 'Weak' },
    { pct: '40%', color: '#f97316', text: 'Fair' },
    { pct: '65%', color: '#eab308', text: 'Good' },
    { pct: '82%', color: '#3b82f6', text: 'Strong' },
    { pct: '100%', color: '#22c55e', text: 'Strong' },
  ];
  return { checks, score, level: val.length ? levels[score] : null };
};

export default function ResetPassword() {
  const navigate = useNavigate();

  const [newPw, setNewPw] = useState('');
  const [confPw, setConfPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { checks, level } = evalStrength(newPw);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPw !== confPw) {
      setError('Passwords do not match.');
      return;
    }
    if (newPw.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    const resetToken = getResetToken();
    const identifier = getOtpIdentifier();

    try {
      const res = await resetPassword(newPw, resetToken, identifier);
      const data = await res.json();

      if (res.ok) {
        setSuccess('Password updated! Redirecting to login...');
        clearOtpSession();
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.detail || data.message || 'Could not reset password.');
      }
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CheckItem = ({ pass, label }) => (
    <div className={`rp-chk${pass ? ' pass' : ''}`}>
      <div className="rp-chk-circle">
        {pass && (
          <svg viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label}
    </div>
  );

  return (
    <>
      <ThreeBackground />

      <div className="rp-page">
        <div className="rp-card">
          <div className="rp-topbar">
            <div className="rp-topbar-brand">
              <div className="rp-topbar-icon">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2.5L4.5 5.8V11C4.5 15.3 7.8 19.3 12 21C16.2 19.3 19.5 15.3 19.5 11V5.8L12 2.5Z"
                    fill="rgba(59,130,246,0.2)"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              Security
            </div>
            <Link to="/login" className="rp-close-btn">
              &#x2715;
            </Link>
          </div>

          <div className="rp-card-body">
            <h2 className="rp-title">Reset Password</h2>
            <p className="rp-subtitle">Protect your account with a strong, unique password.</p>

            <form onSubmit={handleSubmit}>
              <div className="rp-field">
                <label className="rp-field-label">New Password</label>
                <div className="rp-pw-wrap">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min. 8 characters"
                    required
                    autoComplete="new-password"
                    className="rp-input"
                  />
                  <button type="button" className="rp-eye-btn" onClick={() => setShowNew(!showNew)}>
                    {showNew ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <div className="rp-strength-section">
                <div className="rp-strength-header">
                  <span>Password Strength</span>
                  <span className="rp-strength-label" style={{ color: level?.color || 'rgba(255,255,255,0.48)' }}>
                    {level?.text || '–'}
                  </span>
                </div>
                <div className="rp-bar-track">
                  <div
                    className="rp-bar-fill"
                    style={{
                      width: level?.pct || '0%',
                      background: level?.color || '#3b82f6',
                    }}
                  />
                </div>
                <div className="rp-checklist">
                  <CheckItem pass={checks.len} label="8+ Characters" />
                  <CheckItem pass={checks.upper} label="Uppercase letter" />
                  <CheckItem pass={checks.num} label="One number" />
                  <CheckItem pass={checks.special} label="Special char" />
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-field-label">Confirm New Password</label>
                <div className="rp-pw-wrap">
                  <input
                    type={showConf ? 'text' : 'password'}
                    value={confPw}
                    onChange={(e) => setConfPw(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    autoComplete="new-password"
                    className="rp-input"
                  />
                  <button type="button" className="rp-eye-btn" onClick={() => setShowConf(!showConf)}>
                    {showConf ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
              </div>

              <button type="submit" className="rp-btn-update" disabled={loading}>
                {loading ? 'Updating...' : 'Update Password'}
                {!loading && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
            </form>

            {error && <p className="rp-msg rp-msg-err">{error}</p>}
            {success && <p className="rp-msg rp-msg-ok">{success}</p>}

            <p className="rp-trouble">
              Having trouble? <a href="#">Contact support</a>
            </p>
          </div>

          <div className="rp-card-footer">
            <span>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              Secure Encrypted Session
            </span>
          </div>
        </div>
      </div>
    </>
  );
}