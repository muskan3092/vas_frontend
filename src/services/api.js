import axios from 'axios';

// Create axios instance with base URL pointing to our proxy
const api = axios.create({
  baseURL: '/api', // This will be forwarded to backend via proxy
  headers: {
    'Content-Type': 'application/json',
  }
});

// API functions
export const loginUser = (phoneNumber) => {
  return api.get(`/login?user_phone_number=${phoneNumber}`);
};

export const registerUser = (userData) => {
  return api.post('/register', userData);
};

export const sendOtp = (phoneNumber) => {
  return api.post('/sendotp', { user_phone_number: phoneNumber });
};

export const verifyOtp = (phoneNumber, otp) => {
  return api.post('/verifyotp', { user_phone_number: phoneNumber, otp });
};

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response && error.response.status === 403) {
      alert('CORS error detected. Please try again or check your backend configuration.');
    }
    return Promise.reject(error);
  }
);