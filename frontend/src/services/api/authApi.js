import apiClient from './apiClient';

export const authApi = {
  async adminLogin(email, password) {
    try {
      const res = await apiClient.post('/auth/admin/login/', { email, password });
      if (res.data.token) {
        localStorage.setItem('primes_auth_token', res.data.token);
        localStorage.setItem('primes_user_role', 'admin');
        localStorage.setItem('primes_user_data', JSON.stringify(res.data.user || { email, role: 'admin' }));
      }
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Administrator authentication failed');
    }
  },

  async studentLogin(name, student_id) {
    try {
      const res = await apiClient.post('/auth/student/login/', { name, student_id });
      if (res.data.token) {
        localStorage.setItem('primes_auth_token', res.data.token);
        localStorage.setItem('primes_user_role', 'student');
        localStorage.setItem('primes_user_data', JSON.stringify(res.data.student));
      }
      return res.data;
    } catch (err) {
      throw new Error(err.response?.data?.error || err.message || 'Student authentication failed');
    }
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout/');
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('primes_auth_token');
      localStorage.removeItem('primes_user_role');
      localStorage.removeItem('primes_user_data');
    }
  },

  getCurrentUser() {
    try {
      const data = localStorage.getItem('primes_user_data');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getUserRole() {
    return localStorage.getItem('primes_user_role');
  }
};
