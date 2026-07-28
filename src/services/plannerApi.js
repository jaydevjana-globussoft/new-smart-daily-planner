import axios from 'axios';

// Mock Axios client configured for backend ready API structure
const api = axios.create({
  baseURL: '/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const plannerApi = {
  getTasks: async (dateStr) => {
    // Simulated backend async response
    await new Promise((res) => setTimeout(res, 200));
    return { status: 'success', date: dateStr };
  },

  createTask: async (taskPayload) => {
    await new Promise((res) => setTimeout(res, 300));
    return { status: 'success', data: { id: `t_${Date.now()}`, ...taskPayload } };
  },

  toggleTaskStatus: async (taskId, completed) => {
    await new Promise((res) => setTimeout(res, 150));
    return { status: 'success', id: taskId, completed };
  },

  getAnalyticsSummary: async (range = '7d') => {
    await new Promise((res) => setTimeout(res, 250));
    return {
      status: 'success',
      completionRate: 84,
      totalFocusHours: 28.5,
      habitStreak: 12,
      timeDistribution: [
        { name: 'Work', hours: 18.5, fill: '#6366f1' },
        { name: 'Health', hours: 7.0, fill: '#10b981' },
        { name: 'Personal', hours: 5.5, fill: '#ec4899' },
        { name: 'Study', hours: 6.0, fill: '#3b82f6' },
        { name: 'Household', hours: 4.0, fill: '#f59e0b' }
      ]
    };
  }
};

export default api;
