import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true,
});

// Response interceptor for debugging
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.error(`API Error [${error.response.status}]:`, error.response.data);
        } else if (error.request) {
            console.error('API Error: No response received. Is the backend running?', error.request);
        } else {
            console.error('API Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;
