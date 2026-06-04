import axios from 'axios';

const BASE_LINK = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_LINK,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authClient = axios.create({
  baseURL: `${BASE_LINK}/auth`, 
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

export { apiClient, authClient };
export default apiClient;