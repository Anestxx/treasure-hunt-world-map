import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface User {
  id: string;
  username: string;
  email: string;
  points: number;
  badges: string[];
  locationsCompleted: any[];
}

export interface Location {
  locationId: string;
  name: string;
  country: string;
  coordinates: { lat: number; lng: number };
  challengeId: string;
  challengeType: string;
  points: number;
  badge: string;
  completed: boolean;
  locked: boolean;
}

export interface Challenge {
  challengeId: string;
  type: string;
  question: string;
  options: string[];
  hint: string;
  points: number;
  difficulty: string;
}

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      Cookies.set('token', response.data.token, { expires: 7 });
    }
    return response.data;
  },
  logout: () => {
    Cookies.remove('token');
  },
  getMe: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },
};

// Locations API
export const locationsAPI = {
  getAll: async (): Promise<Location[]> => {
    const response = await api.get('/locations');
    return response.data;
  },
  getOne: async (locationId: string): Promise<Location> => {
    const response = await api.get(`/locations/${locationId}`);
    return response.data;
  },
};

// Challenges API
export const challengesAPI = {
  getByLocation: async (locationId: string): Promise<Challenge> => {
    const response = await api.get(`/challenges/location/${locationId}`);
    return response.data;
  },
  submitAnswer: async (locationId: string, answer: string) => {
    const response = await api.post('/challenges/submit', { locationId, answer });
    return response.data;
  },
};

// Progress API
export const progressAPI = {
  getProgress: async () => {
    const response = await api.get('/progress');
    return response.data;
  },
};

// Leaderboard API
export const leaderboardAPI = {
  getGlobal: async (limit: number = 10) => {
    const response = await api.get(`/leaderboard/global?limit=${limit}`);
    return response.data;
  },
  getMyRank: async (userId: string) => {
    const response = await api.get(`/leaderboard/my-rank?userId=${userId}`);
    return response.data;
  },
};

export default api;

