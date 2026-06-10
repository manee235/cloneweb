import React, { useState, useEffect } from 'react';
import { adminService, authService } from '../services/api';
import { formatDate } from '../utils/helpers';
import './AdminDashboard.css';

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [visitorData, setVisitorData] = useState(null);
  const [auditLogs, setAuditLogs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedVisitor, setExpandedVisitor] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [activeTab, currentPage]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'overview') {
        const analytics = await adminService.getAnalytics();
        setAnalytics(analytics);
      } else if (activeTab === 'visitors') {
        const data = await adminService.getVisitorData(currentPage, 20);
        setVisitorData(data);
      } else if (activeTab === 'logs') {
        const logs = await adminService.getAuditLogs(currentPage, 50);
        setAuditLogs(logs);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await adminService.exportData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `campaign-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
  };

  const handleDeleteVisitor = async (sessionId) => {
    if (window.confirm('Are you sure you want to delete this visitor data?')) {
      try {
        await adminService.deleteVisitor(sessionId);
        alert('Visitor data deleted');
        loadDashboardData();
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete visitor data');
      }
    }
  };

  const handleLogout = () => {
    authService.logout();
    onLogout();
  };

  const filteredVisitors = visitorData?.data?.filter(visitor =>
    visitor.session_id.includes(searchTerm) ||
    visitor.ip_address?.includes(searchTerm)
  );

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <h1>📊 Campaign Admin Dashboard</h1>
          <p>Welcome, <strong>{admin?.username}</strong></p>
        </div>
        <div className="header-right">
          <button className="btn-export" onClick={handleExportData}>
            📥 Export Data
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="admin-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('overview');
            setCurrentPage(1);
          }}
        >
          📈 Overview
        </button>
        <button
          className={`tab ${activeTab === 'visitors' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('visitors');
            setCurrentPage(1);
          }}
        >
          👥 Visitor Data
        </button>
        <button
          className={`tab ${activeTab === 'logs' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('logs');
            setCurrentPage(1);
          }}
        >
          📝 Audit Logs
        </button>
      </div>

      {/* Content */}
      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
              <div className="overview-section">
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">👥</div>
                    <div className="stat-info">
                      <h3>Total Visitors</h3>
                      <p className="stat-value">{analytics.totalVisitors}</p>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                      <h3>Privacy Accepted</h3>
                      <p className="stat-value">{analytics.privacyAccepted}</p>
                      <span className="stat-percentage">
                        {((analytics.privacyAccepted / analytics.totalVisitors) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon">📍</div>
                    <div className="stat-info">
                      <h3>Location Granted</h3>
                      <p className="stat-value">{analytics.locationGranted}</p>
                      <span className="stat-percentage">
                        {((analytics.locationGranted / analytics.totalVisitors) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Device Breakdown */}
                <div className="breakdown-section">
                  <h3>Device Breakdown</h3>
                  <div className="breakdown-list">
                    {analytics.deviceBreakdown.map((device, idx) => (
                      <div key={idx} className="breakdown-item">
                        <span>{device.device_type}</span>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${(device.count / analytics.totalVisitors) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="count">{device.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browser Breakdown */}
                <div className="breakdown-section">
                  <h3>Browser Breakdown</h3>
                  <div className="breakdown-list">
                    {analytics.browserBreakdown.map((browser, idx) => (
                      <div key={idx} className="breakdown-item">
                        <span>{browser.browser}</span>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${(browser.count / analytics.totalVisitors) * 100}%`
                            }}
                          ></div>
                        </div>
                        <span className="count">{browser.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Visitors Tab */}
            {activeTab === 'visitors' && visitorData && (
              <div className="visitors-section">
                <div className="section-header">
                  <h3>Visitor Information</h3>
                  <input
                    type="text"
                    placeholder="Search by Session ID or IP..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="visitors-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Session ID</th>
                        <th>IP Address</th>
                        <th>Device</th>
                        <th>Browser</th>
                        <th>Privacy</th>
                        <th>Location</th>
                        <th>Timestamp</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisitors?.map((visitor) => (
                        <tr key={visitor.id}>
                          <td className="session-id">{visitor.session_id.substring(0, 12)}...</td>
                          <td>{visitor.ip_address}</td>
                          <td>{visitor.device_type}</td>
                          <td>{visitor.browser}</td>
                          <td>{visitor.privacy_accepted ? '✅' : '❌'}</td>
                          <td>{visitor.location_granted ? '✅' : '❌'}</td>
                          <td>{formatDate(visitor.timestamp)}</td>
                          <td>
                            <button
                              className="btn-view"
                              onClick={() => setExpandedVisitor(expandedVisitor === visitor.id ? null : visitor.id)}
                            >
                              {expandedVisitor === visitor.id ? 'Hide' : 'View'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Expanded Visitor Detail */}
                {expandedVisitor && (
                  <div className="visitor-detail">
                    {visitorData.data.map(v =>
                      v.id === expandedVisitor ? (
                        <div key={v.id} className="detail-card">
                          <div className="detail-header">
                            <h4>Visitor Details - {v.session_id}</h4>
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteVisitor(v.session_id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                          <div className="detail-grid">
                            <div className="detail-item">
                              <label>IP Address:</label>
                              <value>{v.ip_address}</value>
                            </div>
                            <div className="detail-item">
                              <label>Device Type:</label>
                              <value>{v.device_type}</value>
                            </div>
                            <div className="detail-item">
                              <label>Browser:</label>
                              <value>{v.browser}</value>
                            </div>
                            <div className="detail-item">
                              <label>User Agent:</label>
                              <value className="user-agent">{v.user_agent}</value>
                            </div>
                            {v.latitude && (
                              <>
                                <div className="detail-item">
                                  <label>Latitude:</label>
                                  <value>{v.latitude.toFixed(4)}</value>
                                </div>
                                <div className="detail-item">
                                  <label>Longitude:</label>
                                  <value>{v.longitude.toFixed(4)}</value>
                                </div>
                              </>
                            )}
                            <div className="detail-item">
                              <label>Privacy Accepted:</label>
                              <value>{v.privacy_accepted ? '✅ Yes' : '❌ No'}</value>
                            </div>
                            <div className="detail-item">
                              <label>Location Granted:</label>
                              <value>{v.location_granted ? '✅ Yes' : '❌ No'}</value>
                            </div>
                            {v.latitude && (
                              <>
                                <div className="detail-item">
                                  <label>📍 Latitude:</label>
                                  <value>{v.latitude.toFixed(6)}</value>
                                </div>
                                <div className="detail-item">
                                  <label>📍 Longitude:</label>
                                  <value>{v.longitude.toFixed(6)}</value>
                                </div>
                                {v.location_accuracy && (
                                  <div className="detail-item">
                                    <label>📍 Accuracy:</label>
                                    <value>{v.location_accuracy.toFixed(2)}m</value>
                                  </div>
                                )}
                              </>
                            )}
                            <div className="detail-item">
                              <label>🖥️ Screen Resolution:</label>
                              <value>{v.screen_resolution}</value>
                            </div>
                            {v.screen_color_depth && (
                              <div className="detail-item">
                                <label>Color Depth:</label>
                                <value>{v.screen_color_depth} bits</value>
                              </div>
                            )}
                            {v.timezone && (
                              <div className="detail-item">
                                <label>🕐 Timezone:</label>
                                <value>{v.timezone}</value>
                              </div>
                            )}
                            {v.language && (
                              <div className="detail-item">
                                <label>🗣️ Language:</label>
                                <value>{v.language}</value>
                              </div>
                            )}
                            {v.hardware_concurrency && (
                              <div className="detail-item">
                                <label>CPU Cores:</label>
                                <value>{v.hardware_concurrency}</value>
                              </div>
                            )}
                            {v.device_memory && (
                              <div className="detail-item">
                                <label>Memory:</label>
                                <value>{v.device_memory} GB</value>
                              </div>
                            )}
                            <div className="detail-item">
                              <label>🍪 Cookies:</label>
                              <value>{v.cookies_enabled ? '✅ Enabled' : '❌ Disabled'}</value>
                            </div>
                            <div className="detail-item">
                              <label>Visit Time:</label>
                              <value>{formatDate(v.timestamp)}</value>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                )}

                {/* Pagination */}
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <span>Page {currentPage} of {visitorData.pagination.pages}</span>
                  <button
                    onClick={() => setCurrentPage(Math.min(visitorData.pagination.pages, currentPage + 1))}
                    disabled={currentPage === visitorData.pagination.pages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}

            {/* Audit Logs Tab */}
            {activeTab === 'logs' && auditLogs && (
              <div className="logs-section">
                <h3>Audit Logs</h3>
                <div className="logs-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Admin</th>
                        <th>Action</th>
                        <th>Resource</th>
                        <th>Details</th>
                        <th>IP Address</th>
                        <th>Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.logs.map((log) => (
                        <tr key={log.id}>
                          <td>{log.username || 'System'}</td>
                          <td className={`action-${log.action.toLowerCase()}`}>{log.action}</td>
                          <td>{log.resource}</td>
                          <td className="details-cell">{log.details}</td>
                          <td>{log.ip_address}</td>
                          <td>{formatDate(log.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </button>
                  <span>Page {currentPage} of {auditLogs.pagination.pages}</span>
                  <button
                    onClick={() => setCurrentPage(Math.min(auditLogs.pagination.pages, currentPage + 1))}
                    disabled={currentPage === auditLogs.pagination.pages}
                  >
                    Next →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
