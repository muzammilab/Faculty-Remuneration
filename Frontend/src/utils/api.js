import axios from "axios";

const api = axios.create({
  // baseURL: "https://rcoe-remune-track.onrender.com",
  baseURL: "http://localhost:3002",
  timeout: 10000,
  withCredentials: true, // REQUIRED for cookies & CORS success
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Public routes MUST NOT send token
    const publicRoutes = [
      "/forgot-password",
      "/reset-password",
      "/verify-otp",
      "/admin/login",
      "/faculty/login",
      "/google",
    ];

    const isPublic = publicRoutes.some((route) => config.url.includes(route));

    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

// import axios from 'axios';

// // Create axios instance with default configuration
// const api = axios.create({
//     baseURL: 'http://localhost:3002',
//     timeout: 10000,
// });

// // Add request interceptor to include auth token
// api.interceptors.request.use(
//     (config) => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );

// // Add response interceptor to handle authentication errors
// api.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token is invalid or expired
//             localStorage.removeItem('token');
//             window.location.href = '/login';
//         }
//         return Promise.reject(error);
//     }
// );

// export default api;
