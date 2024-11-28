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
    try {
      const response = await axios.post(`${API_BASE_URL}/cooperation`, data);
      return response.data;
    } catch (error) {
      console.error('공급업체 등록 API 에러:', error.response?.data || error.message);
      throw error;
    }
  },
  registerContents: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contents`, data);
      return response.data;
    } catch (error) {
      console.error('API 호출 에러:', error);
      throw error;
    }
  },
  registerMedia: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/media`, data);
    return response.data;
  },
  getDepartments: async () => {
    const response = await axios.get(`${API_BASE_URL}/departments`);
    return response.data;
  },
  updateDepartment: async (departmentId, data) => {
    const response = await axios.put(`${API_BASE_URL}/departments/${departmentId}`, data);
    return response.data;
  },
  deleteDepartment: async (departmentId) => {
    const response = await axios.delete(`${API_BASE_URL}/departments/${departmentId}`);
    return response.data;
  },
  getReturnLocations: async () => {
    const response = await axios.get(`${API_BASE_URL}/returnLocations`);
    return response.data;
  },
  updateReturnLocation: async (locationId, data) => {
    const response = await axios.put(`${API_BASE_URL}/returnLocations/${locationId}`, data);
    return response.data;
  },
  deleteReturnLocation: async (locationId) => {
    const response = await axios.delete(`${API_BASE_URL}/returnLocations/${locationId}`);
    return response.data;
  },
  getCooperations: async () => {
    const response = await axios.get(`${API_BASE_URL}/cooperations`);
    return response.data;
  },
  updateCooperation: async (cooperationId, data) => {
    const response = await axios.put(`${API_BASE_URL}/cooperations/${cooperationId}`, data);
    return response.data;
  },
  deleteCooperation: async (cooperationId) => {
    const response = await axios.delete(`${API_BASE_URL}/cooperations/${cooperationId}`);
    return response.data;
  },
  registerSupply: async (data) => {
    const response = await axios.post(`${API_BASE_URL}/supply`, data);
    return response.data;
  },
  getSupplies: async () => {
    const response = await axios.get(`${API_BASE_URL}/supplies`);
    return response.data;
  },
  updateSupply: async (supplyId, data) => {
    const response = await axios.put(`${API_BASE_URL}/supplies/${supplyId}`, data);
    return response.data;
  },
  deleteSupply: async (supplyId) => {
    const response = await axios.delete(`${API_BASE_URL}/supplies/${supplyId}`);
    return response.data;
  },
  getContents: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/contents`);
      return response.data;
    } catch (error) {
      console.error('콘텐츠 조회 API 에러:', error);
      throw error;
    }
  },
  updateContents: async (contentsId, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/contents/${contentsId}`, data);
      return response.data;
    } catch (error) {
      console.error('콘텐츠 수정 API 에러:', error);
      throw error;
    }
  },
  deleteContents: async (contentsId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/contents/${contentsId}`);
      return response.data;
    } catch (error) {
      console.error('콘텐츠 삭제 API 에러:', error);
      throw error;
    }
  },
  getMedias: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/medias`);
      return response.data;
    } catch (error) {
      console.error('영상자료 조회 API 에러:', error);
      throw error;
    }
  },
  updateMedia: async (mediaId, data) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/medias/${mediaId}`, data);
      return response.data;
    } catch (error) {
      console.error('영상자료 수정 API 에러:', error);
      throw error;
    }
  },
  deleteMedia: async (mediaId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/medias/${mediaId}`);
      return response.data;
    } catch (error) {
      console.error('영상자료 삭제 API 에러:', error);
      throw error;
    }
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