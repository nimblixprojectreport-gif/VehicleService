import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ComplaintForm.css';

const API_URL = 'http://localhost:8000/api';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    booking: '',
    complaint_type: 'quality',
    subject: '',
    description: '',
    against_user: ''
  });
  
  const [bookings, setBookings] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_URL}/bookings/?user=me`);
        setBookings(res.data);
      } catch (err) {
        console.error('Failed to fetch bookings', err);
      }
    };
    fetchBookings();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const complaintRes = await axios.post(`${API_URL}/complaints/`, formData);
      const complaintId = complaintRes.data.id;
      
      if (files.length > 0) {
        const fileData = new FormData();
        for (let file of files) {
          fileData.append('file', file);
          fileData.append('file_type', file.type.startsWith('image/') ? 'image' : 'document');
          await axios.post(`${API_URL}/complaints/${complaintId}/add_evidence/`, fileData);
        }
      }
      
      setSuccess(true);
      setFormData({
        booking: '',
        complaint_type: 'quality',
        subject: '',
        description: '',
        against_user: ''
      });
      setFiles([]);
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {success && (
        <div className="alert success">
          Complaint submitted successfully!
        </div>
      )}
      
      {error && (
        <div className="alert error">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Service/Booking *</label>
          <select
            name="booking"
            value={formData.booking}
            onChange={handleChange}
            required
          >
            <option value="">-- Select a booking --</option>
            {bookings.map(b => (
              <option key={b.id} value={b.id}>
                {b.service_name || 'Service'} - {b.date}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Issue Category *</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="complaint_type"
                value="quality"
                checked={formData.complaint_type === 'quality'}
                onChange={handleChange}
              />
              Quality
            </label>
            <label>
              <input
                type="radio"
                name="complaint_type"
                value="delay"
                checked={formData.complaint_type === 'delay'}
                onChange={handleChange}
              />
              Delay
            </label>
            <label>
              <input
                type="radio"
                name="complaint_type"
                value="overcharged"
                checked={formData.complaint_type === 'overcharged'}
                onChange={handleChange}
              />
              Overcharged
            </label>
            <label>
              <input
                type="radio"
                name="complaint_type"
                value="other"
                checked={formData.complaint_type === 'other'}
                onChange={handleChange}
              />
              Other
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Subject *</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief summary of the issue"
            required
            minLength={10}
          />
        </div>

        <div className="form-group">
          <label>Detailed Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please describe the issue you encountered in detail..."
            rows="5"
            required
            minLength={20}
          />
        </div>

        <div className="form-group">
          <label>Evidence & Attachments</label>
          <div className="file-upload-area">
            <input
              type="file"
              onChange={handleFileChange}
              multiple
              accept=".png,.jpg,.jpeg,.pdf"
            />
            <p className="file-hint">PNG, JPG or PDF (max. 1MB each)</p>
          </div>
          {files.length > 0 && (
            <div className="file-list">
              {Array.from(files).map((file, index) => (
                <div key={index} className="file-item">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>
    </>
  );
};

export default ComplaintForm;