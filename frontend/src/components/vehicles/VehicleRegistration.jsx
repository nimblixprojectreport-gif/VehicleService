import React, { useState } from "react";
import "./VehicleRegistration.css";
import Step1BasicInfo from "./Step1BasicInfo";

const STEPS = [
  "Basic Vehicle Information",
  "Owner Details",
  "Documents & Insurance",
  "Review & Confirm",
];

export default function VehicleRegistration({ onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    plateNumber: "",
  });

  const update = (d) => setFormData((p) => ({ ...p, ...d }));
  const pct = Math.round((step / 4) * 100);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1BasicInfo formData={formData} update={update} />;
      default:
        return (
          <p style={{ color: "#3d5070", fontSize: 13 }}>
            Step {step} — coming soon
          </p>
        );
    }
  };

  return (
    <div className="vr-overlay">
      <div className="vr-glow">
        <div className="vr-card">

          {/* SCROLLABLE AREA */}
          <div className="vr-scroll">

            {/* Header */}
            <div className="vr-header">
              <div className="vr-header-left">
                <div className="vr-icon-box">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="1" y="3" width="15" height="13" rx="2"/>
                    <path d="M16 8h4l3 3v5h-7V8z"/>
                    <circle cx="5.5" cy="18.5" r="2.5"/>
                    <circle cx="18.5" cy="18.5" r="2.5"/>
                  </svg>
                </div>
                <span className="vr-title">Register Vehicle</span>
              </div>
              <button className="vr-close" onClick={onClose}>✕</button>
            </div>

            {/* Progress */}
            <div className="vr-progress">
              <div className="vr-progress-top">
                <span>Step {step} of 4</span>
                <span>{pct}% Complete</span>
              </div>
              <div className="vr-track">
                <div className="vr-fill" style={{ width: `${pct}%` }} />
              </div>
              <div className="vr-progress-label">{STEPS[step - 1]}</div>
            </div>

            {/* Step content */}
            {renderStep()}

            <div className="vr-spacer" style={{height:'150px'}} />
          </div>

          {/* FOOTER */}
          <div className="vr-footer">
            <button
              className="vr-btn-continue"
              onClick={() => setStep((s) => Math.min(s + 1, 4))}
            >
              Continue
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
            <button className="vr-btn-save">Save for later</button>
          </div>

        </div>
      </div>
    </div>
  );
}
