import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from './StatusBadge';
import './ComplaintList.css';

const API_URL = 'http://localhost:8000/api';

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(`${API_URL}/complaints/my_complaints/`);
      setComplaints(res.data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) return <div className="loading">Loading complaints...</div>;

  return (
    <div className="complaint-list">
      <h2>My Complaints History</h2>
      
      <table className="complaint-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>SERVICE</th>
            <th>DATE SUBMITTED</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length === 0 ? (
            <tr>
              <td colSpan="5" className="no-data">
                No complaints found
              </td>
            </tr>
          ) : (
            complaints.map(complaint => (
              <tr key={complaint.id}>
                <td className="complaint-id">{complaint.complaint_id}</td>
                <td>{complaint.booking?.service || 'General'}</td>
                <td>{formatDate(complaint.created_at)}</td>
                <td><StatusBadge status={complaint.status} /></td>
                <td>
                  <button className="view-btn">
                    View Details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintList;