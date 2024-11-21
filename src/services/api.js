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
  signup: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/signup`, userData);
    return response.data;
  }
}; 