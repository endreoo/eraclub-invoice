import axios from 'axios';

class AuthService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: process.env.API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async login(credentials) {
    try {
      const response = await this.apiClient.post('/auth/login', credentials);
      if (response.data && response.data.token) {
        this.setAuthToken(response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      throw error;
    }
  }

  setAuthToken(token) {
    if (token) {
      this.apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Store token for reuse
      global.token = token;
    }
  }

  getStoredToken() {
    return global.token;
  }
}

export default new AuthService(); 