const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Data collection service
export const dataService = {
  collectVisitorData: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/data/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error collecting data:', error);
      throw error;
    }
  },

  getIPInfo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data/ip-info`);
      return await response.json();
    } catch (error) {
      console.error('Error getting IP info:', error);
      throw error;
    }
  },
};

// Auth service
export const authService = {
  register: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error registering:', error);
      throw error;
    }
  },

  login: async (username, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
      }
      return data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('adminToken');
  },

  getToken: () => {
    return localStorage.getItem('adminToken');
  },
};

// Admin service
export const adminService = {
  getVisitorData: async (page = 1, limit = 20) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/visitor-data?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching visitor data:', error);
      throw error;
    }
  },

  getVisitorDetail: async (sessionId) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/visitor/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching visitor detail:', error);
      throw error;
    }
  },

  getAnalytics: async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  },

  getAuditLogs: async (page = 1, limit = 50) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/audit-logs?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      throw error;
    }
  },

  exportData: async () => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/export`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  },

  deleteVisitor: async (sessionId) => {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/admin/visitor/${sessionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting visitor:', error);
      throw error;
    }
  },
};
