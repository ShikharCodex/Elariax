import { create } from "zustand";
import { fetchMe, loginUser, registerUser } from "../services/api";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("auth_token") || "",
  user: null,
  loading: false,
  error: "",

  hydrateAuth: async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) return set({ token: "", user: null });
    set({ token, loading: true, error: "" });
    try {
      const user = await fetchMe();
      set({ user });
    } catch (error) {
      localStorage.removeItem("auth_token");
      set({ token: "", user: null, error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  login: async (payload) => {
    set({ loading: true, error: "" });
    try {
      const data = await loginUser(payload);
      localStorage.setItem("auth_token", data.token);
      set({ token: data.token, user: data.user });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (payload) => {
    set({ loading: true, error: "" });
    try {
      const data = await registerUser(payload);
      localStorage.setItem("auth_token", data.token);
      set({ token: data.token, user: data.user });
    } catch (error) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    set({ token: "", user: null, error: "" });
  },
}));
