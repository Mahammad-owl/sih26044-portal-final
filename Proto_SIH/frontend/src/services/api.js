const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('sih_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const error = new Error(data.error || `HTTP error! status: ${res.status}`);
      error.status = res.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  demoSwitch: (role) => request('/auth/demo-switch', { method: 'POST', body: { role } }),
  getMe: () => request('/auth/me'),

  // Student
  getStudentDashboard: () => request('/students/dashboard'),
  getStudentProfile: () => request('/students/profile'),
  updateStudentProfile: (data) => request('/students/profile', { method: 'PUT', body: data }),
  getStudentSkills: () => request('/students/skills'),
  addStudentSkill: (data) => request('/students/skills', { method: 'POST', body: data }),
  getGapAnalysis: (careerRoleId) => request(`/students/gap-analysis${careerRoleId ? `?careerRoleId=${careerRoleId}` : ''}`),
  getRoadmap: (careerRoleId) => request(`/students/roadmap${careerRoleId ? `?careerRoleId=${careerRoleId}` : ''}`),
  toggleRoadmapActivity: (activityId) => request(`/students/roadmap/activity/${activityId}/toggle`, { method: 'PUT' }),
  parseResume: (text) => request('/students/resume-parse', { method: 'POST', body: { text } }),
  importResumeSkills: (skills) => request('/students/resume-import-skills', { method: 'POST', body: { skills } }),
  getPublicPortfolio: (slugOrId) => request(`/students/portfolio/${slugOrId}`),

  // Assessments
  getAssessments: () => request('/assessments'),
  getAssessmentDetail: (id) => request(`/assessments/${id}`),
  submitAssessment: (id, answers) => request(`/assessments/${id}/submit`, { method: 'POST', body: { answers } }),

  // Verifications
  getVerifications: () => request('/verifications'),
  getVerificationDetail: (id) => request(`/verifications/${id}`),
  submitVerification: (data) => request('/verifications/submit', { method: 'POST', body: data }),
  reviewVerification: (id, data) => request(`/verifications/${id}/review`, { method: 'POST', body: data }),

  // Projects
  getProjects: () => request('/projects'),
  submitProject: (data) => request('/projects', { method: 'POST', body: data }),
  reviewProject: (id, data) => request(`/projects/${id}/review`, { method: 'POST', body: data }),

  // Opportunities
  getOpportunities: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.type) params.append('type', filters.type);
    if (filters.mode) params.append('mode', filters.mode);
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString();
    return request(`/opportunities${qs ? `?${qs}` : ''}`);
  },
  getOpportunityDetail: (id) => request(`/opportunities/${id}`),
  applyOpportunity: (id, data) => request(`/opportunities/${id}/apply`, { method: 'POST', body: data }),
  createOpportunity: (data) => request('/opportunities', { method: 'POST', body: data }),
  getMyApplications: () => request('/opportunities/my/applications'),

  // Industry
  getIndustryDashboard: () => request('/industry/dashboard'),
  getCandidates: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.opportunityId) params.append('opportunityId', filters.opportunityId);
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.minScore) params.append('minScore', filters.minScore);
    const qs = params.toString();
    return request(`/industry/candidates${qs ? `?${qs}` : ''}`);
  },
  getIndustryApplications: () => request('/industry/applications'),
  updateApplicationStatus: (id, data) => request(`/industry/applications/${id}/status`, { method: 'PUT', body: data }),

  // Faculty
  getFacultyDashboard: () => request('/faculty/dashboard'),
  getStudentRoster: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.branch) params.append('branch', filters.branch);
    if (filters.search) params.append('search', filters.search);
    const qs = params.toString();
    return request(`/faculty/students${qs ? `?${qs}` : ''}`);
  },
  createAssessment: (data) => request('/faculty/assessments', { method: 'POST', body: data }),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),

  // Collaborations
  getCollaborations: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.discipline) params.append('discipline', filters.discipline);
    if (filters.status) params.append('status', filters.status);
    const qs = params.toString();
    return request(`/collaborations${qs ? `?${qs}` : ''}`);
  },
  createCollaboration: (data) => request('/collaborations', { method: 'POST', body: data }),
  updateCollaborationStatus: (id, data) => request(`/collaborations/${id}/status`, { method: 'PUT', body: data }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' })
};
