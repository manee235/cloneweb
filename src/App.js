import React, { useState, useEffect } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    // Check if admin is already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
      // You could verify the token here, but for now we'll just allow them in
      const adminData = localStorage.getItem('adminData');
      if (adminData) {
        setAdmin(JSON.parse(adminData));
        setCurrentPage('dashboard');
      }
    }
  }, []);

  const handleLoginSuccess = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
    setCurrentPage('landing');
  };

  const handleAdminAccess = () => {
    setCurrentPage('login');
  };

  return (
    <div className="App">
      {currentPage === 'landing' && (
        <>
          <LandingPage />
          <div className="admin-access-footer">
            <button 
              className="admin-btn"
              onClick={handleAdminAccess}
              title="Admin Dashboard"
            >
              🔐 Admin
            </button>
          </div>
        </>
      )}

      {currentPage === 'login' && (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}

      {currentPage === 'dashboard' && admin && (
        <AdminDashboard admin={admin} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
