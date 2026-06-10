import React, { useState } from 'react';
import './PrivacyNotice.css';

const PrivacyNotice = ({ onAccept, onDecline }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="privacy-notice">
      <div className="privacy-content">
        <h3>🎉 100% නොමිලේ දීමනාවක්! 🎉</h3>
        
        <div className={`privacy-details ${expanded ? 'expanded' : ''}`}>
          <p>
            <strong>What Information We Collect:</strong>
          </p>
          <ul>
            <li>Your IP address (for regional analytics)</li>
            <li>Device type and browser information (to optimize your experience)</li>
            
            <li>Visit timestamp and user activity</li>
          </ul>

          <p>
            <strong>How We Use This Information:</strong>
          </p>
          <ul>
            <li>To understand visitor behavior and improve the campaign</li>
            <li>To provide personalized experiences based on your location (if permitted)</li>
            <li>To maintain security and prevent fraud</li>
            <li>To comply with legal requirements</li>
          </ul>

          <p>
            <strong>Your Privacy Rights:</strong>
          </p>
          <ul>
            <li>You can withdraw consent at any time</li>
            <li>You can request deletion of your data</li>
            <li>You can opt-out of location tracking</li>
            <li>We will not sell your data to third parties</li>
          </ul>

          <p>
            <strong>Data Security:</strong>
          </p>
          <p>
            Your data is encrypted and stored securely. We maintain audit logs of all data access 
            and implement strict access controls to protect your information.
          </p>

          <p>
            <strong>Contact & Support:</strong>
          </p>
          <p>
            For privacy concerns or to exercise your rights, contact: privacy@promotion.local
          </p>
        </div>

        <button 
          className="expand-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : 'Read Full Privacy Policy'}
        </button>

        <div className="privacy-actions">
          <button className="btn-decline" onClick={onAccept}>
            Decline
          </button>
          <button className="btn-accept" onClick={onAccept}>
            ඉදිරියට යන්න
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyNotice;
