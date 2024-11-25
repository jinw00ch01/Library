import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const bookService = {
  getAllBooks: async () => {
    const response = await axios.get(`${API_BASE_URL}/books`);
    return response.data;
  },
  getBooksSummary: async () => {
    const response = await axios.get(`${API_BASE_URL}/books/summary`);
    return response.data;
  },
  getBookDetail: async (bookId) => {
    const response = await axios.get(`${API_BASE_URL}/books/${bookId}`);
    return response.data;
  },
  updateBook: async (bookId, bookData) => {
    const response = await axios.put(`${API_BASE_URL}/books/${bookId}`, bookData);
    return response.data;
  },
  deleteBook: async (bookId) => {
    const response = await axios.delete(`${API_BASE_URL}/books/${bookId}`);
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
  },
  
  updateCustomerInfo: async (customerId, updateData) => {
    const response = await axios.put(`${API_BASE_URL}/customer/${customerId}`, updateData);
    return response.data;
  },
  
  updateStaffInfo: async (staffId, updateData) => {
    const response = await axios.put(`${API_BASE_URL}/staff/${staffId}`, updateData);
    return response.data;
  },
  
  deleteCustomer: async (customerId) => {
    const response = await axios.delete(`${API_BASE_URL}/customer/${customerId}`);
    return response.data;
  },
  
  deleteStaff: async (staffId) => {
    const response = await axios.delete(`${API_BASE_URL}/staff/${staffId}`);
    return response.data;
  }
};

export const adminService = {
  registerDepartment: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/department`, data);
    return response.data;
  },
  registerBook: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/book`, data);
    return response.data;
  },
  registerReturnLo: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/returnLo`, data);
    return response.data;
  },
  registerCooperation: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/cooperation`, data);
    return response.data;
  },
  registerContents: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/contents`, data);
    return response.data;
  },
  registerMedia: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/media`, data);
    return response.data;
  }
};

export const staffService = {
  getStaffInfo: async (staffId) => {
    const response = await axios.get(`${API_BASE_URL}/staff/${staffId}`);
    return response.data;
  },
  
  updateStaffInfo: async (staffId, staffData) => {
    const response = await axios.put(`${API_BASE_URL}/staff/${staffId}`, staffData);
    return response.data;
  },
  
  deleteStaffInfo: async (staffId) => {
    const response = await axios.delete(`${API_BASE_URL}/staff/${staffId}`);
    return response.data;
  }
};

export const userService = {
  getUserInfo: async (userType, userId) => {
    const response = await axios.get(`${API_BASE_URL}/${userType}/${userId}`);
    return response.data;
  },
  
  updateUserInfo: async (userType, userId, data) => {
    const response = await axios.put(`${API_BASE_URL}/${userType}/${userId}`, data);
    return response.data;
  },
  
  deleteUser: async (userType, userId) => {
    const response = await axios.delete(`${API_BASE_URL}/${userType}/${userId}`);
    return response.data;
  }
}; 