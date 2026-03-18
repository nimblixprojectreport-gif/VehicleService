/**
 * Login.jsx
 * Route: /login
 * Matches AutoServe Login UI exactly.
 * Connects to: /forgot-password, /register, /dashboard
 */

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, saveTokens } from "../api/authApi";
import "./Login.css";

// ── Icon components ───────────────────────────────
const IconMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const IconLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IconGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
const IconApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

// ── Car image ─────────────────────────────────────
const CAR_IMAGE = "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&fit=crop";

export default function Login() {
  const navigate = useNavigate();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await loginUser(email, password);
      const data = await res.json();
      if (res.ok) {
        saveTokens(data.access, data.refresh);
        navigate("/dashboard");
      } else {
        setError(data.detail || "Invalid email or password.");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">

      {/* ── Navbar ─────────────────────────────── */}
      <nav className="login-nav">
        <div className="login-nav-logo">
          <div className="login-nav-icon"><IconCar /></div>
          <span className="login-nav-name">AutoServe</span>
        </div>
        <button className="login-dark-btn" aria-label="Toggle theme">
          <IconMoon />
        </button>
      </nav>

      {/* ── Page body ──────────────────────────── */}
      <main className="login-main">
        <div className="login-card">

          {/* Car image */}
          <div className="login-car-wrap">
            <img src={CAR_IMAGE} alt="AutoServe vehicle" className="login-car-img" />
          </div>

          {/* Heading */}
          <h1 className="login-heading">Welcome Back</h1>
          <p className="login-sub">
            Log in to manage your vehicle's performance and service history.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form" noValidate>

            {/* Email */}
            <div className="as-field-group">
              <label className="as-label">Email Address</label>
              <div className="as-input-wrap">
                <span className="as-input-icon"><IconMail /></span>
                <input
                  type="email"
                  className="as-input"
                  placeholder="driver@autoserve.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="as-field-group">
              <div className="as-label-row">
                <label className="as-label">Password</label>
                <Link to="/forgot-password" className="as-forgot-link">
                  Forgot password?
                </Link>
              </div>
              <div className="as-input-wrap">
                <span className="as-input-icon"><IconLock /></span>
                <input
                  type={showPw ? "text" : "password"}
                  className="as-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="as-eye-btn"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Toggle password"
                >
                  {showPw ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            {error && <p className="as-error">{error}</p>}

            <button type="submit" className="as-btn-primary" disabled={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="as-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          {/* Social buttons */}
          <div className="as-social-row">
            <button className="as-social-btn">
              <IconGoogle /> Google
            </button>
            <button className="as-social-btn">
              <IconApple /> Apple
            </button>
          </div>

          {/* Switch page */}
          <p className="login-switch">
            Don't have an account?{" "}
            <Link to="/register" className="as-link">Create an account</Link>
          </p>

        </div>
      </main>

      {/* ── Footer ─────────────────────────────── */}
      <footer className="login-footer">
        © 2024 AutoServe Vehicle Management. All rights reserved.
      </footer>

    </div>
  );
}
