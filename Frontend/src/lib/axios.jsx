
import axios from 'axios';


const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token'); 
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Unauthorized');
    }
    return Promise.reject(error);
  }
);

export default instance;

