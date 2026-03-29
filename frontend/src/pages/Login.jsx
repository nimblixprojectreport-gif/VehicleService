import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import injectGlobalStyles from "../utils/injectGlobalStyles";
 
const API_BASE = "http://127.0.0.1:8000/api";
 
const PAGE_CSS = `
.login-root{min-height:100vh;background:#0d1117;font-family:'DM Sans',sans-serif;color:#e6edf3;display:flex;flex-direction:column;}
.login-nav{display:flex;align-items:center;justify-content:space-between;padding:0 32px;height:64px;border-bottom:1px solid rgba(255,255,255,0.06);background:#0d1117;position:sticky;top:0;z-index:10;}
.login-nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;}
.login-nav-icon{width:38px;height:38px;background:#3b82f6;border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(59,130,246,0.4);flex-shrink:0;}
.login-nav-name{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:#e6edf3;letter-spacing:-0.3px;}
.login-dark-btn{width:38px;height:38px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#8b949e;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background 0.2s,color 0.2s;}
.login-dark-btn:hover{background:rgba(255,255,255,0.1);color:#e6edf3;}
.login-main{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:40px 16px 32px;}
.login-card{width:100%;max-width:420px;animation:loginRise 0.4s cubic-bezier(0.22,1,0.36,1) both;}
@keyframes loginRise{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
.login-car-wrap{width:100%;height:200px;border-radius:16px;overflow:hidden;margin-bottom:28px;box-shadow:0 20px 60px rgba(0,0,0,0.5);}
.login-car-img{width:100%;height:100%;object-fit:cover;object-position:center 40%;transition:transform 0.6s ease;}
.login-car-wrap:hover .login-car-img{transform:scale(1.03);}
.login-heading{font-family:'Sora',sans-serif;font-size:36px;font-weight:800;color:#ffffff;line-height:1.1;letter-spacing:-0.8px;margin-bottom:10px;}
.login-sub{font-size:14.5px;color:#8b949e;line-height:1.6;margin-bottom:28px;}
.login-form{display:flex;flex-direction:column;gap:16px;}
.as-fg{display:flex;flex-direction:column;gap:7px;}
.as-lbl{font-size:13px;font-weight:500;color:#c9d1d9;letter-spacing:0.1px;}
.as-lbl-row{display:flex;align-items:center;justify-content:space-between;}
.as-forgot{font-size:13px;color:#3b82f6;text-decoration:none;font-weight:500;transition:color 0.2s;}
.as-forgot:hover{color:#60a5fa;}
.as-iw{position:relative;display:flex;align-items:center;}
.as-ic{position:absolute;left:14px;color:#6e7681;display:flex;align-items:center;pointer-events:none;}
.as-inp{width:100%;padding:13px 44px 13px 44px;background:#161b22;border:1.5px solid #30363d;border-radius:10px;color:#e6edf3;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color 0.2s,box-shadow 0.2s;box-sizing:border-box;}
.as-inp::placeholder{color:#484f58;}
.as-inp:focus{border-color:#3b82f6;background:#1c2333;box-shadow:0 0 0 3px rgba(59,130,246,0.15);}
.as-eye{position:absolute;right:14px;background:none;border:none;color:#6e7681;cursor:pointer;display:flex;align-items:center;padding:0;transition:color 0.2s;}
.as-eye:hover{color:#c9d1d9;}
.as-err{font-size:13px;color:#f87171;padding:10px 14px;background:rgba(248,113,113,0.08);border:1px solid rgba(248,113,113,0.2);border-radius:8px;}
.as-btn{width:100%;padding:14px;background:#3b82f6;border:none;border-radius:10px;color:#fff;font-size:15px;font-weight:600;font-family:'DM Sans',sans-serif;cursor:pointer;box-shadow:0 4px 20px rgba(59,130,246,0.35);transition:background 0.2s,box-shadow 0.2s,transform 0.1s;margin-top:4px;}
.as-btn:hover{background:#2563eb;box-shadow:0 6px 24px rgba(59,130,246,0.45);}
.as-btn:active{transform:scale(0.988);}
.as-btn:disabled{opacity:0.6;cursor:not-allowed;}
.as-divider{position:relative;text-align:center;margin:24px 0;}
.as-divider::before,.as-divider::after{content:"";position:absolute;top:50%;width:calc(50% - 70px);height:1px;background:#30363d;}
.as-divider::before{left:0;}.as-divider::after{right:0;}
.as-divider span{font-size:11.5px;font-weight:600;color:#484f58;letter-spacing:1px;text-transform:uppercase;}
.as-social-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:24px;}
.as-social-btn{display:flex;align-items:center;justify-content:center;gap:9px;padding:12px 16px;background:#161b22;border:1.5px solid #30363d;border-radius:10px;color:#c9d1d9;font-size:14px;font-weight:500;font-family:'DM Sans',sans-serif;cursor:pointer;transition:background 0.2s,border-color 0.2s;}
.as-social-btn:hover{background:#1c2333;border-color:#484f58;}
.login-switch{text-align:center;font-size:14px;color:#8b949e;}
.as-link{color:#3b82f6;text-decoration:none;font-weight:500;transition:color 0.2s;}
.as-link:hover{color:#60a5fa;}
.login-footer{text-align:center;padding:20px 16px;font-size:12px;color:#484f58;border-top:1px solid rgba(255,255,255,0.04);}
`;
 
function injectPageStyles() {
  if (document.getElementById("login-page-css")) return;
  const s = document.createElement("style");
  s.id = "login-page-css";
  s.textContent = PAGE_CSS;
  document.head.appendChild(s);
}
 
const CAR_IMAGE = "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80&fit=crop";
 
const IcCar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);
 
const IcMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
 
const IcMail = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
 
const IcLock = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
 
const IcEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
 
const IcEyeOff = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
 
const IcGoogle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);
 
const IcApple = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
 
export default function Login() {
  useEffect(() => {
    injectGlobalStyles();
    injectPageStyles();
  }, []);
 
  const navigate = useNavigate();
  const [email,   setEmail]   = useState("");
  const [pw,      setPw]      = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/login/`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password: pw }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token",   data.access);
        localStorage.setItem("access",  data.access);
        localStorage.setItem("refresh", data.refresh);
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
      <nav className="login-nav">
        <div className="login-nav-logo">
          <div className="login-nav-icon"><IcCar /></div>
          <span className="login-nav-name">AutoServe</span>
        </div>
        <button className="login-dark-btn" aria-label="Toggle theme" type="button">
          <IcMoon />
        </button>
      </nav>
 
      <main className="login-main">
        <div className="login-card">
          <div className="login-car-wrap">
            <img src={CAR_IMAGE} alt="AutoServe vehicle" className="login-car-img" />
          </div>
 
          <h1 className="login-heading">Welcome Back</h1>
          <p className="login-sub">
            Log in to manage your vehicle's performance and service history.
          </p>
 
          <form onSubmit={handleSubmit} className="login-form" noValidate>
            <div className="as-fg">
              <label className="as-lbl">Email Address</label>
              <div className="as-iw">
                <span className="as-ic"><IcMail /></span>
                <input
                  className="as-inp"
                  type="email"
                  placeholder="driver@autoserve.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
 
            <div className="as-fg">
              <div className="as-lbl-row">
                <label className="as-lbl">Password</label>
                <Link to="/forgot-password" className="as-forgot">Forgot password?</Link>
              </div>
              <div className="as-iw">
                <span className="as-ic"><IcLock /></span>
                <input
                  className="as-inp"
                  type={showPw ? "text" : "password"}
                  placeholder="........"
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="as-eye"
                  onClick={() => setShowPw(!showPw)}
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <IcEyeOff /> : <IcEye />}
                </button>
              </div>
            </div>
 
            {error && <p className="as-err">{error}</p>}
 
            <button type="submit" className="as-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
 
          <div className="as-divider"><span>OR CONTINUE WITH</span></div>
 
          <div className="as-social-row">
            <button className="as-social-btn" type="button"><IcGoogle /> Google</button>
            <button className="as-social-btn" type="button"><IcApple /> Apple</button>
          </div>
 
          <p className="login-switch">
            Don't have an account?{" "}
            <Link to="/register" className="as-link">Create an account</Link>
          </p>
        </div>
      </main>
 
      <footer className="login-footer">
        (c) 2024 AutoServe Vehicle Management. All rights reserved.
      </footer>
    </div>
  );
}
