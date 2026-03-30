import React from 'react';

const Step3Documents = ({ onNext, onPrev }) => {
  return (
    <div className="step-card">
      <h2>Documents Upload</h2>
      <p className="step-description">Upload your vehicle documents.</p>
      
      <div className="form-group">
        <label>RC Document</label>
        <input type="file" className="form-input" accept=".pdf,.jpg,.png" />
      </div>

      <div className="form-group">
        <label>Insurance Document</label>
        <input type="file" className="form-input" accept=".pdf,.jpg,.png" />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPrev} className="btn-secondary">
          ← Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary">
          Continue →
        </button>
      </div>
    </div>
  );
};

export default Step3Documents;