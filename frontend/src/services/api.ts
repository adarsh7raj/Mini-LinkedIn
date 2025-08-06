import axios from 'axios';

const API_BASE_URL = 'https://mini-linkedin-20hz.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string, bio?: string) => {
    const response = await api.post('/auth/register', { name, email, password, bio });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Users API calls
export const usersAPI = {
  getUsers: async (search?: string, limit = 10, page = 1) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    params.append('limit', limit.toString());
    params.append('page', page.toString());
    
    const response = await api.get(`/users?${params}`);
    return response.data;
  },

  getUserById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  updateProfile: async (updates: { name?: string; bio?: string }) => {
    const response = await api.put('/users/profile', updates);
    return response.data;
  },

  followUser: async (id: string) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },

  unfollowUser: async (id: string) => {
    const response = await api.post(`/users/${id}/follow`);
    return response.data;
  },

  getUserPosts: async (id: string, limit = 10, page = 1) => {
    const response = await api.get(`/users/${id}/posts?limit=${limit}&page=${page}`);
    return response.data;
  },
};

// Posts API calls
export const postsAPI = {
  getPosts: async (limit = 10, page = 1) => {
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('page', page.toString());
    
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  createPost: async (content: string) => {
    const response = await api.post('/posts', { content });
    return response.data;
  },

  getPost: async (id: string) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  likePost: async (id: string) => {
    const response = await api.post(`/posts/${id}/like`);
    return response.data;
  },
};

export default api;