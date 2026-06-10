import React, { useState } from 'react';
import './LocationConsent.css';

const LocationConsent = ({ onAllow, onDeny }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAllow = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported');
        setError('Geolocation not supported on this device');
        setLoading(false);
        onAllow(null);
        return;
      }

      // Use watchPosition for better accuracy on mobile
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            altitude: position.coords.altitude,
            altitudeAccuracy: position.coords.altitudeAccuracy,
            heading: position.coords.heading,
            speed: position.coords.speed,
            timestamp: position.timestamp
          };
          
          console.log('📍 Location obtained:', coords);
          onAllow(coords);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          
          let errorMsg = 'Unable to get location';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMsg = 'Permission denied. Please enable location in browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMsg = 'Position unavailable. Please check GPS settings.';
              break;
            case error.TIMEOUT:
              errorMsg = 'Location request timeout. Please try again.';
              break;
            default:
              errorMsg = error.message;
          }
          
          setError(errorMsg);
          setLoading(false);
          onAllow(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (err) {
      console.error('Error requesting location:', err);
      setError('Error requesting location');
      setLoading(false);
      onAllow(null);
    }
  };

  return (
    <div className="location-consent">
      <div className="location-content">
        <div className="location-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-12.5c-1.93 0-3.5 1.57-3.5 3.5S10.07 14.5 12 14.5s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5z"/>
          </svg>
        </div>

        <h3>විශේෂිත වට්ටම්</h3>

        <p className="location-description">
          🎊 සුභ උත්සව සමයේ දැවැන්ත තෑගි සහ වට්ටම්! 🎊
        </p>

        <p className="location-note">
          ඔබට විශේෂිත වට්ටම්, තෑගි සහ අනෙකුත් වාසි රැසක් දිනා ගැනීමට අවස්ථාවක්!
        </p>

        {error && (
          <div className="location-error">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        <div className="location-benefits">
          <p><strong>✨ මෙම දීමනාවේ වාසි:</strong></p>
          <ul>
            <li>✓ විශේෂිත දේශීය වට්ටම් සහ දීමනා</li>
            <li>✓ වේගවත් ඩෙලිවරි ඇස්තමේන්තු</li>
            <li>✓ දේශීය ගෙවීම් විකල්පයන්</li>
            <li>✓ ඉවත නඩත්තු කරන්නෙකු සොයා ගැනීම</li>
          </ul>
        </div>

        <div className="location-actions">
          <button 
            className="btn-deny" 
            onClick={onDeny}
            disabled={loading}
          >
            පසුව
          </button>
          <button 
            className="btn-allow" 
            onClick={handleAllow}
            disabled={loading}
          >
            {loading ? 'ස්ථාන ලබා ගමින්...' : '🎁 දීමනාව ලබාගන්න'}
          </button>
        </div>

        <p className="location-legal">
          දීමනාව ලබාගන්න.
        </p>
      </div>
    </div>
  );
};

export default LocationConsent;
