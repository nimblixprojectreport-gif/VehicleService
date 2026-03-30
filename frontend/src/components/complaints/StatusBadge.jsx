import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusConfig = () => {
    switch(status?.toLowerCase()) {
      case 'pending':
        return { color: '#ff9800', text: 'Pending' };
      case 'under_review':
      case 'under review':
        return { color: '#2196f3', text: 'Under Review' };
      case 'resolved':
        return { color: '#4caf50', text: 'Resolved' };
      case 'rejected':
        return { color: '#f44336', text: 'Rejected' };
      default:
        return { color: '#9e9e9e', text: status || 'Unknown' };
    }
  };

  const config = getStatusConfig();

  return (
    <span 
      className="status-badge"
      style={{
        backgroundColor: config.color + '20',
        color: config.color,
        border: `1px solid ${config.color}`,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        display: 'inline-block'
      }}
    >
      {config.text}
    </span>
  );
};

export default StatusBadge;