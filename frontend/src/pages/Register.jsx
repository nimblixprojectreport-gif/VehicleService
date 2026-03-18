import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api/authApi';
import './Register.css';

const IconCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&fit=crop';

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agree) {
      setError('Please accept terms and privacy policy.');
      return;
    }

    try {
      setLoading(true);
      const res = await registerUser(name, email, phone, password);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || data.message || 'Registration failed');
        return;
      }

      navigate('/login');
    } catch {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reg-root">
      <nav className="reg-nav">
        <div className="reg-nav-logo">
          <div className="reg-nav-icon">
            <IconCar />
          </div>
          <span className="reg-nav-name">AutoServe</span>
        </div>

        <div className="reg-nav-right">
          <span className="reg-nav-text">Already registered?</span>
          <Link to="/login" className="reg-nav-login-btn">
            Sign In
          </Link>
        </div>
      </nav>

      <main className="reg-main">
        <div className="reg-card">
          <div className="reg-hero-wrap">
            <img src={HERO_IMAGE} alt="AutoServe" className="reg-hero-img" />
            <div className="reg-hero-overlay">
              <span className="reg-hero-badge">AutoServe</span>
              <h3 className="reg-hero-tagline">Professional Vehicle Care</h3>
            </div>
          </div>

          <h1 className="reg-heading">Get Started</h1>
          <p className="reg-sub">
            Create your account to manage maintenance and book services.
          </p>

          <form onSubmit={handleSubmit} className="reg-form" noValidate>
            <div className="as-field-group">
              <label className="as-label">Full Name</label>
              <div className="as-input-wrap">
                <input
                  type="text"
                  className="as-input"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="as-field-group">
              <label className="as-label">Email</label>
              <div className="as-input-wrap">
                <input
                  type="email"
                  className="as-input"
                  placeholder="driver@autoserve.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="as-field-group">
              <label className="as-label">Phone</label>
              <div className="as-input-wrap">
                <input
                  type="tel"
                  className="as-input"
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="as-field-group">
              <label className="as-label">Password</label>
              <div className="as-input-wrap">
                <input
                  type="password"
                  className="as-input"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </div>
            </div>

            {error ? <p className="as-error">{error}</p> : null}

            <label className="reg-checkbox-row">
              <input
                type="checkbox"
                className="reg-checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span className="reg-checkbox-text">
                I agree to the <a className="as-link" href="#">terms</a> and{' '}
                <a className="as-link" href="#">privacy policy</a>.
              </span>
            </label>

            <button type="submit" className="as-btn-primary" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="login-switch">
            Already have an account?{' '}
            <Link to="/login" className="as-link">
              Sign in
            </Link>
          </p>
        </div>
      </main>

      <footer className="reg-footer">
        <span>© 2026 AutoServe. All rights reserved.</span>
        <div className="reg-footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </div>
  );
}
