import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const apiClient = {
  // Health check
  health: () => api.get('/health'),
  
  // Crop recommendation
  recommendCrop: (data) => api.post('/api/crop/recommend', data),
  
  // Fertilizer calculation
  calculateFertilizer: (data) => api.post('/api/fertilizer/calculate', data),
  
  // Diagnosis
  analyzeImage: (formData) => api.post('/api/diagnosis/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export default apiClient;
