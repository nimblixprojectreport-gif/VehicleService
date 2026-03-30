import React from "react";
import { User, Mail, Phone, MapPin, Info } from "lucide-react";

const Step2OwnerInfo = ({ formData, updateFormData, errors }) => {
  return (
    <div className="step-content">
      <h2 className="step-title">Owner Details</h2>
      <p className="sub-text">
        Tell us about yourself so we can link this vehicle to your account and contact you when needed.
      </p>

      {/* Full Name */}
      <div className="form-group">
        <label>Full Name</label>
        <div className={`input-icon ${errors.ownerName ? "error" : ""}`}>
          <User size={16} />
          <input
            type="text"
            placeholder="e.g. Rahul Sharma"
            value={formData.ownerName}
            onChange={(e) => updateFormData({ ownerName: e.target.value })}
          />
        </div>
        {errors.ownerName && <div className="error-msg">⚠ {errors.ownerName}</div>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label>Email Address</label>
        <div className={`input-icon ${errors.email ? "error" : ""}`}>
          <Mail size={16} />
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
        </div>
        {errors.email && <div className="error-msg">⚠ {errors.email}</div>}
      </div>

      {/* Phone */}
      <div className="form-group">
        <label>Phone Number</label>
        <div className="phone-input-row">
          <div className="country-code">
            <Phone size={13} />
            +91
          </div>
          <div className={`input-icon ${errors.phone ? "error" : ""}`}>
            <input
              type="tel"
              placeholder="98765 43210"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value.replace(/\D/g, "").slice(0, 10) })}
            />
          </div>
        </div>
        {errors.phone && <div className="error-msg">⚠ {errors.phone}</div>}
      </div>

      {/* Address */}
      <div className="form-group">
        <label>Address</label>
        <div className={`input-icon ${errors.address ? "error" : ""}`} style={{ height: "auto", padding: "12px 14px", alignItems: "flex-start" }}>
          <MapPin size={16} style={{ marginTop: "2px" }} />
          <textarea
            rows={2}
            placeholder="Street, City, State"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#e2e8f0",
              width: "100%",
              fontSize: "13.5px",
              fontFamily: "'Sora', sans-serif",
              resize: "none",
              lineHeight: "1.5",
            }}
          />
        </div>
        {errors.address && <div className="error-msg">⚠ {errors.address}</div>}
      </div>

      <div className="info-box">
        <Info size={15} />
        <p>Your contact information will only be used for service updates and registration confirmations.</p>
      </div>
    </div>
  );
};

export default Step2OwnerInfo;
