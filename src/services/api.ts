/**
 * Type-safe API Client for SIH26044 Academia-Industry Collaboration Portal
 * Connects frontend React components to Express.js + SQLite backend.
 */

const API_BASE = '/api';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  headers?: Record<string, string>;
}

async function request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('sih_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config: RequestInit = {
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
      const errorMsg = data.error || `HTTP error ${res.status}`;
      const err = new Error(errorMsg) as Error & { status: number; data: any };
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data as T;
  } catch (err: any) {
    console.warn(`[API Call] ${endpoint} notice:`, err.message || err);
    throw err;
  }
}

export const api = {
  // Authentication
  login: (credentials: { email: string; password?: string }) =>
    request('/auth/login', { method: 'POST', body: credentials }),

  register: (payload: {
    name: string;
    email: string;
    password?: string;
    role: 'STUDENT' | 'INDUSTRY' | 'FACULTY';
    institution_name?: string;
    branch?: string;
    year?: string;
    career_goal?: string;
    cgpa?: number | string;
    phone?: string;
    company_name?: string;
    industry_sector?: string;
    website?: string;
    location?: string;
    department?: string;
    designation?: string;
  }) => request('/auth/register', { method: 'POST', body: payload }),

  demoSwitch: (role: 'STUDENT' | 'INDUSTRY' | 'FACULTY' | 'INSTITUTION_ADMIN') =>
    request('/auth/demo-switch', { method: 'POST', body: { role } }),

  getMe: () => request('/auth/me'),

  forgotPassword: (email: string) =>
    request('/auth/forgot-password', { method: 'POST', body: { email } }),

  // Student Endpoints
  getStudentDashboard: () => request('/students/dashboard'),
  getStudentProfile: () => request('/students/profile'),
  updateStudentProfile: (data: any) => request('/students/profile', { method: 'PUT', body: data }),
  getStudentSkills: () => request('/students/skills'),
  addStudentSkill: (data: any) => request('/students/skills', { method: 'POST', body: data }),
  getGapAnalysis: (careerRoleId?: string) =>
    request(`/students/gap-analysis${careerRoleId ? `?careerRoleId=${careerRoleId}` : ''}`),
  getRoadmap: (careerRoleId?: string) =>
    request(`/students/roadmap${careerRoleId ? `?careerRoleId=${careerRoleId}` : ''}`),
  toggleRoadmapActivity: (activityId: string) =>
    request(`/students/roadmap/activity/${activityId}/toggle`, { method: 'PUT' }),
  parseResume: (text: string) => request('/students/resume-parse', { method: 'POST', body: { text } }),
  importResumeSkills: (skills: string[]) =>
    request('/students/resume-import-skills', { method: 'POST', body: { skills } }),
  getPublicPortfolio: (slugOrId: string) => request(`/students/portfolio/${slugOrId}`),

  // Assessments
  getAssessments: () => request('/assessments'),
  getAssessmentDetail: (id: string) => request(`/assessments/${id}`),
  submitAssessment: (id: string, answers: Record<string, any>) =>
    request(`/assessments/${id}/submit`, { method: 'POST', body: { answers } }),

  // Verifications
  getVerifications: () => request('/verifications'),
  getVerificationDetail: (id: string) => request(`/verifications/${id}`),
  submitVerification: (data: any) => request('/verifications/submit', { method: 'POST', body: data }),
  reviewVerification: (id: string, data: any) =>
    request(`/verifications/${id}/review`, { method: 'POST', body: data }),

  // Projects
  getProjects: () => request('/projects'),
  submitProject: (data: any) => request('/projects', { method: 'POST', body: data }),
  reviewProject: (id: string, data: any) =>
    request(`/projects/${id}/review`, { method: 'POST', body: data }),

  // Opportunities
  getOpportunities: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters);
    const qs = params.toString();
    return request(`/opportunities${qs ? `?${qs}` : ''}`);
  },
  getOpportunityDetail: (id: string) => request(`/opportunities/${id}`),
  applyOpportunity: (id: string, data: { coverLetter?: string; resumeSummary?: string } = {}) =>
    request(`/opportunities/${id}/apply`, { method: 'POST', body: data }),
  createOpportunity: (data: any) => request('/opportunities', { method: 'POST', body: data }),
  getMyApplications: () => request('/opportunities/my/applications'),

  // Industry
  getIndustryDashboard: () => request('/industry/dashboard'),
  getCandidates: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters);
    const qs = params.toString();
    return request(`/industry/candidates${qs ? `?${qs}` : ''}`);
  },
  getIndustryApplications: () => request('/industry/applications'),
  updateApplicationStatus: (id: string, data: { status: string; notes?: string }) =>
    request(`/industry/applications/${id}/status`, { method: 'PUT', body: data }),

  // Faculty
  getFacultyDashboard: () => request('/faculty/dashboard'),
  getStudentRoster: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters);
    const qs = params.toString();
    return request(`/faculty/students${qs ? `?${qs}` : ''}`);
  },
  createAssessment: (data: any) => request('/faculty/assessments', { method: 'POST', body: data }),

  // Admin
  getAdminAnalytics: () => request('/admin/analytics'),

  // Collaborations
  getCollaborations: (filters: Record<string, string> = {}) => {
    const params = new URLSearchParams(filters);
    const qs = params.toString();
    return request(`/collaborations${qs ? `?${qs}` : ''}`);
  },
  createCollaboration: (data: any) => request('/collaborations', { method: 'POST', body: data }),
  updateCollaborationStatus: (id: string, data: { status: string; facultyId?: string; facultyName?: string }) =>
    request(`/collaborations/${id}/status`, { method: 'PUT', body: data }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' })
};
