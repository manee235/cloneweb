// Get device type
export const getDeviceType = () => {
  const userAgent = navigator.userAgent;
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase())) {
    return 'Mobile';
  }
  if (/tablet|ipad|playbook|silk|kindle/i.test(userAgent.toLowerCase())) {
    return 'Tablet';
  }
  return 'Desktop';
};

// Get browser info
export const getBrowserInfo = () => {
  const userAgent = navigator.userAgent;
  
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
  if (userAgent.indexOf('Safari') > -1) return 'Safari';
  if (userAgent.indexOf('Edge') > -1) return 'Edge';
  if (userAgent.indexOf('Opera') > -1) return 'Opera';
  if (userAgent.indexOf('Trident') > -1) return 'Internet Explorer';
  
  return 'Unknown';
};

// Get geolocation
export const getGeolocation = () => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          resolve(null);
        }
      );
    } else {
      resolve(null);
    }
  });
};

// Generate session ID
export const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// Get stored session ID or create new one
export const getOrCreateSessionId = () => {
  let sessionId = localStorage.getItem('promotionSessionId');
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem('promotionSessionId', sessionId);
  }
  return sessionId;
};

// Format date
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format time remaining
export const formatTimeRemaining = (seconds) => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  return { days, hours, minutes, secs };
};
