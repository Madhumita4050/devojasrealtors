import { apiClient } from './api';

/**
 * Auth Service — connects to the DEVOJAS REALTORS backend.
 */
export const authService = {
  /**
   * Login via email, phone, or Associate ID (DEV-XXXX)
   */
  async login(identifier, password) {
    const res = await apiClient('/auth/login', {
      method: 'POST',
      data: { email: identifier, password }
    });
    if (res.success && res.data?.token) {
      localStorage.setItem('devojas_token', res.data.token);
      localStorage.setItem('devojas_user', JSON.stringify(res.data.user));
      return { success: true, user: res.data.user, token: res.data.token };
    }
    return { success: false, message: res.data?.message || res.error || 'Login failed. Please check your credentials.' };
  },

  /**
   * Register as Associate — user sets their own password.
   * Admin must approve before login is possible.
   */
  async signupAssociate({ name, email, phone, pan_number, aadhar_number, address, sponsor_code, password, confirm_password }) {
    const res = await apiClient('/auth/register-associate', {
      method: 'POST',
      data: { name, email: email || undefined, phone, pan_number, aadhar_number, address, sponsor_code: sponsor_code || undefined, password, confirm_password }
    });
    if (res.success) {
      return { success: true, data: res.data?.data || res.data, user: res.data?.user };
    }
    return { success: false, message: res.data?.message || res.error || 'Registration failed. Please try again.' };
  },

  logout() {
    localStorage.removeItem('devojas_token');
    localStorage.removeItem('devojas_user');
  },

  getCurrentUser() {
    const raw = localStorage.getItem('devojas_user');
    return raw ? JSON.parse(raw) : null;
  },

  isLoggedIn() {
    return !!localStorage.getItem('devojas_token');
  }
};
