import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for uniform error parsing
apiClient.interceptors.response.use(
  response => response,
  error => {
    const errorData = error.response?.data?.error || {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network error occurred. Please check your connection.'
    };
    return Promise.reject(errorData);
  }
);

export const authApi = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/auth/me'),
  forgotPassword: (data) => apiClient.post('/auth/forgot-password', data),
};

export const jobsApi = {
  getJobs: (params) => apiClient.get('/jobs', { params }),
  getJobById: (id) => apiClient.get(`/jobs/${id}`),
  createJob: (jobData) => apiClient.post('/jobs', jobData),
  updateJob: (id, jobData) => apiClient.patch(`/jobs/${id}`, jobData),
  deleteJob: (id) => apiClient.delete(`/jobs/${id}`),
};

export const applicationsApi = {
  submitApplication: (data) => {
    // If data is FormData (file upload)
    if (data instanceof FormData) {
      return apiClient.post('/applications', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    }
    return apiClient.post('/applications', data);
  },
  getMyApplications: () => apiClient.get('/applications/mine'),
  getApplicationById: (id) => apiClient.get(`/applications/${id}`),
  getAdminApplications: (params) => apiClient.get('/admin/applications', { params }),
  updateStatus: (id, statusData) => apiClient.patch(`/admin/applications/${id}/status`, statusData),
};

export const profileApi = {
  getProfile: () => apiClient.get('/profile'),
  updateProfile: (data) => apiClient.patch('/profile', data),
};

export const systemApi = {
  health: () => apiClient.get('/health'),
  reseed: () => apiClient.post('/seed'),
};
