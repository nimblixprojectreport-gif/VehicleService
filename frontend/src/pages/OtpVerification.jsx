import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThreeBackground from '../components/ThreeBackground';
import {
  verifyOtp,
  resendOtp,
  getOtpIdentifier,
  getOtpPhone,
  setResetToken,
  saveTokens,
} from '../api/authApi';
import '../styles/auth.css';

export default function OtpVerification() {
  const navigate = useNavigate();

  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(54);
  const [canResend, setCanResend] = useState(false);
  const timerRef = useRef(null);

  const identifier = getOtpIdentifier();
  const phone = getOtpPhone();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, []);

  const formatTime = (seconds) =>
    `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleDigitChange = (idx, val) => {
    const clean = val.replace(/\D/g, '').slice(0, 1);
    const next = [...digits];
    next[idx] = clean;
    setDigits(next);
    if (clean && idx < 3) inputRefs[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      const next = [...digits];
      next[idx - 1] = '';
      setDigits(next);
      inputRefs[idx - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    const next = ['', '', '', ''];
    pasted.split('').forEach((d, i) => {
      next[i] = d;
    });
    setDigits(next);
    inputRefs[Math.min(pasted.length, 3)].current?.focus();
  };

  const handleResend = async () => {
    if (!canResend) return;
    setCanResend(false);
    setRemaining(60);
    setSuccess('');
    setError('');

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    try {
      await resendOtp(identifier);
      setSuccess('A new code has been sent.');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Could not resend. Try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = digits.join('');
    setError('');
    setSuccess('');

    if (otp.length < 4) {
      setError('Please enter all 4 digits.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(otp, identifier);
      const data = await res.json();

      if (res.ok) {
        setSuccess('Verified! Redirecting...');
        if (data.reset_token) {
          setResetToken(data.reset_token);
          setTimeout(() => navigate('/reset-password'), 1000);
        } else {
          if (data.access) saveTokens(data.access, data.refresh);
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } else {
        setError(data.detail || data.message || 'Invalid or expired OTP.');
        setTimeout(() => setDigits(['', '', '', '']), 600);
        inputRefs[0].current?.focus();
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

      <div className="otp-page">
        <div className="otp-card">
          <div className="otp-card-inner">
            <button className="otp-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="otp-shield-wrap">
              <div className="otp-shield-outer">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2.5L4.5 5.8V11C4.5 15.3 7.8 19.3 12 21C16.2 19.3 19.5 15.3 19.5 11V5.8L12 2.5Z"
                    fill="rgba(251,191,36,0.18)"
                    stroke="#fbbf24"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                  />
                  <path d="M8.5 11.5L10.8 13.8L15.5 9" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="otp-shield-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="#1a1200" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            <h2 className="otp-title">OTP Verification</h2>
            <p className="otp-subtitle">
              Enter the 4-digit code sent to
              <br />
              <strong>{phone || identifier || '+1 (555) ··· ··90'}</strong>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="otp-row">
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={inputRefs[i]}
                    className={`otp-box${d ? ' filled' : ''}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                  />
                ))}
              </div>

              <div className="otp-resend-row">
                Didn&apos;t receive code?&nbsp;
                <span className={`otp-resend-link${canResend ? '' : ' disabled'}`} onClick={handleResend}>
                  Resend Code
                </span>
                <span className="otp-timer-pill">
                  <svg viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
                    <polyline points="12 7 12 12 15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                  {formatTime(remaining)}
                </span>
              </div>

              <button type="submit" className="otp-btn-verify" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify Account'}
                {!loading && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
            </form>

            {error && <p className="otp-msg otp-msg-err">{error}</p>}
            {success && <p className="otp-msg otp-msg-ok">{success}</p>}

            <div className="otp-support-row">
              {[
                {
                  label: 'Call Me',
                  icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.88 12.5 19.79 19.79 0 0 1 2 4H4a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L5.09 11.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
                },
                {
                  label: 'WhatsApp',
                  icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
                },
                {
                  label: 'Support',
                  icon: (
                    <>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="currentColor" />
                    </>
                  ),
                },
              ].map(({ label, icon }) => (
                <div key={label} className="otp-support-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    {icon}
                  </svg>
                  {label}
                </div>
              ))}
            </div>

            <div className="otp-dots-row">
              <div className="otp-dot active" />
              <div className="otp-dot inactive" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}