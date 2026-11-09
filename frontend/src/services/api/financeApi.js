import apiClient from './apiClient';

export const financeApi = {
  async getFinanceOverview(search = '') {
    try {
      const res = await apiClient.get('/finance/', { params: { search } });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch academy finance overview');
    }
  },

  async getStudentFinance(studentId) {
    try {
      const res = await apiClient.get(`/finance/${studentId}/`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch student finance summary');
    }
  },

  async addPayment(studentId, amount) {
    try {
      const res = await apiClient.post(`/finance/${studentId}/payments/`, { amount });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to record payment in database');
    }
  },

  async updatePayment(studentId, paymentId, amount) {
    try {
      const res = await apiClient.patch(`/finance/${studentId}/payments/${paymentId}/`, { amount });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to update payment record');
    }
  }
};
