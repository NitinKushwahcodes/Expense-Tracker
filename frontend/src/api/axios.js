import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
  timeout: 10000
});

api.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      return Promise.reject({
        isNetworkError: true,
        message: 'Unable to reach the server. Please check your connection.'
      });
    }
    return Promise.reject(err);
  }
);

export default api;
