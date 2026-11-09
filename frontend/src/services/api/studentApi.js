import apiClient from './apiClient';

export const studentApi = {
  async getStudents(search = '') {
    try {
      const res = await apiClient.get('/students/', { params: { search } });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch student directory');
    }
  },

  async getStudentById(id) {
    try {
      const res = await apiClient.get(`/students/${id}/`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Student record not found in database');
    }
  },

  async createStudent({ name }) {
    try {
      const res = await apiClient.post('/students/', { name });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.name?.[0] || err.response?.data?.error || err.message || 'Failed to create student');
    }
  },

  async updateStudent(id, { name }) {
    try {
      const res = await apiClient.patch(`/students/${id}/`, { name });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.name?.[0] || err.response?.data?.error || err.message || 'Failed to update student');
    }
  },

  async deleteStudent(id) {
    try {
      const res = await apiClient.delete(`/students/${id}/`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to delete student');
    }
  },

  async getDashboardStats() {
    try {
      const res = await apiClient.get('/dashboard/stats/');
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch administrative statistics');
    }
  }
};
