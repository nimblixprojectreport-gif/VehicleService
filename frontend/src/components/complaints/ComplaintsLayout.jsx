import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './ComplaintsLayout.css';

const ComplaintsLayout = () => {
  return (
    <div className="complaints-layout">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-brand">
          <h1>AutoCare SaaS</h1>
          <span className="brand-tagline">Premium Fleet Access</span>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/bookings">Bookings</Link>
          <Link to="/complaints" className="active">Complaints</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/settings">Settings</Link>
        </div>
        <div className="nav-profile">
          <span className="profile-name">John Doe</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="complaints-main">
        <div className="content-header">
          <h2>Complaints Management</h2>
          <p>Submit and track your service issues for rapid resolution.</p>
        </div>

        {/* Two Column Grid */}
        <div className="content-grid">
          {/* LEFT COLUMN */}
          <div className="left-column">
            {/* Submit New Complaint Form */}
            <div className="form-section">
              <h3>Submit New Complaint</h3>
              <Outlet />
            </div>

           {/* My Complaints History */}
<div className="table-section">
  <h3>My Complaints History</h3>
  <table className="complaints-table">
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
      <tr>
        <td>#CMP-8210</td>
        <td>Brake Service</td>
        <td>Aug 14, 2023</td>
        <td><span className="status-badge">Under Review</span></td>
        <td><button className="view-btn">View Details</button></td>
      </tr>
    </tbody>
  </table>
</div>

            {/* Common Questions */}
            <div className="faq-section">
              <h4>Common Questions</h4>
              <ul>
                <li>How long does review take?</li>
                <li>Can I edit my complaint?</li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="right-column">
            {/* Contact Support */}
            <div className="support-card">
              <h3>Contact Support</h3>
              <div className="support-item">
                <span className="support-icon">💬</span>
                <div>
                  <strong>Live Chat</strong>
                  <p>Average wait: 2 mins</p>
                </div>
              </div>
              <div className="support-item">
                <span className="support-icon">📧</span>
                <div>
                  <strong>Email Support</strong>
                  <p>Response within 24h</p>
                </div>
              </div>
              <div className="support-item">
                <span className="support-icon">📞</span>
                <div>
                  <strong>Premium Hotline</strong>
                  <p>Exclusive for members</p>
                </div>
              </div>
            </div>

            {/* Our Commitment */}
            <div className="commitment-card">
              <h3>Our Commitment</h3>
              <p>We resolve 98% of service complaints within 48 business hours. Your satisfaction is our top priority.</p>
              <div className="badges">
                <span className="badge">48h SLA TARGET</span>
                <span className="badge">24/7 AVAILABILITY</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComplaintsLayout;