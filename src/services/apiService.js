// API Service - Axios Client for Backend Communication
import axios from 'axios';
import { auth } from '../firebase';

// Base URL for API calls
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use(
  async (config) => {
    // Get Firebase auth token
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - could trigger logout
      console.error('Authentication error:', error.response.data);
    }
    return Promise.reject(error);
  }
);

// ========== USER API ==========
export const userAPI = {
  // Create or update user profile
  createOrUpdateUser: async (userData) => {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Get user by Firebase UID
  getUser: async (firebaseUid) => {
    const response = await apiClient.get(`/users/${firebaseUid}`);
    return response.data;
  },

  // Update user profile
  updateUser: async (firebaseUid, updates) => {
    const response = await apiClient.put(`/users/${firebaseUid}`, updates);
    return response.data;
  },
};

// ========== GROUP API ==========
export const groupAPI = {
  // Create new group
  createGroup: async (groupData) => {
    const response = await apiClient.post('/groups', groupData);
    return response.data;
  },

  // Get all groups for a user
  getUserGroups: async (firebaseUid) => {
    const response = await apiClient.get(`/groups/user/${firebaseUid}`);
    return response.data;
  },

  // Get group by ID
  getGroup: async (groupId) => {
    const response = await apiClient.get(`/groups/${groupId}`);
    return response.data;
  },

  // Join a group
  joinGroup: async (groupId) => {
    const response = await apiClient.post(`/groups/${groupId}/join`);
    return response.data;
  },

  // Leave a group
  leaveGroup: async (groupId) => {
    const response = await apiClient.post(`/groups/${groupId}/leave`);
    return response.data;
  },

  // Update group
  updateGroup: async (groupId, updates) => {
    const response = await apiClient.put(`/groups/${groupId}`, updates);
    return response.data;
  },

  // Delete group
  deleteGroup: async (groupId) => {
    const response = await apiClient.delete(`/groups/${groupId}`);
    return response.data;
  },
};

// ========== TASK API ==========
export const taskAPI = {
  // Create new task
  createTask: async (taskData) => {
    const response = await apiClient.post('/tasks', taskData);
    return response.data;
  },

  // Get all tasks for a user
  getUserTasks: async (firebaseUid) => {
    const response = await apiClient.get(`/tasks/user/${firebaseUid}`);
    return response.data;
  },

  // Get all tasks for a group
  getGroupTasks: async (groupId) => {
    const response = await apiClient.get(`/tasks/group/${groupId}`);
    return response.data;
  },

  // Get task by ID
  getTask: async (taskId) => {
    const response = await apiClient.get(`/tasks/${taskId}`);
    return response.data;
  },

  // Update task
  updateTask: async (taskId, updates) => {
    const response = await apiClient.put(`/tasks/${taskId}`, updates);
    return response.data;
  },

  // Toggle task status
  toggleTask: async (taskId) => {
    const response = await apiClient.patch(`/tasks/${taskId}/toggle`);
    return response.data;
  },

  // Delete task
  deleteTask: async (taskId) => {
    const response = await apiClient.delete(`/tasks/${taskId}`);
    return response.data;
  },
};

// ========== RESOURCE API ==========
export const resourceAPI = {
  // Create new resource
  createResource: async (resourceData) => {
    const response = await apiClient.post('/resources', resourceData);
    return response.data;
  },

  // Get all resources for a user
  getUserResources: async (firebaseUid) => {
    const response = await apiClient.get(`/resources/user/${firebaseUid}`);
    return response.data;
  },

  // Get all resources for a group
  getGroupResources: async (groupId) => {
    const response = await apiClient.get(`/resources/group/${groupId}`);
    return response.data;
  },

  // Get all resources (with optional filters)
  getAllResources: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await apiClient.get(`/resources?${params}`);
    return response.data;
  },

  // Get resource by ID
  getResource: async (resourceId) => {
    const response = await apiClient.get(`/resources/${resourceId}`);
    return response.data;
  },

  // Delete resource
  deleteResource: async (resourceId) => {
    const response = await apiClient.delete(`/resources/${resourceId}`);
    return response.data;
  },
};

// Health check
export const healthCheck = async () => {
  const response = await apiClient.get('/health');
  return response.data;
};

export default apiClient;
