import React from "react";

export default function Step1BasicInfo({ formData, update }) {
  return (
    <>
      <div className="vr-section-title">Vehicle Details</div>
      <div className="vr-section-sub">
        Please provide the identification details of your vehicle to
        proceed with the registration.
      </div>

      {/* Brand */}
      <div className="vr-field">
        <label className="vr-label">Brand</label>
        <div className="vr-input-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d4a6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
          <select value={formData.brand} onChange={(e) => update({ brand: e.target.value })}>
            <option value="">Select Brand</option>
            <option value="Tesla">Tesla</option>
            <option value="Toyota">Toyota</option>
            <option value="Honda">Honda</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes">Mercedes</option>
            <option value="Ford">Ford</option>
          </select>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2d4a6e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>

      {/* Model */}
      <div className="vr-field">
        <label className="vr-label">Model</label>
        <div className="vr-input-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d4a6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C8 2 4 5.5 4 10v3h16v-3c0-4.5-3.5-8-8-8z"/>
            <path d="M4 13h16v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2z"/>
          </svg>
          <input
            type="text"
            placeholder="e.g. Model 3 or Corolla"
            value={formData.model}
            onChange={(e) => update({ model: e.target.value })}
          />
        </div>
      </div>

      {/* Year + Plate */}
      <div className="vr-two-col">
        <div className="vr-field">
          <label className="vr-label">Year</label>
          <div className="vr-input-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d4a6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <input
              type="text"
              placeholder="2024"
              value={formData.year}
              onChange={(e) => update({ year: e.target.value })}
            />
          </div>
        </div>
        <div className="vr-field">
          <label className="vr-label">Plate Number</label>
          <div className="vr-input-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d4a6e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="10" rx="2"/>
              <line x1="7" y1="7" x2="7" y2="17"/>
              <line x1="17" y1="7" x2="17" y2="17"/>
            </svg>
            <input
              type="text"
              placeholder="ABC-1234"
              value={formData.plateNumber}
              onChange={(e) => update({ plateNumber: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Info box */}
      <div className="vr-info">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <p>
          The vehicle identification details can usually be found on your
          current registration document or the insurance policy.
        </p>
      </div>
    </>
  );
}
