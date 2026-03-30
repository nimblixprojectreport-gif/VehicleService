import React from 'react';

const Step4Review = ({ formData, onPrev, onSubmit }) => {
  return (
    <div className="step-card">
      <h2>Review Your Information</h2>
      <p className="step-description">Please verify all details before submitting.</p>
      
      <div style={{ background: '#F8F9FA', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3 style={{ color: '#1A2B3C', marginBottom: '1rem' }}>Vehicle Details</h3>
        <p><strong>Brand:</strong> {formData.brand || 'Not provided'}</p>
        <p><strong>Model:</strong> {formData.model || 'Not provided'}</p>
        <p><strong>Year:</strong> {formData.year}</p>
        <p><strong>Plate Number:</strong> {formData.plateNumber || 'Not provided'}</p>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPrev} className="btn-secondary">
          ← Back
        </button>
        <button type="button" onClick={onSubmit} className="btn-primary">
          Submit Registration
        </button>
      </div>
    </div>
  );
};

export default Step4Review;