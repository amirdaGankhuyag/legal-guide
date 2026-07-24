import axios from "axios";

const instance = axios.create({
  // Production-д VITE_API_URL env-ээр backend-ийн хаягийг заана
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1/",
});
instance.defaults.withCredentials = true; // Cookie-д бичигдсэн зүйлсийг дамжуулах

// Хүсэлт бүрт localStorage-с token-г  Authorization header болгож залгана
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
