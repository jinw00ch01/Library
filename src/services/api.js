import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// 요청 인터셉터 설정
axiosInstance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userType = localStorage.getItem('userType');
    if (user && userType) {
      config.headers['x-user-id'] = user.id;
      config.headers['x-user-type'] = userType;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const bookService = {
  getAllBooks: async () => {
    const response = await axiosInstance.get('/books');
    return response.data;
  },
  getBooksSummary: async () => {
    const response = await axiosInstance.get('/books/summary');
    return response.data;
  },
  getBookDetail: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}`);
    return response.data;
  },
  updateBook: async (bookId, bookData) => {
    const response = await axiosInstance.put(`/books/${bookId}`, bookData);
    return response.data;
  },
  deleteBook: async (bookId) => {
    const response = await axiosInstance.delete(`/books/${bookId}`);
    return response.data;
  },
  getBooks: async () => {
    const response = await axiosInstance.get('/books');
    return response.data;
  },
};

export const authService = {
  customerSignup: async (userData) => {
    const response = await axiosInstance.post(`/customer/signup`, userData);
    return response.data;
  },
  
  staffSignup: async (userData) => {
    const response = await axiosInstance.post(`/staff/signup`, userData);
    return response.data;
  },
  
  customerLogin: async (loginData) => {
    const response = await axiosInstance.post(`/customer/login`, loginData);
    return response.data;
  },
  
  staffLogin: async (loginData) => {
    const response = await axiosInstance.post(`/staff/login`, loginData);
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  },
  
  getCustomerInfo: async (customerId) => {
    const response = await axiosInstance.get(`/customer/${customerId}`);
    return response.data;
  },
  
  getStaffInfo: async (staffId) => {
    const response = await axiosInstance.get(`/staff/${staffId}`);
    return response.data;
  },
  
  updateCustomerInfo: async (customerId, updateData) => {
    const response = await axiosInstance.put(`/customer/${customerId}`, updateData);
    return response.data;
  },
  
  updateStaffInfo: async (staffId, updateData) => {
    const response = await axiosInstance.put(`/staff/${staffId}`, updateData);
    return response.data;
  },
  
  deleteCustomer: async (customerId) => {
    const response = await axiosInstance.delete(`/customer/${customerId}`);
    return response.data;
  },
  
  deleteStaff: async (staffId) => {
    const response = await axiosInstance.delete(`/staff/${staffId}`);
    return response.data;
  }
};

export const adminService = {
  registerDepartment: async (data) => {
    const response = await axiosInstance.post(`/department`, data);
    return response.data;
  },
  registerBook: async (data) => {
    const response = await axiosInstance.post(`/book`, data);
    return response.data;
  },
  registerReturnLo: async (data) => {
    const response = await axiosInstance.post(`/returnLo`, data);
    return response.data;
  },
  registerCooperation: async (data) => {
    try {
      const response = await axiosInstance.post(`/cooperation`, data);
      return response.data;
    } catch (error) {
      console.error('공급업체 등록 API 에러:', error.response?.data || error.message);
      throw error;
    }
  },
  registerContents: async (data) => {
    try {
      const response = await axiosInstance.post(`/contents`, data);
      return response.data;
    } catch (error) {
      console.error('API 호출 에러:', error);
      throw error;
    }
  },
  registerMedia: async (data) => {
    const response = await axiosInstance.post(`/media`, data);
    return response.data;
  },
  getDepartments: async () => {
    const response = await axiosInstance.get(`/departments`);
    return response.data;
  },
  updateDepartment: async (departmentId, data) => {
    const response = await axiosInstance.put(`/departments/${departmentId}`, data);
    return response.data;
  },
  deleteDepartment: async (departmentId) => {
    const response = await axiosInstance.delete(`/departments/${departmentId}`);
    return response.data;
  },
  getReturnLocations: async () => {
    const response = await axiosInstance.get(`/returnLocations`);
    return response.data;
  },
  updateReturnLocation: async (locationId, data) => {
    const response = await axiosInstance.put(`/returnLocations/${locationId}`, data);
    return response.data;
  },
  deleteReturnLocation: async (locationId) => {
    const response = await axiosInstance.delete(`/returnLocations/${locationId}`);
    return response.data;
  },
  getCooperations: async () => {
    const response = await axiosInstance.get(`/cooperations`);
    return response.data;
  },
  updateCooperation: async (cooperationId, data) => {
    const response = await axiosInstance.put(`/cooperations/${cooperationId}`, data);
    return response.data;
  },
  deleteCooperation: async (cooperationId) => {
    const response = await axiosInstance.delete(`/cooperations/${cooperationId}`);
    return response.data;
  },
  registerSupply: async (data) => {
    const response = await axiosInstance.post(`/supply`, data);
    return response.data;
  },
  getSupplies: async () => {
    const response = await axiosInstance.get(`/supplies`);
    return response.data;
  },
  updateSupply: async (supplyId, data) => {
    const response = await axiosInstance.put(`/supplies/${supplyId}`, data);
    return response.data;
  },
  deleteSupply: async (supplyId) => {
    const response = await axiosInstance.delete(`/supplies/${supplyId}`);
    return response.data;
  },
  getContents: async () => {
    try {
      const response = await axiosInstance.get(`/contents`);
      return response.data;
    } catch (error) {
      console.error('콘텐츠 조회 API 에러:', error);
      throw error;
    }
  },
  updateContents: async (contentsId, data) => {
    try {
      const response = await axiosInstance.put(`/contents/${contentsId}`, data);
      return response.data;
    } catch (error) {
      console.error('콘텐츠 수정 API 에러:', error);
      throw error;
    }
  },
  deleteContents: async (contentsId) => {
    try {
      const response = await axiosInstance.delete(`/contents/${contentsId}`);
      return response.data;
    } catch (error) {
      console.error('콘텐츠 삭제 API 에러:', error);
      throw error;
    }
  },
  getMedias: async () => {
    try {
      const response = await axiosInstance.get(`/medias`);
      return response.data;
    } catch (error) {
      console.error('영상자료 조회 API 에러:', error);
      throw error;
    }
  },
  updateMedia: async (mediaId, data) => {
    try {
      const response = await axiosInstance.put(`/medias/${mediaId}`, data);
      return response.data;
    } catch (error) {
      console.error('영상자료 수정 API 에러:', error);
      throw error;
    }
  },
  deleteMedia: async (mediaId) => {
    try {
      const response = await axiosInstance.delete(`/medias/${mediaId}`);
      return response.data;
    } catch (error) {
      console.error('영상자료 삭제 API 에러:', error);
      throw error;
    }
  }
};

export const staffService = {
  getStaffInfo: async (staffId) => {
    const response = await axiosInstance.get(`/staff/${staffId}`);
    return response.data;
  },
  
  updateStaffInfo: async (staffId, staffData) => {
    const response = await axiosInstance.put(`/staff/${staffId}`, staffData);
    return response.data;
  },
  
  deleteStaffInfo: async (staffId) => {
    const response = await axiosInstance.delete(`/staff/${staffId}`);
    return response.data;
  }
};

export const userService = {
  getUserInfo: async (userType, userId) => {
    const response = await axiosInstance.get(`/${userType}/${userId}`);
    return response.data;
  },
  
  updateUserInfo: async (userType, userId, data) => {
    const response = await axiosInstance.put(`/${userType}/${userId}`, data);
    return response.data;
  },
  
  deleteUser: async (userType, userId) => {
    const response = await axiosInstance.delete(`/${userType}/${userId}`);
    return response.data;
  }
};

export const loanService = {
  processLoan: async (data) => {
    return await axiosInstance.post(`/borrow`, data).then((res) => res.data);
  },
  getLoanHistory: async (customerId) => {
    return await axiosInstance.get(`/borrow-log/${customerId}`).then((res) => res.data);
  },
};

export const returnService = {
  processReturn: async (data) => {
    return await axiosInstance.post(`/return`, data).then((res) => res.data);
  },
};

export const reviewService = {
  getReviewsByBook: async (bookId) => {
    const response = await axiosInstance.get(`/books/${bookId}/reviews`);
    return response.data;
  },
  writeReview: async (bookId, data) => {
    const response = await axiosInstance.post(`/books/${bookId}/reviews`, data);
    return response.data;
  },
  upvoteReview: async (reviewId) => {
    const response = await axiosInstance.post(`/reviews/${reviewId}/upvote`);
    return response.data;
  },
  reportReview: async (reviewId) => {
    const response = await axiosInstance.post(`/reviews/${reviewId}/report`);
    return response.data;
  },
  getReportedReviews: async () => {
    const response = await axiosInstance.get('/reviews/reported');
    return response.data;
  },
  deleteReview: async (reviewId) => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  },
  deleteOwnReview: async (reviewId) => {
    const response = await axiosInstance.delete(`/reviews/${reviewId}`);
    return response.data;
  },
  updateReview: async (reviewId, data) => {
    const response = await axiosInstance.put(`/reviews/${reviewId}`, data);
    return response.data;
  },
  blindReview: async (reviewId) => {
    const response = await axiosInstance.post(`/reviews/${reviewId}/blind`);
    return response.data;
  },
  unblindReview: async (reviewId) => {
    const response = await axiosInstance.post(`/reviews/${reviewId}/unblind`);
    return response.data;
  },
};

export const contentsService = {
  getAllContents: async () => {
    const response = await axiosInstance.get('/contents');
    return response.data;
  },
  participate: async (contentsId) => {
    const response = await axiosInstance.post(`/contents/${contentsId}/participate`);
    return response.data;
  },
  getParticipations: async (customerId) => {
    const response = await axiosInstance.get(`/customers/${customerId}/participations`);
    return response.data;
  },
  cancelParticipation: async (customerId, contentsId) => {
    const response = await axiosInstance.delete(`/customers/${customerId}/participations/${contentsId}`);
    return response.data;
  },
};

export const mediaService = {
  getAllMedia: async () => {
    const response = await axiosInstance.get('/medias');
    return response.data;
  },
  getMediaByBookId: async (bookId) => {
    const response = await axiosInstance.get(`/medias/book/${bookId}`);
    return response.data;
  },
};