import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 20000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Network request failed";
    return Promise.reject(new Error(message));
  }
);

export const fetchState = async () => (await api.get("/chat/state")).data.data;
export const sendMessage = async (message, attachment) => (await api.post("/chat/message", { message, attachment })).data.data;
export const fetchSummary = async () => (await api.get("/chat/summary")).data.data;
export const addMemoryCard = async (payload) => (await api.post("/chat/memory-cards", payload)).data.data;
export const fetchSettings = async () => (await api.get("/settings")).data.data;
export const saveSettings = async (payload) => (await api.put("/settings", payload)).data.data;
export const loginUser = async (payload) => (await api.post("/auth/login", payload)).data.data;
export const registerUser = async (payload) => (await api.post("/auth/register", payload)).data.data;
export const fetchMe = async () => (await api.get("/auth/me")).data.data;

export default api;
