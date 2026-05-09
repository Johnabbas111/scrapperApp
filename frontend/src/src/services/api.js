import axios from "axios";
const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});
export const getStories = (page = 1, limit = 10) => {
  return api.get(`/stories?page=${page}&limit=${limit}`);
};

export const getStoryById = (id) => api.get(`/stories/${id}`);

export const toggleBookmark = (id) => api.post(`/stories/${id}/bookmark`);

export const triggerScrape = () => api.post("/stories/scrape");

export default api;
