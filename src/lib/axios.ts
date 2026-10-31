// // lib/axios.js
// import axios from 'axios';
// import { cookies } from 'next/headers';

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true,
// });

// // Intercept requests to add access token
// axiosInstance.interceptors.request.use(async (config) => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get('access_token')?.value;
//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }
//   return config;
// });

// // Intercept 401 responses to refresh token
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
      
//       try {
//         // Call refresh-token endpoint
//         await axios.post('/api/auth/refresh', {}, { withCredentials: true });
//         // Retry the original request
//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         // Redirect to login if refresh fails
//         window.location.href = '/login';
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;