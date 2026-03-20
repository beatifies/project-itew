import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Sanctum cookies
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/api/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      await api.post('/api/logout');
    } finally {
      localStorage.removeItem('token');
    }
  },
  
  getUser: async () => {
    const response = await api.get('/api/user');
    return response.data;
  },
};

export const studentService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/students', { params });
    return response.data;
  },
  
  get: async (id) => {
    const response = await api.get(`/api/students/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/api/students', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/api/students/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/students/${id}`);
    return response.data;
  },
};

export const facultyService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/faculty', { params });
    return response.data;
  },
  
  get: async (id) => {
    const response = await api.get(`/api/faculty/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/api/faculty', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/api/faculty/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/faculty/${id}`);
    return response.data;
  },
};

export const courseService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/courses', { params });
    return response.data;
  },
  
  get: async (id) => {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/api/courses', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/api/courses/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/courses/${id}`);
    return response.data;
  },
};

export const instructionService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/instructions', { params });
    return response.data;
  },
  
  get: async (id) => {
    const response = await api.get(`/api/instructions/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/api/instructions', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/api/instructions/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/instructions/${id}`);
    return response.data;
  },
};

export const scheduleService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/schedules', { params });
    return response.data;
  },
  
  get: async (id) => {
    const response = await api.get(`/api/schedules/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/api/schedules', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/api/schedules/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/schedules/${id}`);
    return response.data;
  },
};

export const eventService = {
  getAll: async (params = {}) => {
    const response = await api.get('/api/events', { params });
    return response.data;
  },
  
  get: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/api/events', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/api/events/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/api/events/${id}`);
    return response.data;
  },
};

export const analyticsService = {
  getDashboard: async () => {
    const response = await api.get('/api/analytics');
    return response.data;
  },
};

// Aliases for backwards compatibility
export const apiService = {
  getStudents: studentService.getAll,
  getStudent: studentService.get,
  createStudent: studentService.create,
  updateStudent: studentService.update,
  deleteStudent: studentService.delete,
  
  getFaculty: facultyService.getAll,
  getFacultyMember: facultyService.get,
  createFaculty: facultyService.create,
  updateFaculty: facultyService.update,
  deleteFaculty: facultyService.delete,
  
  getCourses: courseService.getAll,
  getCourse: courseService.get,
  createCourse: courseService.create,
  updateCourse: courseService.update,
  deleteCourse: courseService.delete,
  
  getInstructions: instructionService.getAll,
  getInstruction: instructionService.get,
  createInstruction: instructionService.create,
  updateInstruction: instructionService.update,
  deleteInstruction: instructionService.delete,
  
  getSchedules: scheduleService.getAll,
  getSchedule: scheduleService.get,
  createSchedule: scheduleService.create,
  updateSchedule: scheduleService.update,
  deleteSchedule: scheduleService.delete,
  
  getEvents: eventService.getAll,
  getEvent: eventService.get,
  createEvent: eventService.create,
  updateEvent: eventService.update,
  deleteEvent: eventService.delete,
};

export default api;
