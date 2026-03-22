/**
 * ServiceOptions.jsx
 * Route: /booking/service-options
 *
 * Fully self-contained — no external API imports.
 * All API calls are written inline.
 *
 * SRS Coverage:
 *   FR-07  Create Booking — vehicle, service, date/time, location
 *   FR-10  Auto Assignment — partner notified after booking confirmed
 *   FR-11  Payment — cost shown before confirm
 */
 
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ServiceOptions.css";
 
// ── Config ────────────────────────────────────────────────────
const API_BASE = "http://127.0.0.1:8000/api/v1";
const PICKUP_FEE = 15;
 
// ── Saved addresses (replace with real /vehicles/ API call) ──
const SAVED_ADDRESSES = [
  { id: 1, label: "Home", full: "123 Maple Street, San Francisco, CA 94105" },
  { id: 2, label: "Work", full: "450 Market St, San Francisco, CA 94111" },
  { id: 3, label: "Other", full: "Enter a custom address" },
];
 
// ── Inline API call ───────────────────────────────────────────
async function postBooking(payload) {
  const token = localStorage.getItem("token") || "";
  return fetch(`${API_BASE}/bookings/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}
 
// ── Session slot helpers ──────────────────────────────────────
function getSlot() {
  try {
    const raw = sessionStorage.getItem("booking_slot");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
function clearSlot() {
  sessionStorage.removeItem("booking_slot");
}
 
// ── Street-grid SVG map (no API key needed) ───────────────────
function MapGrid() {
  const hLines = Array.from({ length: 11 }, (_, i) => (
    <line key={`h${i}`} x1="0" y1={i * 14} x2="300" y2={i * 14} />
  ));
  const vLines = Array.from({ length: 11 }, (_, i) => (
    <line key={`v${i}`} x1={i * 30} y1="0" x2={i * 30} y2="140" />
  ));
 
  return (
    <div className="so-map-wrap">
      <svg
        className="so-map-svg"
        viewBox="0 0 300 140"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="300" height="140" fill="#0d1117" />
        <g stroke="#1e2d3d" strokeWidth="0.7">
          {hLines}
          {vLines}
        </g>
        {/* highlighted block */}
        <rect x="60" y="42" width="60" height="28"
          fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="0.8" />
        {/* pulse rings */}
        <circle cx="90" cy="56" r="10" fill="rgba(59,130,246,0.12)" />
        <circle cx="90" cy="56" r="6"  fill="rgba(59,130,246,0.2)" />
        {/* pin */}
        <circle cx="90" cy="56" r="3.5" fill="#3b82f6" />
      </svg>
      <div className="so-map-label">
        <span className="so-map-dot" />
        Home — 123 Maple Street
      </div>
    </div>
  );
}
 
// ═══════════════════════════════════════════════════════════════
export default function ServiceOptions() {
  const navigate = useNavigate();
 
  const [mode,        setMode]        = useState("pickup"); // "dropoff" | "pickup"
  const [addressId,   setAddressId]   = useState(1);
  const [dropOpen,    setDropOpen]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
 
  const selectedAddr = SAVED_ADDRESSES.find((a) => a.id === addressId);
  const totalCost    = mode === "pickup" ? PICKUP_FEE : 0;
  const slot         = getSlot();
 
  // ── confirm booking ────────────────────────────────────────
  const handleConfirm = async () => {
    setError("");
    setLoading(true);
 
    // Build payload — FR-07
    const payload = {
      vehicle_id:        slot?.vehicle_id  || null,
      service_id:        slot?.service_id  || null,
      scheduled_date:    slot?.scheduled_date  || null,
      scheduled_time:    slot?.scheduled_time  || null,
      service_latitude:  37.7749,
      service_longitude: -122.4194,
      pickup_mode:       mode,
    };
 
    try {
      const res  = await postBooking(payload);
      const data = await res.json();
 
      if (res.ok) {
        clearSlot();
        navigate("/booking/confirmation", { state: { booking: data } });
      } else {
        setError(data.detail || data.message || "Could not place booking. Please try again.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };
 
  // ── render ─────────────────────────────────────────────────
  return (
    <div className="so-overlay">
      <div className="so-modal">
 
        {/* ── Header ── */}
        <div className="so-header">
          <div className="so-header-left">
            <span className="so-header-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="1"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5"  cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </span>
            <span className="so-header-title">Service Options</span>
          </div>
          <button className="so-bell-btn" aria-label="Notifications">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
        </div>
 
        {/* ── Scrollable body ── */}
        <div className="so-body">
          <h1 className="so-heading">How would you like to proceed?</h1>
          <p className="so-subheading">
            Choose a convenient method for your repair or maintenance service.
          </p>
 
          {/* ── Option cards ── */}
          <div className="so-cards-row">
 
            {/* Card — Drop Off */}
            <div
              className={`so-card${mode === "dropoff" ? " so-card--active" : ""}`}
              onClick={() => setMode("dropoff")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setMode("dropoff")}
              aria-pressed={mode === "dropoff"}
            >
              {/* top row */}
              <div className="so-card-top">
                <span className="so-badge-free">Free</span>
                <span className={`so-card-icon-btn${mode === "dropoff" ? " active" : ""}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                </span>
              </div>
              <p className="so-card-title">I will drop off</p>
              <p className="so-card-desc">
                Bring your item to our nearest authorized service center
              </p>
              {/* placeholder image */}
              <div className="so-card-img so-card-img--dropoff">
                <div className="so-dropoff-art">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(59,130,246,0.35)" strokeWidth="1.2" strokeLinecap="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                </div>
              </div>
            </div>
 
            {/* Card — Pickup & Drop */}
            <div
              className={`so-card${mode === "pickup" ? " so-card--active" : ""}`}
              onClick={() => setMode("pickup")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setMode("pickup")}
              aria-pressed={mode === "pickup"}
            >
              <div className="so-card-top">
                <p className="so-card-title" style={{ marginBottom: 0 }}>
                  Pickup &amp; Drop Service
                </p>
                <span className={`so-card-icon-btn${mode === "pickup" ? " active" : ""}`}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="1"/>
                    <path d="M16 8h4l3 3v5h-7V8z"/>
                    <circle cx="5.5"  cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </span>
              </div>
              <p className="so-card-desc">
                We collect and return directly to your doorstep
              </p>
              <div className="so-card-img so-card-img--pickup">
                <img
                  src="https://images.unsplash.com/photo-1504215680853-026ed2a45def?w=400&q=75&fit=crop"
                  alt="Pickup & drop van"
                  loading="lazy"
                />
              </div>
            </div>
 
          </div>
 
          {/* ── Pickup Details — shows only when pickup selected ── */}
          {mode === "pickup" && (
            <div className="so-pickup-section">
 
              {/* Section label */}
              <div className="so-section-label">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="10" r="3"/>
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/>
                </svg>
                Pickup Details
              </div>
 
              <p className="so-field-label">Select Collection Address</p>
 
              {/* Dropdown */}
              <div className="so-drop-wrap">
                <button
                  type="button"
                  className="so-drop-btn"
                  onClick={() => setDropOpen((o) => !o)}
                >
                  <span>
                    {selectedAddr.label} — {selectedAddr.full}
                  </span>
                  <svg
                    className={`so-chevron${dropOpen ? " open" : ""}`}
                    width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
 
                {dropOpen && (
                  <div className="so-drop-menu">
                    {SAVED_ADDRESSES.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        className={`so-drop-item${addr.id === addressId ? " sel" : ""}`}
                        onClick={() => { setAddressId(addr.id); setDropOpen(false); }}
                      >
                        <span className="so-drop-dot" />
                        <span>
                          <strong>{addr.label}</strong>&ensp;{addr.full}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
 
              {/* Map */}
              <MapGrid />
 
              {/* Info box */}
              <div className="so-info-box">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, marginTop: 2 }}>
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <circle cx="12" cy="16" r="0.6" fill="#3b82f6" stroke="#3b82f6"/>
                </svg>
                <div>
                  <p className="so-info-title">Estimated Time Buffer</p>
                  <p className="so-info-desc">
                    Pickup will have an approximately{" "}
                    <span className="so-info-hi">15 minutes</span> buffer to account
                    for traffic and route optimization. Our driver will call you
                    10 minutes before arrival.
                  </p>
                </div>
              </div>
 
            </div>
          )}
 
          {error && <p className="so-error">{error}</p>}
        </div>
 
        {/* ── Footer ── */}
        <div className="so-footer">
          <div className="so-cost-wrap">
            <span className="so-cost-label">TOTAL ADDITIONAL COST</span>
            <span className="so-cost-value">
              {totalCost === 0 ? "No extra charge" : `$${totalCost.toFixed(2)}`}
            </span>
          </div>
          <button
            type="button"
            className="so-btn-confirm"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading
              ? "Confirming…"
              : mode === "pickup"
              ? "Confirm Pickup"
              : "Confirm Drop Off"}
          </button>
        </div>
 
      </div>
    </div>
  );
}
 