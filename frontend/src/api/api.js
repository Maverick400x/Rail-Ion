import axios from "axios";

// Use deployed backend URL when live, fallback to localhost for local dev
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

// Attach token automatically if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;