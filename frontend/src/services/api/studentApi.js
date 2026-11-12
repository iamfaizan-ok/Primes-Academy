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

  async generateStudentId() {
    try {
      const res = await apiClient.get('/students/generate-id/');
      return res.data?.student_id || Math.floor(1000 + Math.random() * 9000).toString();
    } catch {
      return Math.floor(1000 + Math.random() * 9000).toString();
    }
  },

  async createStudent(payload) {
    try {
      const res = await apiClient.post('/students/', payload);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.name?.[0] || 
                     err.response?.data?.error || 
                     err.response?.data?.student_id?.[0] || 
                     err.message || 
                     'Failed to create student';
      throw new Error(errMsg);
    }
  },

  async updateStudent(id, payload) {
    try {
      const res = await apiClient.patch(`/students/${id}/`, payload);
      return res.data;
    } catch (err) {
      const errMsg = err.response?.data?.name?.[0] || 
                     err.response?.data?.error || 
                     err.message || 
                     'Failed to update student';
      throw new Error(errMsg);
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
