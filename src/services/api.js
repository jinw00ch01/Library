import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const bookService = {
  getAllBooks: async () => {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return response.data;
  },
  // 필요한 다른 API 메서드들 추가
};

export const authService = {
  customerSignup: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/customer/signup`, userData);
    return response.data;
  },
  
  staffSignup: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/staff/signup`, userData);
    return response.data;
  },
  
  customerLogin: async (loginData) => {
    const response = await axios.post(`${API_BASE_URL}/customer/login`, loginData);
    return response.data;
  },
  
  staffLogin: async (loginData) => {
    const response = await axios.post(`${API_BASE_URL}/staff/login`, loginData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },
  
  getCustomerInfo: async (customerId) => {
    const response = await axios.get(`${API_BASE_URL}/customer/${customerId}`);
    return response.data;
  },
  
  getStaffInfo: async (staffId) => {
    const response = await axios.get(`${API_BASE_URL}/staff/${staffId}`);
    return response.data;
  }
}; 