import apiClient from './apiClient';

export const attendanceApi = {
  async getAttendanceMatrix(search = '') {
    try {
      const res = await apiClient.get('/attendance/', { params: { search } });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch attendance matrix');
    }
  },

  async saveBulkAttendance(entries) {
    try {
      const res = await apiClient.post('/attendance/bulk-save/', { entries });
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to save attendance in database');
    }
  },

  async getStudentAttendance(studentId) {
    try {
      const res = await apiClient.get(`/attendance/${studentId}/`);
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Failed to fetch student attendance records');
    }
  }
};
