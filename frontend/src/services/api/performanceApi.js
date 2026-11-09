import apiClient from './apiClient';

export const performanceApi = {
  async getStudentPerformance(studentId) {
    try {
      const res = await apiClient.get(`/performance/${studentId}/`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch student performance');
    }
  },

  async getStudentTest(studentId, testId) {
    try {
      const res = await apiClient.get(`/performance/${studentId}/tests/${testId}/`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch test details');
    }
  },

  async createTest(studentId, data) {
    try {
      const res = await apiClient.post(`/performance/${studentId}/tests/`, data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to record test scores');
    }
  },

  async updateTest(studentId, testId, data) {
    try {
      const res = await apiClient.patch(`/performance/${studentId}/tests/${testId}/`, data);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to update test record');
    }
  }
};
